
import { Leaf, Trees, Droplets, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EcoStatsCardProps {
  className?: string;
}

export default function EcoStatsCard({ className }: EcoStatsCardProps) {
  return (
    <div className={cn("eco-card p-6", className)}>
      <h3 className="text-lg font-medium mb-4">Your Eco Impact</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
          <Leaf className="h-6 w-6 text-green-600 mb-1" />
          <span className="text-lg font-medium">238</span>
          <span className="text-xs text-muted-foreground">EcoPoints</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
          <Trees className="h-6 w-6 text-green-600 mb-1" />
          <span className="text-lg font-medium">2</span>
          <span className="text-xs text-muted-foreground">Trees Planted</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
          <Droplets className="h-6 w-6 text-green-600 mb-1" />
          <span className="text-lg font-medium">84</span>
          <span className="text-xs text-muted-foreground">Water Saved (L)</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
          <Trash2 className="h-6 w-6 text-green-600 mb-1" />
          <span className="text-lg font-medium">17</span>
          <span className="text-xs text-muted-foreground">Items Recycled</span>
        </div>
      </div>
    </div>
  );
}
