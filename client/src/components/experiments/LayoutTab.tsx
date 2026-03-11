import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Grid2X2, Columns, LayoutTemplate, Monitor, Tablet, Smartphone, ScrollText } from "lucide-react";

type LayoutCategory = "grid" | "magazine" | "card" | "scroll" | "responsive";

interface LayoutVariant {
  id: string;
  name: string;
  description: string;
}

const categories: { id: LayoutCategory; name: string; icon: React.ElementType; variants: LayoutVariant[] }[] = [
  {
    id: "grid",
    name: "Grid Systems",
    icon: Grid2X2,
    variants: [
      { id: "asymmetric", name: "Asymmetric", description: "Unequal column widths for visual interest" },
      { id: "masonry", name: "Masonry", description: "Pinterest-style staggered grid" },
      { id: "swiss", name: "Swiss Grid", description: "Clean, modular units with strict alignment" },
    ],
  },
  {
    id: "magazine",
    name: "Editorial",
    icon: LayoutTemplate,
    variants: [
      { id: "feature", name: "Feature Story", description: "Large hero with supporting cards" },
      { id: "split", name: "Split Panel", description: "50/50 content split with fixed image" },
      { id: "overlap", name: "Overlap", description: "Elements overlapping for depth" },
    ],
  },
  {
    id: "card",
    name: "Card Layouts",
    icon: Columns,
    variants: [
      { id: "minimal", name: "Minimal Cards", description: "Clean cards with subtle shadows" },
      { id: "stacked", name: "Stacked Cards", description: "Cards that appear layered" },
      { id: "horizontal", name: "Horizontal Cards", description: "Wide cards with side-by-side content" },
    ],
  },
  {
    id: "scroll",
    name: "Scroll-Driven",
    icon: ScrollText,
    variants: [
      { id: "horizontal", name: "Horizontal Scroll", description: "Sections scroll left-right in a strip" },
      { id: "parallax", name: "Parallax Sections", description: "Layers move at different speeds" },
      { id: "sticky", name: "Sticky Reveal", description: "Elements pin and reveal as you scroll" },
    ],
  },
  {
    id: "responsive",
    name: "Breakpoints",
    icon: Monitor,
    variants: [
      { id: "desktop", name: "Desktop (1200px+)", description: "Full layout with all elements" },
      { id: "tablet", name: "Tablet (768px)", description: "Adapted two-column layout" },
      { id: "mobile", name: "Mobile (375px)", description: "Single column, stacked" },
    ],
  },
];

export default function LayoutTab() {
  const [selectedCategory, setSelectedCategory] = useState<LayoutCategory>("grid");
  const [selectedVariant, setSelectedVariant] = useState("asymmetric");

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-serif font-bold text-primary">Layout Systems</h2>
        <p className="text-sm text-muted-foreground">
          Explore different grid systems, editorial layouts, and responsive patterns
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedVariant(cat.variants[0].id);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-4 h-4" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Variant selector */}
      {currentCategory && (
        <div className="flex gap-2 flex-wrap">
          {currentCategory.variants.map(variant => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant.id)}
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

      {/* Layout preview */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/30">
          <h3 className="font-bold text-primary">
            {currentCategory?.variants.find(v => v.id === selectedVariant)?.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {currentCategory?.variants.find(v => v.id === selectedVariant)?.description}
          </p>
        </div>
        
        <div className="p-6 bg-background/50 min-h-[350px]">
          <LayoutPreview category={selectedCategory} variant={selectedVariant} />
        </div>
      </div>
    </div>
  );
}

function LayoutPreview({ category, variant }: { category: LayoutCategory; variant: string }) {
  // Grid Systems
  if (category === "grid") {
    if (variant === "asymmetric") {
      return (
        <div className="grid grid-cols-12 gap-3 h-64">
          <div className="col-span-7 bg-primary/80 rounded-md flex items-center justify-center text-primary-foreground font-bold">
            7 cols
          </div>
          <div className="col-span-5 space-y-3">
            <div className="h-1/2 bg-secondary rounded-md flex items-center justify-center text-secondary-foreground font-bold text-sm">
              5 cols
            </div>
            <div className="h-1/2 bg-muted rounded-md flex items-center justify-center text-muted-foreground font-bold text-sm">
              5 cols
            </div>
          </div>
          <div className="col-span-4 bg-muted rounded-md flex items-center justify-center text-muted-foreground font-bold text-sm">
            4 cols
          </div>
          <div className="col-span-4 bg-muted rounded-md flex items-center justify-center text-muted-foreground font-bold text-sm">
            4 cols
          </div>
          <div className="col-span-4 bg-muted rounded-md flex items-center justify-center text-muted-foreground font-bold text-sm">
            4 cols
          </div>
        </div>
      );
    }
    
    if (variant === "masonry") {
      const heights = [120, 180, 100, 160, 140, 200, 110, 150];
      return (
        <div className="columns-3 gap-3 space-y-3">
          {heights.map((h, i) => (
            <div
              key={i}
              className="break-inside-avoid bg-gradient-to-br from-primary/70 to-secondary/50 rounded-md flex items-center justify-center text-primary-foreground font-bold text-sm"
              style={{ height: h }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      );
    }
    
    if (variant === "swiss") {
      return (
        <div className="grid grid-cols-6 grid-rows-4 gap-2 h-64">
          <div className="col-span-2 row-span-2 bg-primary rounded-sm flex items-center justify-center text-primary-foreground font-bold">
            A
          </div>
          <div className="col-span-2 row-span-1 bg-secondary rounded-sm flex items-center justify-center text-secondary-foreground font-bold text-sm">
            B
          </div>
          <div className="col-span-2 row-span-3 bg-muted rounded-sm flex items-center justify-center text-muted-foreground font-bold">
            C
          </div>
          <div className="col-span-2 row-span-2 bg-muted/60 rounded-sm flex items-center justify-center text-muted-foreground font-bold text-sm">
            D
          </div>
          <div className="col-span-2 row-span-2 bg-secondary/60 rounded-sm flex items-center justify-center text-secondary-foreground font-bold text-sm">
            E
          </div>
          <div className="col-span-2 row-span-1 bg-primary/60 rounded-sm flex items-center justify-center text-primary-foreground font-bold text-sm">
            F
          </div>
        </div>
      );
    }
  }

  // Magazine/Editorial
  if (category === "magazine") {
    if (variant === "feature") {
      return (
        <div className="space-y-4">
          <div className="h-40 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-end p-4">
            <div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white">Featured</span>
              <h3 className="text-xl font-bold text-white mt-1">Main Story Headline</h3>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-md border border-border/50 p-3">
                <div className="h-16 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted/60 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (variant === "split") {
      return (
        <div className="grid grid-cols-2 gap-0 h-64 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">Image</span>
          </div>
          <div className="bg-card p-6 flex flex-col justify-center">
            <span className="text-xs text-secondary font-bold uppercase tracking-wider">Category</span>
            <h3 className="text-lg font-bold text-primary mt-1">Article Title</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="mt-4 h-2 bg-primary/20 rounded-full">
              <div className="h-full w-2/3 bg-primary rounded-full" />
            </div>
          </div>
        </div>
      );
    }
    
    if (variant === "overlap") {
      return (
        <div className="relative h-64">
          <div className="absolute inset-0 bg-muted rounded-lg" />
          <div className="absolute top-4 left-4 right-1/3 bottom-4 bg-primary rounded-lg shadow-lg flex items-center justify-center text-primary-foreground font-bold">
            Background
          </div>
          <div className="absolute top-12 left-1/4 right-4 bottom-8 bg-card rounded-lg shadow-xl border border-border/50 flex items-center justify-center font-bold">
            Foreground Content
          </div>
        </div>
      );
    }
  }

  // Card Layouts
  if (category === "card") {
    if (variant === "minimal") {
      return (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-lg p-4 shadow-sm border border-border/30 hover:shadow-md transition-shadow">
              <div className="h-24 bg-muted rounded-md mb-3" />
              <h4 className="font-bold text-sm">Card Title {i}</h4>
              <p className="text-xs text-muted-foreground mt-1">Brief description</p>
            </div>
          ))}
        </div>
      );
    }
    
    if (variant === "stacked") {
      return (
        <div className="relative h-64 flex items-center justify-center">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute w-48 h-32 bg-card rounded-lg border border-border/50 shadow-lg flex items-center justify-center font-bold"
              style={{
                transform: `rotate(${(i - 1) * 5}deg) translateY(${i * 8}px)`,
                zIndex: 3 - i,
              }}
            >
              Card {i + 1}
            </div>
          ))}
        </div>
      );
    }
    
    if (variant === "horizontal") {
      return (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-4 bg-card rounded-lg border border-border/30 overflow-hidden">
              <div className="w-32 bg-gradient-to-br from-secondary/60 to-primary/60 flex-shrink-0" />
              <div className="py-4 pr-4">
                <h4 className="font-bold">Horizontal Card {i}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  This layout works well for list views and article previews.
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  // Scroll-Driven Layouts
  if (category === "scroll") {
    if (variant === "horizontal") {
      return <HorizontalScrollDemo />;
    }
    if (variant === "parallax") {
      return <ParallaxSectionsDemo />;
    }
    if (variant === "sticky") {
      return <StickyRevealDemo />;
    }
  }

  // Responsive Breakpoints
  if (category === "responsive") {
    const getViewportWidth = () => {
      if (variant === "desktop") return "100%";
      if (variant === "tablet") return "70%";
      return "40%";
    };
    
    const Icon = variant === "desktop" ? Monitor : variant === "tablet" ? Tablet : Smartphone;
    
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="w-5 h-5" />
          <span className="text-sm font-medium">
            {variant === "desktop" ? "1200px+" : variant === "tablet" ? "768px" : "375px"}
          </span>
        </div>
        <div
          className="bg-card rounded-lg border-2 border-border shadow-inner overflow-hidden transition-all duration-500"
          style={{ width: getViewportWidth(), minHeight: 200 }}
        >
          <div className="p-3 border-b border-border/50 flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
          </div>
          <div className="p-4">
            <div className={cn(
              "grid gap-3",
              variant === "desktop" ? "grid-cols-4" : variant === "tablet" ? "grid-cols-2" : "grid-cols-1"
            )}>
              {[...Array(variant === "mobile" ? 2 : 4)].map((_, i) => (
                <div key={i} className="bg-muted rounded-md h-12" />
              ))}
            </div>
            <div className={cn(
              "mt-4 gap-3",
              variant === "mobile" ? "space-y-3" : "grid grid-cols-2"
            )}>
              <div className="bg-primary/20 rounded-md h-20" />
              <div className="bg-secondary/20 rounded-md h-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="text-muted-foreground">Select a layout</div>;
}

// Horizontal Scroll Demo
function HorizontalScrollDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground text-center">← Scroll horizontally →</p>
      <div 
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden pb-4 -mx-2 px-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex gap-4" style={{ width: "max-content" }}>
          {[
            { title: "Section One", color: "from-primary to-primary/60" },
            { title: "Section Two", color: "from-secondary to-secondary/60" },
            { title: "Section Three", color: "from-primary/80 to-secondary/80" },
            { title: "Section Four", color: "from-secondary/80 to-primary/80" },
          ].map((section, i) => (
            <div
              key={i}
              className={cn(
                "w-64 h-48 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0",
                section.color
              )}
              style={{ scrollSnapAlign: "start" }}
            >
              <span className="text-white font-bold text-lg">{section.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ left: i * 280, behavior: "smooth" });
              }
            }}
            className="w-2 h-2 rounded-full bg-muted hover:bg-secondary transition-colors"
          />
        ))}
      </div>
    </div>
  );
}

// Parallax Sections Demo
function ParallaxSectionsDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      setScrollY(container.scrollTop);
    };
    
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground text-center">↓ Scroll to see parallax effect ↓</p>
      <div 
        ref={containerRef}
        className="h-64 overflow-y-auto rounded-lg border border-border/50 relative"
      >
        {/* Background layer - slowest */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-primary/20 to-secondary/20"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        
        {/* Mid layer */}
        <div 
          className="absolute top-20 left-8 w-20 h-20 bg-secondary/40 rounded-full"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute top-40 right-8 w-16 h-16 bg-primary/40 rounded-lg"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        />
        
        {/* Content - normal speed */}
        <div className="relative z-10 p-6 space-y-48">
          <div className="bg-card/90 backdrop-blur rounded-lg p-4 shadow-lg">
            <h4 className="font-bold">First Section</h4>
            <p className="text-sm text-muted-foreground">Content moves at normal speed</p>
          </div>
          <div className="bg-card/90 backdrop-blur rounded-lg p-4 shadow-lg">
            <h4 className="font-bold">Second Section</h4>
            <p className="text-sm text-muted-foreground">Background elements lag behind</p>
          </div>
          <div className="bg-card/90 backdrop-blur rounded-lg p-4 shadow-lg">
            <h4 className="font-bold">Third Section</h4>
            <p className="text-sm text-muted-foreground">Creates depth illusion</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sticky Reveal Demo
function StickyRevealDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const scrollPosition = container.scrollTop;
      const sectionHeight = 120;
      const newSection = Math.min(2, Math.floor(scrollPosition / sectionHeight));
      setActiveSection(newSection);
    };
    
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);
  
  const sections = [
    { title: "Step 1: Discovery", desc: "Understanding the problem space" },
    { title: "Step 2: Design", desc: "Creating solutions and prototypes" },
    { title: "Step 3: Deliver", desc: "Building and shipping the product" },
  ];
  
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground text-center">↓ Scroll to reveal steps ↓</p>
      <div className="grid grid-cols-2 gap-4 h-64">
        {/* Sticky sidebar */}
        <div className="bg-primary rounded-lg p-4 flex flex-col justify-center">
          <h3 className="text-primary-foreground font-bold text-xl mb-2">
            {sections[activeSection].title}
          </h3>
          <p className="text-primary-foreground/80 text-sm">
            {sections[activeSection].desc}
          </p>
          <div className="flex gap-2 mt-4">
            {sections.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === activeSection ? "bg-secondary w-4" : "bg-primary-foreground/40"
                )}
              />
            ))}
          </div>
        </div>
        
        {/* Scrollable content */}
        <div 
          ref={containerRef}
          className="overflow-y-auto rounded-lg border border-border/50 bg-card"
        >
          <div className="p-4 space-y-4">
            {sections.map((section, i) => (
              <div
                key={i}
                className={cn(
                  "p-4 rounded-lg border transition-all",
                  i === activeSection 
                    ? "border-secondary bg-secondary/10" 
                    : "border-border/30"
                )}
              >
                <h4 className="font-bold text-sm">{section.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{section.desc}</p>
                <div className="mt-3 space-y-2">
                  <div className="h-2 bg-muted rounded w-full" />
                  <div className="h-2 bg-muted rounded w-3/4" />
                  <div className="h-2 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
            {/* Extra scroll space */}
            <div className="h-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
