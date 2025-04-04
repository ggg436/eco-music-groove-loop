
import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-eco text-white">
        <Leaf className="h-5 w-5" />
      </div>
      <div className="flex flex-col items-start leading-none">
        <span className="text-xl font-bold tracking-tight">GreenLoop</span>
        <span className="text-xs text-foreground/60">Sustainable Music</span>
      </div>
    </Link>
  );
}
