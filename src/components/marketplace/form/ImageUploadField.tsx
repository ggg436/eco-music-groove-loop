
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploadFieldProps {
  onChange: (file: File | null) => void;
}

export function ImageUploadField({ onChange }: ImageUploadFieldProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setImageUrl(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="image">Image Upload</Label>
      <Input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <Button variant="outline" asChild>
        <Label htmlFor="image" className="cursor-pointer">
          <Upload className="mr-2 h-4 w-4" />
          {image ? "Change Image" : "Upload Image"}
        </Label>
      </Button>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="mt-2 rounded-md object-cover aspect-square max-h-40"
        />
      )}
    </div>
  );
}
