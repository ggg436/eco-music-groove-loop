
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

export default function Chats() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [playNotification, setPlayNotification] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching conversations for user:', user.id);
        
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            product:product_id (
              id, 
              title, 
              image_url,
              price,
              listing_type
            )
          `)
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
        console.log('Fetched conversations:', data?.length || 0);
        
        const conversationsWithDetails: ConversationWithDetails[] = [];
        
        for (const conv of data || []) {
          const otherUserId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id;
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', otherUserId)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile for user:', otherUserId, profileError);
            continue; // Skip this conversation but don't fail the whole process
          }
          
          const { data: latestMessageData } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
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
          
          let product: MarketplaceItem | null = null;
          
          if (conv.product && typeof conv.product === 'object') {
            product = {
              id: (conv.product as any).id || 0,
              title: (conv.product as any).title || '',
              price: (conv.product as any).price !== null ? Number((conv.product as any).price) : null,
              images: (conv.product as any).image_url ? [(conv.product as any).image_url] : [],
              listingType: getNormalizedListingType((conv.product as any).listing_type),
              image_url: (conv.product as any).image_url
            };
          }
          
          conversationsWithDetails.push({
            ...conv,
            sellerProfile: conv.seller_id === user.id ? undefined : profileData,
            buyerProfile: conv.buyer_id === user.id ? undefined : profileData,
            product: product,
            latestMessage: latestMessage
          });
        }
        
        console.log('Processed conversations with details:', conversationsWithDetails.length);
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
    
    // Create a unique channel name for this user's messages
    const channelName = `user-messages-${user.id}`;
    
    // Set up realtime subscription for new messages
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
          
          // Check if this message is for a conversation involving this user
          if (payload.new) {
            const messageData = payload.new as any;
            
            // Play notification sound if the message is sent to this user
            if (messageData.sender_id !== user.id) {
              console.log('Playing notification for new message');
              setPlayNotification(true);
            }
            
            // Refresh conversations to show the latest messages
            fetchConversations();
          }
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for channel ${channelName}:`, status);
      });
    
    // Set up realtime subscription for updated conversations
    const conversationsChannel = supabase
      .channel(`user-conversations-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations'
        },
        (payload) => {
          console.log('Conversation updated:', payload);
          
          // Check if this conversation involves the current user
          const conversation = payload.new as Conversation;
          if (conversation.buyer_id === user.id || conversation.seller_id === user.id) {
            fetchConversations();
          }
        }
      )
      .subscribe();
    
    return () => {
      console.log('Cleaning up subscription channels');
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(conversationsChannel);
    };
  }, [user, toast]);
  
  const handleNotificationPlayed = () => {
    setPlayNotification(false);
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
          
          <ConversationSearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
        
        <ConversationList 
          conversations={filteredAndSortedConversations}
          isLoading={isLoading}
          searchQuery={searchQuery}
          user={user}
        />
      </div>
    </Layout>
  );
}
