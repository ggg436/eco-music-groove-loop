
import { useState, useRef } from "react";
import { isDuplicateMessage } from "@/components/chat/utils/messageUtils";

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessageSenderId, setLastMessageSenderId] = useState<string | null>(null);

  const addMessage = (newMessage: Message) => {
    setLastMessageSenderId(newMessage.sender_id);
    
    setMessages((currentMessages) => {
      // Check if the message already exists to prevent duplicates
      if (isDuplicateMessage(newMessage, currentMessages)) {
        console.log(`Message ${newMessage.id} already exists, not adding`);
        return currentMessages;
      }
      console.log(`Adding new message ${newMessage.id} to state`);
      return [...currentMessages, newMessage];
    });
  };

  const setInitialMessages = (initialMessages: Message[]) => {
    setMessages(initialMessages);
    
    if (initialMessages.length > 0) {
      setLastMessageSenderId(initialMessages[initialMessages.length - 1].sender_id);
    }
  };

  return {
    messages,
    lastMessageSenderId,
    addMessage,
    setInitialMessages,
  };
};
