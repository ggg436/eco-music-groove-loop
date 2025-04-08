
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
    </>
  );
};

export default MessageInput;
