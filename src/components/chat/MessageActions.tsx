
import { Button } from "@/components/ui/button";
import { Send, MapPin } from "lucide-react";
import FileInput from "./FileInput";

interface MessageActionsProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  canSend: boolean;
  isSending: boolean;
  isConnected: boolean;
  hasAttachment: boolean;
}

export default function MessageActions({
  fileInputRef,
  onFileChange,
  onSend,
  canSend,
  isSending,
  isConnected,
  hasAttachment,
}: MessageActionsProps) {
  return (
    <div className="flex gap-1">
      <FileInput
        ref={fileInputRef}
        onFileChange={onFileChange}
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
        onClick={onSend}
        disabled={!canSend}
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
  );
}
