
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image, Send, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AttachmentPreview from "./AttachmentPreview";

interface MessageInputProps {
  conversationId: string;
  userId: string;
}

const MessageInput = ({ conversationId, userId }: MessageInputProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [attachment, setAttachment] = useState<{
    file: File | null;
    previewUrl: string | null;
    type: string | null;
  }>({
    file: null,
    previewUrl: null,
    type: null,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if ((!message.trim() && !attachment.file) || !userId || !conversationId) return;
    
    try {
      setIsSending(true);
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
      
      console.log('Sending message to conversation:', conversationId);
      
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          content: message.trim() || null,
          attachment_url: attachmentUrl,
          attachment_type: attachmentType,
        });
      
      if (messageError) throw messageError;
      
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      if (updateError) {
        console.error('Error updating conversation timestamp:', updateError);
        // Don't throw here, just log since the message was already sent
      }
      
      console.log('Message sent successfully');
      setMessage("");
      setAttachment({ file: null, previewUrl: null, type: null });
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSending(false);
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

  return (
    <>
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
      
      <div className="p-3 border-t">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
              disabled={isSending}
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
              disabled={isSending}
            >
              <Image className="h-5 w-5" />
            </Button>
            
            <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={isSending}
            />
            
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowLocationPicker(true)}
              disabled={isSending}
            >
              <MapPin className="h-5 w-5" />
            </Button>
            
            <Button
              type="button"
              onClick={handleSendMessage}
              disabled={(!message.trim() && !attachment.file) || isSending}
            >
              {isSending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending
                </span>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageInput;
