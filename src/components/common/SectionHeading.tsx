
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

export default function SectionHeading({ 
  title, 
  subtitle, 
  className,
  align = "center" 
}: SectionHeadingProps) {
  return (
    <div className={cn(
      "space-y-2 mb-8",
      align === "center" && "text-center",
      align === "right" && "text-right",
      className
    )}>
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
