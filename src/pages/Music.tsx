
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import MusicPlayer from "@/components/music/MusicPlayer";
import PlaylistCard from "@/components/music/PlaylistCard";
import TrackCard from "@/components/music/TrackCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Music() {
  // Sample playlists
  const playlists = [
    {
      id: 1,
      title: "Nature Sounds",
      description: "Relaxing sounds from nature to help you focus and destress.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      trackCount: 12,
    },
    {
      id: 2,
      title: "Eco Artists",
      description: "Music from artists committed to environmental causes.",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
      trackCount: 18,
    },
    {
      id: 3,
      title: "Green Vibes",
      description: "Upbeat tunes to inspire your recycling routine.",
      image: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d",
      trackCount: 15,
    },
    {
      id: 4,
      title: "Recycling Rhythms",
      description: "The perfect soundtrack for sorting your recyclables.",
      image: "https://images.unsplash.com/photo-1534619039567-7notexts-unsplash.com/photo-1506157786151-b8491531f063",
      trackCount: 10,
    },
    {
      id: 5,
      title: "Sustainable Sounds",
      description: "Carefully curated tracks from eco-conscious artists.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      trackCount: 14,
    },
    {
      id: 6,
      title: "Forest Meditation",
      description: "Connect with nature through these ambient forest sounds.",
      image: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1",
      trackCount: 8,
    },
  ];

  // Sample tracks
  const tracks = [
    {
      id: 1,
      title: "Forest Whispers",
      artist: "NatureTone",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b",
      duration: "3:42",
      ecoFriendly: true,
    },
    {
      id: 2,
      title: "Ocean Waves",
      artist: "SoundScape",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      duration: "4:17",
      ecoFriendly: true,
    },
    {
      id: 3,
      title: "Mountain High",
      artist: "EcoBeats",
      image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606",
      duration: "3:28",
      ecoFriendly: false,
    },
    {
      id: 4,
      title: "Rainforest Rhythm",
      artist: "Green Harmony",
      image: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1",
      duration: "5:12",
      ecoFriendly: true,
    },
    {
      id: 5,
      title: "Recycled Beats",
      artist: "EarthTones",
      image: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0",
      duration: "3:05",
      ecoFriendly: true,
    },
    {
      id: 6,
      title: "Wind Chimes",
      artist: "Nature's Symphony",
      image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe",
      duration: "4:32",
      ecoFriendly: false,
    },
    {
      id: 7,
      title: "Sunrise Melody",
      artist: "Daybreak",
      image: "https://images.unsplash.com/photo-1504882981353-1a47bfda529a",
      duration: "3:18",
      ecoFriendly: true,
    },
    {
      id: 8,
      title: "Waterfall",
      artist: "Cascade",
      image: "https://images.unsplash.com/photo-1513125370-3a44a89bd8f1",
      duration: "6:21",
      ecoFriendly: true,
    },
  ];

  return (
    <Layout>
      <div className="container py-8">
        <SectionHeading
          title="Music Stream"
          subtitle="Discover and listen to eco-friendly music"
        />

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search tracks, artists, or playlists..." 
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Music</TabsTrigger>
            <TabsTrigger value="eco">Eco-Friendly</TabsTrigger>
            <TabsTrigger value="playlists">My Playlists</TabsTrigger>
            <TabsTrigger value="liked">Liked Songs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-8 mt-6">
            <div>
              <h3 className="text-xl font-medium mb-4">Featured Playlists</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {playlists.slice(0, 4).map((playlist) => (
                  <PlaylistCard 
                    key={playlist.id}
                    title={playlist.title}
                    description={playlist.description}
                    image={playlist.image}
                    trackCount={playlist.trackCount}
                  />
                ))}
              </div>
              
              <div className="mt-4 text-right">
                <Button variant="link" className="text-primary">
                  View All Playlists
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Popular Tracks</h3>
              <div className="space-y-3">
                {tracks.map((track) => (
                  <TrackCard 
                    key={track.id}
                    title={track.title}
                    artist={track.artist}
                    image={track.image}
                    duration={track.duration}
                    ecoFriendly={track.ecoFriendly}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="eco" className="space-y-8 mt-6">
            <div>
              <h3 className="text-xl font-medium mb-4">Eco-Friendly Tracks</h3>
              <div className="space-y-3">
                {tracks
                  .filter(track => track.ecoFriendly)
                  .map((track) => (
                    <TrackCard 
                      key={track.id}
                      title={track.title}
                      artist={track.artist}
                      image={track.image}
                      duration={track.duration}
                      ecoFriendly={track.ecoFriendly}
                    />
                  ))
                }
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="playlists" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {playlists.map((playlist) => (
                <PlaylistCard 
                  key={playlist.id}
                  title={playlist.title}
                  description={playlist.description}
                  image={playlist.image}
                  trackCount={playlist.trackCount}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="liked" className="mt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                You haven't liked any songs yet. Start listening and heart the tracks you love!
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <MusicPlayer className="mt-8" />
      </div>
    </Layout>
  );
}
