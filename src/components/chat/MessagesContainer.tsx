
import { useRef, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import ConversationMessage from "./ConversationMessage";

interface MessagesContainerProps {
  messages: Message[];
  otherUser: Profile;
  currentUser: any;
}

const MessagesContainer = ({ messages, otherUser, currentUser }: MessagesContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg">Start the conversation</h3>
          <p className="text-muted-foreground">
            No messages yet. Say hello to {otherUser.full_name || otherUser.username || 'User'}!
          </p>
        </div>
      ) : (
        messages.map((msg) => (
          <ConversationMessage
            key={msg.id}
            message={msg}
            isOwn={msg.sender_id === currentUser?.id}
            otherUser={otherUser}
            currentUser={currentUser}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesContainer;
