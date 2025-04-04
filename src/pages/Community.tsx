
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import CommunityPostCard from "@/components/community/CommunityPostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Search } from "lucide-react";

export default function Community() {
  // Sample community posts
  const communityPosts = [
    {
      id: 1,
      username: "EcoWarrior",
      userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      content: "Just finished my Plastic-Free Week challenge! It was tough, but I found some great alternatives to single-use plastics. My favorite discovery was these beeswax wraps that replace plastic wrap!",
      image: "https://images.unsplash.com/photo-1621448835608-3f768820589b",
      likes: 24,
      comments: 7,
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      username: "GreenThumb",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      content: "Started my balcony garden today! Growing herbs and some vegetables to reduce my carbon footprint from food transportation. Has anyone tried growing tomatoes in containers?",
      image: "https://images.unsplash.com/photo-1581834070456-26b3d7bd703e",
      likes: 18,
      comments: 12,
      timeAgo: "5 hours ago",
    },
    {
      id: 3,
      username: "RecyclePro",
      content: "Tip of the day: Rinse your recyclables! Food residue can contaminate entire batches of recycling. A quick rinse makes a big difference!",
      likes: 32,
      comments: 3,
      timeAgo: "Yesterday",
    },
    {
      id: 4,
      username: "MusicLover",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      content: "Check out this amazing playlist I discovered on GreenLoop - 'Forest Meditation' is the perfect soundtrack for my morning yoga practice! 🎵🌿",
      likes: 15,
      comments: 2,
      timeAgo: "Yesterday",
    },
    {
      id: 5,
      username: "EarthFirst",
      content: "Just calculated that I've saved approximately 20kg of CO2 emissions this month by biking to work instead of driving! Small changes add up. How are you reducing your carbon footprint?",
      likes: 41,
      comments: 14,
      timeAgo: "2 days ago",
    },
  ];

  return (
    <Layout>
      <div className="container py-8">
        <SectionHeading
          title="Community Forum"
          subtitle="Connect with fellow eco-enthusiasts, share tips, and get inspired"
        />

        <Tabs defaultValue="feed" className="mb-8">
          <TabsList>
            <TabsTrigger value="feed">Community Feed</TabsTrigger>
            <TabsTrigger value="eco-tips">Eco Tips</TabsTrigger>
            <TabsTrigger value="music">Music Discussions</TabsTrigger>
            <TabsTrigger value="my-posts">My Posts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="eco-card p-6">
                  <h3 className="text-base font-medium mb-4">Create a Post</h3>
                  <Textarea 
                    placeholder="Share your eco-friendly tips, achievements, or questions..."
                    className="mb-4"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Add Photo
                      </Button>
                    </div>
                    <Button>Post</Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {communityPosts.map((post) => (
                    <CommunityPostCard 
                      key={post.id}
                      username={post.username}
                      userAvatar={post.userAvatar}
                      content={post.content}
                      image={post.image}
                      likes={post.likes}
                      comments={post.comments}
                      timeAgo={post.timeAgo}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search community posts..." 
                    className="pl-10"
                  />
                </div>
                
                <div className="eco-card p-6">
                  <h3 className="text-base font-medium mb-4">Popular Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">#PlasticFree</Button>
                    <Button variant="outline" size="sm">#RecyclingTips</Button>
                    <Button variant="outline" size="sm">#SustainableMusic</Button>
                    <Button variant="outline" size="sm">#GreenLiving</Button>
                    <Button variant="outline" size="sm">#ZeroWaste</Button>
                    <Button variant="outline" size="sm">#EcoChallenge</Button>
                  </div>
                </div>
                
                <div className="eco-card p-6">
                  <h3 className="text-base font-medium mb-4">Community Guidelines</h3>
                  <ul className="leaf-bullet space-y-2 text-sm text-muted-foreground">
                    <li>Be respectful and supportive of others</li>
                    <li>Share fact-based information about sustainability</li>
                    <li>Keep discussions relevant to eco-friendly topics</li>
                    <li>Cite sources when sharing research or statistics</li>
                    <li>No promotional content unrelated to sustainability</li>
                  </ul>
                </div>
                
                <div className="eco-card p-6">
                  <h3 className="text-base font-medium mb-4">Active Members</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
                        <img 
                          src="https://images.unsplash.com/photo-1580489944761-15a19d654956" 
                          alt="User avatar" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">EcoWarrior</p>
                        <p className="text-xs text-muted-foreground">427 EcoPoints</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" 
                          alt="User avatar" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">GreenThumb</p>
                        <p className="text-xs text-muted-foreground">356 EcoPoints</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
                        <img 
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80" 
                          alt="User avatar" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">MusicLover</p>
                        <p className="text-xs text-muted-foreground">318 EcoPoints</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="eco-tips" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <CommunityPostCard 
                  username="RecyclePro"
                  content="Tip of the day: Rinse your recyclables! Food residue can contaminate entire batches of recycling. A quick rinse makes a big difference!"
                  likes={32}
                  comments={3}
                  timeAgo="Yesterday"
                />
                
                <CommunityPostCard 
                  username="ZeroWasteChef"
                  userAvatar="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04"
                  content="Here's a simple recipe for DIY all-purpose cleaner: Mix equal parts water and white vinegar, add a few drops of essential oil (I like lemon or tea tree). Works great on most surfaces and saves plastic bottles!"
                  image="https://images.unsplash.com/photo-1600585152220-90363fe7e115"
                  likes={27}
                  comments={8}
                  timeAgo="2 days ago"
                />
                
                <CommunityPostCard 
                  username="EcoMinimalist"
                  userAvatar="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
                  content="Upcycling idea: Turn old t-shirts into reusable produce bags! Just cut off the sleeves and bottom hem, sew the bottom closed, and add a drawstring at the top. So easy and practical for grocery shopping!"
                  likes={19}
                  comments={5}
                  timeAgo="3 days ago"
                />
              </div>
              
              <div className="space-y-6">
                <div className="eco-card p-6">
                  <h3 className="text-base font-medium mb-4">Popular Eco Tips</h3>
                  <ul className="leaf-bullet space-y-2 text-sm">
                    <li>Use a reusable water bottle instead of buying plastic</li>
                    <li>Bring your own shopping bags to the grocery store</li>
                    <li>Try a bamboo toothbrush instead of plastic</li>
                    <li>Consider composting food scraps to reduce waste</li>
                    <li>Use cloth napkins instead of paper towels</li>
                  </ul>
                </div>
                
                <div className="eco-card p-6">
                  <h3 className="text-base font-medium mb-4">Contribute Your Tips</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share your best eco-friendly tips and help our community grow more sustainable!
                  </p>
                  <Button className="w-full">Share a Tip</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="music" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <CommunityPostCard 
                  username="MusicLover"
                  userAvatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
                  content="Check out this amazing playlist I discovered on GreenLoop - 'Forest Meditation' is the perfect soundtrack for my morning yoga practice! 🎵🌿"
                  likes={15}
                  comments={2}
                  timeAgo="Yesterday"
                />
                
                <CommunityPostCard 
                  username="AcousticFan"
                  userAvatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                  content="I've been really enjoying the 'Eco Artists' playlist. It's so inspiring to hear music from artists who are committed to environmental causes. Any other playlists with similar vibes you'd recommend?"
                  likes={12}
                  comments={6}
                  timeAgo="2 days ago"
                />
                
                <CommunityPostCard 
                  username="NatureTunes"
                  content="Fun fact: Studies show that listening to nature sounds can reduce stress and improve focus! Perfect for when you're working on sustainable DIY projects."
                  likes={24}
                  comments={3}
                  timeAgo="3 days ago"
                />
              </div>
              
              <div className="space-y-6">
                <div className="eco-card p-6">
                  <h3 className="text-base font-medium mb-4">Popular Playlists</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"  
                          alt="Playlist cover" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Nature Sounds</p>
                        <p className="text-xs text-muted-foreground">12 tracks</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1470115636492-6d2b56f9146d"  
                          alt="Playlist cover" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Green Vibes</p>
                        <p className="text-xs text-muted-foreground">15 tracks</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4"  
                          alt="Playlist cover" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Eco Artists</p>
                        <p className="text-xs text-muted-foreground">18 tracks</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="eco-card p-6">
                  <h3 className="text-base font-medium mb-4">Music Discussion Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">#EcoArtists</Button>
                    <Button variant="outline" size="sm">#NatureSounds</Button>
                    <Button variant="outline" size="sm">#SustainableFestivals</Button>
                    <Button variant="outline" size="sm">#EarthMusic</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="my-posts" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">You haven't created any posts yet</h3>
              <p className="text-muted-foreground mb-6">
                Share your eco-tips, recycling achievements, or music recommendations with the community.
              </p>
              <Button>Create Your First Post</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
