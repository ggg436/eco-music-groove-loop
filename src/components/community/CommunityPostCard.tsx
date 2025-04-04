
import { Heart, MessageSquare, Share2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CommunityPostCardProps {
  username: string;
  userAvatar?: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timeAgo: string;
  className?: string;
}

export default function CommunityPostCard({
  username,
  userAvatar,
  content,
  image,
  likes,
  comments,
  timeAgo,
  className,
}: CommunityPostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  
  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };
  
  return (
    <div className={cn("eco-card p-4 space-y-4", className)}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
          {userAvatar ? (
            <img src={userAvatar} alt={username} className="h-full w-full object-cover" />
          ) : (
            <User className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="font-medium">{username}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
      </div>
      
      <p className="text-sm">{content}</p>
      
      {image && (
        <div className="rounded-lg overflow-hidden">
          <img src={image} alt="Post content" className="w-full object-cover" />
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t border-border/30">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLike} 
          className={cn(
            "text-foreground/80 hover:text-primary",
            liked && "text-red-500"
          )}
        >
          <Heart className={cn("h-4 w-4 mr-2", liked && "fill-red-500")} />
          {likeCount}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-foreground/80 hover:text-primary"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {comments}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-foreground/80 hover:text-primary"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
