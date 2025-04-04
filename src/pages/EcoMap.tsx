
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Recycle, CloudSun, Leaf } from "lucide-react";

export default function EcoMap() {
  return (
    <Layout>
      <div className="container py-8">
        <SectionHeading
          title="Eco Map & Local Resources"
          subtitle="Discover sustainable options in your area"
          align="center"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden h-[600px]">
              <CardContent className="p-0 h-full flex items-center justify-center bg-muted">
                <div className="text-center p-6">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
                  <h3 className="text-xl font-medium mb-2">Map Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Our interactive eco-map is under development. Soon you'll be able to find recycling centers, 
                    eco-friendly stores, and community events near you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4 flex items-center">
                  <Recycle className="h-5 w-5 mr-2 text-green-600" />
                  Nearby Resources
                </h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <h4 className="font-medium">Recycling Centers</h4>
                    <p className="text-sm text-muted-foreground">Find places to recycle specific materials</p>
                  </div>
                  
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <h4 className="font-medium">Eco-Friendly Stores</h4>
                    <p className="text-sm text-muted-foreground">Discover shops with sustainable products</p>
                  </div>
                  
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <h4 className="font-medium">Community Gardens</h4>
                    <p className="text-sm text-muted-foreground">Join local gardening initiatives</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4 flex items-center">
                  <Leaf className="h-5 w-5 mr-2 text-green-600" />
                  Local Eco Events
                </h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 py-1">
                    <h4 className="font-medium">Community Cleanup</h4>
                    <p className="text-sm text-muted-foreground">May 15, 2023 • Central Park</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-1">
                    <h4 className="font-medium">Sustainable Living Workshop</h4>
                    <p className="text-sm text-muted-foreground">May 22, 2023 • City Library</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-1">
                    <h4 className="font-medium">Farmers Market</h4>
                    <p className="text-sm text-muted-foreground">Every Sunday • Downtown Square</p>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Events
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
