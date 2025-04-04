
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  title: string;
  description: string;
  image: string;
  trackCount: number;
  className?: string;
}

export default function PlaylistCard({
  title,
  description,
  image,
  trackCount,
  className,
}: PlaylistCardProps) {
  return (
    <div className={cn("eco-card overflow-hidden group", className)}>
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="aspect-square w-full object-cover" 
        />
        <button className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
          <Play className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
        <p className="text-xs text-muted-foreground mt-2">{trackCount} tracks</p>
      </div>
    </div>
  );
}
