import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Play, RotateCcw } from "lucide-react";

type AnimationCategory = "page" | "scroll" | "hover" | "loading" | "hero";
type AnimationMood = "minimal" | "bouncy" | "cinematic" | "glitchy" | "organic";

interface AnimationVariant {
  id: string;
  name: string;
  description: string;
}

const categories: { id: AnimationCategory; name: string; variants: AnimationVariant[] }[] = [
  {
    id: "page",
    name: "Page Transitions",
    variants: [
      { id: "fade-slide", name: "Fade Slide", description: "Opacity + translateY, staggered elements" },
      { id: "curtain", name: "Curtain Wipe", description: "Colored div wipes across screen" },
      { id: "clip", name: "Clip Reveal", description: "clip-path circle expanding from center" },
      { id: "shutter", name: "Shutter Bars", description: "Horizontal bars slide open like blinds" },
      { id: "iris", name: "Iris Wipe", description: "Circular wipe from center outward" },
    ],
  },
  {
    id: "scroll",
    name: "Scroll Reveals",
    variants: [
      { id: "rise", name: "Subtle Rise", description: "Elements fade + rise 20px on scroll" },
      { id: "stagger", name: "Stagger Grid", description: "Grid items appear one-by-one" },
      { id: "parallax", name: "Parallax Float", description: "Layers move at different speeds" },
    ],
  },
  {
    id: "hover",
    name: "Hover Effects",
    variants: [
      { id: "underline", name: "Underline Draw", description: "Line draws under text on hover" },
      { id: "fill", name: "Background Fill", description: "Color fills from left on hover" },
      { id: "glitch", name: "Glitch Shake", description: "RGB split + shake effect" },
    ],
  },
  {
    id: "loading",
    name: "Loading States",
    variants: [
      { id: "skeleton", name: "Skeleton Shimmer", description: "Placeholder with gradient sweep" },
      { id: "bauhaus", name: "Bauhaus Spinner", description: "Circle/triangle/square rotating" },
      { id: "dots", name: "Typewriter Dots", description: "Loading... typed out" },
      { id: "soviet", name: "Soviet Star", description: "Bold red star, propaganda-style" },
      { id: "pulse", name: "Pulse Ring", description: "Expanding concentric circles" },
      { id: "orbit", name: "Orbital Dots", description: "Dots orbiting a center point" },
      { id: "redwedge", name: "Red Wedge", description: "El Lissitzky-inspired geometric thrust" },
      { id: "lissitzky", name: "Beat the Whites", description: "Full Lissitzky poster animation" },
      { id: "gears", name: "Constructivist Gears", description: "Interlocking geometric shapes rotating" },
      { id: "blocks", name: "Primary Blocks", description: "Bauhaus color blocks stacking" },
      { id: "rodchenko", name: "Rodchenko Lines", description: "Dynamic diagonal lines" },
      { id: "suprematist", name: "Suprematist", description: "Malevich-inspired floating shapes" },
      { id: "factory", name: "Factory Cogs", description: "Industrial gear mechanism" },
    ],
  },
  {
    id: "hero",
    name: "Hero Entrances",
    variants: [
      { id: "split", name: "Split Text", description: "Characters animate in individually" },
      { id: "mask", name: "Mask Reveal", description: "Text revealed by moving mask" },
      { id: "assemble", name: "Scattered Assemble", description: "Letters snap from scattered positions" },
    ],
  },
];

const moods: { id: AnimationMood; name: string; timing: string; easing: string }[] = [
  { id: "minimal", name: "Minimal", timing: "300ms", easing: "ease-out" },
  { id: "bouncy", name: "Bouncy", timing: "500ms", easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)" },
  { id: "cinematic", name: "Cinematic", timing: "1000ms", easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
  { id: "glitchy", name: "Glitchy", timing: "200ms", easing: "steps(8)" },
  { id: "organic", name: "Organic", timing: "700ms", easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
];

export default function AnimationsTab() {
  const [selectedCategory, setSelectedCategory] = useState<AnimationCategory>("loading");
  const [selectedVariant, setSelectedVariant] = useState("skeleton");
  const [selectedMood, setSelectedMood] = useState<AnimationMood>("minimal");
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const currentMood = moods.find(m => m.id === selectedMood);

  const handlePlay = () => {
    setIsPlaying(false);
    setAnimationKey(k => k + 1);
    setTimeout(() => setIsPlaying(true), 50);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setAnimationKey(k => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-primary">Animation Library</h2>
          <p className="text-sm text-muted-foreground">
            Explore different animation styles and timing presets
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handlePlay}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            <span className="text-sm font-medium">Play</span>
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setSelectedVariant(cat.variants[0].id);
              setIsPlaying(false);
              setAnimationKey(k => k + 1);
            }}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Variant selector */}
      {currentCategory && (
        <div className="flex gap-2 flex-wrap">
          {currentCategory.variants.map(variant => (
            <button
              key={variant.id}
              onClick={() => {
                setSelectedVariant(variant.id);
                setIsPlaying(false);
                setAnimationKey(k => k + 1);
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md border transition-all",
                selectedVariant === variant.id
                  ? "border-secondary bg-secondary/10 text-secondary"
                  : "border-border/50 hover:border-border"
              )}
            >
              {variant.name}
            </button>
          ))}
        </div>
      )}

      {/* Mood selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mood:</span>
        <div className="flex gap-1">
          {moods.map(mood => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full transition-all",
                selectedMood === mood.id
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {mood.name}
            </button>
          ))}
        </div>
      </div>

      {/* Animation preview */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/30 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-primary">
              {currentCategory?.variants.find(v => v.id === selectedVariant)?.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentCategory?.variants.find(v => v.id === selectedVariant)?.description}
            </p>
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            {currentMood?.timing} • {currentMood?.easing.slice(0, 20)}...
          </div>
        </div>
        
        <div className="p-8 min-h-[300px] bg-background/50 flex items-center justify-center">
          <AnimationPreview
            key={animationKey}
            category={selectedCategory}
            variant={selectedVariant}
            mood={selectedMood}
            isPlaying={isPlaying}
          />
        </div>
      </div>
    </div>
  );
}

// Animation Preview Component
function AnimationPreview({
  category,
  variant,
  mood,
  isPlaying,
}: {
  category: AnimationCategory;
  variant: string;
  mood: AnimationMood;
  isPlaying: boolean;
}) {
  const moodConfig = moods.find(m => m.id === mood)!;
  
  // Loading animations
  if (category === "loading") {
    if (variant === "skeleton") {
      return <SkeletonDemo isPlaying={isPlaying} />;
    }
    if (variant === "bauhaus") {
      return <BauhausSpinner isPlaying={isPlaying} mood={mood} />;
    }
    if (variant === "dots") {
      return <TypewriterDots isPlaying={isPlaying} />;
    }
    if (variant === "soviet") {
      return <SovietConstructivist isPlaying={isPlaying} />;
    }
    if (variant === "pulse") {
      return <PulseRingLoader isPlaying={isPlaying} />;
    }
    if (variant === "orbit") {
      return <OrbitalDotsLoader isPlaying={isPlaying} />;
    }
    if (variant === "redwedge") {
      return <RedWedgeLoader isPlaying={isPlaying} />;
    }
    if (variant === "lissitzky") {
      return <LissitzkyPoster isPlaying={isPlaying} />;
    }
    if (variant === "gears") {
      return <ConstructivistGears isPlaying={isPlaying} />;
    }
    if (variant === "blocks") {
      return <PrimaryBlocks isPlaying={isPlaying} />;
    }
    if (variant === "rodchenko") {
      return <RodchenkoLines isPlaying={isPlaying} />;
    }
    if (variant === "suprematist") {
      return <SuprematistLoader isPlaying={isPlaying} />;
    }
    if (variant === "factory") {
      return <FactoryCogs isPlaying={isPlaying} />;
    }
  }

  // Page transitions
  if (category === "page") {
    if (variant === "fade-slide") {
      return <FadeSlideDemo isPlaying={isPlaying} mood={mood} />;
    }
    if (variant === "curtain") {
      return <CurtainDemo isPlaying={isPlaying} mood={mood} />;
    }
    if (variant === "clip") {
      return <ClipRevealDemo isPlaying={isPlaying} mood={mood} />;
    }
    if (variant === "shutter") {
      return <ShutterBarsDemo isPlaying={isPlaying} mood={mood} />;
    }
    if (variant === "iris") {
      return <IrisWipeDemo isPlaying={isPlaying} mood={mood} />;
    }
  }

  // Scroll reveals
  if (category === "scroll") {
    if (variant === "rise") {
      return <RiseDemo isPlaying={isPlaying} mood={mood} />;
    }
    if (variant === "stagger") {
      return <StaggerGridDemo isPlaying={isPlaying} mood={mood} />;
    }
    if (variant === "parallax") {
      return <ParallaxDemo isPlaying={isPlaying} />;
    }
  }

  // Hover effects
  if (category === "hover") {
    return <HoverDemo variant={variant} />;
  }

  // Hero entrances
  if (category === "hero") {
    if (variant === "split") {
      return <SplitTextDemo isPlaying={isPlaying} mood={mood} />;
    }
    if (variant === "mask") {
      return <MaskRevealDemo isPlaying={isPlaying} mood={mood} />;
    }
    if (variant === "assemble") {
      return <AssembleDemo isPlaying={isPlaying} mood={mood} />;
    }
  }

  return <div className="text-muted-foreground">Select an animation</div>;
}

// Skeleton Demo
function SkeletonDemo({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={cn("space-y-4 w-full max-w-sm transition-opacity duration-300", !isPlaying && "opacity-0")}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted skeleton-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded skeleton-shimmer w-3/4" />
          <div className="h-3 bg-muted rounded skeleton-shimmer w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded skeleton-shimmer" />
        <div className="h-4 bg-muted rounded skeleton-shimmer w-5/6" />
        <div className="h-4 bg-muted rounded skeleton-shimmer w-4/6" />
      </div>
      <div className="h-24 bg-muted rounded-lg skeleton-shimmer" />
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, hsl(151 20% 85%) 25%, hsl(151 49% 25% / 0.1) 50%, hsl(151 20% 85%) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

// Bauhaus Spinner
function BauhausSpinner({ isPlaying, mood }: { isPlaying: boolean; mood: AnimationMood }) {
  const speed = mood === "cinematic" ? "3s" : mood === "minimal" ? "1s" : "2s";
  
  return (
    <div className={cn("transition-opacity duration-300", !isPlaying && "opacity-0")}>
      <div className="relative w-24 h-24" style={{ animation: isPlaying ? `spin ${speed} linear infinite` : "none" }}>
        {/* Circle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-secondary" />
        {/* Triangle */}
        <div 
          className="absolute bottom-0 left-0 w-0 h-0"
          style={{
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            borderBottom: "28px solid hsl(0, 75%, 50%)",
          }}
        />
        {/* Square */}
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary" />
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Typewriter Dots
function TypewriterDots({ isPlaying }: { isPlaying: boolean }) {
  const [text, setText] = useState("");
  const fullText = "Loading...";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isPlaying) {
      let i = 0;
      setText("");
      intervalRef.current = setInterval(() => {
        if (i < fullText.length) {
          setText(fullText.slice(0, i + 1));
          i++;
        } else {
          i = 0;
          setText("");
        }
      }, 150);
    } else {
      setText("");
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);
  
  return (
    <div className="font-mono text-2xl text-primary">
      {text}
      <span className={cn("inline-block w-3 h-6 bg-secondary ml-1", isPlaying ? "animate-pulse" : "opacity-0")} />
    </div>
  );
}

// Fade Slide Demo
function FadeSlideDemo({ isPlaying, mood }: { isPlaying: boolean; mood: AnimationMood }) {
  const duration = mood === "cinematic" ? 1000 : mood === "minimal" ? 300 : 500;
  
  return (
    <div className="space-y-4 w-full max-w-sm">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="h-4 bg-primary/80 rounded-sm"
          style={{
            transition: `all ${duration}ms ${mood === "bouncy" ? "cubic-bezier(0.68, -0.55, 0.265, 1.55)" : "ease-out"}`,
            transitionDelay: isPlaying ? `${i * 150}ms` : "0ms",
            opacity: isPlaying ? 1 : 0,
            transform: isPlaying ? "translateY(0)" : "translateY(20px)",
            width: `${100 - i * 20}%`,
          }}
        />
      ))}
    </div>
  );
}

// Curtain Demo
function CurtainDemo({ isPlaying, mood }: { isPlaying: boolean; mood: AnimationMood }) {
  const duration = mood === "cinematic" ? 1200 : mood === "minimal" ? 400 : 600;
  
  return (
    <div className="relative w-64 h-40 bg-muted rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Content Behind</span>
      </div>
      <div
        className="absolute inset-0 bg-primary"
        style={{
          transition: `transform ${duration}ms ${mood === "bouncy" ? "cubic-bezier(0.68, -0.55, 0.265, 1.55)" : "ease-out"}`,
          transform: isPlaying ? "translateX(100%)" : "translateX(0)",
        }}
      />
    </div>
  );
}

// Clip Reveal Demo
function ClipRevealDemo({ isPlaying, mood }: { isPlaying: boolean; mood: AnimationMood }) {
  const duration = mood === "cinematic" ? 1000 : mood === "minimal" ? 300 : 500;
  
  return (
    <div
      className="w-64 h-40 bg-secondary rounded-lg flex items-center justify-center"
      style={{
        transition: `clip-path ${duration}ms ${mood === "bouncy" ? "cubic-bezier(0.68, -0.55, 0.265, 1.55)" : "ease-out"}`,
        clipPath: isPlaying ? "circle(100% at 50% 50%)" : "circle(0% at 50% 50%)",
      }}
    >
      <span className="text-secondary-foreground font-bold">Revealed!</span>
    </div>
  );
}

// Rise Demo
function RiseDemo({ isPlaying, mood }: { isPlaying: boolean; mood: AnimationMood }) {
  const duration = mood === "cinematic" ? 800 : mood === "minimal" ? 300 : 500;
  
  return (
    <div className="space-y-3 w-full max-w-sm">
      {["First Item", "Second Item", "Third Item"].map((text, i) => (
        <div
          key={i}
          className="p-4 bg-card rounded-lg border border-border/50"
          style={{
            transition: `all ${duration}ms ease-out`,
            transitionDelay: isPlaying ? `${i * 100}ms` : "0ms",
            opacity: isPlaying ? 1 : 0,
            transform: isPlaying ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {text}
        </div>
      ))}
    </div>
  );
}

// Stagger Grid Demo
function StaggerGridDemo({ isPlaying, mood }: { isPlaying: boolean; mood: AnimationMood }) {
  const duration = mood === "cinematic" ? 600 : mood === "minimal" ? 200 : 400;
  
  return (
    <div className="grid grid-cols-3 gap-2">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className="w-12 h-12 bg-secondary rounded-sm"
          style={{
            transition: `all ${duration}ms ${mood === "bouncy" ? "cubic-bezier(0.68, -0.55, 0.265, 1.55)" : "ease-out"}`,
            transitionDelay: isPlaying ? `${i * 50}ms` : "0ms",
            opacity: isPlaying ? 1 : 0,
            transform: isPlaying ? "scale(1)" : "scale(0)",
          }}
        />
      ))}
    </div>
  );
}

// Parallax Demo
function ParallaxDemo({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="relative w-64 h-40 overflow-hidden rounded-lg bg-muted">
      <div
        className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent"
        style={{
          transition: "transform 1s ease-out",
          transform: isPlaying ? "translateY(-20px)" : "translateY(0)",
        }}
      />
      <div
        className="absolute bottom-4 left-4 text-xl font-bold"
        style={{
          transition: "transform 1s ease-out",
          transform: isPlaying ? "translateY(-40px)" : "translateY(0)",
        }}
      >
        Parallax
      </div>
      <div
        className="absolute bottom-4 right-4 w-16 h-16 bg-secondary rounded-full"
        style={{
          transition: "transform 1s ease-out",
          transform: isPlaying ? "translateY(-60px)" : "translateY(0)",
        }}
      />
    </div>
  );
}

// Hover Demo
function HoverDemo({ variant }: { variant: string }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground text-center">Hover over the element below</p>
      
      {variant === "underline" && (
        <span className="relative text-2xl font-bold cursor-pointer group">
          Hover Me
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full" />
        </span>
      )}
      
      {variant === "fill" && (
        <button className="relative px-6 py-3 text-lg font-bold border-2 border-primary overflow-hidden group">
          <span className="relative z-10 transition-colors duration-300 group-hover:text-primary-foreground">
            Hover Me
          </span>
          <span className="absolute inset-0 bg-primary transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0" />
        </button>
      )}
      
      {variant === "glitch" && (
        <span className="text-2xl font-bold cursor-pointer hover:animate-glitch relative">
          Hover Me
          <style>{`
            @keyframes glitch {
              0%, 100% { transform: translate(0); }
              20% { transform: translate(-2px, 2px); }
              40% { transform: translate(-2px, -2px); }
              60% { transform: translate(2px, 2px); }
              80% { transform: translate(2px, -2px); }
            }
            .hover\\:animate-glitch:hover {
              animation: glitch 0.3s ease-in-out infinite;
            }
          `}</style>
        </span>
      )}
    </div>
  );
}

// Split Text Demo
function SplitTextDemo({ isPlaying, mood }: { isPlaying: boolean; mood: AnimationMood }) {
  const text = "HEADLINES";
  const duration = mood === "cinematic" ? 100 : mood === "minimal" ? 30 : 50;
  
  return (
    <div className="text-5xl font-bold tracking-wider">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            transition: `all 500ms ${mood === "bouncy" ? "cubic-bezier(0.68, -0.55, 0.265, 1.55)" : "ease-out"}`,
            transitionDelay: isPlaying ? `${i * duration}ms` : "0ms",
            opacity: isPlaying ? 1 : 0,
            transform: isPlaying ? "translateY(0)" : "translateY(50px)",
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

// Mask Reveal Demo
function MaskRevealDemo({ isPlaying, mood }: { isPlaying: boolean; mood: AnimationMood }) {
  const duration = mood === "cinematic" ? 1200 : mood === "minimal" ? 400 : 700;
  
  return (
    <div className="relative overflow-hidden">
      <h2 className="text-4xl font-bold">REVEALED</h2>
      <div
        className="absolute inset-0 bg-background"
        style={{
          transition: `transform ${duration}ms ease-out`,
          transform: isPlaying ? "translateX(100%)" : "translateX(0)",
        }}
      />
    </div>
  );
}

// Assemble Demo
function AssembleDemo({ isPlaying, mood }: { isPlaying: boolean; mood: AnimationMood }) {
  const text = "CHAOS";
  const duration = mood === "cinematic" ? 800 : mood === "minimal" ? 300 : 500;
  
  const randomOffsets = [
    { x: -100, y: -50, r: -45 },
    { x: 80, y: 60, r: 30 },
    { x: -60, y: 80, r: 15 },
    { x: 120, y: -40, r: -20 },
    { x: -40, y: -80, r: 60 },
  ];
  
  return (
    <div className="text-5xl font-bold tracking-wider">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            transition: `all ${duration}ms ${mood === "bouncy" ? "cubic-bezier(0.68, -0.55, 0.265, 1.55)" : "ease-out"}`,
            transitionDelay: isPlaying ? `${i * 80}ms` : "0ms",
            opacity: isPlaying ? 1 : 0,
            transform: isPlaying 
              ? "translate(0, 0) rotate(0deg)" 
              : `translate(${randomOffsets[i].x}px, ${randomOffsets[i].y}px) rotate(${randomOffsets[i].r}deg)`,
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

// Soviet Constructivist Loading Animation
function SovietConstructivist({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={cn("transition-opacity duration-300", !isPlaying && "opacity-0")}>
      <div className="relative w-40 h-40">
        {/* Rotating red star/gear */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: isPlaying ? "soviet-rotate 2s linear infinite" : "none" }}
        >
          <svg viewBox="0 0 100 100" className="w-32 h-32">
            {/* Large red circle */}
            <circle cx="50" cy="50" r="40" fill="hsl(0, 75%, 45%)" />
            {/* White star */}
            <polygon 
              points="50,15 58,38 82,38 63,52 70,78 50,62 30,78 37,52 18,38 42,38" 
              fill="hsl(40, 30%, 90%)"
            />
          </svg>
        </div>
        
        {/* Diagonal bars */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-full bg-black origin-center"
            style={{ 
              animation: isPlaying ? "soviet-bar-1 2s ease-in-out infinite" : "none",
              transform: "rotate(45deg)"
            }}
          />
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-full bg-black origin-center"
            style={{ 
              animation: isPlaying ? "soviet-bar-2 2s ease-in-out infinite" : "none",
              transform: "rotate(-45deg)"
            }}
          />
        </div>
        
        {/* Bold text */}
        <div 
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-bold text-xs tracking-[0.3em] text-black uppercase whitespace-nowrap"
          style={{ animation: isPlaying ? "soviet-text 0.5s ease-in-out infinite" : "none" }}
        >
          LOADING
        </div>
      </div>
      
      <style>{`
        @keyframes soviet-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes soviet-bar-1 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes soviet-bar-2 {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes soviet-text {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

// Pulse Ring Loader
function PulseRingLoader({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={cn("transition-opacity duration-300", !isPlaying && "opacity-0")}>
      <div className="relative w-24 h-24 flex items-center justify-center">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-secondary"
            style={{
              animation: isPlaying ? `pulse-ring 1.5s ease-out infinite` : "none",
              animationDelay: `${i * 0.3}s`,
              opacity: 0,
            }}
          />
        ))}
        <div className="w-4 h-4 rounded-full bg-secondary" />
      </div>
      
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Orbital Dots Loader
function OrbitalDotsLoader({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={cn("transition-opacity duration-300", !isPlaying && "opacity-0")}>
      <div className="relative w-24 h-24">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              animation: isPlaying ? `orbit 1.5s linear infinite` : "none",
              animationDelay: `${i * 0.15}s`,
            }}
          >
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
              style={{ backgroundColor: i % 2 === 0 ? "hsl(196, 100%, 33%)" : "hsl(151, 49%, 14%)" }}
            />
          </div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
      </div>
      
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Shutter Bars Page Transition
function ShutterBarsDemo({ isPlaying, mood }: { isPlaying: boolean; mood: AnimationMood }) {
  const duration = mood === "cinematic" ? 1000 : mood === "minimal" ? 400 : 600;
  const barCount = 6;
  
  return (
    <div className="relative w-64 h-40 bg-muted rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Content Revealed</span>
      </div>
      {[...Array(barCount)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-primary"
          style={{
            top: `${(i / barCount) * 100}%`,
            left: 0,
            right: 0,
            height: `${100 / barCount + 1}%`,
            transition: `transform ${duration}ms ${mood === "bouncy" ? "cubic-bezier(0.68, -0.55, 0.265, 1.55)" : "ease-out"}`,
            transitionDelay: isPlaying ? `${i * 50}ms` : "0ms",
            transform: isPlaying ? "translateX(-100%)" : "translateX(0)",
          }}
        />
      ))}
    </div>
  );
}

// Iris Wipe Page Transition
function IrisWipeDemo({ isPlaying, mood }: { isPlaying: boolean; mood: AnimationMood }) {
  const duration = mood === "cinematic" ? 1200 : mood === "minimal" ? 400 : 700;
  
  return (
    <div className="relative w-64 h-40 bg-muted rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Content Behind</span>
      </div>
      <div
        className="absolute inset-0 bg-secondary flex items-center justify-center"
        style={{
          transition: `clip-path ${duration}ms ${mood === "bouncy" ? "cubic-bezier(0.68, -0.55, 0.265, 1.55)" : "ease-out"}`,
          clipPath: isPlaying 
            ? "circle(0% at 50% 50%)" 
            : "circle(100% at 50% 50%)",
        }}
      >
        <span className="text-secondary-foreground font-bold">Iris Wipe</span>
      </div>
    </div>
  );
}

// Lissitzky Poster - Full "Beat the Whites with the Red Wedge" animation
function LissitzkyPoster({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={cn("transition-opacity duration-300", !isPlaying && "opacity-0")}>
      <div className="relative w-64 h-52 bg-[#1a1a1a] rounded overflow-hidden">
        
        {/* White circle (The Whites) - being pierced */}
        <div 
          className="absolute w-28 h-28 rounded-full bg-white"
          style={{
            right: "10%",
            top: "50%",
            transform: "translateY(-50%)",
            animation: isPlaying ? "whites-crack 2.5s ease-in-out infinite" : "none",
          }}
        >
          {/* Crack lines appearing */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <line 
              x1="30" y1="50" x2="50" y2="30" 
              stroke="#1a1a1a" 
              strokeWidth="2"
              style={{
                animation: isPlaying ? "crack-appear 2.5s ease-in-out infinite" : "none",
                animationDelay: "0.8s",
              }}
            />
            <line 
              x1="25" y1="55" x2="45" y2="65" 
              stroke="#1a1a1a" 
              strokeWidth="1.5"
              style={{
                animation: isPlaying ? "crack-appear 2.5s ease-in-out infinite" : "none",
                animationDelay: "1s",
              }}
            />
          </svg>
        </div>
        
        {/* Main Red Wedge - piercing through (point facing right into white circle) */}
        <svg 
          className="absolute left-0 top-0 w-full h-full"
          viewBox="0 0 260 200"
          style={{ animation: isPlaying ? "wedge-pierce 2.5s ease-out infinite" : "none" }}
        >
          <polygon 
            points="-40,50 -40,150 180,100" 
            fill="#cc2936"
          />
        </svg>
        
        {/* Small red triangles - scattered (pointing right) */}
        <div 
          className="absolute w-4 h-4"
          style={{
            left: "15%",
            top: "15%",
            animation: isPlaying ? "scatter-1 2.5s ease-in-out infinite" : "none",
          }}
        >
          <svg viewBox="0 0 20 20">
            <polygon points="0,0 20,10 0,20" fill="#cc2936"/>
          </svg>
        </div>
        <div 
          className="absolute w-3 h-3"
          style={{
            left: "25%",
            bottom: "20%",
            animation: isPlaying ? "scatter-2 2.5s ease-in-out infinite" : "none",
          }}
        >
          <svg viewBox="0 0 20 20">
            <polygon points="0,0 20,10 0,20" fill="#cc2936"/>
          </svg>
        </div>
        
        {/* Small white circles - debris */}
        <div 
          className="absolute w-3 h-3 rounded-full bg-white"
          style={{
            right: "30%",
            top: "20%",
            animation: isPlaying ? "debris-1 2.5s ease-out infinite" : "none",
          }}
        />
        <div 
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{
            right: "25%",
            bottom: "25%",
            animation: isPlaying ? "debris-2 2.5s ease-out infinite" : "none",
          }}
        />
        <div 
          className="absolute w-2.5 h-2.5 rounded-full bg-white"
          style={{
            right: "40%",
            top: "35%",
            animation: isPlaying ? "debris-3 2.5s ease-out infinite" : "none",
          }}
        />
        
        {/* Constructivist text elements */}
        <div 
          className="absolute text-white font-bold text-[8px] tracking-[0.2em] uppercase"
          style={{
            left: "5%",
            top: "8%",
            transform: "rotate(-15deg)",
            animation: isPlaying ? "text-flash 1s steps(2) infinite" : "none",
          }}
        >
          КЛИНОМ
        </div>
        <div 
          className="absolute text-[#cc2936] font-bold text-[10px] tracking-[0.15em] uppercase"
          style={{
            left: "8%",
            bottom: "12%",
            transform: "rotate(5deg)",
            animation: isPlaying ? "text-flash 1s steps(2) infinite" : "none",
            animationDelay: "0.3s",
          }}
        >
          КРАСНЫМ
        </div>
        <div 
          className="absolute text-white font-bold text-[7px] tracking-[0.25em] uppercase"
          style={{
            right: "8%",
            bottom: "8%",
            transform: "rotate(-8deg)",
            animation: isPlaying ? "text-flash 1s steps(2) infinite" : "none",
            animationDelay: "0.6s",
          }}
        >
          БЕЙ БЕЛЫХ
        </div>
        
        {/* Diagonal black bars */}
        <div 
          className="absolute w-1 bg-black origin-center"
          style={{
            height: "150%",
            left: "40%",
            top: "-25%",
            transform: "rotate(25deg)",
            animation: isPlaying ? "bar-pulse 1.5s ease-in-out infinite" : "none",
          }}
        />
        <div 
          className="absolute w-0.5 bg-black origin-center"
          style={{
            height: "150%",
            left: "50%",
            top: "-25%",
            transform: "rotate(-30deg)",
            animation: isPlaying ? "bar-pulse 1.5s ease-in-out infinite" : "none",
            animationDelay: "0.5s",
          }}
        />
      </div>
      
      <style>{`
        @keyframes wedge-pierce {
          0% { transform: translateX(-60px); }
          30%, 100% { transform: translateX(0); }
        }
        @keyframes whites-crack {
          0%, 30% { transform: translateY(-50%) scale(1); }
          50% { transform: translateY(-50%) scale(0.95); }
          70%, 100% { transform: translateY(-50%) scale(0.92); }
        }
        @keyframes crack-appear {
          0%, 30% { opacity: 0; stroke-dasharray: 0 100; }
          50%, 100% { opacity: 1; stroke-dasharray: 100 0; }
        }
        @keyframes scatter-1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(10px, -5px) rotate(15deg); }
          100% { transform: translate(15px, -8px) rotate(25deg); }
        }
        @keyframes scatter-2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(8px, 5px) rotate(-10deg); }
          100% { transform: translate(12px, 10px) rotate(-20deg); }
        }
        @keyframes debris-1 {
          0%, 25% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(30px, -20px) scale(0.5); opacity: 0; }
        }
        @keyframes debris-2 {
          0%, 30% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(25px, 25px) scale(0.3); opacity: 0; }
        }
        @keyframes debris-3 {
          0%, 35% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(20px, -15px) scale(0.4); opacity: 0; }
        }
        @keyframes text-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes bar-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

// Red Wedge Loader - Inspired by El Lissitzky's "Beat the Whites with the Red Wedge"
function RedWedgeLoader({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={cn("transition-opacity duration-300", !isPlaying && "opacity-0")}>
      <div className="relative w-48 h-32">
        {/* White circle (being pierced) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-gray-300 bg-white" />
        
        {/* Red wedge piercing (point facing right into white circle) */}
        <svg 
          viewBox="0 0 100 60" 
          className="absolute inset-0 w-full h-full"
          style={{ animation: isPlaying ? "wedge-thrust 1.5s ease-in-out infinite" : "none" }}
        >
          <polygon 
            points="0,10 0,50 70,30" 
            fill="hsl(0, 75%, 45%)"
          />
        </svg>
        
        {/* Bold text */}
        <div 
          className="absolute -bottom-6 left-0 right-0 text-center font-bold text-[10px] tracking-[0.4em] uppercase"
          style={{ animation: isPlaying ? "soviet-text 0.8s ease-in-out infinite" : "none" }}
        >
          PROGRESS
        </div>
      </div>
      
      <style>{`
        @keyframes wedge-thrust {
          0%, 100% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}

// Constructivist Gears - Interlocking geometric shapes
export function ConstructivistGears({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={cn("transition-opacity duration-300", !isPlaying && "opacity-0")}>
      <div className="relative w-40 h-40">
        {/* Large gear */}
        <div 
          className="absolute top-0 left-0 w-24 h-24"
          style={{ animation: isPlaying ? "gear-spin 3s linear infinite" : "none" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="35" fill="none" stroke="hsl(0, 0%, 10%)" strokeWidth="8"/>
            <circle cx="50" cy="50" r="12" fill="hsl(0, 75%, 45%)"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
              <rect 
                key={angle}
                x="46" y="10" width="8" height="15" 
                fill="hsl(0, 0%, 10%)"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </svg>
        </div>
        
        {/* Small gear - counter rotation */}
        <div 
          className="absolute bottom-0 right-0 w-20 h-20"
          style={{ animation: isPlaying ? "gear-spin-reverse 2s linear infinite" : "none" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="28" fill="none" stroke="hsl(210, 80%, 45%)" strokeWidth="8"/>
            <circle cx="50" cy="50" r="10" fill="hsl(50, 100%, 50%)"/>
            {[0, 60, 120, 180, 240, 300].map(angle => (
              <rect 
                key={angle}
                x="46" y="15" width="8" height="12" 
                fill="hsl(210, 80%, 45%)"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </svg>
        </div>
      </div>
      
      <style>{`
        @keyframes gear-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gear-spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}

// Primary Blocks - Bauhaus primary colors stacking
function PrimaryBlocks({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={cn("transition-opacity duration-300", !isPlaying && "opacity-0")}>
      <div className="relative w-32 h-40 flex flex-col items-center justify-end gap-1">
        {/* Stacking blocks with bounce */}
        {[
          { color: "hsl(210, 80%, 50%)", delay: "0s", size: "w-20 h-8" },
          { color: "hsl(50, 100%, 50%)", delay: "0.2s", size: "w-16 h-8" },
          { color: "hsl(0, 75%, 50%)", delay: "0.4s", size: "w-12 h-8" },
        ].map((block, i) => (
          <div
            key={i}
            className={cn("rounded-sm", block.size)}
            style={{
              backgroundColor: block.color,
              animation: isPlaying ? `block-bounce 1.5s ease-in-out infinite` : "none",
              animationDelay: block.delay,
            }}
          />
        ))}
        
        {/* Base */}
        <div className="w-24 h-2 bg-black rounded-sm" />
      </div>
      
      <style>{`
        @keyframes block-bounce {
          0%, 100% { transform: translateY(0) scaleY(1); }
          25% { transform: translateY(-8px) scaleY(1.1); }
          50% { transform: translateY(0) scaleY(0.9); }
          75% { transform: translateY(-4px) scaleY(1.05); }
        }
      `}</style>
    </div>
  );
}

// Rodchenko Lines - Dynamic diagonal lines
function RodchenkoLines({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={cn("transition-opacity duration-300", !isPlaying && "opacity-0")}>
      <div className="relative w-40 h-40 overflow-hidden bg-cream rounded">
        {/* Diagonal lines radiating from corner */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 origin-top-left"
            style={{
              width: "200%",
              height: "3px",
              backgroundColor: i % 2 === 0 ? "hsl(0, 75%, 45%)" : "hsl(0, 0%, 10%)",
              transform: `rotate(${i * 12}deg)`,
              animation: isPlaying ? `line-pulse 1.5s ease-in-out infinite` : "none",
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        
        {/* Center circle */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black flex items-center justify-center"
          style={{ animation: isPlaying ? "scale-pulse 1.5s ease-in-out infinite" : "none" }}
        >
          <div className="w-4 h-4 rounded-full bg-white" />
        </div>
      </div>
      
      <style>{`
        @keyframes line-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes scale-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>
    </div>
  );
}

// Suprematist Loader - Malevich-inspired floating shapes
export function SuprematistLoader({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={cn("transition-opacity duration-300", !isPlaying && "opacity-0")}>
      <div className="relative w-48 h-40">
        {/* Floating black square */}
        <div 
          className="absolute w-10 h-10 bg-black"
          style={{
            top: "20%",
            left: "20%",
            animation: isPlaying ? "float-1 3s ease-in-out infinite" : "none",
          }}
        />
        
        {/* Red rectangle */}
        <div 
          className="absolute w-16 h-6 bg-red-600"
          style={{
            top: "40%",
            left: "35%",
            transform: "rotate(-15deg)",
            animation: isPlaying ? "float-2 3s ease-in-out infinite" : "none",
          }}
        />
        
        {/* Yellow circle */}
        <div 
          className="absolute w-8 h-8 rounded-full"
          style={{
            backgroundColor: "hsl(50, 100%, 50%)",
            top: "55%",
            right: "20%",
            animation: isPlaying ? "float-3 3s ease-in-out infinite" : "none",
          }}
        />
        
        {/* Blue cross */}
        <div 
          className="absolute"
          style={{
            top: "15%",
            right: "25%",
            animation: isPlaying ? "float-4 3s ease-in-out infinite" : "none",
          }}
        >
          <div className="relative">
            <div className="w-3 h-10 bg-blue-600 absolute top-0 left-1/2 -translate-x-1/2" />
            <div className="w-10 h-3 bg-blue-600 absolute top-1/2 left-0 -translate-y-1/2" />
          </div>
        </div>
        
        {/* Thin diagonal line */}
        <div 
          className="absolute w-24 h-0.5 bg-black origin-center"
          style={{
            top: "75%",
            left: "10%",
            transform: "rotate(25deg)",
            animation: isPlaying ? "line-grow 2s ease-in-out infinite" : "none",
          }}
        />
      </div>
      
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(5px, -10px) rotate(5deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: rotate(-15deg) translate(0, 0); }
          50% { transform: rotate(-10deg) translate(8px, -5px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-8px, -8px) scale(1.1); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-5px, 8px) rotate(-10deg); }
        }
        @keyframes line-grow {
          0%, 100% { transform: rotate(25deg) scaleX(1); }
          50% { transform: rotate(25deg) scaleX(1.3); }
        }
      `}</style>
    </div>
  );
}

// Factory Cogs - Industrial gear mechanism
export function FactoryCogs({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={cn("transition-opacity duration-300", !isPlaying && "opacity-0")}>
      <div className="relative w-48 h-36">
        {/* Main large cog */}
        <div 
          className="absolute left-4 top-4"
          style={{ animation: isPlaying ? "cog-main 4s linear infinite" : "none" }}
        >
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            <circle cx="40" cy="40" r="25" fill="none" stroke="hsl(0, 0%, 20%)" strokeWidth="6"/>
            <circle cx="40" cy="40" r="8" fill="hsl(0, 75%, 45%)"/>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
              <rect 
                key={angle}
                x="37" y="8" width="6" height="10" 
                fill="hsl(0, 0%, 20%)"
                transform={`rotate(${angle} 40 40)`}
              />
            ))}
          </svg>
        </div>
        
        {/* Medium cog - counter */}
        <div 
          className="absolute right-8 top-2"
          style={{ animation: isPlaying ? "cog-counter 2.5s linear infinite" : "none" }}
        >
          <svg viewBox="0 0 60 60" className="w-14 h-14">
            <circle cx="30" cy="30" r="18" fill="none" stroke="hsl(0, 0%, 30%)" strokeWidth="5"/>
            <circle cx="30" cy="30" r="6" fill="hsl(50, 100%, 50%)"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
              <rect 
                key={angle}
                x="27" y="6" width="6" height="8" 
                fill="hsl(0, 0%, 30%)"
                transform={`rotate(${angle} 30 30)`}
              />
            ))}
          </svg>
        </div>
        
        {/* Small cog - fast */}
        <div 
          className="absolute right-4 bottom-4"
          style={{ animation: isPlaying ? "cog-fast 1.5s linear infinite" : "none" }}
        >
          <svg viewBox="0 0 40 40" className="w-10 h-10">
            <circle cx="20" cy="20" r="12" fill="none" stroke="hsl(210, 80%, 45%)" strokeWidth="4"/>
            <circle cx="20" cy="20" r="4" fill="hsl(0, 0%, 10%)"/>
            {[0, 60, 120, 180, 240, 300].map(angle => (
              <rect 
                key={angle}
                x="18" y="4" width="4" height="6" 
                fill="hsl(210, 80%, 45%)"
                transform={`rotate(${angle} 20 20)`}
              />
            ))}
          </svg>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600"
            style={{
              animation: isPlaying ? "progress-fill 2s ease-in-out infinite" : "none",
            }}
          />
        </div>
      </div>
      
      <style>{`
        @keyframes cog-main {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cog-counter {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes cog-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes progress-fill {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </div>
  );
}
