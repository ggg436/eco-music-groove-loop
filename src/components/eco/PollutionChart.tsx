
import { useEffect, useState } from "react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CloudSun, CloudRain, Wind, Cloud } from "lucide-react";

// Types for pollution data
interface PollutionData {
  location: string;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
}

export default function PollutionChart() {
  const [pollutionData, setPollutionData] = useState<PollutionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"aqi" | "particles" | "gases">("aqi");

  useEffect(() => {
    // In a real app, this would be a call to a real-time API
    // For this demo, we'll simulate with mock data
    const mockData: PollutionData[] = [
      { location: "Your Location", aqi: 48, pm25: 12.3, pm10: 25.7, o3: 38.2, no2: 15.6 },
      { location: "Downtown", aqi: 72, pm25: 24.8, pm10: 38.6, o3: 52.1, no2: 31.4 },
      { location: "Riverside", aqi: 35, pm25: 8.1, pm10: 15.2, o3: 28.7, no2: 10.3 },
      { location: "Industrial Zone", aqi: 89, pm25: 30.5, pm10: 50.8, o3: 65.3, no2: 45.2 },
      { location: "Suburban Area", aqi: 42, pm25: 10.2, pm10: 21.6, o3: 34.5, no2: 18.1 },
    ];

    // Simulate loading
    const timer = setTimeout(() => {
      setPollutionData(mockData);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Configuration for the different pollution metrics
  const chartConfig = {
    aqi: {
      label: "Air Quality Index",
      color: "#8B5CF6",
    },
    pm25: {
      label: "PM2.5",
      color: "#F97316",
    },
    pm10: {
      label: "PM10",
      color: "#0EA5E9",
    },
    o3: {
      label: "Ozone",
      color: "#10B981",
    },
    no2: {
      label: "Nitrogen Dioxide",
      color: "#F43F5E",
    },
  };

  // Functions to determine pollution level
  const getAqiLevel = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-500";
    if (aqi <= 100) return "text-yellow-500";
    if (aqi <= 150) return "text-orange-500";
    if (aqi <= 200) return "text-red-500";
    if (aqi <= 300) return "text-purple-500";
    return "text-stone-800";
  };

  const getAqiForLocation = (location: string) => {
    const locationData = pollutionData.find(data => data.location === location);
    return locationData ? locationData.aqi : 0;
  };

  // Prepare data for the active tab
  const prepareChartData = () => {
    if (activeTab === "aqi") {
      return pollutionData.map(data => ({
        location: data.location,
        aqi: data.aqi,
      }));
    } else if (activeTab === "particles") {
      return pollutionData.map(data => ({
        location: data.location,
        pm25: data.pm25,
        pm10: data.pm10,
      }));
    } else {
      return pollutionData.map(data => ({
        location: data.location,
        o3: data.o3,
        no2: data.no2,
      }));
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full h-80 animate-pulse">
        <CardHeader>
          <CardTitle className="bg-muted h-8 w-3/4 rounded"></CardTitle>
          <CardDescription className="bg-muted h-4 w-1/2 rounded mt-2"></CardDescription>
        </CardHeader>
        <CardContent className="h-56 bg-muted rounded"></CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Real-Time Pollution Levels</CardTitle>
        <CardDescription>
          Current air quality data for locations around you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="aqi">Air Quality Index</TabsTrigger>
            <TabsTrigger value="particles">Particulate Matter</TabsTrigger>
            <TabsTrigger value="gases">Gases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="aqi" className="h-[300px]">
            <ChartContainer 
              config={chartConfig}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareChartData()}
                  margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="aqi" fill={chartConfig.aqi.color} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="particles" className="h-[300px]">
            <ChartContainer 
              config={chartConfig}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareChartData()}
                  margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Legend />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="pm25" fill={chartConfig.pm25.color} name="PM2.5" />
                  <Bar dataKey="pm10" fill={chartConfig.pm10.color} name="PM10" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="gases" className="h-[300px]">
            <ChartContainer 
              config={chartConfig}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareChartData()}
                  margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Legend />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="o3" fill={chartConfig.o3.color} name="Ozone (O₃)" />
                  <Bar dataKey="no2" fill={chartConfig.no2.color} name="Nitrogen Dioxide (NO₂)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {pollutionData.map((data) => (
            <Card key={data.location} className={`border-l-4 ${getAqiColor(data.aqi).replace('text-', 'border-')}`}>
              <CardContent className="p-3">
                <p className="text-xs">{data.location}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="font-bold text-lg">{data.aqi}</p>
                  <p className={`text-xs ${getAqiColor(data.aqi)}`}>{getAqiLevel(data.aqi)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
