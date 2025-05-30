
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { transformMessage, isDuplicateMessage } from "@/components/chat/utils/messageUtils";

interface UseChatProps {
  conversationId: string | undefined;
  userId: string | undefined;
}

interface UseChatResult {
  isLoading: boolean;
  conversation: Conversation | null;
  otherUser: Profile | null;
  product: MarketplaceItem | null;
  messages: Message[];
  lastMessageSenderId: string | null;
  showLocationPicker: boolean;
  setShowLocationPicker: (show: boolean) => void;
  handleLocationSelected: (location: { lat: number; lng: number; address: string }) => void;
  playNotification: boolean;
  setPlayNotification: (play: boolean) => void;
}

export const useChat = ({ conversationId, userId }: UseChatProps): UseChatResult => {
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<Profile | null>(null);
  const [product, setProduct] = useState<MarketplaceItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessageSenderId, setLastMessageSenderId] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [playNotification, setPlayNotification] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<boolean>(false);

  useEffect(() => {
    if (!conversationId || !userId) return;
    
    const fetchConversation = async () => {
      try {
        setIsLoading(true);
        
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
        } else if (productError) {
          console.error('Error fetching product:', productError);
          // Don't throw here, just log the error as the product might have been deleted
        }
        
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
        
        setMessages(transformedMessages);
        
        if (transformedMessages.length > 0) {
          setLastMessageSenderId(transformedMessages[transformedMessages.length - 1].sender_id);
        }
        
      } catch (error) {
        console.error('Error in fetchConversation:', error);
        setSubscriptionError(true);
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
    
    // Create a truly unique channel ID for this user and conversation
    const uniqueChannelId = `chat-messages-${conversationId}-${userId}-${Date.now()}`;
    console.log(`Creating channel: ${uniqueChannelId} for conversation ${conversationId}`);
    
    // Subscribe to new messages
    const messageChannel = supabase
      .channel(uniqueChannelId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('New message received via realtime:', payload);
          
          if (!payload.new) {
            console.error('Message payload is missing the new property:', payload);
            return;
          }
          
          const newMessage = payload.new as any;
          const transformedMessage = transformMessage(newMessage);
          
          if (newMessage.sender_id !== userId) {
            console.log('Playing notification for message from:', newMessage.sender_id);
            setPlayNotification(true);
          }
          
          setLastMessageSenderId(newMessage.sender_id);
          
          setMessages((currentMessages) => {
            // Check if the message already exists to prevent duplicates
            if (isDuplicateMessage(transformedMessage, currentMessages)) {
              console.log(`Message ${transformedMessage.id} already exists, not adding`);
              return currentMessages;
            }
            console.log(`Adding new message ${transformedMessage.id} to state`);
            return [...currentMessages, transformedMessage];
          });
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for channel ${uniqueChannelId}:`, status);
        
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to messages for conversation ${conversationId}`);
          setSubscriptionError(false);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to messages for conversation ${conversationId}`);
          setSubscriptionError(true);
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Unable to receive real-time messages. Please refresh the page.",
          });
        }
      });
    
    // Subscribe to conversation updates
    const conversationChannelId = `chat-updates-${conversationId}-${userId}-${Date.now()}`;
    
    const conversationChannel = supabase
      .channel(conversationChannelId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('Conversation updated:', payload);
          setConversation(payload.new as Conversation);
        }
      )
      .subscribe((status) => {
        console.log(`Conversation channel status: ${status}`);
      });
    
    // Check if we are connected periodically
    const intervalId = setInterval(() => {
      if (subscriptionError) {
        console.log('Trying to reconnect...');
        fetchConversation();
      }
    }, 30000); // Try to reconnect every 30 seconds if there's an error
    
    return () => {
      console.log('Cleaning up subscription channels');
      clearInterval(intervalId);
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(conversationChannel);
    };
  }, [conversationId, userId, toast, subscriptionError]);

  const handleLocationSelected = (location: { lat: number; lng: number; address: string }) => {
    if (!userId || !conversationId) return;
    
    const locationData = {
      latitude: location.lat,
      longitude: location.lng,
      address: location.address,
    };
    
    supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        content: location.address,
        location: locationData,
      })
      .then(({ error }) => {
        if (error) {
          console.error('Error sending location:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to send location",
          });
        }
        
        setShowLocationPicker(false);
      });
  };

  return {
    isLoading,
    conversation,
    otherUser,
    product,
    messages,
    lastMessageSenderId,
    showLocationPicker,
    setShowLocationPicker,
    handleLocationSelected,
    playNotification,
    setPlayNotification,
  };
};
