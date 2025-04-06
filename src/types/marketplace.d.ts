
declare interface MarketplaceItem {
  id: number;
  title: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  images: string[];
  category?: string;
  location?: string;
  distance?: string;
  listingType: 'sell' | 'exchange' | 'giveaway';
  createdAt: Date;
  user?: {
    name: string;
    avatar?: string;
    rating?: number;
    id?: string;
  };
  user_id?: string;
  image_url?: string;
  original_price?: number;
  created_at?: string;
  listing_type?: 'sell' | 'exchange' | 'giveaway';
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
  p_listing_type: 'sell' | 'exchange' | 'giveaway';
  p_user_id: string;
}
