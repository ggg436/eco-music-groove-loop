
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttachmentPreviewProps {
  url: string;
  type: string;
  fileName?: string;
  onRemove: () => void;
}

export default function AttachmentPreview({ url, type, fileName, onRemove }: AttachmentPreviewProps) {
  return (
    <div className="relative inline-block max-w-xs">
      <div className="rounded-md overflow-hidden border bg-card">
        {type === 'image' ? (
          <div className="relative">
            <img src={url} alt="Attachment Preview" className="max-h-32 max-w-full object-contain" />
          </div>
        ) : (
          <div className="p-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm truncate max-w-[200px]">{fileName || 'File'}</span>
          </div>
        )}
      </div>
      
      <Button 
        variant="destructive" 
        size="icon" 
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full" 
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
