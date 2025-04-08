import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Send, Image, Paperclip, MapPin, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ConversationMessage from "@/components/chat/ConversationMessage";
import AttachmentPreview from "@/components/chat/AttachmentPreview";
import LocationPicker from "@/components/chat/LocationPicker";
import MessageSound from "@/components/chat/MessageSound";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const transformLocation = (location: any): { lat: number; lng: number; address?: string } | undefined => {
  if (!location) return undefined;
  
  if (typeof location === 'object') {
    return {
      lat: location.latitude || location.lat || 0,
      lng: location.longitude || location.lng || 0,
      address: location.address || ''
    };
  }
  
  return undefined;
};

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<Profile | null>(null);
  const [product, setProduct] = useState<MarketplaceItem | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [playNotification, setPlayNotification] = useState(false);
  const [lastMessageSenderId, setLastMessageSenderId] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<{
    file: File | null;
    previewUrl: string | null;
    type: string | null;
  }>({
    file: null,
    previewUrl: null,
    type: null,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!conversationId || !user) return;
    
    const fetchConversation = async () => {
      try {
        setIsLoading(true);
        
        const { data: conversationData, error: conversationError } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single();
        
        if (conversationError) throw conversationError;
        
        setConversation(conversationData);
        
        const otherUserId = conversationData.seller_id === user.id 
          ? conversationData.buyer_id 
          : conversationData.seller_id;
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherUserId)
          .single();
        
        if (profileError) throw profileError;
        
        setOtherUser(profileData);
        
        const { data: productData, error: productError } = await supabase
          .from('marketplace_items')
          .select('*')
          .eq('id', conversationData.product_id)
          .single();
        
        if (!productError && productData) {
          setProduct({
            id: productData.id,
            title: productData.title,
            description: productData.description || '',
            price: productData.price !== null ? Number(productData.price) : null,
            originalPrice: productData.original_price !== null ? Number(productData.original_price) : null,
            images: [productData.image_url || 'https://images.unsplash.com/photo-1560343090-f0409e92791a'],
            category: productData.category || 'Miscellaneous',
            location: productData.location || 'Unknown',
            user_id: productData.user_id,
            image_url: productData.image_url,
            listing_type: productData.listing_type
          });
        }
        
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
        
        if (messagesError) throw messagesError;
        
        const transformedMessages: Message[] = messagesData.map((msg) => ({
          id: msg.id,
          conversation_id: msg.conversation_id,
          sender_id: msg.sender_id,
          content: msg.content || undefined,
          attachment_url: msg.attachment_url || undefined,
          attachment_type: msg.attachment_type || undefined,
          location: transformLocation(msg.location),
          created_at: msg.created_at
        }));
        
        setMessages(transformedMessages);
        
        if (transformedMessages.length > 0) {
          setLastMessageSenderId(transformedMessages[transformedMessages.length - 1].sender_id);
        }
        
      } catch (error) {
        console.error('Error fetching conversation:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load conversation",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversation();
    
    const channelName = `conversation-messages-${conversationId}`;
    
    const messageChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('New message received:', payload);
          
          if (!payload.new) {
            console.error('Message payload is missing the new property:', payload);
            return;
          }
          
          const newMessage = payload.new as any;
          const transformedMessage: Message = {
            id: newMessage.id,
            conversation_id: newMessage.conversation_id,
            sender_id: newMessage.sender_id,
            content: newMessage.content || undefined,
            attachment_url: newMessage.attachment_url || undefined,
            attachment_type: newMessage.attachment_type || undefined,
            location: transformLocation(newMessage.location),
            created_at: newMessage.created_at
          };
          
          if (newMessage.sender_id !== user.id) {
            console.log('Playing notification for message from:', newMessage.sender_id);
            setPlayNotification(true);
          }
          
          setLastMessageSenderId(newMessage.sender_id);
          
          setMessages((currentMessages) => {
            const messageExists = currentMessages.some(msg => msg.id === transformedMessage.id);
            if (messageExists) {
              return currentMessages;
            }
            return [...currentMessages, transformedMessage];
          });
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for channel ${channelName}:`, status);
        
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to messages for conversation ${conversationId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to messages for conversation ${conversationId}`);
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Unable to receive real-time messages. Please refresh the page.",
          });
        }
      });
    
    const conversationChannel = supabase
      .channel(`conversation-updates-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('Conversation updated:', payload);
          setConversation(payload.new as Conversation);
        }
      )
      .subscribe();
    
    scrollToBottom();
    
    return () => {
      console.log('Cleaning up subscription channels');
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(conversationChannel);
    };
  }, [conversationId, user, toast]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if ((!message.trim() && !attachment.file) || !user || !conversationId) return;
    
    try {
      let attachmentUrl = null;
      let attachmentType = null;
      
      if (attachment.file) {
        const fileExt = attachment.file.name.split('.').pop();
        const filePath = `conversations/${conversationId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('message_attachments')
          .upload(filePath, attachment.file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('message_attachments')
          .getPublicUrl(filePath);
        
        attachmentUrl = publicUrl;
        attachmentType = attachment.type;
      }
      
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: message.trim() || null,
          attachment_url: attachmentUrl,
          attachment_type: attachmentType,
        });
      
      if (messageError) throw messageError;
      
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      if (updateError) console.error('Error updating conversation timestamp:', updateError);
      
      setMessage("");
      setAttachment({ file: null, previewUrl: null, type: null });
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      let type = 'file';
      if (file.type.startsWith('image/')) {
        type = 'image';
      }
      
      setAttachment({
        file,
        previewUrl: reader.result as string,
        type,
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleRemoveAttachment = () => {
    setAttachment({ file: null, previewUrl: null, type: null });
  };
  
  const handleLocationSelected = (location: { lat: number; lng: number; address: string }) => {
    if (!user?.id || !conversationId) return;
    
    const locationData = {
      latitude: location.lat,
      longitude: location.lng,
      address: location.address,
    };
    
    supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: location.address,
        location: locationData,
      })
      .then(({ error }) => {
        if (error) {
          console.error('Error sending location:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to send location",
          });
        }
        
        setShowLocationPicker(false);
      });
  };
  
  const handleNotificationPlayed = () => {
    setPlayNotification(false);
  };
  
  if (!user) {
    return (
      <Layout>
        <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-xl font-semibold mb-4">Please sign in to view conversations</h2>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex flex-col h-[calc(100vh-240px)] md:h-[calc(100vh-200px)] bg-background rounded-lg border shadow">
            <div className="p-4 border-b flex items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="ml-3 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32 mt-1" />
              </div>
            </div>
            <div className="p-3 bg-muted/50 border-b flex items-center">
              <Skeleton className="h-10 w-10 rounded mr-2" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${i % 2 === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-20 mt-2" />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t">
              <div className="flex items-end gap-2">
                <Skeleton className="flex-1 h-20" />
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-10 w-10 rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!conversation || !otherUser) {
    return (
      <Layout>
        <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-xl font-semibold mb-4">Conversation not found</h2>
          <p className="text-muted-foreground mb-4 text-center">
            This conversation may have been deleted or you may not have permission to view it.
          </p>
          <Button onClick={() => navigate('/marketplace')}>
            Back to Marketplace
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <MessageSound play={playNotification} onPlayed={handleNotificationPlayed} />
      
      <div className="container py-4 md:py-8">
        <div className="flex flex-col h-[calc(100vh-240px)] md:h-[calc(100vh-200px)] bg-background rounded-lg border shadow">
          <div className="p-4 border-b flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 md:hidden"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser.avatar_url || undefined} alt={otherUser.full_name || otherUser.username || 'User'} />
              <AvatarFallback>{otherUser.full_name?.charAt(0) || otherUser.username?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="ml-3 flex-1">
              <h3 className="font-semibold">{otherUser.full_name || otherUser.username || 'User'}</h3>
              <p className="text-xs text-muted-foreground">
                About {product?.title || 'Product'}
              </p>
            </div>
            
            <div className="hidden md:block">
              <Badge variant="outline" className="ml-2">
                {user?.id === conversation.seller_id ? 'You are the seller' : 'You are the buyer'}
              </Badge>
            </div>
          </div>
          
          {product && (
            <div className="p-3 bg-muted/50 border-b flex items-center">
              <div className="h-10 w-10 rounded overflow-hidden mr-2">
                <img 
                  src={product.image_url || product.images?.[0] || 'https://images.unsplash.com/photo-1560343090-f0409e92791a'} 
                  alt={product.title} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{product.title}</p>
                {product.price !== null && (
                  <p className="text-xs">${product.price}</p>
                )}
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">Start the conversation</h3>
                <p className="text-muted-foreground">
                  No messages yet. Say hello to {otherUser.full_name || otherUser.username || 'User'}!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <ConversationMessage
                  key={msg.id}
                  message={msg}
                  isOwn={msg.sender_id === user?.id}
                  otherUser={otherUser}
                  currentUser={user}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {attachment.previewUrl && (
            <div className="p-3 border-t">
              <AttachmentPreview
                url={attachment.previewUrl}
                type={attachment.type || 'file'}
                fileName={attachment.file?.name || ''}
                onRemove={handleRemoveAttachment}
              />
            </div>
          )}
          
          {showLocationPicker && (
            <div className="p-3 border-t">
              <LocationPicker
                onSelectLocation={handleLocationSelected}
                onCancel={() => setShowLocationPicker(false)}
              />
            </div>
          )}
          
          <div className="p-3 border-t">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="h-5 w-5" />
                </Button>
                
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowLocationPicker(true)}
                >
                  <MapPin className="h-5 w-5" />
                </Button>
                
                <Button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={(!message.trim() && !attachment.file)}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
