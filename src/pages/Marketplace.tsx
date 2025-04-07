
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Package, RefreshCw, Gift, Search, Filter, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MarketplaceItemCard from "@/components/marketplace/MarketplaceItemCard";
import NewItemDialog from "@/components/marketplace/NewItemDialog";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function Marketplace() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sell' | 'exchange' | 'giveaway'>('all');
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  const fetchMarketplaceItems = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build the query
      let query = supabase
        .from('marketplace_items')
        .select(`
          id, 
          title, 
          description, 
          price, 
          original_price, 
          category, 
          image_url, 
          location, 
          listing_type, 
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false });
      
      // Apply filter if not 'all'
      if (activeFilter !== 'all') {
        // Convert first letter to uppercase for proper comparison
        const filterType = activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);
        query = query.eq('listing_type', filterType);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (data) {
        // Transform the data to match our MarketplaceItem interface
        const formattedItems: MarketplaceItem[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          price: item.price !== null ? Number(item.price) : null,
          originalPrice: item.original_price !== null ? Number(item.original_price) : null,
          images: [item.image_url || 'https://images.unsplash.com/photo-1560343090-f0409e92791a'],
          category: item.category || 'Miscellaneous',
          location: item.location || 'Unknown',
          distance: "Nearby", // We'll use a placeholder for now
          listingType: (item.listing_type?.toLowerCase() as 'sell' | 'exchange' | 'giveaway') || 'sell',
          createdAt: new Date(item.created_at),
          user: {
            name: "User", // We'll use a placeholder name for now
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956", // Default avatar
            rating: 5.0,
            id: item.user_id
          }
        }));
        
        setMarketplaceItems(formattedItems);
      }
    } catch (err: any) {
      console.error('Error fetching marketplace items:', err);
      setError(err.message || 'Failed to fetch marketplace items');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Trigger re-fetch when filter changes
  useEffect(() => {
    fetchMarketplaceItems();
  }, [activeFilter]);

  const filteredItems = marketplaceItems;

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
          
          <NewItemDialog />
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex gap-2 flex-wrap">
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
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading items...</span>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-destructive text-center mb-4">
                {error}
              </p>
              <Button variant="outline" onClick={fetchMarketplaceItems}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Marketplace grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MarketplaceItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && !error && filteredItems.length === 0 && (
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
