
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/common/SectionHeading";
import { Leaf, Music, BarChart2, Users, ChevronRight, Upload, Play, Award } from "lucide-react";
import PlaylistCard from "@/components/music/PlaylistCard";
import TrackCard from "@/components/music/TrackCard";
import ChallengeCard from "@/components/eco/ChallengeCard";
import EcoStatsCard from "@/components/common/EcoStatsCard";
import MusicPlayer from "@/components/music/MusicPlayer";

export default function Index() {
  // Sample featured playlists for the homepage
  const featuredPlaylists = [
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
  ];

  // Sample featured tracks
  const featuredTracks = [
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
  ];

  // Sample featured challenges
  const featuredChallenges = [
    {
      id: 1,
      title: "Plastic-Free Week",
      description: "Avoid single-use plastics for one week and log your alternatives.",
      image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f",
      daysLeft: 5,
      participants: 243,
      points: 50,
    },
    {
      id: 2,
      title: "Reuse Challenge",
      description: "Repurpose 3 items you would normally throw away.",
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9",
      daysLeft: 3,
      participants: 187,
      points: 30,
      isJoined: true,
      progress: 67,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-pattern py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Listen to Music,{" "}
              <span className="bg-gradient-eco bg-clip-text text-transparent">
                Save the Planet
              </span>
            </h1>
            <p className="mb-8 text-muted-foreground md:text-lg">
              GreenLoop combines sustainable living with music streaming.
              Track your eco-impact, participate in green challenges,
              and discover new music while making a difference.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild className="bg-gradient-eco">
                <Link to="/music">
                  <Music className="mr-2 h-5 w-5" />
                  Start Listening
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/recycle">
                  <Leaf className="mr-2 h-5 w-5" />
                  Log Recycling
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 h-64 w-64 animate-spin-slow opacity-10">
          <div className="absolute inset-0 rounded-full border-8 border-dashed border-green-400"></div>
        </div>
        <div className="absolute -bottom-8 -left-8 h-32 w-32 animate-pulse-soft opacity-10">
          <div className="absolute inset-0 rounded-full bg-green-400"></div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <SectionHeading 
            title="How GreenLoop Works"
            subtitle="Three simple steps to start making a difference while enjoying music"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="eco-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Music className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Stream Music</h3>
              <p className="text-muted-foreground">
                Listen to royalty-free and indie music. Create playlists and discover new artists.
              </p>
            </div>
            
            <div className="eco-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Upload className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Log Recycling</h3>
              <p className="text-muted-foreground">
                Upload photos of your recycled items and track your sustainable habits.
              </p>
            </div>
            
            <div className="eco-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Award className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Earn Rewards</h3>
              <p className="text-muted-foreground">
                Get EcoPoints for your green activities and unlock exclusive content and rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Music */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <SectionHeading 
              title="Featured Playlists"
              subtitle="Curated collections to enhance your green lifestyle"
              align="left"
              className="mb-0"
            />
            <Button variant="link" asChild>
              <Link to="/music" className="flex items-center text-primary">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredPlaylists.map((playlist) => (
              <PlaylistCard 
                key={playlist.id}
                title={playlist.title}
                description={playlist.description}
                image={playlist.image}
                trackCount={playlist.trackCount}
              />
            ))}
          </div>
          
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <SectionHeading 
                title="Popular Tracks"
                subtitle="Most listened eco-friendly music"
                align="left"
                className="mb-0"
              />
              <Button variant="link" asChild>
                <Link to="/music" className="flex items-center text-primary">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-3">
              {featuredTracks.map((track) => (
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
          
          <div className="mt-8">
            <MusicPlayer />
          </div>
        </div>
      </section>

      {/* Eco Challenges */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <SectionHeading 
              title="Active Challenges"
              subtitle="Join community challenges to boost your impact"
              align="left"
              className="mb-0"
            />
            <Button variant="link" asChild>
              <Link to="/challenges" className="flex items-center text-primary">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredChallenges.map((challenge) => (
              <ChallengeCard 
                key={challenge.id}
                title={challenge.title}
                description={challenge.description}
                image={challenge.image}
                daysLeft={challenge.daysLeft}
                participants={challenge.participants}
                points={challenge.points}
                isJoined={challenge.isJoined}
                progress={challenge.progress}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats & Testimonials */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <SectionHeading 
                title="Your Impact Matters"
                subtitle="Track your eco-footprint and see the difference you're making"
                align="left"
              />
              
              <EcoStatsCard />
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Join the movement:</h4>
                <ul className="leaf-bullet space-y-2">
                  <li>Over 10,000 users working together for a greener planet</li>
                  <li>50,000+ recycled items logged through our platform</li>
                  <li>500+ trees planted through user EcoPoints donations</li>
                  <li>1,500+ hours of eco-friendly music streamed daily</li>
                </ul>
                
                <div className="pt-4">
                  <Button asChild className="bg-gradient-eco">
                    <Link to="/register">
                      Join GreenLoop Today
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="eco-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956" 
                      alt="User avatar" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Sarah K.</p>
                    <p className="text-sm text-muted-foreground">EcoPoints: 427</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "I love how GreenLoop makes recycling fun! The music selection keeps me motivated while I sort my recyclables, and seeing my impact grow is really rewarding."
                </p>
              </div>
              
              <div className="eco-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" 
                      alt="User avatar" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Michael T.</p>
                    <p className="text-sm text-muted-foreground">EcoPoints: 318</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "The challenges keep me engaged and I've learned so much from the community. Plus, I discovered some amazing indie artists through the Green Vibes playlists!"
                </p>
              </div>
              
              <div className="eco-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80" 
                      alt="User avatar" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Leila H.</p>
                    <p className="text-sm text-muted-foreground">EcoPoints: 573</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "I've reduced my waste by 40% since joining GreenLoop! The tracking features help me stay accountable, and I've made great friends in the community forums."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-eco text-white">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Make a Difference?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-white/80">
            Join thousands of users who are combining their love for music with 
            environmental sustainability. Start your GreenLoop journey today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/register">
                Create Account
              </Link>
            </Button>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/music">
                <Play className="mr-2 h-5 w-5" />
                Start Listening
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mini player for mobile */}
      <div className="md:hidden">
        <MusicPlayer minimized />
      </div>
    </Layout>
  );
}
