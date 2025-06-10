
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { transformMessage } from "@/components/chat/utils/messageUtils";

interface UseChatDataProps {
  conversationId: string | undefined;
  userId: string | undefined;
  onDataLoaded: (messages: Message[]) => void;
}

export const useChatData = ({ conversationId, userId, onDataLoaded }: UseChatDataProps) => {
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<Profile | null>(null);
  const [product, setProduct] = useState<MarketplaceItem | null>(null);

  useEffect(() => {
    if (!conversationId || !userId) {
      setIsLoading(false);
      return;
    }
    
    const fetchConversation = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching conversation ${conversationId} for user ${userId}`);
        
        const { data: conversationData, error: conversationError } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single();
        
        if (conversationError) {
          console.error('Error fetching conversation:', conversationError);
          throw conversationError;
        }
        
        setConversation(conversationData);
        
        // Check if the user is part of this conversation
        if (conversationData.seller_id !== userId && conversationData.buyer_id !== userId) {
          console.error('User is not part of this conversation');
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "You are not authorized to view this conversation",
          });
          return;
        }
        
        const otherUserId = conversationData.seller_id === userId 
          ? conversationData.buyer_id 
          : conversationData.seller_id;
        
        console.log(`Fetching profile for other user: ${otherUserId}`);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherUserId)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }
        
        setOtherUser(profileData);
        
        // Fetch product details
        if (conversationData.product_id) {
          const { data: productData, error: productError } = await supabase
            .from('marketplace_items')
            .select('*')
            .eq('id', conversationData.product_id)
            .single();
          
          if (!productError && productData) {
            setProduct({
              id: productData.id,
              title: productData.title,
              description: productData.description || '',
              price: productData.price !== null ? Number(productData.price) : null,
              originalPrice: productData.original_price !== null ? Number(productData.original_price) : null,
              images: [productData.image_url || 'https://images.unsplash.com/photo-1560343090-f0409e92791a'],
              category: productData.category || 'Miscellaneous',
              location: productData.location || 'Unknown',
              user_id: productData.user_id,
              image_url: productData.image_url,
              listing_type: productData.listing_type
            });
          }
        }
        
        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
        
        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          throw messagesError;
        }
        
        const transformedMessages: Message[] = messagesData.map(transformMessage);
        console.log(`Loaded ${transformedMessages.length} messages for conversation ${conversationId}`);
        
        onDataLoaded(transformedMessages);
        
      } catch (error) {
        console.error('Error in fetchConversation:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load conversation. Please try refreshing the page.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversation();
  }, [conversationId, userId, toast, onDataLoaded]);

  const updateConversation = (updatedConversation: Conversation) => {
    setConversation(updatedConversation);
  };

  return {
    isLoading,
    conversation,
    otherUser,
    product,
    updateConversation,
  };
};
