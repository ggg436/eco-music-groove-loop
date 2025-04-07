
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "./FormField";
import { PriceFields } from "./PriceFields";
import { ListingTypeSelector } from "./ListingTypeSelector";
import { ImageUploadField } from "./ImageUploadField";

export default function MarketplaceItemForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [listingType, setListingType] = useState("Offer");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const { error: uploadError } = await supabase
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
          <FormField id="title" label="Title">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Item Name"
            />
          </FormField>
          
          <FormField id="description" label="Description">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the item"
            />
          </FormField>
          
          <PriceFields 
            price={price}
            originalPrice={originalPrice}
            onPriceChange={setPrice}
            onOriginalPriceChange={setOriginalPrice}
          />
          
          <FormField id="category" label="Category">
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Electronics, Clothing"
            />
          </FormField>
          
          <FormField id="location" label="Location">
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
            />
          </FormField>
          
          <ListingTypeSelector
            value={listingType}
            onChange={(value) => setListingType(value)}
          />
          
          <ImageUploadField onChange={setImage} />
          
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
