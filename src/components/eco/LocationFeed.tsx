
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, CloudSun, Wind, Recycle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationFeedProps {
  className?: string;
}

export default function LocationFeed({ className }: LocationFeedProps) {
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [weather, setWeather] = useState<{temp: number; condition: string} | null>(null);
  const [airQuality, setAirQuality] = useState<{index: number; level: string} | null>(null);
  const [nearbyRecycling, setNearbyRecycling] = useState<number>(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        
        // Simulate fetching weather, air quality, and recycling data
        // In a real app, you would make API calls here
        simulateDataFetch(position.coords.latitude, position.coords.longitude);
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionDenied(true);
        }
        setLoading(false);
      }
    );
  }, []);

  const simulateDataFetch = (lat: number, lng: number) => {
    // Simulate weather data
    setTimeout(() => {
      setWeather({
        temp: Math.floor(Math.random() * 15) + 15, // 15-30°C
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)]
      });
    }, 500);

    // Simulate air quality data
    setTimeout(() => {
      const index = Math.floor(Math.random() * 150) + 20;
      let level;
      if (index < 50) level = "Good";
      else if (index < 100) level = "Moderate";
      else if (index < 150) level = "Unhealthy for Sensitive Groups";
      else level = "Unhealthy";
      
      setAirQuality({ index, level });
    }, 800);

    // Simulate nearby recycling centers
    setTimeout(() => {
      setNearbyRecycling(Math.floor(Math.random() * 10) + 1);
    }, 1000);
  };

  const getAirQualityColor = () => {
    if (!airQuality) return "bg-gray-200";
    if (airQuality.index < 50) return "bg-green-100 text-green-800";
    if (airQuality.index < 100) return "bg-yellow-100 text-yellow-800";
    if (airQuality.index < 150) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <Card className={cn("h-full", className)}>
        <CardContent className="p-6 flex items-center justify-center h-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
            <div className="h-4 w-24 bg-primary/20 rounded mb-3"></div>
            <div className="h-3 w-48 bg-primary/10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (permissionDenied) {
    return (
      <Card className={cn("h-full", className)}>
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg mb-2">Location Access Denied</h3>
          <p className="text-muted-foreground mb-4">
            We need access to your location to show local eco data. Please enable location services in your browser settings.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-medium text-lg">Local Eco Data</h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {location ? "Your current location" : "Location unavailable"}
            </p>
          </div>
          <Button variant="outline" size="sm">Refresh</Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {weather && (
            <div className="flex items-center p-3 bg-secondary/30 rounded-lg">
              <CloudSun className="h-10 w-10 text-primary mr-4" />
              <div>
                <h4 className="font-medium">{weather.temp}°C</h4>
                <p className="text-sm text-muted-foreground">{weather.condition}</p>
              </div>
            </div>
          )}

          {airQuality && (
            <div className="flex items-center p-3 bg-secondary/30 rounded-lg">
              <Wind className="h-10 w-10 text-primary mr-4" />
              <div className="flex-1">
                <h4 className="font-medium">Air Quality</h4>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">AQI: {airQuality.index}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getAirQualityColor()}`}>
                    {airQuality.level}
                  </span>
                </div>
              </div>
            </div>
          )}

          {nearbyRecycling > 0 && (
            <div className="flex items-center p-3 bg-secondary/30 rounded-lg">
              <Recycle className="h-10 w-10 text-primary mr-4" />
              <div>
                <h4 className="font-medium">{nearbyRecycling} Recycling Centers</h4>
                <p className="text-sm text-muted-foreground">Within 5 miles of you</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button variant="outline" className="w-full" size="sm">
            View Detailed Eco Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
