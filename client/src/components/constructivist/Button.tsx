import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  children: React.ReactNode;
}

export const ConstructivistButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", children, className, ...props }, ref) => {
    const baseStyles = "text-sm tracking-[0.15em] uppercase transition-all duration-200 group";
    
    const variants = {
      primary: "bg-[#CC2936] text-white px-6 py-3 hover:scale-[1.02] hover:rotate-[2deg] flex items-center gap-3",
      secondary: "border-2 border-[#1E5AA8] text-[#1E5AA8] px-6 py-3 hover:bg-[#1E5AA8] hover:text-white",
      accent: "text-[#CC2936] flex items-center gap-2",
      ghost: "text-[#0A0A0A] relative hover:text-[#CC2936]",
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
        {...props}
      >
        {variant === "accent" && (
          <svg width="12" height="10" viewBox="0 0 12 10" className="fill-current">
            <polygon points="0,0 12,5 0,10" />
          </svg>
        )}
        
        {children}
        
        {variant === "primary" && (
          <svg 
            width="16" height="12" viewBox="0 0 16 12" 
            className="fill-current transition-transform group-hover:translate-x-1"
          >
            <polygon points="0,0 0,12 16,6" />
          </svg>
        )}
        
        {variant === "ghost" && (
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#CC2936] transition-all group-hover:w-full" />
        )}
      </button>
    );
  }
);

ConstructivistButton.displayName = "ConstructivistButton";
