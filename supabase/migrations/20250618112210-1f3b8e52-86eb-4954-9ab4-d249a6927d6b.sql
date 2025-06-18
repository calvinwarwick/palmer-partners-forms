
-- Create storage bucket for admin files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'admin-files',
  'admin-files',
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload admin files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'admin-files' AND
  auth.role() = 'authenticated'
);

-- Create policy to allow authenticated users to view files
CREATE POLICY "Authenticated users can view admin files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'admin-files');

-- Create policy to allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete admin files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'admin-files' AND
  auth.role() = 'authenticated'
);

-- Create policy to allow authenticated users to update files
CREATE POLICY "Authenticated users can update admin files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'admin-files' AND
  auth.role() = 'authenticated'
);
