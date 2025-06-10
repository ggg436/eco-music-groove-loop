
import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, MapPin } from "lucide-react";
import AttachmentPreview from "./AttachmentPreview";
import ConnectionStatus from "./ConnectionStatus";
import FileInput from "./FileInput";
import { useMessageInput } from "@/hooks/chat/useMessageInput";
import { useFileAttachment } from "@/hooks/chat/useFileAttachment";

interface MessageInputProps {
  conversationId: string;
  userId: string;
  isConnected?: boolean;
}

const MessageInput = ({ conversationId, userId, isConnected = true }: MessageInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    message,
    setMessage,
    isSending,
    handleSendMessage,
    canSend,
  } = useMessageInput({ conversationId, userId, isConnected });

  const {
    attachment,
    fileInputRef,
    handleFileChange,
    handleRemoveAttachment,
    uploadAttachment,
  } = useFileAttachment({ conversationId, isConnected });

  const handleSend = async () => {
    let attachmentData = null;
    
    if (attachment.file) {
      try {
        attachmentData = await uploadAttachment();
      } catch (error) {
        console.error('Failed to upload attachment:', error);
        return;
      }
    }
    
    const success = await handleSendMessage(attachmentData);
    
    if (success) {
      handleRemoveAttachment();
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
        {/* Connection status indicator */}
        <div className="flex items-center justify-between mb-2">
          <ConnectionStatus isConnected={isConnected} />
        </div>
        
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
              disabled={isSending || !isConnected}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          <div className="flex gap-1">
            <FileInput
              ref={fileInputRef}
              onFileChange={handleFileChange}
              disabled={isSending || !isConnected}
            />
            
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={isSending || !isConnected}
              title="Share location"
            >
              <MapPin className="h-5 w-5" />
            </Button>
            
            <Button
              type="button"
              onClick={handleSend}
              disabled={!canSend(!!attachment.file)}
              className="min-w-[80px]"
            >
              {isSending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
