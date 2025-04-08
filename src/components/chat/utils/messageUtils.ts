
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
  return {
    id: msg.id,
    conversation_id: msg.conversation_id,
    sender_id: msg.sender_id,
    content: msg.content || undefined,
    attachment_url: msg.attachment_url || undefined,
    attachment_type: msg.attachment_type || undefined,
    location: transformLocation(msg.location),
    created_at: msg.created_at
  };
};
