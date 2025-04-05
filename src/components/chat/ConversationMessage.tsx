
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { MapPin } from "lucide-react";

interface MessageLocation {
  latitude: number;
  longitude: number;
  address: string;
}

interface MessageProps {
  message: {
    id: string;
    content: string | null;
    attachment_url: string | null;
    attachment_type: string | null;
    location: MessageLocation | null;
    created_at: string;
    sender_id: string;
  };
  isOwn: boolean;
  otherUser: {
    id: string;
    avatar_url: string | null;
    full_name: string | null;
    username: string | null;
  };
  currentUser: any;
}

export default function ConversationMessage({ message, isOwn, otherUser, currentUser }: MessageProps) {
  const hasAttachment = !!message.attachment_url;
  const hasLocation = !!message.location;
  const hasContent = !!message.content;
  
  const renderAttachment = () => {
    if (!message.attachment_url) return null;
    
    if (message.attachment_type === 'image') {
      return (
        <a href={message.attachment_url} target="_blank" rel="noopener noreferrer" className="block">
          <img
            src={message.attachment_url}
            alt="Attachment"
            className="rounded-md max-h-64 max-w-full object-contain"
          />
        </a>
      );
    }
    
    // For other file types
    return (
      <a 
        href={message.attachment_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block bg-secondary rounded-md p-3 text-sm"
      >
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download attachment</span>
        </div>
      </a>
    );
  };
  
  const renderLocation = () => {
    if (!message.location) return null;
    
    return (
      <div className="bg-secondary rounded-md p-3 text-sm">
        <div className="flex items-center mb-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="font-medium">Location shared</span>
        </div>
        <p className="text-xs text-muted-foreground">{message.location.address}</p>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${message.location.latitude},${message.location.longitude}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-primary mt-1 block"
        >
          View on map
        </a>
      </div>
    );
  };
  
  const formattedTime = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });
  
  return (
    <div className={cn(
      "flex gap-2 max-w-[80%]",
      isOwn ? "ml-auto flex-row-reverse" : ""
    )}>
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={otherUser.avatar_url || undefined} alt={otherUser.username || "User"} />
          <AvatarFallback>{otherUser.full_name?.charAt(0) || otherUser.username?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "space-y-1",
        isOwn ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-lg p-3 max-w-full",
          isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
          (!hasContent && (hasAttachment || hasLocation)) ? "p-0 overflow-hidden bg-transparent" : ""
        )}>
          {hasContent && <p className="whitespace-pre-wrap break-words">{message.content}</p>}
          {renderAttachment()}
          {renderLocation()}
        </div>
        
        <p className={cn(
          "text-xs text-muted-foreground",
          isOwn ? "text-right" : "text-left"
        )}>
          {formattedTime}
        </p>
      </div>
    </div>
  );
}
