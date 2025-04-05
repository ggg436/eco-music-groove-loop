
-- Create function to get conversation details
CREATE OR REPLACE FUNCTION public.get_conversation(
  p_product_id INTEGER,
  p_buyer_id UUID,
  p_seller_id UUID
)
RETURNS SETOF conversations
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT *
  FROM conversations
  WHERE product_id = p_product_id
    AND buyer_id = p_buyer_id
    AND seller_id = p_seller_id
  LIMIT 1;
$$;

-- Create function to get messages by conversation ID
CREATE OR REPLACE FUNCTION public.get_messages_by_conversation(
  p_conversation_id UUID
)
RETURNS SETOF messages
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT *
  FROM messages
  WHERE conversation_id = p_conversation_id
  ORDER BY created_at ASC;
$$;
