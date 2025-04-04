
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/common/SectionHeading";
import { Leaf, BarChart2, Users, ChevronRight, Upload, Award } from "lucide-react";
import ChallengeCard from "@/components/eco/ChallengeCard";
import EcoStatsCard from "@/components/common/EcoStatsCard";

export default function Index() {
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
              Eco-Friendly Living,{" "}
              <span className="bg-gradient-eco bg-clip-text text-transparent">
                Save the Planet
              </span>
            </h1>
            <p className="mb-8 text-muted-foreground md:text-lg">
              GreenLoop promotes sustainable living through community engagement.
              Track your eco-impact, participate in green challenges,
              and make a difference for our planet.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild className="bg-gradient-eco">
                <Link to="/recycle">
                  <Leaf className="mr-2 h-5 w-5" />
                  Log Recycling
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/challenges">
                  <Award className="mr-2 h-5 w-5" />
                  Join Challenges
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
            subtitle="Three simple steps to start making a difference"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="eco-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Leaf className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Track Recycling</h3>
              <p className="text-muted-foreground">
                Log your recycling activities to track your environmental impact.
              </p>
            </div>
            
            <div className="eco-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Upload className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Log Eco Activities</h3>
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

      {/* Eco Challenges */}
      <section className="py-16">
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
      <section className="py-16 bg-secondary/50">
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
                  <li>Thousands of participants in our eco challenges</li>
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
                  "I love how GreenLoop makes recycling fun! Seeing my impact grow is really rewarding, and the challenges keep me motivated."
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
                  "The challenges keep me engaged and I've learned so much from the community. My recycling habits have improved tremendously!"
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
            Join thousands of users who are dedicated to environmental 
            sustainability. Start your GreenLoop journey today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/register">
                Create Account
              </Link>
            </Button>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/challenges">
                <Award className="mr-2 h-5 w-5" />
                Join Challenges
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
