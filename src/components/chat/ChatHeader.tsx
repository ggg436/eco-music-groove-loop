
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatHeaderProps {
  conversation: Conversation;
  otherUser: Profile;
  product: MarketplaceItem | null;
  currentUserId: string;
}

const ChatHeader = ({ conversation, otherUser, product, currentUserId }: ChatHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="p-4 border-b flex items-center">
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      
      <Avatar className="h-10 w-10">
        <AvatarImage src={otherUser.avatar_url || undefined} alt={otherUser.full_name || otherUser.username || 'User'} />
        <AvatarFallback>{otherUser.full_name?.charAt(0) || otherUser.username?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
      
      <div className="ml-3 flex-1">
        <h3 className="font-semibold">{otherUser.full_name || otherUser.username || 'User'}</h3>
        <p className="text-xs text-muted-foreground">
          About {product?.title || 'Product'}
        </p>
      </div>
      
      <div className="hidden md:block">
        <Badge variant="outline" className="ml-2">
          {currentUserId === conversation.seller_id ? 'You are the seller' : 'You are the buyer'}
        </Badge>
      </div>
    </div>
  );
};

export default ChatHeader;
