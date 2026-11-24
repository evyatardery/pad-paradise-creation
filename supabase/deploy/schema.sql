-- Full schema for a fresh Supabase project (generated from supabase/migrations)

-- ===== 20260314201628_4a8b398d-ac3f-4433-accc-e7c556e44121.sql

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled')),
  
  -- Customer details
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  
  -- Product specs
  design_id TEXT,
  design_name TEXT NOT NULL,
  design_image_url TEXT,
  dimensions TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  is_custom_design BOOLEAN NOT NULL DEFAULT false,
  custom_text TEXT,
  custom_font TEXT,
  custom_text_align TEXT,
  
  -- Pricing
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  
  -- Generated files
  order_form_url TEXT,
  print_file_url TEXT,
  
  -- Payment
  payment_provider TEXT DEFAULT 'grow',
  payment_transaction_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Admin-only access (for now, service role only via edge functions)
-- No public policies - orders are managed server-side

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generate sequential order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.orders;
  
  NEW.order_number := 'PZ-' || LPAD(next_num::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION public.generate_order_number();

-- Create storage bucket for order files
INSERT INTO storage.buckets (id, name, public) VALUES ('order-files', 'order-files', false);

-- Service role can manage all order files (edge functions use service role)
CREATE POLICY "Service role can manage order files"
  ON storage.objects FOR ALL
  USING (bucket_id = 'order-files')
  WITH CHECK (bucket_id = 'order-files');

-- ===== 20260323181718_836ad24d-cd8a-48b9-b7dc-920f11181f3a.sql

-- Drop trigger if exists and recreate to ensure it's correct
DROP TRIGGER IF EXISTS set_order_number ON public.orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_order_number();

-- ===== 20260323181739_0a3a4a34-e349-4721-ae07-2abe291e95f7.sql

-- RLS policies for orders table
CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can read orders"
ON public.orders FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Service role can update orders"
ON public.orders FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can delete orders"
ON public.orders FOR DELETE
TO service_role
USING (true);

-- Storage policies for order-files bucket
CREATE POLICY "Anyone can upload order files"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'order-files');

CREATE POLICY "Anyone can read order files"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'order-files');

-- ===== 20260324151033_10cd8a54-e8f2-41d7-aa90-1afc847cf7cb.sql
CREATE POLICY "Anyone can update orders"
ON public.orders FOR UPDATE TO anon, authenticated
USING (true)
WITH CHECK (true);
-- ===== 20260328132237_5cff9e07-a44b-4d9b-95a3-790027e9d933.sql
ALTER TABLE public.orders DROP CONSTRAINT orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (status = ANY (ARRAY['pending'::text, 'pending_payment'::text, 'paid'::text, 'processing'::text, 'in_production'::text, 'shipped'::text, 'completed'::text, 'cancelled'::text]));
-- ===== 20260409165340_6c800d48-1614-4fab-8fd5-1c44ac5285be.sql
ALTER TABLE public.orders ADD COLUMN payment_method text;
-- ===== 20260805205138_17e247ed-af3d-48ee-aa58-fb5bceb8dac1.sql
ALTER TABLE public.orders ADD COLUMN coupon_code text;

COMMENT ON COLUMN public.orders.coupon_code IS 'Applied coupon/promo code at checkout';
-- ===== 20260805210333_6f747740-fbb8-4150-a255-f40c5c48d229.sql
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
-- ===== 20260805210607_86e82054-f492-438c-94cb-f8f43231cd08.sql
DROP POLICY IF EXISTS "Service role can manage order files" ON storage.objects;

CREATE POLICY "Service role can manage order files" ON storage.objects
FOR ALL TO service_role
USING (bucket_id = 'order-files')
WITH CHECK (bucket_id = 'order-files');
-- ===== 20260913125811_19807d1c-2283-4ccc-ad2d-c3a962431ec6.sql
CREATE OR REPLACE FUNCTION public.validate_coupon(p_code text, p_email text)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_code text := upper(trim(coalesce(p_code, '')));
  v_email text := lower(trim(coalesce(p_email, '')));
  v_used boolean;
BEGIN
  IF v_code <> 'PED123' THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'invalid');
  END IF;
  IF v_email <> '' THEN
    SELECT EXISTS (
      SELECT 1 FROM public.orders
      WHERE coupon_code = 'PED123' AND lower(customer_email) = v_email
    ) INTO v_used;
    IF v_used THEN
      RETURN jsonb_build_object('valid', false, 'reason', 'already_used');
    END IF;
  END IF;
  RETURN jsonb_build_object('valid', true, 'type', 'flat_price', 'price', 30, 'label', 'מחיר מיוחד: 30 ש"ח');
END;
$$;

REVOKE ALL ON FUNCTION public.validate_coupon(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text, text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.create_order(payload jsonb)
RETURNS TABLE(id uuid, order_number text, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_id uuid;
  v_coupon text := nullif(left(upper(coalesce(payload ->> 'coupon_code', '')), 50), '');
  v_email text := lower(nullif(left(trim(coalesce(payload ->> 'customer_email', '')), 255), ''));
  v_total numeric := greatest(0, coalesce((payload ->> 'total_price')::numeric, 0));
BEGIN
  IF v_coupon = 'PED123' THEN
    IF v_email IS NULL THEN
      RAISE EXCEPTION 'Coupon PED123 requires an email address';
    END IF;
    IF EXISTS (
      SELECT 1 FROM public.orders
      WHERE coupon_code = 'PED123' AND lower(customer_email) = v_email
    ) THEN
      RAISE EXCEPTION 'Coupon PED123 was already used by this email';
    END IF;
    v_total := 30;
  END IF;

  INSERT INTO public.orders (
    order_number, customer_name, customer_email, customer_phone, shipping_address,
    design_id, design_name, design_image_url, dimensions, quantity,
    is_custom_design, custom_text, custom_font, custom_text_align,
    unit_price, total_price, coupon_code, status, payment_method,
    payment_provider, payment_transaction_id, paid_at
  ) VALUES (
    '',
    left(trim(payload ->> 'customer_name'), 100),
    v_email,
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
    v_total,
    v_coupon,
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
-- ===== 20261124200000_email_send_log.sql
-- Simple send log for the Resend-based email function (replaces Lovable email queue)
CREATE TABLE IF NOT EXISTS public.email_send_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id TEXT,
  template_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_email_send_log_created ON public.email_send_log(created_at DESC);
