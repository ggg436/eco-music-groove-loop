
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface ConversationEmptyStateProps {
  message: string;
  buttonText: string;
  buttonLink?: string;
  buttonAction?: () => void;
  isError?: boolean;
}

export default function ConversationEmptyState({
  message,
  buttonText,
  buttonLink,
  buttonAction,
  isError = false,
}: ConversationEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <MessageCircle className={`h-12 w-12 ${isError ? 'text-destructive' : 'text-muted-foreground'} mb-4`} />
        <h3 className="text-lg font-medium">{message}</h3>
        <p className="text-muted-foreground text-center mt-2 mb-6 max-w-md">
          {isError 
            ? "There was an error loading your conversations. Please try again or contact support if the issue persists."
            : "When you message sellers or buyers, your conversations will appear here."}
        </p>
        {buttonLink ? (
          <Button asChild>
            <Link to={buttonLink}>{buttonText}</Link>
          </Button>
        ) : (
          <Button onClick={buttonAction}>{buttonText}</Button>
        )}
      </CardContent>
    </Card>
  );
}
