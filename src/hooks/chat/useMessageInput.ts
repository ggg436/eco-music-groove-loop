
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseMessageInputProps {
  conversationId: string;
  userId: string;
  isConnected: boolean;
}

export const useMessageInput = ({ conversationId, userId, isConnected }: UseMessageInputProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (attachmentData?: {
    url: string;
    type: string;
  }) => {
    if ((!message.trim() && !attachmentData) || !userId || !conversationId || isSending) return;
    
    try {
      setIsSending(true);
      
      console.log('Sending message:', { 
        conversationId, 
        userId, 
        hasAttachment: !!attachmentData,
        messageLength: message.trim().length 
      });
      
      const messageData = {
        conversation_id: conversationId,
        sender_id: userId,
        content: message.trim() || null,
        attachment_url: attachmentData?.url || null,
        attachment_type: attachmentData?.type || null,
      };
      
      console.log('Inserting message:', messageData);
      
      const { error: messageError } = await supabase
        .from('messages')
        .insert(messageData);
      
      if (messageError) {
        console.error('Error inserting message:', messageError);
        throw messageError;
      }
      
      // Update conversation timestamp
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      if (updateError) {
        console.error('Error updating conversation timestamp:', updateError);
        // Don't throw here, just log since the message was already sent
      }
      
      console.log('Message sent successfully');
      setMessage("");
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const canSend = (hasAttachment: boolean) => {
    return (message.trim() || hasAttachment) && !isSending && isConnected;
  };

  return {
    message,
    setMessage,
    isSending,
    handleSendMessage,
    canSend,
  };
};
