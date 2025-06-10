
import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import AttachmentPreview from "./AttachmentPreview";
import ConnectionStatus from "./ConnectionStatus";
import MessageActions from "./MessageActions";
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
          
          <MessageActions
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onSend={handleSend}
            canSend={canSend(!!attachment.file)}
            isSending={isSending}
            isConnected={isConnected}
            hasAttachment={!!attachment.file}
          />
        </div>
      </div>
    </>
  );
};

export default MessageInput;
