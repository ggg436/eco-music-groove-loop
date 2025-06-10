
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileAttachment {
  file: File | null;
  previewUrl: string | null;
  type: string | null;
}

interface UseFileAttachmentProps {
  conversationId: string;
  isConnected: boolean;
}

export const useFileAttachment = ({ conversationId, isConnected }: UseFileAttachmentProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [attachment, setAttachment] = useState<FileAttachment>({
    file: null,
    previewUrl: null,
    type: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
      });
      return;
    }
    
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadAttachment = async (): Promise<{ url: string; type: string } | null> => {
    if (!attachment.file) return null;

    console.log('Uploading attachment:', attachment.file.name);
    
    const fileExt = attachment.file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `conversations/${conversationId}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('message_attachments')
      .upload(filePath, attachment.file);
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('message_attachments')
      .getPublicUrl(filePath);
    
    console.log('Attachment uploaded successfully:', publicUrl);
    
    return {
      url: publicUrl,
      type: attachment.type || 'file',
    };
  };

  return {
    attachment,
    fileInputRef,
    handleFileChange: isConnected ? handleFileChange : undefined,
    handleRemoveAttachment,
    uploadAttachment,
  };
};
