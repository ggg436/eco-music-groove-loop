
import { Link } from "react-router-dom";
import { Leaf, Package, Users, User, RefreshCw, Gift, MapPin, LogIn, LogOut, MessageCircle, Flower } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link 
              to="/marketplace" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Marketplace
            </Link>
            <Link 
              to="/reuse-ideas" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Reuse Ideas
            </Link>
            <Link 
              to="/eco-map" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Eco Map
            </Link>
            <Link 
              to="/challenges" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Eco Challenges
            </Link>
            <Link 
              to="/community" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Community
            </Link>
            <Link 
              to="/plant-identifier" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Plantist
            </Link>
            <Link 
              to="/contact-us" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {profile && (
                <div className="hidden md:flex relative rounded-full bg-secondary px-3 py-1.5 text-sm text-muted-foreground items-center">
                  <Leaf className="h-4 w-4 text-green-600 mr-1.5" />
                  <span className="text-sm font-medium">{profile.eco_points || 0}</span>
                  <span className="ml-1 text-xs">EcoPoints</span>
                </div>
              )}
              
              <Link to="/chats">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageCircle className="h-5 w-5" />
                  <span className="sr-only">Messages</span>
                </Button>
              </Link>
              
              <Link to="/plant-identifier">
                <Button variant="ghost" size="icon" className="relative">
                  <Flower className="h-5 w-5" />
                  <span className="sr-only">Plantist</span>
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Profile</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm" className="bg-gradient-eco">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
