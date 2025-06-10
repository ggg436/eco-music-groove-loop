
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useChatSubscriptions } from "./chat/use-chat-subscriptions";
import { useChatMessages } from "./chat/use-chat-messages";
import { useChatData } from "./chat/use-chat-data";

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
  isConnected: boolean;
}

export const useChat = ({ conversationId, userId }: UseChatProps): UseChatResult => {
  const { toast } = useToast();
  
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [playNotification, setPlayNotification] = useState(false);

  const { messages, lastMessageSenderId, addMessage, setInitialMessages } = useChatMessages();

  const { isLoading, conversation, otherUser, product, updateConversation } = useChatData({
    conversationId,
    userId,
    onDataLoaded: setInitialMessages,
  });

  const { isConnected } = useChatSubscriptions({
    conversationId,
    userId,
    onNewMessage: addMessage,
    onConversationUpdate: updateConversation,
    onNotification: () => setPlayNotification(true),
  });

  const handleLocationSelected = async (location: { lat: number; lng: number; address: string }) => {
    if (!userId || !conversationId) return;
    
    const locationData = {
      latitude: location.lat,
      longitude: location.lng,
      address: location.address,
    };
    
    console.log('Sending location message:', locationData);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          content: location.address,
          location: locationData,
        });
        
      if (error) {
        console.error('Error sending location:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send location",
        });
      } else {
        console.log('Location message sent successfully');
        
        // Update conversation timestamp
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      }
    } catch (error) {
      console.error('Error in handleLocationSelected:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send location",
      });
    }
    
    setShowLocationPicker(false);
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
    isConnected,
  };
};
