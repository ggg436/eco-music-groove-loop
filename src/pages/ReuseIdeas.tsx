
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Lightbulb, PlayCircle, Bookmark } from "lucide-react";
import ReuseIdeaCard from "@/components/reuse/ReuseIdeaCard";

export default function ReuseIdeas() {
  const [isUploading, setIsUploading] = useState(false);
  
  // Sample reuse ideas
  const reuseIdeas = [
    {
      id: 1,
      title: "DIY Plant Pots from Plastic Bottles",
      description: "Turn old plastic bottles into beautiful plant pots for your garden or indoor plants.",
      thumbnail: "https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9",
      likes: 243,
      category: "Plastic",
      difficulty: "Easy",
      timeRequired: "15 mins",
      videoUrl: "#"
    },
    {
      id: 2,
      title: "Repurpose Glass Jars for Storage",
      description: "Clean and organize your kitchen with repurposed glass jars for storing spices, grains, and more.",
      thumbnail: "https://images.unsplash.com/photo-1622673038044-693f8c2d76bc",
      likes: 187,
      category: "Glass",
      difficulty: "Easy",
      timeRequired: "10 mins",
      videoUrl: "#"
    },
    {
      id: 3,
      title: "Recycled Fabric Tote Bags",
      description: "Create durable tote bags from old clothes or fabric scraps. Perfect for shopping and everyday use.",
      thumbnail: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b",
      likes: 312,
      category: "Textiles",
      difficulty: "Medium",
      timeRequired: "45 mins",
      videoUrl: "#"
    },
    {
      id: 4,
      title: "Wooden Pallet Furniture",
      description: "Transform wooden pallets into stylish outdoor furniture like chairs, tables, and planters.",
      thumbnail: "https://images.unsplash.com/photo-1550581863-df2c219afc7c",
      likes: 428,
      category: "Wood",
      difficulty: "Hard",
      timeRequired: "3-4 hours",
      videoUrl: "#"
    }
  ];

  return (
    <Layout>
      <div className="container py-8">
        <SectionHeading
          title="AI-Powered Reuse Ideas"
          subtitle="Get creative suggestions on how to repurpose your items"
          align="center"
        />

        {/* Upload Section */}
        <Card className="mt-6 mb-12 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold mb-2">Get Custom Reuse Ideas</h3>
                <p className="text-muted-foreground mb-6">
                  Upload a photo of your item and our AI will suggest creative ways to repurpose it.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Upload a photo</p>
                      <p className="text-sm text-muted-foreground">Take or upload a clear photo of your item</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Get AI suggestions</p>
                      <p className="text-sm text-muted-foreground">Our AI identifies your item and generates ideas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <PlayCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Watch DIY videos</p>
                      <p className="text-sm text-muted-foreground">Follow step-by-step guides to repurpose your item</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button className="bg-gradient-eco">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
              </div>
              
              <div className="bg-gradient-eco relative hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b" 
                  alt="Reuse and recycle concept"
                  className="h-full w-full object-cover opacity-75"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Popular Ideas */}
        <div className="my-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Popular Reuse Ideas</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reuseIdeas.map((idea) => (
              <ReuseIdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </div>
        
        {/* Community Ideas */}
        <div className="my-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Community Ideas</h3>
            <Button variant="outline" size="sm">Share Your Idea</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* More items would go here */}
            <Card className="text-center p-8 border-dashed bg-muted/50">
              <CardContent className="p-0 flex flex-col items-center justify-center h-full space-y-4">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                  <Plus className="h-6 w-6" />
                </Button>
                <p className="text-muted-foreground">Share your own reuse ideas with the community</p>
                <Button variant="default" size="sm">
                  Create Post
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Placeholder for the Plus icon since it wasn't imported above
const Plus = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);
