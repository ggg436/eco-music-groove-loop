
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessageCircle, AlertTriangle } from "lucide-react";

interface ConversationEmptyStateProps {
  message: string;
  buttonText: string;
  buttonLink: string;
  isError?: boolean;
}

export default function ConversationEmptyState({
  message,
  buttonText,
  buttonLink,
  isError = false
}: ConversationEmptyStateProps) {
  const navigate = useNavigate();
  
  return (
    <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
      {isError ? (
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      ) : (
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
      )}
      <h2 className={`text-xl font-semibold mb-4 ${isError ? 'text-destructive' : ''}`}>{message}</h2>
      <Button 
        onClick={() => navigate(buttonLink)}
        variant={isError ? "destructive" : "default"}
      >
        {buttonText}
      </Button>
    </div>
  );
}
