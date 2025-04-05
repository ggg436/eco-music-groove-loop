
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LocationPickerProps {
  onSelectLocation: (location: { lat: number; lng: number; address: string }) => void;
  onCancel: () => void;
}

export default function LocationPicker({ onSelectLocation, onCancel }: LocationPickerProps) {
  const [address, setAddress] = useState("");
  
  // In a real app, you would integrate with a maps API like Google Maps
  // For this demo, we'll use a placeholder function
  const handleShareLocation = () => {
    // Simulate finding a location - in a real app this would use geocoding
    if (address.trim()) {
      // Mock coordinates for demo purposes
      onSelectLocation({
        lat: 40.7128,
        lng: -74.0060,
        address: address.trim()
      });
    } else {
      // Use current location if browser supports it
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // In a real app, you would use reverse geocoding to get the address
            onSelectLocation({
              lat: latitude,
              lng: longitude,
              address: "Your current location"
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            // Fallback for demo
            onSelectLocation({
              lat: 40.7128,
              lng: -74.0060,
              address: "New York, NY, USA"
            });
          }
        );
      } else {
        // Fallback for browsers that don't support geolocation
        onSelectLocation({
          lat: 40.7128,
          lng: -74.0060,
          address: "New York, NY, USA"
        });
      }
    }
  };
  
  return (
    <div className="bg-card rounded-md p-3 border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Share Location</h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter an address..."
            className="flex-1"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="bg-muted h-32 rounded-md flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Map preview would appear here
          </p>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleShareLocation}>
            Share Location
          </Button>
        </div>
      </div>
    </div>
  );
}
