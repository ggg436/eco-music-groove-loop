
import { Package, RefreshCw, Gift, MapPin, MessageCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MarketplaceItemProps {
  item: MarketplaceItem;
}

export default function MarketplaceItemCard({ item }: MarketplaceItemProps) {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();

  const getListingBadge = () => {
    const listingType = item.listingType || item.listing_type || 'sell';
    
    switch (listingType) {
      case 'sell':
      case 'Sell':
      case 'Offer':
        return (
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Package className="mr-1 h-3 w-3 text-primary" />
            {item.price ? `$${item.price}` : 'For Sale'}
          </div>
        );
      case 'exchange':
      case 'Exchange':
        return (
          <div className="absolute top-3 left-3 bg-orange-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <RefreshCw className="mr-1 h-3 w-3" />
            Exchange
          </div>
        );
      case 'giveaway':
      case 'Giveaway':
      case 'Donation':
        return (
          <div className="absolute top-3 left-3 bg-green-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Gift className="mr-1 h-3 w-3" />
            Free
          </div>
        );
      default:
        return (
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Package className="mr-1 h-3 w-3 text-primary" />
            For Sale
          </div>
        );
    }
  };

  const startConversation = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to message the seller",
      });
      navigate('/auth', { state: { from: `/marketplace` } });
      return;
    }
    
    const sellerId = item.user?.id || item.user_id;
    
    if (!sellerId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot identify the seller of this item",
      });
      return;
    }
    
    if (user.id === sellerId) {
      toast({
        title: "Cannot message yourself",
        description: "This is your own listing",
      });
      return;
    }
    
    try {
      toast({
        title: "Starting conversation",
        description: "Please wait...",
      });
      
      // First check if a conversation already exists
      const { data: existingConversations, error: queryError } = await supabase
        .from('conversations')
        .select('id')
        .eq('product_id', item.id)
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId);
      
      if (queryError) throw queryError;
      
      // If a conversation already exists, navigate to it
      if (existingConversations && existingConversations.length > 0) {
        navigate(`/chat/${existingConversations[0].id}`);
        return;
      }
      
      // Create a new conversation if none exists
      const { data: newConversation, error: insertError } = await supabase
        .from('conversations')
        .insert({
          product_id: item.id,
          seller_id: sellerId,
          buyer_id: user.id,
        })
        .select('id')
        .single();
      
      if (insertError) throw insertError;
      
      // Add an initial message from the buyer
      await supabase
        .from('messages')
        .insert({
          conversation_id: newConversation.id,
          sender_id: user.id,
          content: `Hi, I'm interested in your listing: "${item.title}"`,
        });
      
      navigate(`/chat/${newConversation.id}`);
      
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start conversation",
      });
    }
  };

  // Get the image URL, handling different formats
  const imageUrl = item.images && item.images.length > 0 
    ? item.images[0] 
    : item.image_url || 'https://images.unsplash.com/photo-1560343090-f0409e92791a';

  // Handle missing description
  const description = item.description || '';

  // Handle user information, with fallbacks
  const userName = item.user?.name || 'User';
  const userAvatar = item.user?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956';
  const userRating = item.user?.rating || 5.0;

  // Handle location info
  const location = item.location || item.distance || 'Nearby';

  // Handle category
  const category = item.category || 'Miscellaneous';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={imageUrl} 
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {getListingBadge()}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <div className="text-xs text-muted-foreground">{category}</div>
          <h3 className="font-medium line-clamp-1">{item.title}</h3>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {description}
        </p>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{location}</span>
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full overflow-hidden">
              <img 
                src={userAvatar} 
                alt={userName}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-xs">{userName}</span>
          </div>
          
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={i < Math.floor(userRating) ? "currentColor" : "none"}
                stroke="currentColor"
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(userRating) ? "text-yellow-500" : "text-gray-300"
                )}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            ))}
            <span className="ml-1 text-xs">{userRating.toFixed(1)}</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-center" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            startConversation();
          }}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Message
        </Button>
      </CardFooter>
    </Card>
  );
}
