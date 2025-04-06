
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { UploadCloud, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "Furniture",
  "Home & Garden",
  "Kitchen",
  "Electronics",
  "Books",
  "Clothing",
  "Toys & Games",
  "Sports",
  "Other",
];

type FormDataType = {
  title: string;
  description: string;
  category: string;
  price: string;
  originalPrice: string;
  location: string;
  listingType: 'sell' | 'exchange' | 'giveaway';
};

export default function AddMarketplaceItemForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    category: "",
    price: "",
    originalPrice: "",
    location: "",
    listingType: "sell", // Default to "sell"
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceWarning, setPriceWarning] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'price' && formData.listingType === 'sell' && formData.originalPrice) {
      const price = parseFloat(value);
      const originalPrice = parseFloat(formData.originalPrice);
      
      if (price > originalPrice * 0.4) {
        setPriceWarning(true);
      } else {
        setPriceWarning(false);
      }
    }
    
    if (name === 'originalPrice' && formData.listingType === 'sell' && formData.price) {
      const price = parseFloat(formData.price);
      const originalPrice = parseFloat(value);
      
      if (price > originalPrice * 0.4) {
        setPriceWarning(true);
      } else {
        setPriceWarning(false);
      }
    }
  };
  
  // Fix the type definition for handleSelectChange
  const handleSelectChange = (name: keyof FormDataType, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  
  const handleListingTypeChange = (value: 'sell' | 'exchange' | 'giveaway') => {
    setFormData({ ...formData, listingType: value });
    
    setPriceWarning(false);
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `market-items/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('marketplace')
      .upload(filePath, file);
      
    if (uploadError) {
      throw new Error('Error uploading image');
    }
    
    const { data } = supabase.storage.from('marketplace').getPublicUrl(filePath);
    return data.publicUrl;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to post an item");
      return;
    }
    
    if (!imageFile) {
      toast.error("Please upload an image of your item");
      return;
    }
    
    if (formData.listingType === 'sell' && priceWarning) {
      if (!window.confirm("Your price exceeds 40% of the original price. Are you sure you want to continue?")) {
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      
      const imageUrl = await uploadImage(imageFile);
      
      const params: InsertMarketplaceItemParams = {
        p_title: formData.title,
        p_description: formData.description,
        p_category: formData.category,
        p_price: formData.listingType === 'sell' ? parseFloat(formData.price) : null,
        p_original_price: formData.listingType === 'sell' ? parseFloat(formData.originalPrice) : null,
        p_image_url: imageUrl,
        p_location: formData.location,
        p_listing_type: formData.listingType,
        p_user_id: user.id
      };
      
      console.log("Submitting item with params:", params);
      
      const { error } = await supabase.rpc('insert_marketplace_item', params);
      
      if (error) {
        console.error("Error from RPC:", error);
        throw error;
      }
      
      toast.success("Item posted successfully!");
      navigate("/marketplace");
    } catch (error) {
      console.error("Error posting item:", error);
      toast.error("Failed to post item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="image">Item Image</Label>
        <div 
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="mx-auto max-h-64 rounded-lg"
              />
              <Button 
                type="button" 
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageFile(null);
                  setImagePreview(null);
                }}
              >
                Change Image
              </Button>
            </div>
          ) : (
            <div className="py-6">
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG or WEBP (max. 5MB)
              </p>
            </div>
          )}
          <input 
            id="image-upload"
            type="file" 
            accept="image/*"
            className="hidden" 
            onChange={handleImageChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Item name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe your item, condition, etc."
          required
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleSelectChange("category", value)}
          required
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Where is this item located? (e.g., Brooklyn, NY)"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Listing Type</Label>
        <RadioGroup 
          defaultValue="sell" 
          value={formData.listingType}
          onValueChange={handleListingTypeChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sell" id="sell" />
            <Label htmlFor="sell" className="cursor-pointer">Sell</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="exchange" id="exchange" />
            <Label htmlFor="exchange" className="cursor-pointer">Exchange</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="giveaway" id="giveaway" />
            <Label htmlFor="giveaway" className="cursor-pointer">Giveaway</Label>
          </div>
        </RadioGroup>
      </div>
      
      {formData.listingType === 'sell' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Your selling price"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price ($)</Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice}
                onChange={handleInputChange}
                placeholder="Original retail price"
                required
              />
            </div>
          </div>
          
          {priceWarning && (
            <div className="flex items-start gap-2 p-3 text-amber-600 bg-amber-50 rounded-md">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                Your price exceeds 40% of the original price. To promote sustainability, 
                we encourage pricing used items at less than 40% of their original value.
              </p>
            </div>
          )}
        </>
      )}
      
      <Button 
        type="submit" 
        className="bg-gradient-eco w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Posting..." : "Post Item"}
      </Button>
    </form>
  );
}
