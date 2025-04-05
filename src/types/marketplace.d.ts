
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
  };
  user_id?: string;
  image_url?: string;
  original_price?: number;
  created_at?: string;
  listing_type?: 'sell' | 'exchange' | 'giveaway';
}
