
export const transformLocation = (location: any): { lat: number; lng: number; address?: string } | undefined => {
  if (!location) return undefined;
  
  if (typeof location === 'object') {
    return {
      lat: location.latitude || location.lat || 0,
      lng: location.longitude || location.lng || 0,
      address: location.address || ''
    };
  }
  
  return undefined;
};

export const transformMessage = (msg: any): Message => {
  if (!msg) {
    console.error('Received empty message object');
    return {
      id: 'temp-' + Date.now(),
      conversation_id: '',
      sender_id: '',
      created_at: new Date().toISOString()
    };
  }
  
  // Ensure all critical fields exist
  return {
    id: msg.id || 'temp-' + Date.now(),
    conversation_id: msg.conversation_id || '',
    sender_id: msg.sender_id || '',
    content: msg.content || undefined,
    attachment_url: msg.attachment_url || undefined,
    attachment_type: msg.attachment_type || undefined,
    location: transformLocation(msg.location),
    created_at: msg.created_at || new Date().toISOString()
  };
};

// Add a function to check for duplicate messages
export const isDuplicateMessage = (message: Message, existingMessages: Message[]): boolean => {
  return existingMessages.some(msg => msg.id === message.id);
};
