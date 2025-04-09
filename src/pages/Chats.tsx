
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ConversationList from "@/components/chat/ConversationList";
import ConversationSearchBar from "@/components/chat/ConversationSearchBar";
import ConversationEmptyState from "@/components/chat/ConversationEmptyState";
import { getNormalizedListingType, filterConversations, sortConversations } from "@/components/chat/utils/conversationUtils";
import MessageSound from "@/components/chat/MessageSound";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function Chats() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [playNotification, setPlayNotification] = useState(false);
  
  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(false);
      console.log('Fetching conversations for user:', user.id);
      
      // Modified query to NOT use the dot notation which was causing the foreign key error
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          product_id
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching conversations:', error);
        setError(true);
        throw error;
      }
      
      console.log('Fetched conversations:', data?.length || 0);
      
      const conversationsWithDetails: ConversationWithDetails[] = [];
      
      for (const conv of data || []) {
        const otherUserId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id;
        
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', otherUserId)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile for user:', otherUserId, profileError);
            continue; // Skip this conversation but don't fail the whole process
          }
          
          const { data: latestMessageData, error: messageError } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (messageError && messageError.code !== 'PGRST116') {
            console.error('Error fetching latest message:', messageError);
          }
            
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
          
          // Get product information separately since dot notation was causing issues
          let product: MarketplaceItem | null = null;
          
          if (conv.product_id) {
            const { data: productData, error: productError } = await supabase
              .from('marketplace_items')
              .select('*')
              .eq('id', conv.product_id)
              .single();
            
            if (!productError && productData) {
              product = {
                id: productData.id,
                title: productData.title || '',
                price: productData.price !== null ? Number(productData.price) : null,
                images: productData.image_url ? [productData.image_url] : [],
                listingType: getNormalizedListingType(productData.listing_type),
                image_url: productData.image_url
              };
            }
          }
          
          conversationsWithDetails.push({
            ...conv,
            sellerProfile: conv.seller_id === user.id ? undefined : profileData,
            buyerProfile: conv.buyer_id === user.id ? undefined : profileData,
            product: product,
            latestMessage: latestMessage
          });
        } catch (err) {
          console.error('Error processing conversation details:', err);
          // Continue with other conversations
        }
      }
      
      console.log('Processed conversations with details:', conversationsWithDetails.length);
      setConversations(conversationsWithDetails);
      setError(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError(true);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load conversations. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!user) return;
    
    fetchConversations();
    
    const channelName = `user-messages-${user.id}-${Date.now()}`;
    
    const messagesChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('New message detected:', payload);
          
          if (payload.new) {
            const messageData = payload.new as any;
            
            if (messageData.sender_id !== user.id) {
              console.log('Playing notification for new message');
              setPlayNotification(true);
            }
            
            fetchConversations();
          }
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for channel ${channelName}:`, status);
      });
    
    const conversationsChannel = supabase
      .channel(`user-conversations-${user.id}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations'
        },
        (payload) => {
          console.log('Conversation updated:', payload);
          
          const conversation = payload.new as Conversation;
          if (conversation.buyer_id === user.id || conversation.seller_id === user.id) {
            fetchConversations();
          }
        }
      )
      .subscribe((status) => {
        console.log(`Conversation subscription status: ${status}`);
      });
    
    const intervalId = setInterval(() => {
      console.log('Periodic refresh of conversations');
      fetchConversations();
    }, 60000);
    
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(conversationsChannel);
    };
  }, [user, toast]);
  
  const handleNotificationPlayed = () => {
    setPlayNotification(false);
  };
  
  const handleRefresh = () => {
    fetchConversations();
    toast({
      title: "Refreshing",
      description: "Refreshing conversations list...",
    });
  };
  
  if (!user) {
    return (
      <Layout>
        <ConversationEmptyState 
          message="Please sign in to view your messages" 
          buttonText="Sign In" 
          buttonLink="/auth" 
        />
      </Layout>
    );
  }
  
  const filteredAndSortedConversations = sortConversations(
    filterConversations(conversations, searchQuery, user),
    sortBy
  );
  
  return (
    <Layout>
      <MessageSound play={playNotification} onPlayed={handleNotificationPlayed} />
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Your Conversations</h1>
          
          <div className="flex gap-2 items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <ConversationSearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </div>
        
        {error ? (
          <ConversationEmptyState 
            message="Failed to load conversations" 
            buttonText="Try Again" 
            buttonAction={fetchConversations}
            isError={true}
          />
        ) : (
          <ConversationList 
            conversations={filteredAndSortedConversations}
            isLoading={isLoading}
            searchQuery={searchQuery}
            user={user}
          />
        )}
      </div>
    </Layout>
  );
}
