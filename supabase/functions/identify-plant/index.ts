
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

    console.log('Calling DeepSeek API for plant identification...');
    
    // Call DeepSeek API for plant identification
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY') || 'sk-8c56615617224fa2a5050c8d6f6b1075'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-v2',
        messages: [
          {
            role: 'system',
            content: 'You are a plant identification expert. Analyze the image and provide detailed information about the plant including scientific name, common name, family, description, and care instructions including water, light, and soil requirements. Also mention common diseases and additional facts if possible. Format the response as JSON with these fields: scientificName, commonName, family, description, care (object with water, light, soil), diseases (array), additional (string).'
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

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error response:', errorText);
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    // Get the response as text first to debug
    const responseText = await response.text();
    console.log('DeepSeek API raw response:', responseText);
    
    // Parse the JSON response from the text
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('Successfully parsed response JSON');
    } catch (parseError) {
      console.error('Error parsing response as JSON:', parseError);
      throw new Error(`Failed to parse response: ${parseError.message}`);
    }
    
    // Parse the AI content as JSON
    let plantData;
    try {
      if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
        const contentText = result.choices[0].message.content;
        console.log('AI content to parse:', contentText);
        plantData = JSON.parse(contentText);
        console.log('Successfully parsed plant data from API response');
      } else {
        console.error('Invalid response structure:', result);
        throw new Error('Invalid response format from DeepSeek API');
      }
    } catch (error) {
      console.error('Error parsing DeepSeek API response content:', error);
      plantData = {
        scientificName: "Unknown",
        commonName: "Unknown",
        family: "Unknown",
        description: "Could not identify plant with confidence.",
        care: {
          water: "N/A",
          light: "N/A",
          soil: "N/A"
        },
        diseases: []
      };
    }

    return new Response(
      JSON.stringify(plantData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in identify-plant function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        scientificName: "Error",
        commonName: "Error Processing Image",
        family: "Unknown",
        description: "We encountered an error processing your plant image. Please try again with a clearer photo.",
        care: {
          water: "N/A",
          light: "N/A",
          soil: "N/A"
        },
        diseases: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
