
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ConversationMessage from "@/components/chat/ConversationMessage";
import AttachmentPreview from "@/components/chat/AttachmentPreview";
import LocationPicker from "@/components/chat/LocationPicker";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  attachment_url: string | null;
  attachment_type: string | null;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  created_at: string;
}

interface Conversation {
  id: string;
  product_id: number;
  seller_id: string;
  buyer_id: string;
  created_at: string;
}

interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
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

  // Fetch conversation and messages
  useEffect(() => {
    if (!conversationId || !user) return;
    
    const fetchConversation = async () => {
      try {
        setIsLoading(true);
        
        // Fetch conversation details using a direct SQL query approach
        const { data: conversationData, error: conversationError } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single();
        
        if (conversationError) throw conversationError;
        
        setConversation(conversationData as Conversation);
        
        // Determine the other user in the conversation
        const otherUserId = conversationData.seller_id === user.id 
          ? conversationData.buyer_id 
          : conversationData.seller_id;
        
        // Fetch other user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherUserId)
          .single();
        
        if (profileError) throw profileError;
        
        setOtherUser(profileData as UserProfile);
        
        // Placeholder for product details
        setProduct({
          id: conversationData.product_id,
          title: "Product Name", // Placeholder
          image: "https://images.unsplash.com/photo-1592078615290-033ee584dd43" // Placeholder
        });
        
        // Fetch messages using a direct SQL query approach
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
        
        if (messagesError) throw messagesError;
        
        setMessages(messagesData as Message[]);
        
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
    
    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // @ts-ignore
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user, toast]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if ((!message.trim() && !attachment.file) || !user || !conversationId) return;
    
    try {
      // Handle file upload if there's an attachment
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
      
      // Insert the message using a direct SQL insert approach
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
      
      // Reset the message and attachment
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
    
    // Convert location to a JSON object to store in the database
    const locationData = {
      latitude: location.lat,
      longitude: location.lng,
      address: location.address,
    };
    
    // Add location to the message using a direct SQL insert approach
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
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 flex justify-center items-center min-h-[60vh]">
          <p>Loading conversation...</p>
        </div>
      </Layout>
    );
  }
  
  if (!conversation || !otherUser) {
    return (
      <Layout>
        <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-xl font-semibold mb-4">Conversation not found</h2>
          <Button onClick={() => navigate('/marketplace')}>
            Back to Marketplace
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-4 md:py-8">
        <div className="flex flex-col h-[calc(100vh-240px)] md:h-[calc(100vh-200px)] bg-background rounded-lg border shadow">
          {/* Chat header */}
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
              <h3 className="font-semibold">{otherUser.full_name || otherUser.username}</h3>
              <p className="text-xs text-muted-foreground">
                About {product?.title}
              </p>
            </div>
            
            <div className="hidden md:block">
              <Badge variant="outline" className="ml-2">
                {user?.id === conversation.seller_id ? 'You are the seller' : 'You are the buyer'}
              </Badge>
            </div>
          </div>
          
          {/* Product summary (optional) */}
          <div className="p-3 bg-muted/50 border-b flex items-center">
            <div className="h-10 w-10 rounded overflow-hidden mr-2">
              <img 
                src={product?.image} 
                alt={product?.title} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{product?.title}</p>
            </div>
          </div>
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">Start the conversation</h3>
                <p className="text-muted-foreground">
                  No messages yet. Say hello to {otherUser.full_name || otherUser.username}!
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
          
          {/* Attachment preview */}
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
          
          {/* Location picker */}
          {showLocationPicker && (
            <div className="p-3 border-t">
              <LocationPicker
                onSelectLocation={handleLocationSelected}
                onCancel={() => setShowLocationPicker(false)}
              />
            </div>
          )}
          
          {/* Message input */}
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
