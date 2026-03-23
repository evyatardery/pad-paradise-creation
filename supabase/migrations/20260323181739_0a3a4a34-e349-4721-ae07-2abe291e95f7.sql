
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
