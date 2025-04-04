
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit, Award, Leaf, Music, Clock, Trees, Upload, Trash2, Droplets } from "lucide-react";
import TrackCard from "@/components/music/TrackCard";
import PlaylistCard from "@/components/music/PlaylistCard";

export default function Profile() {
  // Sample activities for the profile
  const recentActivities = [
    {
      id: 1,
      type: "recycling",
      title: "Logged 3 Plastic Bottles",
      points: 15,
      date: "April 3, 2025",
    },
    {
      id: 2,
      type: "challenge",
      title: "Joined Reuse Challenge",
      points: 10,
      date: "April 2, 2025",
    },
    {
      id: 3,
      type: "music",
      title: "Listened to 1 hour of eco music",
      points: 5,
      date: "April 2, 2025",
    },
    {
      id: 4,
      type: "recycling",
      title: "Logged 1 Cardboard Box",
      points: 5,
      date: "April 1, 2025",
    },
  ];

  // Sample achievements
  const achievements = [
    {
      id: 1,
      title: "Recycling Rookie",
      description: "Logged your first 5 recycled items",
      icon: "trash",
      unlocked: true,
      date: "March 25, 2025",
    },
    {
      id: 2,
      title: "Music Explorer",
      description: "Listened to 10 hours of eco-friendly music",
      icon: "music",
      unlocked: true,
      date: "March 28, 2025",
    },
    {
      id: 3,
      title: "Challenge Accepted",
      description: "Completed your first eco challenge",
      icon: "award",
      unlocked: false,
      progress: 60,
    },
    {
      id: 4,
      title: "Tree Planter",
      description: "Earned enough points to plant a tree",
      icon: "tree",
      unlocked: false,
      progress: 40,
    },
  ];

  return (
    <Layout>
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="eco-card overflow-hidden">
              <div className="h-32 bg-gradient-eco"></div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col items-center -mt-16">
                    <div className="h-24 w-24 rounded-full border-4 border-card overflow-hidden bg-green-100">
                      <img 
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80" 
                        alt="Profile avatar" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h2 className="mt-2 text-xl font-semibold">Emma Green</h2>
                    <p className="text-sm text-muted-foreground">@ecoEmma</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-border/30 pb-2">
                    <div className="flex items-center">
                      <Leaf className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">EcoPoints</span>
                    </div>
                    <span className="text-lg font-semibold">238</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-border/30 pb-2">
                    <div className="flex items-center">
                      <Music className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">Music Hours</span>
                    </div>
                    <span className="text-lg font-semibold">12.5</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-border/30 pb-2">
                    <div className="flex items-center">
                      <Trash2 className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">Items Recycled</span>
                    </div>
                    <span className="text-lg font-semibold">17</span>
                  </div>
                  
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">Challenges</span>
                    </div>
                    <span className="text-lg font-semibold">2/5</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full bg-gradient-eco">
                    View Your Impact Report
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="eco-card p-6 mt-6">
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start justify-between pb-3 border-b border-border/30 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {activity.type === "recycling" && (
                          <Trash2 className="h-4 w-4 text-green-600" />
                        )}
                        {activity.type === "challenge" && (
                          <Award className="h-4 w-4 text-green-600" />
                        )}
                        {activity.type === "music" && (
                          <Music className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <Leaf className="h-3 w-3 mr-1" />
                      +{activity.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="stats" className="mb-8">
              <TabsList>
                <TabsTrigger value="stats">Stats & Achievements</TabsTrigger>
                <TabsTrigger value="music">Music</TabsTrigger>
                <TabsTrigger value="recycling">Recycling Log</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="mt-6 space-y-6">
                <div className="eco-card p-6">
                  <h3 className="text-lg font-medium mb-6">Your Eco Impact</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="eco-card p-4 flex flex-col items-center space-y-2">
                      <Trees className="h-8 w-8 text-green-600" />
                      <span className="text-2xl font-semibold">2</span>
                      <span className="text-sm text-muted-foreground">Trees Planted</span>
                    </div>
                    <div className="eco-card p-4 flex flex-col items-center space-y-2">
                      <Droplets className="h-8 w-8 text-green-600" />
                      <span className="text-2xl font-semibold">84</span>
                      <span className="text-sm text-muted-foreground">Water Saved (L)</span>
                    </div>
                    <div className="eco-card p-4 flex flex-col items-center space-y-2">
                      <Trash2 className="h-8 w-8 text-green-600" />
                      <span className="text-2xl font-semibold">17</span>
                      <span className="text-sm text-muted-foreground">Items Recycled</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Your Impact Breakdown</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Plastic Bottles</span>
                          <span>10 items</span>
                        </div>
                        <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Paper & Cardboard</span>
                          <span>5 items</span>
                        </div>
                        <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Glass</span>
                          <span>2 items</span>
                        </div>
                        <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600 rounded-full" style={{ width: "10%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="eco-card p-6">
                  <h3 className="text-lg font-medium mb-6">Achievements</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div 
                        key={achievement.id} 
                        className={`flex items-start gap-4 p-4 border rounded-lg ${
                          achievement.unlocked 
                            ? "bg-green-50 border-green-200" 
                            : "bg-secondary border-border/30"
                        }`}
                      >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                          achievement.unlocked 
                            ? "bg-green-100" 
                            : "bg-muted"
                        }`}>
                          {achievement.icon === "trash" && (
                            <Trash2 className={`h-6 w-6 ${achievement.unlocked ? "text-green-600" : "text-muted-foreground"}`} />
                          )}
                          {achievement.icon === "music" && (
                            <Music className={`h-6 w-6 ${achievement.unlocked ? "text-green-600" : "text-muted-foreground"}`} />
                          )}
                          {achievement.icon === "award" && (
                            <Award className={`h-6 w-6 ${achievement.unlocked ? "text-green-600" : "text-muted-foreground"}`} />
                          )}
                          {achievement.icon === "tree" && (
                            <Trees className={`h-6 w-6 ${achievement.unlocked ? "text-green-600" : "text-muted-foreground"}`} />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{achievement.title}</h4>
                            {achievement.unlocked && (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                Unlocked
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {achievement.description}
                          </p>
                          
                          {achievement.unlocked ? (
                            <p className="text-xs text-muted-foreground mt-2">
                              Achieved on {achievement.date}
                            </p>
                          ) : (
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{achievement.progress}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-600 rounded-full" 
                                  style={{ width: `${achievement.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="music" className="mt-6 space-y-6">
                <div className="eco-card p-6">
                  <h3 className="text-lg font-medium mb-4">Your Playlists</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PlaylistCard 
                      title="My Eco Mix"
                      description="My favorite songs to listen to while recycling"
                      image="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4"
                      trackCount={8}
                    />
                    <PlaylistCard 
                      title="Chill Nature"
                      description="Relaxing nature sounds for meditation and focus"
                      image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
                      trackCount={12}
                    />
                  </div>
                </div>
                
                <div className="eco-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Recently Played</h3>
                    <Button variant="link" className="text-primary">View All</Button>
                  </div>
                  <div className="space-y-3">
                    <TrackCard 
                      title="Forest Whispers"
                      artist="NatureTone"
                      image="https://images.unsplash.com/photo-1448375240586-882707db888b"
                      duration="3:42"
                      ecoFriendly={true}
                    />
                    <TrackCard 
                      title="Ocean Waves"
                      artist="SoundScape"
                      image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                      duration="4:17"
                      ecoFriendly={true}
                    />
                    <TrackCard 
                      title="Rainforest Rhythm"
                      artist="Green Harmony"
                      image="https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1"
                      duration="5:12"
                      ecoFriendly={true}
                    />
                  </div>
                </div>
                
                <div className="eco-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Listening Stats</h3>
                    <span className="text-sm text-muted-foreground">Last 30 days</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border/30 pb-2">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">Listening Time</span>
                      </div>
                      <span className="text-lg font-semibold">12.5 hours</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b border-border/30 pb-2">
                      <div className="flex items-center">
                        <Music className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">Tracks Played</span>
                      </div>
                      <span className="text-lg font-semibold">87</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b border-border/30 pb-2">
                      <div className="flex items-center">
                        <Leaf className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">Eco Music Hours</span>
                      </div>
                      <span className="text-lg font-semibold">8.2</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">Music Points Earned</span>
                      </div>
                      <span className="text-lg font-semibold">82</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recycling" className="mt-6 space-y-6">
                <div className="eco-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Your Recycling Log</h3>
                    <Button className="bg-gradient-eco">
                      <Upload className="h-4 w-4 mr-2" />
                      Log New Item
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
                      <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1633962938534-b0cfec8a6341" 
                          alt="Plastic bottles" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">Plastic Bottles</h4>
                            <p className="text-sm text-muted-foreground">Quantity: 3</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>April 3, 2025</span>
                              <Clock className="h-3 w-3 ml-2 mr-1" />
                              <span>2:45 PM</span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                            <Leaf className="h-4 w-4 mr-1.5" />
                            +15 points
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
                      <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1589398538631-1fe3357c4aae" 
                          alt="Cardboard" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">Paper/Cardboard</h4>
                            <p className="text-sm text-muted-foreground">Quantity: 1</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>April 2, 2025</span>
                              <Clock className="h-3 w-3 ml-2 mr-1" />
                              <span>11:20 AM</span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                            <Leaf className="h-4 w-4 mr-1.5" />
                            +5 points
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
                      <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1612965607446-25e1332775ae" 
                          alt="Glass bottles" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">Glass</h4>
                            <p className="text-sm text-muted-foreground">Quantity: 2</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>April 1, 2025</span>
                              <Clock className="h-3 w-3 ml-2 mr-1" />
                              <span>5:30 PM</span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                            <Leaf className="h-4 w-4 mr-1.5" />
                            +10 points
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button variant="link" className="text-primary">
                      View Complete History
                    </Button>
                  </div>
                </div>
                
                <div className="eco-card p-6">
                  <h3 className="text-lg font-medium mb-4">Recycling Impact</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-border/50 rounded-lg bg-secondary/30 flex flex-col items-center space-y-2">
                      <span className="text-xl font-semibold">3.2 kg</span>
                      <span className="text-sm text-muted-foreground">Plastic Saved</span>
                    </div>
                    <div className="p-4 border border-border/50 rounded-lg bg-secondary/30 flex flex-col items-center space-y-2">
                      <span className="text-xl font-semibold">4.7 kg</span>
                      <span className="text-sm text-muted-foreground">CO₂ Reduced</span>
                    </div>
                    <div className="p-4 border border-border/50 rounded-lg bg-secondary/30 flex flex-col items-center space-y-2">
                      <span className="text-xl font-semibold">84 L</span>
                      <span className="text-sm text-muted-foreground">Water Saved</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6">
                <div className="eco-card p-6">
                  <h3 className="text-lg font-medium mb-6">Account Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium" htmlFor="name">
                        Display Name
                      </label>
                      <input 
                        id="name"
                        type="text" 
                        defaultValue="Emma Green"
                        className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium" htmlFor="email">
                        Email
                      </label>
                      <input 
                        id="email"
                        type="email" 
                        defaultValue="emma@example.com"
                        className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium" htmlFor="bio">
                        Bio
                      </label>
                      <textarea 
                        id="bio"
                        defaultValue="Passionate about sustainability and music. Working on reducing my carbon footprint one step at a time."
                        className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm h-24"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Profile Photo</label>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
                          <img 
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80" 
                            alt="Profile avatar" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          Change Photo
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button className="bg-gradient-eco">Save Changes</Button>
                    </div>
                  </div>
                </div>
                
                <div className="eco-card p-6 mt-6">
                  <h3 className="text-lg font-medium mb-6">Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border/30">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates about your activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2 border-b border-border/30">
                      <div>
                        <p className="font-medium">Challenge Reminders</p>
                        <p className="text-sm text-muted-foreground">Get reminders about active challenges</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2">
                      <div>
                        <p className="font-medium">Make Profile Public</p>
                        <p className="text-sm text-muted-foreground">Allow others to see your eco impact</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
