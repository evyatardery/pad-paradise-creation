DROP POLICY IF EXISTS "Service role can manage order files" ON storage.objects;

CREATE POLICY "Service role can manage order files" ON storage.objects
FOR ALL TO service_role
USING (bucket_id = 'order-files')
WITH CHECK (bucket_id = 'order-files');