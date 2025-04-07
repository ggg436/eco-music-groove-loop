
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

export default function AddMarketplaceItemForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [listingType, setListingType] = useState("Offer"); // Default value
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setImageUrl(URL.createObjectURL(file)); // Set image URL for preview
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: "destructive",
        title: "You must be signed in to add a listing.",
      });
      return;
    }

    if (!title || !description || !price || !category || !location || !listingType || !image) {
      toast({
        variant: "destructive",
        title: "Please fill out all fields and upload an image.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload image to Supabase storage
      const imagePath = `marketplace/${user.id}/${Date.now()}-${image.name}`;
      
      // Upload the file to Supabase storage using the client directly
      const { error: uploadError, data } = await supabase
        .storage
        .from('marketplace')
        .upload(imagePath, image, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('marketplace')
        .getPublicUrl(imagePath);

      // 2. Save item details to Supabase database
      const { error: dbError } = await supabase
        .from('marketplace_items')
        .insert({
          user_id: user.id,
          title,
          description,
          price,
          original_price: originalPrice,
          category,
          location,
          listing_type: listingType,
          image_url: publicUrl,
        });

      if (dbError) {
        throw new Error(`Database insert failed: ${dbError.message}`);
      }

      toast({
        title: "Listing added successfully!",
      });
      navigate('/marketplace');

    } catch (error: any) {
      console.error("Error adding marketplace item:", error);
      toast({
        variant: "destructive",
        title: "Failed to add listing.",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Add Marketplace Item</CardTitle>
        <CardDescription>List your item for sale or donation.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Item Name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the item"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price === undefined ? "" : price.toString()}
                onChange={(e) => setPrice(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                placeholder="Selling Price"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="originalPrice">Original Price (Optional)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={originalPrice === undefined ? "" : originalPrice.toString()}
                onChange={(e) => setOriginalPrice(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                placeholder="Original Price"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Electronics, Clothing"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="listingType">Listing Type</Label>
                <Select 
                  value={listingType} 
                  onValueChange={(value: string) => setListingType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Offer">Offer (Selling)</SelectItem>
                    <SelectItem value="Request">Request (Donation)</SelectItem>
                  </SelectContent>
                </Select>
          </div>
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
          <CardFooter>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Submitting..." : "Add Listing"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
