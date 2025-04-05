
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get parameters from request body
    const { p_product_id, p_buyer_id, p_seller_id } = await req.json();

    if (!p_product_id || !p_buyer_id || !p_seller_id) {
      throw new Error("Missing required parameters");
    }

    // Query the database for conversations that match the product and users
    const { data, error } = await supabaseClient
      .from("conversations")
      .select("id, product_id, buyer_id, seller_id, created_at")
      .eq("product_id", p_product_id)
      .eq("buyer_id", p_buyer_id)
      .eq("seller_id", p_seller_id);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
