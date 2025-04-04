
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Upload } from "lucide-react";
import { useState } from "react";

interface RecycleLogCardProps {
  className?: string;
}

export default function RecycleLogCard({ className }: RecycleLogCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Just for demo purposes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`eco-card p-6 space-y-4 ${className}`}>
      <h3 className="text-lg font-medium">Log Your Recycling</h3>
      <p className="text-sm text-muted-foreground">
        Track your recycling activity, earn EcoPoints, and make a difference!
      </p>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium" htmlFor="recycleType">
            What did you recycle today?
          </label>
          <select 
            id="recycleType"
            className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          >
            <option>Plastic bottle</option>
            <option>Paper/Cardboard</option>
            <option>Glass</option>
            <option>Metal can</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Other</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium" htmlFor="quantity">
            Quantity
          </label>
          <input 
            id="quantity"
            type="number" 
            min="1"
            defaultValue="1"
            className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">
            Upload photo evidence
          </label>
          <div className="mt-1 border-2 border-dashed border-border rounded-md p-4 text-center">
            {selectedImage ? (
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Uploaded recycling" 
                  className="max-h-40 mx-auto rounded-md"
                />
                <button 
                  onClick={() => setSelectedImage(null)} 
                  className="mt-2 text-sm text-red-500"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to upload
                </p>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Today</span>
          <Clock className="h-3 w-3 ml-2 mr-1" />
          <span>Now</span>
        </div>
        <Button className="bg-gradient-eco">
          Log Recycling (+5 Points)
        </Button>
      </div>
    </div>
  );
}
