
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, ThumbsUp, Bookmark, Share2 } from "lucide-react";

interface VideoRecommendationProps {
  title: string;
  creator: string;
  thumbnail: string;
  duration: string;
  views: string;
  videoId?: string;
  isExternal?: boolean;
}

export default function VideoRecommendation({
  title,
  creator,
  thumbnail,
  duration,
  views,
  videoId,
  isExternal = true
}: VideoRecommendationProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(Math.floor(Math.random() * 500) + 50);
  
  const handleLike = () => {
    setLikeCount(prev => prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const videoUrl = isExternal ? 
    `https://www.youtube.com/watch?v=${videoId}` : 
    `/videos/${videoId}`;

  return (
    <Card className="overflow-hidden transition-transform hover:shadow-md">
      <div className="relative group">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full aspect-video object-cover"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm text-white"
            onClick={() => window.open(videoUrl, '_blank')}
          >
            <PlayCircle className="h-8 w-8" />
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium line-clamp-2 mb-1" title={title}>{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{creator} • {views} views</p>
        
        <div className="flex items-center justify-between text-sm">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-primary"
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            {likeCount}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={isBookmarked ? "text-primary" : "text-muted-foreground"}
            onClick={handleBookmark}
          >
            <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? "fill-primary" : ""}`} />
            Save
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-primary"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
