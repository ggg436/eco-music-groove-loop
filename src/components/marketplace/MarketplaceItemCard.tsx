
import { Package, RefreshCw, Gift, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MarketplaceItemProps {
  item: {
    id: number;
    title: string;
    description: string;
    price: number | null;
    originalPrice: number | null;
    images: string[];
    category: string;
    location: string;
    distance: string;
    listingType: 'sell' | 'exchange' | 'giveaway';
    createdAt: Date;
    user: {
      name: string;
      avatar: string;
      rating: number;
    }
  }
}

export default function MarketplaceItemCard({ item }: MarketplaceItemProps) {
  const getListingBadge = () => {
    switch (item.listingType) {
      case 'sell':
        return (
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Package className="mr-1 h-3 w-3 text-primary" />
            {item.price ? `$${item.price}` : 'For Sale'}
          </div>
        );
      case 'exchange':
        return (
          <div className="absolute top-3 left-3 bg-orange-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <RefreshCw className="mr-1 h-3 w-3" />
            Exchange
          </div>
        );
      case 'giveaway':
        return (
          <div className="absolute top-3 left-3 bg-green-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Gift className="mr-1 h-3 w-3" />
            Free
          </div>
        );
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={item.images[0]} 
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {getListingBadge()}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <div className="text-xs text-muted-foreground">{item.category}</div>
          <h3 className="font-medium line-clamp-1">{item.title}</h3>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {item.description}
        </p>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{item.distance}</span>
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full overflow-hidden">
            <img 
              src={item.user.avatar} 
              alt={item.user.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xs">{item.user.name}</span>
        </div>
        
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={i < Math.floor(item.user.rating) ? "currentColor" : "none"}
              stroke="currentColor"
              className={cn(
                "h-3 w-3",
                i < Math.floor(item.user.rating) ? "text-yellow-500" : "text-gray-300"
              )}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          ))}
          <span className="ml-1 text-xs">{item.user.rating.toFixed(1)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
