-- 1. Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT auth.uid() IS NOT NULL AND (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
    OR lower(coalesce(auth.jwt() ->> 'email', '')) = 'evyatardery@gmail.com'
  )
$$;

CREATE POLICY "Admins can view roles" ON public.user_roles
FOR SELECT TO authenticated USING (public.is_admin());

-- 2. Lock down orders
DROP POLICY IF EXISTS "Anyone can read orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

REVOKE ALL ON public.orders FROM anon;
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

CREATE POLICY "Public can create orders" ON public.orders
FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can view orders" ON public.orders
FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete orders" ON public.orders
FOR DELETE TO authenticated USING (public.is_admin());

-- 3. Secure order creation RPC (returns only the order number / id)
CREATE OR REPLACE FUNCTION public.create_order(payload jsonb)
RETURNS TABLE(id uuid, order_number text, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.orders (
    order_number, customer_name, customer_email, customer_phone, shipping_address,
    design_id, design_name, design_image_url, dimensions, quantity,
    is_custom_design, custom_text, custom_font, custom_text_align,
    unit_price, total_price, coupon_code, status, payment_method,
    payment_provider, payment_transaction_id, paid_at
  ) VALUES (
    '',
    left(trim(payload ->> 'customer_name'), 100),
    nullif(left(trim(coalesce(payload ->> 'customer_email', '')), 255), ''),
    left(trim(payload ->> 'customer_phone'), 20),
    left(trim(payload ->> 'shipping_address'), 400),
    nullif(left(coalesce(payload ->> 'design_id', ''), 100), ''),
    left(trim(payload ->> 'design_name'), 200),
    nullif(left(coalesce(payload ->> 'design_image_url', ''), 2000), ''),
    left(trim(payload ->> 'dimensions'), 50),
    greatest(1, least(50, coalesce((payload ->> 'quantity')::int, 1))),
    coalesce((payload ->> 'is_custom_design')::boolean, false),
    nullif(left(coalesce(payload ->> 'custom_text', ''), 500), ''),
    nullif(left(coalesce(payload ->> 'custom_font', ''), 100), ''),
    nullif(left(coalesce(payload ->> 'custom_text_align', ''), 20), ''),
    greatest(0, coalesce((payload ->> 'unit_price')::numeric, 0)),
    greatest(0, coalesce((payload ->> 'total_price')::numeric, 0)),
    nullif(left(upper(coalesce(payload ->> 'coupon_code', '')), 50), ''),
    CASE WHEN coalesce(payload ->> 'status', '') IN ('pending', 'pending_payment', 'paid')
         THEN payload ->> 'status' ELSE 'pending_payment' END,
    nullif(left(coalesce(payload ->> 'payment_method', ''), 30), ''),
    coalesce(nullif(left(coalesce(payload ->> 'payment_provider', ''), 30), ''), 'grow'),
    nullif(left(coalesce(payload ->> 'payment_transaction_id', ''), 200), ''),
    CASE WHEN coalesce(payload ->> 'status', '') = 'paid' THEN now() ELSE NULL END
  )
  RETURNING orders.id, orders.order_number, orders.created_at
  INTO new_id, order_number, created_at;

  id := new_id;
  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.create_order(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(jsonb) TO anon, authenticated, service_role;

-- 4. Secure attach-files RPC (only fills empty file url fields)
CREATE OR REPLACE FUNCTION public.attach_order_files(_order_id uuid, _print_file_url text, _order_form_url text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.orders
  SET print_file_url = coalesce(print_file_url, left(_print_file_url, 500)),
      order_form_url = coalesce(order_form_url, left(_order_form_url, 500))
  WHERE orders.id = _order_id
    AND (print_file_url IS NULL OR order_form_url IS NULL);
END;
$$;

REVOKE ALL ON FUNCTION public.attach_order_files(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.attach_order_files(uuid, text, text) TO anon, authenticated, service_role;

-- 5. Storage policies for order-files
DROP POLICY IF EXISTS "Anyone can read order files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload order files" ON storage.objects;
DROP POLICY IF EXISTS "Public read order files" ON storage.objects;

CREATE POLICY "Admins can read order files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'order-files' AND public.is_admin());

CREATE POLICY "Public can upload order files" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'order-files' AND name LIKE 'orders/%');