
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Clock, PlayCircle, Bookmark } from "lucide-react";

interface ReuseIdeaProps {
  idea: {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    likes: number;
    category: string;
    difficulty: string;
    timeRequired: string;
    videoUrl: string;
  }
}

export default function ReuseIdeaCard({ idea }: ReuseIdeaProps) {
  return (
    <Card className="overflow-hidden group h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={idea.thumbnail} 
          alt={idea.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        <div className="absolute top-3 left-3 bg-primary/80 text-white text-xs px-2 py-1 rounded-full">
          {idea.category}
        </div>
        
        <Button 
          size="icon" 
          variant="secondary" 
          className="absolute bottom-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <PlayCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-1">{idea.title}</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-500">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {idea.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {idea.timeRequired}
            </div>
            <div>Difficulty: {idea.difficulty}</div>
          </div>
          
          <div className="flex items-center">
            <Heart className="h-3 w-3 mr-1 fill-current text-red-500" />
            {idea.likes}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
