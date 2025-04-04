import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Lightbulb, PlayCircle, Bookmark, Plus } from "lucide-react";
import ReuseIdeaCard from "@/components/reuse/ReuseIdeaCard";
import VideoRecommendation from "@/components/reuse/VideoRecommendation";
import LocationFeed from "@/components/eco/LocationFeed";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function ReuseIdeas() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
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

  // Sample recommended videos
  const recommendedVideos = [
    {
      id: 1,
      title: "10 Creative Ways to Reuse Plastic Bottles",
      creator: "EcoCreators",
      thumbnail: "https://images.unsplash.com/photo-1582408921715-18e7806365c1",
      duration: "8:42",
      views: "256K",
      videoId: "dQw4w9WgXcQ", // Example YouTube ID
      category: "Plastic"
    },
    {
      id: 2,
      title: "Upcycle Old T-shirts into Reusable Bags - No Sewing Required!",
      creator: "Sustainable Living",
      thumbnail: "https://images.unsplash.com/photo-1624029769515-43a30d116de4",
      duration: "12:28",
      views: "124K",
      videoId: "dQw4w9WgXcQ", // Example YouTube ID
      category: "Textiles"
    },
    {
      id: 3,
      title: "Transform Glass Jars into Beautiful Home Decor",
      creator: "Green DIY Projects",
      thumbnail: "https://images.unsplash.com/photo-1550431241-a2b9d7ff574f",
      duration: "15:16",
      views: "87K",
      videoId: "dQw4w9WgXcQ", // Example YouTube ID
      category: "Glass"
    },
    {
      id: 4,
      title: "How to Build a Coffee Table from Wooden Pallets",
      creator: "Upcycle Woodworks",
      thumbnail: "https://images.unsplash.com/photo-1629041235862-83bd198bd227",
      duration: "22:54",
      views: "342K",
      videoId: "dQw4w9WgXcQ", // Example YouTube ID
      category: "Wood"
    },
    {
      id: 5,
      title: "Amazing Paper Craft Ideas - From Waste to Art",
      creator: "Sustainable Crafts",
      thumbnail: "https://images.unsplash.com/photo-1519682577862-22b62b24e493",
      duration: "10:38",
      views: "173K",
      videoId: "dQw4w9WgXcQ", // Example YouTube ID
      category: "Paper"
    },
    {
      id: 6,
      title: "5 Easy Eco-Friendly Crafts for Kids",
      creator: "Green Family",
      thumbnail: "https://images.unsplash.com/photo-1611280616506-b7f587ca46d1",
      duration: "14:07",
      views: "98K",
      videoId: "dQw4w9WgXcQ", // Example YouTube ID
      category: "Kids"
    }
  ];

  const filteredVideos = selectedCategory === "all" 
    ? recommendedVideos 
    : recommendedVideos.filter(video => video.category === selectedCategory);

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
        
        {/* Video Recommendations and Location Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">AI Video Recommendations</h3>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <Button 
                  variant={selectedCategory === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </Button>
                <Button 
                  variant={selectedCategory === "Plastic" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategory("Plastic")}
                >
                  Plastic
                </Button>
                <Button 
                  variant={selectedCategory === "Glass" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategory("Glass")}
                >
                  Glass
                </Button>
                <Button 
                  variant={selectedCategory === "Wood" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategory("Wood")}
                >
                  Wood
                </Button>
                <Button 
                  variant={selectedCategory === "Textiles" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategory("Textiles")}
                >
                  Textiles
                </Button>
              </div>
            </div>
            
            <Carousel className="mb-6">
              <CarouselContent>
                {filteredVideos.slice(0, 3).map((video) => (
                  <CarouselItem key={video.id} className="md:basis-1/2 lg:basis-1/2">
                    <VideoRecommendation
                      title={video.title}
                      creator={video.creator}
                      thumbnail={video.thumbnail}
                      duration={video.duration}
                      views={video.views}
                      videoId={video.videoId}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-4">
                <CarouselPrevious className="static translate-y-0 mr-2" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredVideos.slice(3).map((video) => (
                <VideoRecommendation
                  key={video.id}
                  title={video.title}
                  creator={video.creator}
                  thumbnail={video.thumbnail}
                  duration={video.duration}
                  views={video.views}
                  videoId={video.videoId}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Location-Based Eco Data</h3>
            <LocationFeed className="sticky top-20" />
          </div>
        </div>
        
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
