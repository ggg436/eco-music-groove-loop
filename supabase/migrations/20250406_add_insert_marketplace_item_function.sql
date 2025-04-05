
-- Create a function to insert marketplace items
CREATE OR REPLACE FUNCTION public.insert_marketplace_item(
  p_title TEXT,
  p_description TEXT,
  p_category TEXT,
  p_price DECIMAL(10, 2),
  p_original_price DECIMAL(10, 2),
  p_image_url TEXT,
  p_location TEXT,
  p_listing_type TEXT,
  p_user_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.marketplace_items (
    title,
    description,
    category,
    price,
    original_price,
    image_url,
    location,
    listing_type,
    user_id
  ) VALUES (
    p_title,
    p_description,
    p_category,
    p_price,
    p_original_price,
    p_image_url,
    p_location,
    p_listing_type,
    p_user_id
  );
END;
$$;
