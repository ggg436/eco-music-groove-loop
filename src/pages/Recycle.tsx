
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import RecycleLogCard from "@/components/eco/RecycleLogCard";
import EcoStatsCard from "@/components/common/EcoStatsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, GiftIcon, Info, Leaf, Award } from "lucide-react";

export default function Recycle() {
  // Sample recycle logs for the history tab
  const recycleLogs = [
    {
      id: 1,
      type: "Plastic bottles",
      quantity: 3,
      date: "April 3, 2025",
      time: "2:45 PM",
      points: 15,
      image: "https://images.unsplash.com/photo-1633962938534-b0cfec8a6341",
    },
    {
      id: 2,
      type: "Paper/Cardboard",
      quantity: 1,
      date: "April 2, 2025",
      time: "11:20 AM",
      points: 5,
      image: "https://images.unsplash.com/photo-1589398538631-1fe3357c4aae",
    },
    {
      id: 3,
      type: "Glass",
      quantity: 2,
      date: "April 1, 2025",
      time: "5:30 PM",
      points: 10,
      image: "https://images.unsplash.com/photo-1612965607446-25e1332775ae",
    },
  ];

  return (
    <Layout>
      <div className="container py-8">
        <SectionHeading
          title="Recycle Tracker"
          subtitle="Log your recycling activities and earn EcoPoints"
        />

        <Tabs defaultValue="log" className="mb-8">
          <TabsList>
            <TabsTrigger value="log">Log Recycling</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="guide">Recycling Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="log" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <RecycleLogCard />
              </div>
              
              <div>
                <EcoStatsCard className="mb-6" />
                
                <div className="eco-card p-6">
                  <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recycleLogs.slice(0, 2).map((log) => (
                      <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-border/30">
                        <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                          <img src={log.image} alt={log.type} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{log.type} × {log.quantity}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{log.date}</span>
                            <Clock className="h-3 w-3 ml-2 mr-1" />
                            <span>{log.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <Leaf className="h-3 w-3 mr-1" />
                          +{log.points}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="link" className="w-full mt-2 text-primary">
                    View All Activity
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <div className="eco-card p-6">
              <h3 className="text-lg font-medium mb-4">Your Recycling History</h3>
              
              <div className="space-y-6">
                {recycleLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 pb-4 border-b border-border/30">
                    <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                      <img src={log.image} alt={log.type} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{log.type}</h4>
                          <p className="text-sm text-muted-foreground">Quantity: {log.quantity}</p>
                          
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{log.date}</span>
                            <Clock className="h-3 w-3 ml-2 mr-1" />
                            <span>{log.time}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                          <Leaf className="h-4 w-4 mr-1.5" />
                          +{log.points} points
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rewards" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="eco-card p-6">
                  <h3 className="text-lg font-medium mb-4">Available Rewards</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center bg-green-100 rounded-full">
                          <GiftIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Exclusive Green Vibes Playlist</p>
                          <p className="text-sm text-muted-foreground">Special curated tracks from eco artists</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                        <Leaf className="h-4 w-4 mr-1.5" />
                        <span>100 points</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center bg-green-100 rounded-full">
                          <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Plant a Tree Certificate</p>
                          <p className="text-sm text-muted-foreground">We'll plant a tree in your name</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                        <Leaf className="h-4 w-4 mr-1.5" />
                        <span>250 points</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center bg-green-100 rounded-full">
                          <GiftIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Digital Badge: "Earth Champion"</p>
                          <p className="text-sm text-muted-foreground">Special profile badge for top recyclers</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                        <Leaf className="h-4 w-4 mr-1.5" />
                        <span>300 points</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="eco-card p-6">
                  <h3 className="text-lg font-medium mb-4">Redeemed Rewards</h3>
                  
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      You haven't redeemed any rewards yet. Start recycling to earn points!
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <EcoStatsCard className="mb-6" />
                
                <div className="eco-card p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    How Points Work
                  </h3>
                  
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Leaf className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>5 points per recycled item logged with photo evidence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Leaf className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Bonus points for participating in eco challenges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Leaf className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>10 points for each hour of eco-friendly music played</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Leaf className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Points can be redeemed for rewards or to plant trees</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="guide" className="mt-6">
            <div className="eco-card p-6">
              <h3 className="text-lg font-medium mb-4">Recycling Guide</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Plastic Recycling</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Most plastic bottles and containers can be recycled, but check the recycling symbol first. 
                    Clean containers before recycling.
                  </p>
                  <ul className="leaf-bullet space-y-1 text-sm">
                    <li>Rinse containers to remove food residue</li>
                    <li>Remove bottle caps and recycle them separately</li>
                    <li>Flatten bottles to save space</li>
                    <li>Check local guidelines for accepted plastic types</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Paper and Cardboard</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Paper products are highly recyclable. Flatten cardboard boxes and remove any plastic or tape.
                  </p>
                  <ul className="leaf-bullet space-y-1 text-sm">
                    <li>Remove any non-paper materials (plastic windows, tape, etc.)</li>
                    <li>Break down boxes to save space</li>
                    <li>Keep paper dry and clean</li>
                    <li>Shredded paper may need special handling</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Glass</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Glass is 100% recyclable and can be recycled endlessly without loss in quality.
                  </p>
                  <ul className="leaf-bullet space-y-1 text-sm">
                    <li>Rinse bottles and jars</li>
                    <li>Remove lids and caps (recycle separately)</li>
                    <li>Do not include lightbulbs, mirrors, or window glass</li>
                    <li>No need to remove labels</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Electronics</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Electronic waste contains valuable materials that can be recovered and reused.
                  </p>
                  <ul className="leaf-bullet space-y-1 text-sm">
                    <li>Remove batteries (recycle separately)</li>
                    <li>Look for e-waste collection events in your area</li>
                    <li>Many retailers offer takeback programs</li>
                    <li>Wipe personal data before recycling devices</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
