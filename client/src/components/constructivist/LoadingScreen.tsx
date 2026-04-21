import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ConstructivistGears, 
  SuprematistLoader, 
  FactoryCogs 
} from "../experiments/AnimationsTab";

type LoadingVariant = "gears" | "suprematist" | "factory" | "minimal";

interface LoadingScreenProps {
  variant?: LoadingVariant;
  onComplete?: () => void;
  duration?: number; // ms before fade out
}

const loadingTexts = ["LOADING", "CONSTRUCTING", "BUILDING"];

export function LoadingScreen({ 
  variant = "gears", 
  onComplete,
  duration = 2500 
}: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [textIndex, setTextIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  
  // Cycle loading text for gears/factory variants
  useEffect(() => {
    if (variant !== "gears" && variant !== "factory") return;
    const interval = setInterval(() => {
      setTextIndex(i => (i + 1) % loadingTexts.length);
    }, 800);
    return () => clearInterval(interval);
  }, [variant]);
  
  // Stagger letter reveal for suprematist
  useEffect(() => {
    if (variant !== "suprematist") return;
    const name = "KENBUI";
    const interval = setInterval(() => {
      setLetterIndex(i => i < name.length ? i + 1 : i);
    }, 150);
    return () => clearInterval(interval);
  }, [variant]);
  
  // Fade out after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 500);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);
  
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-12 transition-opacity duration-500",
        "bg-background",
        !isVisible && "opacity-0 pointer-events-none"
      )}
    >
      <div className="transform scale-[2] origin-center">
        {variant === "gears" && <ConstructivistGears isPlaying={true} />}
        {variant === "suprematist" && <SuprematistLoader isPlaying={true} />}
        {variant === "factory" && <FactoryCogs isPlaying={true} />}
        {variant === "minimal" && <MinimalWedge />}
      </div>
      
      <div 
        className="uppercase tracking-[0.4em] text-sm text-foreground"
        style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
      >
        {(variant === "gears" || variant === "factory") && (
          <span className="animate-pulse">
            {variant === "gears" ? loadingTexts[textIndex] : "ASSEMBLING..."}
          </span>
        )}
        {variant === "suprematist" && (
          <span>
            {"KENBUI".split("").map((letter, i) => (
              <span
                key={i}
                className={cn(
                  "inline-block transition-opacity duration-300",
                  i < letterIndex ? "opacity-100" : "opacity-0"
                )}
              >
                {letter}
                {i < 5 && <span className="mx-1">·</span>}
              </span>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

function MinimalWedge() {
  return (
    <svg viewBox="0 0 100 60" className="w-24 h-16">
      <polygon 
        points="0,10 0,50 80,30" 
        className="animate-pulse fill-secondary"
      />
    </svg>
  );
}
