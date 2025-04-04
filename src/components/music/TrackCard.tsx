
import { Heart, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TrackCardProps {
  title: string;
  artist: string;
  image: string;
  duration: string;
  ecoFriendly?: boolean;
  className?: string;
}

export default function TrackCard({
  title,
  artist,
  image,
  duration,
  ecoFriendly = false,
  className,
}: TrackCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <div className={cn("track-card group", className)}>
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 flex-shrink-0 rounded overflow-hidden">
          <img src={image} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="h-5 w-5 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{title}</h4>
          <p className="text-sm text-muted-foreground truncate">{artist}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {ecoFriendly && (
            <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <svg 
                className="w-3 h-3 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Eco
            </span>
          )}
          <span className="text-xs text-muted-foreground">{duration}</span>
          <button 
            onClick={() => setIsLiked(!isLiked)} 
            className="text-foreground/70 hover:text-red-500"
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
          </button>
        </div>
      </div>
    </div>
  );
}
