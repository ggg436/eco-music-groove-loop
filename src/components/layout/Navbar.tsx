
import { Link } from "react-router-dom";
import { Leaf, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/common/Logo";

export default function Navbar() {
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
              to="/recycle" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Recycle Log
            </Link>
            <Link 
              to="/challenges" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Challenges
            </Link>
            <Link 
              to="/community" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Community
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative rounded-full bg-secondary px-3 py-1.5 text-sm text-muted-foreground items-center">
            <Leaf className="h-4 w-4 text-green-600 mr-1.5" />
            <span className="text-sm font-medium">238</span>
            <span className="ml-1 text-xs">EcoPoints</span>
          </div>
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
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
