
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Leaf, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export default function PlantIdentifier() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [photoSource, setPhotoSource] = useState<'upload' | 'camera' | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<{
    scientificName: string;
    commonName: string;
    family: string;
    description: string;
    care: {
      water: string;
      light: string;
      soil: string;
    };
    diseases?: string[];
    additional?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)"
      });
      return;
    }
    
    // Check if the file size is reasonable (under 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 5MB"
      });
      return;
    }
    
    setError(null);
    
    // Process image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      identifyPlant(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const takePicture = async () => {
    // This would be implemented with device camera
    // For now, we just simulate with file upload
    setPhotoSource('camera');
    document.getElementById('camera-input')?.click();
  };
  
  const identifyPlant = async (imageBase64: string) => {
    try {
      setIsIdentifying(true);
      setResult(null);
      setError(null);
      
      // Call our Supabase Edge Function for plant identification
      toast({
        title: "Analyzing plant...",
        description: "Our AI is identifying your plant. This may take a moment.",
      });
      
      const { data, error: invocationError } = await supabase.functions.invoke('identify-plant', {
        body: { imageBase64 },
      });
      
      if (invocationError) {
        console.error("Function invocation error:", invocationError);
        throw new Error(`Function error: ${invocationError.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned from plant identification service');
      }
      
      console.log("Plant identification result:", data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResult(data);
      
      toast({
        title: "Plant identified!",
        description: `We've identified this as ${data.commonName || 'a plant'}`,
      });
      
    } catch (error) {
      console.error("Error identifying plant:", error);
      setError((error as Error).message || "Unknown error occurred");
      toast({
        variant: "destructive",
        title: "Identification failed",
        description: "We couldn't identify your plant. Please try again with a clearer image."
      });
    } finally {
      setIsIdentifying(false);
    }
  };
  
  const resetIdentification = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setPhotoSource(null);
  };
  
  const retryIdentification = () => {
    if (image) {
      identifyPlant(image);
    }
  };
  
  if (!user) {
    return (
      <Layout>
        <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-xl font-semibold mb-4">Please sign in to use Plantist</h2>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mb-4">
              <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold">Plantist</h1>
            <p className="text-muted-foreground mt-2 max-w-md">
              Upload a photo of any plant and our AI will identify it and provide care instructions
            </p>
          </div>
          
          {!image ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Identify a Plant</CardTitle>
                <CardDescription>
                  Take a clear photo of the plant you want to identify
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-32 flex flex-col gap-2"
                    onClick={() => {
                      setPhotoSource('upload');
                      document.getElementById('file-input')?.click();
                    }}
                  >
                    <Upload className="h-8 w-8" />
                    <span>Upload from Device</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-32 flex flex-col gap-2"
                    onClick={takePicture}
                  >
                    <Camera className="h-8 w-8" />
                    <span>Take Photo</span>
                  </Button>
                </div>
                
                <input 
                  type="file" 
                  id="file-input" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                
                <input 
                  type="file" 
                  id="camera-input" 
                  className="hidden" 
                  accept="image/*" 
                  capture="environment"
                  onChange={handleFileUpload}
                />
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Tip</AlertTitle>
                  <AlertDescription>
                    For the best results, make sure the plant is well-lit and the photo is clear
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Plant</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center p-2">
                    <div className="bg-muted rounded-md overflow-hidden relative aspect-square w-full max-w-[250px]">
                      <img 
                        src={image} 
                        alt="Plant to identify" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="ghost" 
                      className="w-full" 
                      onClick={resetIdentification}
                    >
                      Try Another Photo
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="w-full md:w-2/3">
                <Card>
                  <CardHeader>
                    <CardTitle>Identification Results</CardTitle>
                    {isIdentifying ? (
                      <CardDescription>Analyzing your plant...</CardDescription>
                    ) : (
                      <CardDescription>Plant details and care instructions</CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    {isIdentifying ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
                        <p className="text-muted-foreground">
                          Our AI is analyzing your plant. This may take a moment...
                        </p>
                      </div>
                    ) : error ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                        <p className="text-destructive font-medium mb-2">Identification Failed</p>
                        <p className="text-muted-foreground text-center">
                          We couldn't identify your plant. Please try again with a clearer image.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4" 
                          onClick={retryIdentification}
                        >
                          Try Again
                        </Button>
                      </div>
                    ) : result ? (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold">{result.commonName}</h3>
                          <p className="text-sm text-muted-foreground italic">{result.scientificName}</p>
                          <Badge variant="outline" className="mt-1">{result.family}</Badge>
                        </div>
                        
                        <p>{result.description}</p>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Care Instructions</h4>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <span className="font-medium min-w-[60px]">Water:</span>
                              <span>{result.care.water}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-medium min-w-[60px]">Light:</span>
                              <span>{result.care.light}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-medium min-w-[60px]">Soil:</span>
                              <span>{result.care.soil}</span>
                            </div>
                          </div>
                        </div>
                        
                        {result.diseases && result.diseases.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Common Issues</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {result.diseases.map((disease, index) => (
                                <li key={index}>{disease}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.additional && (
                          <div>
                            <Separator className="my-2" />
                            <h4 className="font-semibold mb-2">Additional Information</h4>
                            <p>{result.additional}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No results available. Please try again with a different photo.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
