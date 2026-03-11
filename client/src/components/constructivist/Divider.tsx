import { cn } from "@/lib/utils";

interface DividerProps {
  variant?: "line" | "shapes" | "diagonal";
  className?: string;
}

export function ConstructivistDivider({ variant = "line", className }: DividerProps) {
  if (variant === "line") {
    return (
      <div className={cn("flex items-center gap-4 my-8", className)}>
        <div className="flex-1 h-0.5 bg-[#0A0A0A]" />
        <svg width="12" height="12" viewBox="0 0 12 12">
          <polygon points="6,0 12,12 0,12" fill="#CC2936" />
        </svg>
        <div className="flex-1 h-0.5 bg-[#0A0A0A]" />
      </div>
    );
  }
  
  if (variant === "shapes") {
    return (
      <div className={cn("flex items-center justify-center gap-6 my-8", className)}>
        <span className="text-xl text-[#1E5AA8]">●</span>
        <span className="text-xl text-[#CC2936]">▲</span>
        <span className="text-xl text-[#F4C430]">■</span>
      </div>
    );
  }
  
  if (variant === "diagonal") {
    return (
      <div 
        className={cn("h-8 bg-[#CC2936] my-8", className)}
        style={{ clipPath: "polygon(0 50%, 100% 0, 100% 50%, 0 100%)" }}
      />
    );
  }
  
  return null;
}
