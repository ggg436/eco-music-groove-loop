
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error('No image data provided');
    }

    // Remove data URL prefix if present
    const base64Data = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1]
      : imageBase64;

    // Call DeepSeek API for plant identification
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-v2',
        messages: [
          {
            role: 'system',
            content: 'You are a plant identification expert. Analyze the image and provide detailed information about the plant including scientific name, common name, family, description, and care instructions including water, light, and soil requirements. Also mention common diseases and additional facts if possible. Format the response as JSON.'
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Identify this plant and provide detailed information about it.' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Data}` } }
            ]
          }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`DeepSeek API error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    
    // Parse the JSON response from the AI
    let plantData;
    try {
      plantData = JSON.parse(result.choices[0].message.content);
    } catch (error) {
      plantData = {
        scientificName: "Unknown",
        commonName: "Unknown",
        family: "Unknown",
        description: "Could not identify plant with confidence.",
        care: {
          water: "N/A",
          light: "N/A",
          soil: "N/A"
        }
      };
    }

    return new Response(
      JSON.stringify(plantData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in identify-plant function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
