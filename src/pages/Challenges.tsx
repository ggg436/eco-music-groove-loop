
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import ChallengeCard from "@/components/eco/ChallengeCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Challenges() {
  // Sample challenges
  const activeChallenges = [
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
    {
      id: 3,
      title: "Zero Waste Meal",
      description: "Prepare meals with zero packaging waste for three days.",
      image: "https://images.unsplash.com/photo-1556909114-44e3123e3d42",
      daysLeft: 7,
      participants: 156,
      points: 35,
    },
    {
      id: 4,
      title: "Clean Up Your Stream",
      description: "Join a local waterway cleanup or organize a mini cleanup.",
      image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5",
      daysLeft: 10,
      participants: 89,
      points: 60,
    },
    {
      id: 5,
      title: "Green Transportation",
      description: "Use public transport, bike, or walk instead of driving for a week.",
      image: "https://images.unsplash.com/photo-1519750783826-e2420f4d687f",
      daysLeft: 6,
      participants: 215,
      points: 40,
      isJoined: true,
      progress: 30,
    },
    {
      id: 6,
      title: "Energy Saver",
      description: "Reduce your energy consumption by 10% this week.",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e",
      daysLeft: 4,
      participants: 173,
      points: 45,
    },
  ];

  const upcomingChallenges = [
    {
      id: 7,
      title: "Plant a Tree",
      description: "Plant a tree or contribute to a tree-planting initiative.",
      image: "https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0",
      daysLeft: 14,
      participants: 78,
      points: 70,
    },
    {
      id: 8,
      title: "Compost Start-Up",
      description: "Start a compost bin and log your progress for two weeks.",
      image: "https://images.unsplash.com/photo-1580974852861-c381510bc98a",
      daysLeft: 12,
      participants: 56,
      points: 55,
    },
  ];

  const completedChallenges = [
    {
      id: 9,
      title: "Digital Cleanup",
      description: "Clean up your digital storage to reduce energy consumption.",
      image: "https://images.unsplash.com/photo-1640552435350-a6c776af8f0f",
      daysLeft: 0,
      participants: 203,
      points: 20,
      isJoined: true,
      progress: 100,
    },
  ];

  return (
    <Layout>
      <div className="container py-8">
        <SectionHeading
          title="Eco Challenges"
          subtitle="Join challenges to boost your eco-impact and earn rewards"
        />

        <Tabs defaultValue="active" className="mb-8">
          <TabsList>
            <TabsTrigger value="active">Active Challenges</TabsTrigger>
            <TabsTrigger value="joined">My Challenges</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeChallenges.map((challenge) => (
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
          </TabsContent>
          
          <TabsContent value="joined" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeChallenges
                .filter(challenge => challenge.isJoined)
                .map((challenge) => (
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
                ))
              }
              {completedChallenges
                .filter(challenge => challenge.isJoined)
                .map((challenge) => (
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
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingChallenges.map((challenge) => (
                <ChallengeCard 
                  key={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  image={challenge.image}
                  daysLeft={challenge.daysLeft}
                  participants={challenge.participants}
                  points={challenge.points}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedChallenges.map((challenge) => (
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
