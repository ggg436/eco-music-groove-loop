
import { Link } from "react-router-dom";
import Logo from "@/components/common/Logo";
import { Leaf, Music, BarChart2, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border/40 py-12">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs">
            Promoting eco-conscious behavior through sustainable music streaming and community engagement.
          </p>
          <p className="text-xs text-muted-foreground">© 2025 GreenLoop. All rights reserved.</p>
        </div>
        
        <div>
          <h3 className="text-base font-medium mb-4">Explore</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/music" className="hover:text-primary">Music Stream</Link>
            </li>
            <li>
              <Link to="/recycle" className="hover:text-primary">Recycle Log</Link>
            </li>
            <li>
              <Link to="/challenges" className="hover:text-primary">Eco Challenges</Link>
            </li>
            <li>
              <Link to="/community" className="hover:text-primary">Community Forum</Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-base font-medium mb-4">Resources</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/eco-guide" className="hover:text-primary">Sustainable Living Guide</Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-primary">FAQ</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-base font-medium mb-4">Connect</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:text-primary">Instagram</a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">Twitter</a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">Facebook</a>
            </li>
            <li>
              <a href="mailto:contact@greenloop.eco" className="hover:text-primary">contact@greenloop.eco</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
