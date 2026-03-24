CREATE POLICY "Anyone can update orders"
ON public.orders FOR UPDATE TO anon, authenticated
USING (true)
WITH CHECK (true);