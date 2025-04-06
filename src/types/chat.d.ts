
declare interface Conversation {
  id: string;
  product_id: number;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at?: string;
}

declare interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content?: string;
  attachment_url?: string;
  attachment_type?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  created_at: string;
}

declare interface ConversationWithDetails extends Conversation {
  sellerProfile?: Profile;
  buyerProfile?: Profile;
  product?: MarketplaceItem;
  latestMessage?: Message;
}

declare interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  eco_points?: number;
  created_at?: string;
  updated_at?: string;
}
