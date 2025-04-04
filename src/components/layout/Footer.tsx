
import { Link } from "react-router-dom";
import Logo from "@/components/common/Logo";
import { Leaf, Package, RefreshCw, Gift, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border/40 py-12">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs">
            A sustainable marketplace promoting reuse, exchange, and giveaway of items to support our environment.
          </p>
          <p className="text-xs text-muted-foreground">© 2025 GreenLoop. All rights reserved.</p>
        </div>
        
        <div>
          <h3 className="text-base font-medium mb-4">Marketplace</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/marketplace?type=sell" className="hover:text-primary flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Items for Sale
              </Link>
            </li>
            <li>
              <Link to="/marketplace?type=exchange" className="hover:text-primary flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Exchange Items
              </Link>
            </li>
            <li>
              <Link to="/marketplace?type=giveaway" className="hover:text-primary flex items-center">
                <Gift className="h-4 w-4 mr-2" />
                Free Giveaways
              </Link>
            </li>
            <li>
              <Link to="/marketplace/post" className="hover:text-primary">
                Post an Item
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-base font-medium mb-4">Resources</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/reuse-ideas" className="hover:text-primary">
                Reuse Ideas
              </Link>
            </li>
            <li>
              <Link to="/challenges" className="hover:text-primary">
                Eco Challenges
              </Link>
            </li>
            <li>
              <Link to="/impact" className="hover:text-primary">
                Environmental Impact
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-primary">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-primary">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-base font-medium mb-4">Connect</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/community" className="hover:text-primary">
                Community Forum
              </Link>
            </li>
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
