
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationListProps {
  conversations: ConversationWithDetails[];
  isLoading: boolean;
  searchQuery: string;
  user: any;
}

export default function ConversationList({
  conversations,
  isLoading,
  searchQuery,
  user
}: ConversationListProps) {
  const navigate = useNavigate();
  
  const getOtherUserProfile = (conversation: ConversationWithDetails) => {
    return conversation.sellerProfile || conversation.buyerProfile;
  };
  
  const handleConversationClick = (id: string) => {
    navigate(`/chat/${id}`);
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isThisYear = date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (isThisYear) {
      return format(date, 'MMM d, h:mm a');
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="h-4 w-[80px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (conversations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No conversations yet</h3>
          <p className="text-muted-foreground text-center mt-2 mb-6 max-w-md">
            {searchQuery 
              ? "No conversations match your search" 
              : "When you message sellers or buyers in the marketplace, your conversations will appear here."}
          </p>
          <Button onClick={() => navigate('/marketplace')}>
            Browse Marketplace
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {conversations.map((conversation) => {
        const otherUserProfile = getOtherUserProfile(conversation);
        const latestMessage = conversation.latestMessage;
        const isCurrentUserSeller = conversation.seller_id === user.id;
        
        return (
          <Card 
            key={conversation.id} 
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => handleConversationClick(conversation.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={otherUserProfile?.avatar_url || undefined} />
                  <AvatarFallback>
                    {otherUserProfile?.full_name?.charAt(0) || otherUserProfile?.username?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">
                      {otherUserProfile?.full_name || otherUserProfile?.username || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {conversation.updated_at ? (
                        formatTimestamp(conversation.updated_at)
                      ) : (
                        formatTimestamp(conversation.created_at)
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {isCurrentUserSeller ? 'Selling' : 'Buying'}
                    </Badge>
                    
                    {conversation.product && (
                      <div className="flex items-center gap-1 truncate">
                        <span className="text-sm font-medium truncate">
                          {conversation.product.title}
                        </span>
                        {conversation.product.price !== null && (
                          <span className="text-xs text-muted-foreground">
                            (${conversation.product.price})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {latestMessage && (
                    <p className="text-sm text-muted-foreground truncate mt-2">
                      <span className="font-medium inline-block mr-1">
                        {latestMessage.sender_id === user.id ? 'You:' : ''}
                      </span>
                      {latestMessage.content || 
                       (latestMessage.attachment_url ? 'Sent an attachment' : 
                        (latestMessage.location ? 'Shared a location' : 'New message'))}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
