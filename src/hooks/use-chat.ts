
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { transformMessage } from "@/components/chat/utils/messageUtils";

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
        
        if (conversationError) throw conversationError;
        
        setConversation(conversationData);
        
        const otherUserId = conversationData.seller_id === userId 
          ? conversationData.buyer_id 
          : conversationData.seller_id;
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherUserId)
          .single();
        
        if (profileError) throw profileError;
        
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
        }
        
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
        
        if (messagesError) throw messagesError;
        
        const transformedMessages: Message[] = messagesData.map(transformMessage);
        
        setMessages(transformedMessages);
        
        if (transformedMessages.length > 0) {
          setLastMessageSenderId(transformedMessages[transformedMessages.length - 1].sender_id);
        }
        
      } catch (error) {
        console.error('Error fetching conversation:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load conversation",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversation();
    
    const uniqueChannelId = `conversation-messages-${conversationId}-${userId}`;
    
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
          console.log('New message received:', payload);
          
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
            const messageExists = currentMessages.some(msg => msg.id === transformedMessage.id);
            if (messageExists) {
              return currentMessages;
            }
            return [...currentMessages, transformedMessage];
          });
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for channel ${uniqueChannelId}:`, status);
        
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to messages for conversation ${conversationId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to messages for conversation ${conversationId}`);
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Unable to receive real-time messages. Please refresh the page.",
          });
        }
      });
    
    const conversationChannelId = `conversation-updates-${conversationId}-${userId}`;
    
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
      .subscribe();
    
    return () => {
      console.log('Cleaning up subscription channels');
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(conversationChannel);
    };
  }, [conversationId, userId, toast]);

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
