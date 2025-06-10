
import { forwardRef } from "react";
import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileInputProps {
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ onFileChange, disabled }, ref) => {
    const handleClick = () => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.click();
      }
    };

    return (
      <>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleClick}
          disabled={disabled}
          title="Attach file"
        >
          <Image className="h-5 w-5" />
        </Button>
        
        <input 
          type="file"
          ref={ref}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={onFileChange}
          disabled={disabled}
        />
      </>
    );
  }
);

FileInput.displayName = "FileInput";

export default FileInput;
