
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Search, ArrowUpDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Chats() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  
  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all conversations where user is either buyer or seller
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            product:product_id (
              id, 
              title, 
              image_url
            )
          `)
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
        // Format conversations with additional info
        const conversationsWithDetails: ConversationWithDetails[] = [];
        
        for (const conv of data) {
          // Determine the other user ID
          const otherUserId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id;
          
          // Fetch the other user's profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', otherUserId)
            .single();
          
          // Fetch the latest message
          const { data: latestMessageData } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          // Convert location format to match Message type if it exists
          let latestMessage: Message | undefined;
          
          if (latestMessageData) {
            latestMessage = {
              ...latestMessageData,
              location: latestMessageData.location 
                ? {
                    lat: (latestMessageData.location as any).latitude || 0,
                    lng: (latestMessageData.location as any).longitude || 0,
                    address: (latestMessageData.location as any).address || '',
                  }
                : undefined
            };
          }
          
          // Create product object compatible with MarketplaceItem type
          const product: MarketplaceItem | undefined = conv.product 
            ? {
                id: conv.product.id,
                title: conv.product.title || '',
                images: conv.product.image_url ? [conv.product.image_url] : [],
                listingType: 'sell', // Default value as we don't have this info directly
                createdAt: new Date(),
                image_url: conv.product.image_url
              }
            : undefined;
          
          conversationsWithDetails.push({
            ...conv,
            sellerProfile: conv.seller_id === user.id ? undefined : profileData,
            buyerProfile: conv.buyer_id === user.id ? undefined : profileData,
            product: product,
            latestMessage: latestMessage
          });
        }
        
        setConversations(conversationsWithDetails);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load conversations",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          // Update the conversation list when a new message is added
          fetchConversations();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);
  
  const getOtherUserProfile = (conversation: ConversationWithDetails) => {
    return conversation.sellerProfile || conversation.buyerProfile;
  };
  
  const handleConversationClick = (id: string) => {
    navigate(`/chat/${id}`);
  };
  
  const filteredConversations = conversations
    .filter(conv => {
      const otherUser = getOtherUserProfile(conv);
      const productTitle = conv.product?.title || '';
      const searchLower = searchQuery.toLowerCase();
      
      return (
        otherUser?.username?.toLowerCase().includes(searchLower) ||
        otherUser?.full_name?.toLowerCase().includes(searchLower) ||
        productTitle.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at);
      const dateB = new Date(b.updated_at || b.created_at);
      
      return sortBy === 'newest' 
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
  
  if (!user) {
    return (
      <Layout>
        <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-xl font-semibold mb-4">Please sign in to view your messages</h2>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Your Conversations</h1>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-[250px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="pl-10 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
            >
              <ArrowUpDown className="h-4 w-4 mr-1.5" />
              {sortBy === 'newest' ? 'Newest' : 'Oldest'}
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No conversations yet</h3>
              <p className="text-muted-foreground text-center mt-2 mb-6 max-w-md">
                {searchQuery 
                  ? "No conversations match your search" 
                  : "When you message sellers or buyers in the marketplace, your conversations will appear here."}
              </p>
              <Button onClick={() => navigate('/marketplace')}>
                Browse Marketplace
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => {
              const otherUserProfile = getOtherUserProfile(conversation);
              const latestMessage = conversation.latestMessage;
              const isCurrentUserSeller = conversation.seller_id === user.id;
              
              return (
                <Card 
                  key={conversation.id} 
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleConversationClick(conversation.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={otherUserProfile?.avatar_url || undefined} />
                        <AvatarFallback>
                          {otherUserProfile?.full_name?.charAt(0) || otherUserProfile?.username?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium truncate">
                            {otherUserProfile?.full_name || otherUserProfile?.username || 'Unknown User'}
                          </h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {conversation.updated_at ? (
                              format(new Date(conversation.updated_at), 'MMM d, h:mm a')
                            ) : (
                              format(new Date(conversation.created_at), 'MMM d, h:mm a')
                            )}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {isCurrentUserSeller ? 'You are selling' : 'You are buying'}
                          </span>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.product?.title || 'Product not available'}
                          </p>
                        </div>
                        
                        {latestMessage && (
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            <span className="font-medium">
                              {latestMessage.sender_id === user.id ? 'You: ' : ''}
                            </span>
                            {latestMessage.content || (latestMessage.attachment_url ? 'Sent an attachment' : 'Sent a location')}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
