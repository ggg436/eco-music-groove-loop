
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import ReuseIdeas from "./pages/ReuseIdeas";
import Challenges from "./pages/Challenges";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import EcoMap from "./pages/EcoMap";
import ContactUs from "./pages/ContactUs";
import ClerkAuth from "./pages/ClerkAuth";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import Chats from "./pages/Chats";
import PlantIdentifier from "./pages/PlantIdentifier";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <ClerkAuth />
    </SignedOut>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/reuse-ideas" element={<ReuseIdeas />} />
          <Route path="/eco-map" element={<EcoMap />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/auth" element={<ClerkAuth />} />
          <Route path="/plant-identifier" element={
            <ProtectedRoute>
              <PlantIdentifier />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/chats" element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          } />
          <Route path="/chat/:conversationId" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
