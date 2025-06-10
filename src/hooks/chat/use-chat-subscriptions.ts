
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { transformMessage, isDuplicateMessage } from "@/components/chat/utils/messageUtils";

interface UseChatSubscriptionsProps {
  conversationId: string | undefined;
  userId: string | undefined;
  onNewMessage: (message: Message) => void;
  onConversationUpdate: (conversation: Conversation) => void;
  onNotification: () => void;
}

export const useChatSubscriptions = ({
  conversationId,
  userId,
  onNewMessage,
  onConversationUpdate,
  onNotification,
}: UseChatSubscriptionsProps) => {
  const [isConnected, setIsConnected] = useState(false);
  
  const subscriptionsSetup = useRef(false);
  const messageChannelRef = useRef<any>(null);
  const conversationChannelRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = () => {
    console.log('Cleaning up chat subscriptions');
    subscriptionsSetup.current = false;
    
    if (messageChannelRef.current) {
      supabase.removeChannel(messageChannelRef.current);
      messageChannelRef.current = null;
    }
    if (conversationChannelRef.current) {
      supabase.removeChannel(conversationChannelRef.current);
      conversationChannelRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
  };

  const setupRealtimeSubscriptions = () => {
    if (!conversationId || !userId || subscriptionsSetup.current) return;
    
    console.log(`Setting up real-time subscriptions for conversation ${conversationId}`);
    subscriptionsSetup.current = true;
    
    // Clean up existing subscriptions
    cleanup();
    
    // Subscribe to new messages
    messageChannelRef.current = supabase
      .channel(`messages-${conversationId}-${userId}-${Date.now()}`)
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
          
          // Only play notification for messages from other users
          if (newMessage.sender_id !== userId) {
            console.log('Playing notification for message from:', newMessage.sender_id);
            onNotification();
          }
          
          onNewMessage(transformedMessage);
        }
      )
      .subscribe((status) => {
        console.log(`Message subscription status:`, status);
        
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to messages for conversation ${conversationId}`);
          setIsConnected(true);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to messages for conversation ${conversationId}`);
          setIsConnected(false);
          
          // Retry connection after 3 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Retrying message subscription...');
            setupRealtimeSubscriptions();
          }, 3000);
        } else if (status === 'CLOSED') {
          setIsConnected(false);
        }
      });
    
    // Subscribe to conversation updates
    conversationChannelRef.current = supabase
      .channel(`conversation-${conversationId}-${userId}-${Date.now()}`)
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
          onConversationUpdate(payload.new as Conversation);
        }
      )
      .subscribe((status) => {
        console.log(`Conversation subscription status:`, status);
      });
  };

  useEffect(() => {
    if (!conversationId || !userId) {
      cleanup();
      return;
    }
    
    setupRealtimeSubscriptions();
    
    return cleanup;
  }, [conversationId, userId]);

  return {
    isConnected,
    cleanup,
  };
};
