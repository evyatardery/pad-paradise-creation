ALTER TABLE public.orders ADD COLUMN coupon_code text;

COMMENT ON COLUMN public.orders.coupon_code IS 'Applied coupon/promo code at checkout';