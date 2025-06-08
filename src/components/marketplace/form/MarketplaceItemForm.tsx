
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingTypeSelector } from "./ListingTypeSelector";
import { FormField } from "./FormField";
import { ImageUploadField } from "./ImageUploadField";
import { PriceFields } from "./PriceFields";

export default function MarketplaceItemForm() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    listingType: "sell" as "sell" | "exchange" | "giveaway",
    price: "",
    location: "",
    images: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post an item",
      });
      navigate('/auth');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in title and description",
      });
      return;
    }

    if (formData.listingType === "sell" && !formData.price) {
      toast({
        variant: "destructive",
        title: "Price required",
        description: "Please set a price for items you're selling",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category || 'Miscellaneous',
          listing_type: formData.listingType,
          price: formData.listingType === "sell" ? parseFloat(formData.price) : null,
          location: formData.location || 'Not specified',
          images: formData.images,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Item posted successfully!",
        description: "Your item has been added to the marketplace",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        listingType: "sell",
        price: "",
        location: "",
        images: []
      });

      // Navigate back to marketplace
      navigate('/marketplace');
      
    } catch (error) {
      console.error('Error posting item:', error);
      toast({
        variant: "destructive",
        title: "Error posting item",
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Please sign in to post items to the marketplace.
          </p>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ListingTypeSelector
        value={formData.listingType}
        onChange={(value) => updateFormData('listingType', value)}
      />

      <FormField
        label="Title *"
        placeholder="What are you selling/trading/giving away?"
        value={formData.title}
        onChange={(value) => updateFormData('title', value)}
      />

      <FormField
        label="Description *"
        placeholder="Describe your item in detail..."
        value={formData.description}
        onChange={(value) => updateFormData('description', value)}
        multiline
      />

      <FormField
        label="Category"
        placeholder="e.g., Electronics, Books, Clothing..."
        value={formData.category}
        onChange={(value) => updateFormData('category', value)}
      />

      <PriceFields
        listingType={formData.listingType}
        price={formData.price}
        onPriceChange={(value) => updateFormData('price', value)}
      />

      <FormField
        label="Location"
        placeholder="Where can buyers pick this up?"
        value={formData.location}
        onChange={(value) => updateFormData('location', value)}
      />

      <ImageUploadField
        images={formData.images}
        onImagesChange={(images) => updateFormData('images', images)}
      />

      <Button
        type="submit"
        className="w-full bg-gradient-eco"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Posting..." : "Post Item"}
      </Button>
    </form>
  );
}
