
import { Award, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ChallengeCardProps {
  title: string;
  description: string;
  image: string;
  daysLeft: number;
  participants: number;
  points: number;
  progress?: number;
  isJoined?: boolean;
  className?: string;
}

export default function ChallengeCard({
  title,
  description,
  image,
  daysLeft,
  participants,
  points,
  progress = 0,
  isJoined = false,
  className,
}: ChallengeCardProps) {
  return (
    <div className={cn("eco-card overflow-hidden group", className)}>
      <div className="relative h-40">
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover" 
        />
        <div className="absolute top-3 right-3 flex items-center bg-card/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <Award className="h-4 w-4 text-primary mr-1" />
          <span className="text-xs font-medium">{points} EcoPoints</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{daysLeft} days left</span>
          </div>
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            <span>{participants} participants</span>
          </div>
        </div>
        
        {isJoined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Your progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <Button variant={isJoined ? "secondary" : "default"} className="w-full">
          {isJoined ? "Track Progress" : "Join Challenge"}
        </Button>
      </div>
    </div>
  );
}
