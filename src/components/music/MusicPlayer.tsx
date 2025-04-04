
import { useState } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, Heart, Repeat, Shuffle, Volume1, 
  VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface MusicPlayerProps {
  className?: string;
  minimized?: boolean;
}

export default function MusicPlayer({ className, minimized = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(30);
  const [isLiked, setIsLiked] = useState(false);

  // Just for demo/visual purposes - no actual functionality
  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleLike = () => setIsLiked(!isLiked);
  const toggleMute = () => setIsMuted(!isMuted);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Simulated current time and duration for demo purposes
  const currentTime = (progress / 100) * 210; // 3:30 in seconds
  const duration = 210; // 3:30 in seconds

  const VolumeIcon = isMuted ? VolumeX : volume > 50 ? Volume2 : Volume1;

  if (minimized) {
    return (
      <div className={cn("fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-background/95 px-4 py-2 backdrop-blur-md", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-md bg-green-200 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1446057032654-9d8885db76c6" 
                alt="Album art" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Forest Reverie</span>
              <span className="text-xs text-muted-foreground">EchoGrove</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleLike} className="text-foreground/80 hover:text-primary">
              <Heart className={cn("h-5 w-5", isLiked && "fill-red-500 text-red-500")} />
            </Button>
            <Button variant="ghost" size="icon" onClick={togglePlay} className="text-foreground/80 hover:text-primary">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full border border-border/30 rounded-xl bg-card/80 p-4 backdrop-blur-sm", className)}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="h-24 w-24 rounded-lg overflow-hidden shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1446057032654-9d8885db76c6" 
            alt="Album art" 
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">Forest Reverie</h3>
              <p className="text-sm text-muted-foreground">EchoGrove</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLike}
              className="text-foreground/80 hover:text-primary"
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-red-500 text-red-500")} />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="music-track-progress">
              <div style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                <Repeat className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-full" 
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMute}
                className="text-foreground/80 hover:text-primary"
              >
                <VolumeIcon className="h-4 w-4" />
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                className="w-24"
                onValueChange={(value) => setVolume(value[0])}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
