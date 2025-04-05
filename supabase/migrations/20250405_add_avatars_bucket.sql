
-- Create a storage bucket for user avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'User Avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to avatar files
CREATE POLICY "Public avatar images are accessible to all"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar images
CREATE POLICY "Users can upload their own avatar images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid() IS NOT NULL AND
        (storage.foldername(name))[1] = 'profiles' AND
        (storage.filename(name))[1] = auth.uid()::text
    );

-- Allow users to update their own avatar images
CREATE POLICY "Users can update their own avatar images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars' AND
        owner = auth.uid() AND
        (storage.foldername(name))[1] = 'profiles' AND
        (storage.filename(name))[1] = auth.uid()::text
    );

-- Allow users to delete their own avatar images
CREATE POLICY "Users can delete their own avatar images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars' AND
        owner = auth.uid() AND
        (storage.foldername(name))[1] = 'profiles' AND
        (storage.filename(name))[1] = auth.uid()::text
    );
