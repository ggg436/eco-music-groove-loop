
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploadFieldProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function ImageUploadField({ images, onImagesChange }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // For now, we'll create a local URL for the image
      // In a real app, you'd upload to a cloud storage service
      const imageUrl = URL.createObjectURL(file);
      onImagesChange([...images, imageUrl]);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="image">Images</Label>
      <Input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={isUploading}
      />
      <Button 
        variant="outline" 
        asChild 
        disabled={isUploading}
      >
        <Label htmlFor="image" className="cursor-pointer">
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload Image"}
        </Label>
      </Button>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative">
              <img
                src={imageUrl}
                alt={`Preview ${index + 1}`}
                className="rounded-md object-cover aspect-square"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 p-1 h-6 w-6"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
