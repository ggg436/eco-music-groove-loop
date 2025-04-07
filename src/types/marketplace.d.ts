
declare interface MarketplaceItem {
  id: number;
  title: string;
  description?: string;
  price?: number | null;
  originalPrice?: number | null;
  images: string[];
  category?: string;
  location?: string;
  distance?: string;
  listingType?: 'sell' | 'exchange' | 'giveaway';
  createdAt?: Date;
  user?: {
    name: string;
    avatar?: string;
    rating?: number;
    id?: string;
  };
  user_id?: string;
  image_url?: string;
  original_price?: number | null;
  created_at?: string;
  listing_type?: string; // Changed from enum to string to accept any value from the database
}

// Add a type for the RPC function parameters
declare interface InsertMarketplaceItemParams {
  p_title: string;
  p_description: string;
  p_category: string;
  p_price: number | null;
  p_original_price: number | null;
  p_image_url: string;
  p_location: string;
  p_listing_type: string;
  p_user_id: string;
}
