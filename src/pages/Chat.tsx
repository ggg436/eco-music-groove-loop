
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import MessageSound from "@/components/chat/MessageSound";
import ChatHeader from "@/components/chat/ChatHeader";
import ProductInfo from "@/components/chat/ProductInfo";
import MessagesContainer from "@/components/chat/MessagesContainer";
import MessageInput from "@/components/chat/MessageInput";
import ChatSkeleton from "@/components/chat/ChatSkeleton";
import LocationPicker from "@/components/chat/LocationPicker";
import { useChat } from "@/hooks/use-chat";

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const {
    isLoading,
    conversation,
    otherUser,
    product,
    messages,
    showLocationPicker,
    setShowLocationPicker,
    handleLocationSelected,
    playNotification,
    setPlayNotification,
    isConnected,
  } = useChat({
    conversationId,
    userId: user?.id,
  });
  
  const handleNotificationPlayed = () => {
    setPlayNotification(false);
  };
  
  if (!user) {
    return (
      <Layout>
        <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-xl font-semibold mb-4">Please sign in to view conversations</h2>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <ChatSkeleton />
        </div>
      </Layout>
    );
  }
  
  if (!conversation || !otherUser) {
    return (
      <Layout>
        <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-xl font-semibold mb-4">Conversation not found</h2>
          <p className="text-muted-foreground mb-4 text-center">
            This conversation may have been deleted or you may not have permission to view it.
          </p>
          <Button onClick={() => navigate('/marketplace')}>
            Back to Marketplace
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <MessageSound play={playNotification} onPlayed={handleNotificationPlayed} />
      
      <div className="container py-4 md:py-8">
        <div className="flex flex-col h-[calc(100vh-240px)] md:h-[calc(100vh-200px)] bg-background rounded-lg border shadow">
          <ChatHeader 
            conversation={conversation}
            otherUser={otherUser}
            product={product}
            currentUserId={user.id}
          />
          
          <ProductInfo product={product} />
          
          <MessagesContainer 
            messages={messages}
            otherUser={otherUser}
            currentUser={user}
          />
          
          {showLocationPicker && (
            <div className="p-3 border-t">
              <LocationPicker
                onSelectLocation={handleLocationSelected}
                onCancel={() => setShowLocationPicker(false)}
              />
            </div>
          )}
          
          <MessageInput 
            conversationId={conversationId as string}
            userId={user.id}
            isConnected={isConnected}
          />
        </div>
      </div>
    </Layout>
  );
}
