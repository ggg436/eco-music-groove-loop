
CREATE TABLE IF NOT EXISTS public.marketplace_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price DECIMAL(10, 2),
    original_price DECIMAL(10, 2),
    image_url TEXT,
    location TEXT,
    listing_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add RLS policies for marketplace_items
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view marketplace items
CREATE POLICY "Anyone can view marketplace items"
    ON public.marketplace_items
    FOR SELECT
    USING (true);

-- Only the authenticated user who created the item can update it
CREATE POLICY "Users can update their own marketplace items"
    ON public.marketplace_items
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Only the authenticated user who created the item can delete it
CREATE POLICY "Users can delete their own marketplace items"
    ON public.marketplace_items
    FOR DELETE
    USING (auth.uid() = user_id);

-- Only authenticated users can insert marketplace items and they must be the owner
CREATE POLICY "Authenticated users can create marketplace items"
    ON public.marketplace_items
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create a storage bucket for marketplace images
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace', 'Marketplace Images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to marketplace files
CREATE POLICY "Public marketplace images are accessible to all"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'marketplace');

-- Allow authenticated users to upload marketplace images
CREATE POLICY "Users can upload marketplace images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'marketplace' AND
        auth.uid() IS NOT NULL
    );

-- Allow users to delete their own marketplace images
CREATE POLICY "Users can delete their own marketplace images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'marketplace' AND
        owner = auth.uid()
    );
