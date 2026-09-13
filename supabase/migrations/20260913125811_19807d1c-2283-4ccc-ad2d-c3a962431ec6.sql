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