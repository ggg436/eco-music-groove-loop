
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ConversationEmptyStateProps {
  message: string;
  buttonText: string;
  buttonLink: string;
}

export default function ConversationEmptyState({
  message,
  buttonText,
  buttonLink
}: ConversationEmptyStateProps) {
  const navigate = useNavigate();
  
  return (
    <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-xl font-semibold mb-4">{message}</h2>
      <Button onClick={() => navigate(buttonLink)}>
        {buttonText}
      </Button>
    </div>
  );
}
