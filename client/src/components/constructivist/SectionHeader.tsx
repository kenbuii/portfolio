import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  variant?: "diagonal" | "vertical" | "block";
  className?: string;
}

export function SectionHeader({ title, variant = "diagonal", className }: SectionHeaderProps) {
  if (variant === "diagonal") {
    return (
      <header 
        className={cn("bg-[#0A0A0A] py-12 px-16", className)}
        style={{ clipPath: "polygon(0 15%, 100% 0, 100% 85%, 0 100%)" }}
      >
        <h1 
          className="text-5xl md:text-7xl tracking-[0.2em] text-[#F5F0E6]"
          style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
        >
          {title.split("").join(" ")}
        </h1>
      </header>
    );
  }
  
  if (variant === "vertical") {
    return (
      <header className={cn("flex items-start gap-4", className)}>
        <div 
          className="text-xl tracking-[0.3em] text-[#CC2936]"
          style={{ 
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            writingMode: "vertical-rl", 
            transform: "rotate(180deg)" 
          }}
        >
          {title}
        </div>
        <div className="w-px h-32 bg-[#0A0A0A]" />
      </header>
    );
  }
  
  if (variant === "block") {
    return (
      <header className={cn("inline-block bg-[#CC2936] px-8 py-4", className)}>
        <h1 
          className="text-3xl tracking-[0.15em] text-white"
          style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
        >
          {title}
        </h1>
      </header>
    );
  }
  
  return null;
}
