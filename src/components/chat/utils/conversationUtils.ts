
export const getNormalizedListingType = (type: string | undefined): 'sell' | 'exchange' | 'giveaway' => {
  if (!type) return 'sell';
  
  const lowerType = type.toLowerCase();
  if (lowerType === 'offer' || lowerType === 'sell') return 'sell';
  if (lowerType === 'exchange') return 'exchange';
  if (lowerType === 'donation' || lowerType === 'giveaway') return 'giveaway';
  
  return 'sell'; // Default case
};

export const filterConversations = (
  conversations: ConversationWithDetails[],
  searchQuery: string,
  user: any
) => {
  if (!conversations) return [];
  
  return conversations.filter(conv => {
    const otherUser = conv.sellerProfile || conv.buyerProfile;
    const productTitle = conv.product?.title || '';
    const searchLower = searchQuery.toLowerCase();
    
    return (
      otherUser?.username?.toLowerCase().includes(searchLower) ||
      otherUser?.full_name?.toLowerCase().includes(searchLower) ||
      productTitle.toLowerCase().includes(searchLower)
    );
  });
};

export const sortConversations = (
  conversations: ConversationWithDetails[],
  sortBy: 'newest' | 'oldest'
) => {
  if (!conversations) return [];
  
  return [...conversations].sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at);
    const dateB = new Date(b.updated_at || b.created_at);
    
    return sortBy === 'newest' 
      ? dateB.getTime() - dateA.getTime()
      : dateA.getTime() - dateB.getTime();
  });
};

// Helper function to safely check if a conversation belongs to a user
export const isUserInConversation = (conversation: Conversation, userId: string): boolean => {
  return conversation.buyer_id === userId || conversation.seller_id === userId;
};

// Helper function to get the other user ID from a conversation
export const getOtherUserId = (conversation: Conversation, currentUserId: string): string => {
  return conversation.buyer_id === currentUserId ? conversation.seller_id : conversation.buyer_id;
};
