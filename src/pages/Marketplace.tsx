
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Package, RefreshCw, Gift, Search, Filter, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MarketplaceItemCard from "@/components/marketplace/MarketplaceItemCard";

export default function Marketplace() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sell' | 'exchange' | 'giveaway'>('all');
  
  // Sample marketplace items
  const marketplaceItems = [
    {
      id: 1,
      title: "Wooden Desk Chair",
      description: "Lightly used wooden chair, perfect condition",
      price: 25,
      originalPrice: 80,
      images: ["https://images.unsplash.com/photo-1592078615290-033ee584dd43"],
      category: "Furniture",
      location: "Brooklyn, NY",
      distance: "1.2 miles away",
      listingType: "sell" as const,
      createdAt: new Date("2023-01-15"),
      user: {
        name: "Sarah K.",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
        rating: 4.8
      }
    },
    {
      id: 2,
      title: "Plant Pots (Set of 3)",
      description: "Ceramic plant pots, different sizes. Will trade for gardening tools.",
      price: null,
      originalPrice: null,
      images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411"],
      category: "Home & Garden",
      location: "Queens, NY",
      distance: "3.5 miles away",
      listingType: "exchange" as const,
      createdAt: new Date("2023-01-10"),
      user: {
        name: "Michael T.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        rating: 4.5
      }
    },
    {
      id: 3,
      title: "Books for Children",
      description: "Collection of children's books, free to a good home",
      price: null,
      originalPrice: null,
      images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794"],
      category: "Books",
      location: "Manhattan, NY",
      distance: "0.7 miles away",
      listingType: "giveaway" as const,
      createdAt: new Date("2023-01-05"),
      user: {
        name: "Leila H.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        rating: 4.9
      }
    },
    {
      id: 4,
      title: "Reusable Glass Bottles",
      description: "6 glass bottles, perfect for homemade juices",
      price: 12,
      originalPrice: 30,
      images: ["https://images.unsplash.com/photo-1610147323479-a7fb11ffd5dd"],
      category: "Kitchen",
      location: "Bronx, NY",
      distance: "5.1 miles away",
      listingType: "sell" as const,
      createdAt: new Date("2023-01-02"),
      user: {
        name: "James R.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        rating: 4.6
      }
    }
  ];
  
  const filteredItems = activeFilter === 'all' 
    ? marketplaceItems 
    : marketplaceItems.filter(item => item.listingType === activeFilter);

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <SectionHeading
            title="Sustainable Marketplace"
            subtitle="Buy, exchange, or give away items in your community"
            align="left"
            className="mb-4 md:mb-0"
          />
          
          <Button className="bg-gradient-eco">
            <Plus className="mr-2 h-4 w-4" />
            Post New Item
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex gap-2">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setActiveFilter('all')}
            >
              All Items
            </Button>
            <Button 
              variant={activeFilter === 'sell' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setActiveFilter('sell')}
            >
              <Package className="mr-1.5 h-4 w-4" />
              For Sale
            </Button>
            <Button 
              variant={activeFilter === 'exchange' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setActiveFilter('exchange')}
            >
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Exchange
            </Button>
            <Button 
              variant={activeFilter === 'giveaway' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setActiveFilter('giveaway')}
            >
              <Gift className="mr-1.5 h-4 w-4" />
              Giveaway
            </Button>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search items..." 
                className="pl-10 h-10 w-full sm:w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
          </div>
        </div>
        
        {/* Marketplace grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MarketplaceItemCard key={item.id} item={item} />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground text-center mb-4">
                No items found matching your filter criteria.
              </p>
              <Button variant="outline" onClick={() => setActiveFilter('all')}>
                Show All Items
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
