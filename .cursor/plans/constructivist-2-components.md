# Constructivist Design System — Part 2: Component Library

All UI components with radical Constructivist/Bauhaus styling, ready to implement in React.

---

## Loading Screen

A full-screen loading state using the existing Constructivist Gears and Suprematist animations.

### Variants

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   VARIANT: GEARS                                                            │
│   ──────────────                                                            │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                                                                     │  │
│   │                     ████  NEAR BLACK (#0A0A0A)                      │  │
│   │                                                                     │  │
│   │                                                                     │  │
│   │                        ┌───────────────┐                            │  │
│   │                        │               │                            │  │
│   │                        │   ⚙️ ─── ⚙️    │   scale: 2                │  │
│   │                        │      ╲ ╱      │                            │  │
│   │                        │       ⚙️       │                            │  │
│   │                        │               │                            │  │
│   │                        └───────────────┘                            │  │
│   │                                                                     │  │
│   │              ════════════════════════════════════                   │  │
│   │              L O A D I N G                                          │  │
│   │              ════════════════════════════════════                   │  │
│   │              letter-spacing: 0.4em                                  │  │
│   │                                                                     │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   VARIANT: SUPREMATIST                                                      │
│   ────────────────────                                                      │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                                                                     │  │
│   │                     ████  PAPER (#F5F0E6)                           │  │
│   │                                                                     │  │
│   │              ■                                                      │  │
│   │                   (floating shapes)                                 │  │
│   │                        ┌───────────────┐                            │  │
│   │                        │               │                            │  │
│   │                        │  ■    ●   ▬   │   scale: 2                │  │
│   │                        │     ╲   ╱     │                            │  │
│   │                        │      ╲ ╱      │                            │  │
│   │                        └───────────────┘                            │  │
│   │                                   ●                                 │  │
│   │                                                                     │  │
│   │                 K · E · N · B · U · I                               │  │
│   │                 (staggered letter reveal)                           │  │
│   │                                                                     │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### React Component

```tsx
// components/constructivist/LoadingScreen.tsx

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ConstructivistGears, SuprematistLoader, FactoryCogs } from "../experiments/AnimationsTab";

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
  
  // Cycle loading text
  useEffect(() => {
    if (variant !== "gears") return;
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
  
  const isDark = variant === "gears" || variant === "factory";
  
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-12 transition-opacity duration-500",
        isDark ? "bg-[#0A0A0A]" : "bg-[#F5F0E6]",
        !isVisible && "opacity-0 pointer-events-none"
      )}
    >
      {/* Animation Container - scaled 2x */}
      <div className="transform scale-[2] origin-center">
        {variant === "gears" && <ConstructivistGears isPlaying={true} />}
        {variant === "suprematist" && <SuprematistLoader isPlaying={true} />}
        {variant === "factory" && <FactoryCogs isPlaying={true} />}
        {variant === "minimal" && <MinimalWedge />}
      </div>
      
      {/* Loading Text */}
      <div className={cn(
        "font-display uppercase tracking-[0.4em] text-sm",
        isDark ? "text-[#F5F0E6]" : "text-[#0A0A0A]"
      )}>
        {variant === "gears" && (
          <span className="animate-pulse">{loadingTexts[textIndex]}</span>
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
        {variant === "factory" && (
          <span className="animate-pulse">ASSEMBLING...</span>
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
        fill="#CC2936"
        className="animate-pulse"
      />
    </svg>
  );
}
```

### CSS

```css
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
}

.loading-animation {
  transform: scale(2);
  transform-origin: center;
}

.loading-text {
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  font-size: 0.875rem;
}
```

---

## Navigation

### Variant A: Diagonal Bar

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ╲                                                                         │
│    ╲   HOME    ABOUT    INSPIRATIONS    EXPERIMENTS                         │
│     ╲_________________________________________________________________      │
│      ╲                                                                ╲     │
│       ▲ Active indicator = red triangle under active item              ╲    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```tsx
// components/constructivist/NavigationDiagonal.tsx

export function NavigationDiagonal() {
  const links = [
    { href: "/", label: "HOME", shape: "●" },
    { href: "/about", label: "ABOUT", shape: "▲" },
    { href: "/inspirations", label: "INSPIRATIONS", shape: "■" },
    { href: "/experiments", label: "EXPERIMENTS", shape: "◆" },
  ];
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-30">
      {/* Diagonal background */}
      <div 
        className="absolute inset-0 bg-[#0A0A0A]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)" }}
      />
      
      <div className="relative flex items-center gap-8 px-8 py-6">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="group relative text-[#F5F0E6] font-display text-sm tracking-[0.2em] hover:text-[#CC2936] transition-colors"
          >
            <span className="mr-2 opacity-50 group-hover:opacity-100">{link.shape}</span>
            {link.label}
            
            {/* Active indicator */}
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="8" height="6" viewBox="0 0 8 6">
                <polygon points="4,6 0,0 8,0" fill="#CC2936" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
```

### Variant B: Vertical Sidebar with Shapes

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ┌────┐                                                                     │
│ │    │                                                                     │
│ │ ●  │  HOME                                                               │
│ │    │                                                                     │
│ │ ▲  │  ABOUT                                                              │
│ │    │                                                                     │
│ │ ■  │  INSPIRATIONS                                                       │
│ │    │                                                                     │
│ │ ◆  │  EXPERIMENTS                                                        │
│ │    │                                                                     │
│ └────┘                                                                     │
│                                                                            │
│  Shape = page identifier, fills with color on hover/active                 │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

```tsx
// components/constructivist/NavigationSidebar.tsx

export function NavigationSidebar() {
  const links = [
    { href: "/", shape: "circle", color: "#1E5AA8" },
    { href: "/about", shape: "triangle", color: "#CC2936" },
    { href: "/inspirations", shape: "square", color: "#F4C430" },
    { href: "/experiments", shape: "diamond", color: "#0A0A0A" },
  ];
  
  return (
    <nav className="fixed left-0 top-0 bottom-0 w-16 bg-[#F5F0E6] border-r border-[#0A0A0A]/10 z-30 flex flex-col items-center justify-center gap-6">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="group w-10 h-10 flex items-center justify-center"
        >
          <Shape 
            type={link.shape} 
            className="w-6 h-6 stroke-[#0A0A0A] stroke-2 fill-transparent group-hover:fill-current transition-colors"
            style={{ color: link.color }}
          />
        </a>
      ))}
    </nav>
  );
}

function Shape({ type, className, style }: { type: string; className: string; style?: React.CSSProperties }) {
  if (type === "circle") {
    return <svg viewBox="0 0 24 24" className={className} style={style}><circle cx="12" cy="12" r="10" /></svg>;
  }
  if (type === "triangle") {
    return <svg viewBox="0 0 24 24" className={className} style={style}><polygon points="12,2 22,22 2,22" /></svg>;
  }
  if (type === "square") {
    return <svg viewBox="0 0 24 24" className={className} style={style}><rect x="2" y="2" width="20" height="20" /></svg>;
  }
  if (type === "diamond") {
    return <svg viewBox="0 0 24 24" className={className} style={style}><polygon points="12,2 22,12 12,22 2,12" /></svg>;
  }
  return null;
}
```

### Variant C: Overlapping Blocks

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│    ┌─────────────┐                                                         │
│    │    HOME     │                                                         │
│    └──────┬──────┘                                                         │
│           │  ┌─────────────┐                                               │
│           └──│   ABOUT     │                                               │
│              └──────┬──────┘                                               │
│                     │  ┌─────────────────┐                                 │
│                     └──│  INSPIRATIONS   │                                 │
│                        └──────┬──────────┘                                 │
│                               │  ┌─────────────────┐                       │
│                               └──│   EXPERIMENTS   │                       │
│                                  └─────────────────┘                       │
│                                                                            │
│   Each block offset 20px right and 10px down from previous                 │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

```tsx
// components/constructivist/NavigationBlocks.tsx

export function NavigationBlocks() {
  const links = [
    { href: "/", label: "HOME", bg: "#1E5AA8" },
    { href: "/about", label: "ABOUT", bg: "#CC2936" },
    { href: "/inspirations", label: "INSPIRATIONS", bg: "#F4C430" },
    { href: "/experiments", label: "EXPERIMENTS", bg: "#0A0A0A" },
  ];
  
  return (
    <nav className="fixed top-8 left-8 z-30">
      {links.map((link, i) => (
        <a
          key={link.href}
          href={link.href}
          className="block px-4 py-2 font-display text-sm tracking-[0.15em] text-white hover:scale-105 transition-transform"
          style={{
            backgroundColor: link.bg,
            marginLeft: `${i * 24}px`,
            marginTop: i > 0 ? "-4px" : "0",
            position: "relative",
            zIndex: links.length - i,
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
```

---

## Cards

### Constructivist Card

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   CLASSIC CARD                         CONSTRUCTIVIST CARD                  │
│   ────────────                         ───────────────────                  │
│                                                                             │
│   ┌──────────────────┐                ╱─────────────────────╲               │
│   │                  │               ╱                       ╲              │
│   │     [IMAGE]      │              ╱      [IMAGE]            ╲             │
│   │                  │             ╱    (diagonal clip-path)   ╲            │
│   ├──────────────────┤            ╱_____________________________╲           │
│   │  Title           │           │                               │          │
│   │  Description     │           │  ▲ TITLE                      │          │
│   └──────────────────┘           │    Description text here      │          │
│                                  │              ──────────────●  │          │
│                                  └───────────────────────────────┘          │
│                                                                             │
│   ELEMENTS:                                                                 │
│   • Diagonal clip-path on image (var(--clip-diagonal-right))                │
│   • Shape prefix (●▲■) before title based on content type                   │
│   • Geometric accent line with shape terminator                             │
│   • Asymmetric padding (more on left)                                       │
│   • Subtle rotation on hover (transform: rotate(-2deg))                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```tsx
// components/constructivist/Card.tsx

interface CardProps {
  image?: string;
  title: string;
  description?: string;
  type?: "circle" | "triangle" | "square";
  href?: string;
  rotation?: number;
}

export function ConstructivistCard({
  image,
  title,
  description,
  type = "triangle",
  href,
  rotation = 0,
}: CardProps) {
  const shapes = {
    circle: { symbol: "●", color: "#1E5AA8" },
    triangle: { symbol: "▲", color: "#CC2936" },
    square: { symbol: "■", color: "#F4C430" },
  };
  
  const shape = shapes[type];
  
  const content = (
    <article
      className="group bg-[#F5F0E6] border border-[#0A0A0A]/15 overflow-hidden transition-transform hover:rotate-[-2deg] hover:shadow-lg"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Image with diagonal clip */}
      {image && (
        <div 
          className="h-48 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${image})`,
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
          }}
        />
      )}
      
      {/* Content */}
      <div className="p-6 pl-8">
        <h3 className="font-display text-xl tracking-[0.1em] text-[#0A0A0A] flex items-center gap-2">
          <span style={{ color: shape.color }}>{shape.symbol}</span>
          {title.toUpperCase()}
        </h3>
        
        {description && (
          <p className="mt-2 text-sm text-[#0A0A0A]/70 font-body leading-relaxed">
            {description}
          </p>
        )}
        
        {/* Geometric accent line */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-px bg-[#0A0A0A]/20" />
          <span style={{ color: shape.color }}>{shape.symbol}</span>
        </div>
      </div>
    </article>
  );
  
  if (href) {
    return <a href={href} className="block">{content}</a>;
  }
  
  return content;
}
```

---

## Buttons

### Button Variants

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   PRIMARY                SECONDARY              ACCENT          GHOST       │
│   ───────                ─────────              ──────          ─────       │
│                                                                             │
│   ┌───────────────┐     ┌───────────────┐      ▶ ACTION       [ TEXT ]     │
│   │  ACTION    ───┼──▶  │    ACTION     │      ────────       ─────────    │
│   └───────────────┘     └───────────────┘                                   │
│                                                                             │
│   • Red fill (#CC2936)  • Blue outline         • Red arrow     • No bg     │
│   • White text          • Blue text (#1E5AA8)    prefix        • Underline  │
│   • Arrow exits right   • No fill              • Wide track      on hover   │
│                                                                             │
│   HOVER STATES:                                                             │
│   • Scale 1.02                                                              │
│   • Rotate 2deg                                                             │
│   • Arrow slides right                                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```tsx
// components/constructivist/Button.tsx

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  children: React.ReactNode;
}

export function ConstructivistButton({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = "font-display text-sm tracking-[0.15em] uppercase transition-all duration-200 group";
  
  const variants = {
    primary: "bg-[#CC2936] text-white px-6 py-3 hover:scale-[1.02] hover:rotate-[2deg] flex items-center gap-3",
    secondary: "border-2 border-[#1E5AA8] text-[#1E5AA8] px-6 py-3 hover:bg-[#1E5AA8] hover:text-white",
    accent: "text-[#CC2936] flex items-center gap-2",
    ghost: "text-[#0A0A0A] relative hover:text-[#CC2936]",
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
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
```

---

## Hero Section

### Constructivist Hero Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ╲                                                                         │
│    ╲   K                                                                    │
│     ╲  E                         ┌──────────────────┐                       │
│      ╲ N                        ╱                    ╲                      │
│       ╲                        ╱    CIRCLE: Profile   ╲                     │
│        ╲ B                    ╱      image clipped     ╲                    │
│         ╲ U                  ╱        to circle         ╲                   │
│          ╲ I                ╱____________________________╲                  │
│           ╲                                                                 │
│                                                                             │
│        ■ DESIGNER                                                           │
│        ■ DEVELOPER                        ▲                                 │
│        ■ THINKER                         ╱ ╲                                │
│                                         ╱   ╲                               │
│        ─────────────────────────────────────────────                        │
│                                                                             │
│   ●  About   ▲  Inspirations   ■  Bookshelf   ◆  Experiments                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```tsx
// components/constructivist/Hero.tsx

export function ConstructivistHero({
  name = "KEN BUI",
  roles = ["DESIGNER", "DEVELOPER", "THINKER"],
  profileImage,
}: {
  name?: string;
  roles?: string[];
  profileImage?: string;
}) {
  return (
    <section className="relative min-h-screen bg-[#F5F0E6] overflow-hidden">
      {/* Diagonal background element */}
      <div 
        className="absolute top-0 left-0 w-1/3 h-full bg-[#0A0A0A]"
        style={{ clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)" }}
      />
      
      {/* Vertical name */}
      <div 
        className="absolute left-8 top-1/2 -translate-y-1/2 font-display text-4xl tracking-[0.3em] text-[#F5F0E6]"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg) translateY(50%)" }}
      >
        {name.split("").map((char, i) => (
          <span key={i} className="block">{char}</span>
        ))}
      </div>
      
      {/* Profile image - circle clipped */}
      {profileImage && (
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2">
          <div 
            className="w-64 h-64 rounded-full bg-cover bg-center border-4 border-[#1E5AA8]"
            style={{ backgroundImage: `url(${profileImage})` }}
          />
        </div>
      )}
      
      {/* Roles list with shape prefixes */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 space-y-2">
        {roles.map((role, i) => (
          <div key={i} className="flex items-center gap-3 font-display text-lg tracking-[0.15em]">
            <span className="text-[#F4C430]">■</span>
            <span className="text-[#0A0A0A]">{role}</span>
          </div>
        ))}
      </div>
      
      {/* Geometric divider */}
      <div className="absolute bottom-32 left-1/4 right-1/4 flex items-center gap-4">
        <div className="flex-1 h-0.5 bg-[#0A0A0A]" />
        <svg width="20" height="20" viewBox="0 0 20 20">
          <polygon points="10,0 20,20 0,20" fill="#CC2936" />
        </svg>
        <div className="flex-1 h-0.5 bg-[#0A0A0A]" />
      </div>
      
      {/* Shape-coded nav */}
      <nav className="absolute bottom-12 left-1/4 flex gap-8">
        {[
          { href: "/about", shape: "●", label: "About", color: "#1E5AA8" },
          { href: "/inspirations", shape: "▲", label: "Inspirations", color: "#CC2936" },
          { href: "/bookshelf", shape: "■", label: "Bookshelf", color: "#F4C430" },
          { href: "/experiments", shape: "◆", label: "Experiments", color: "#0A0A0A" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 font-display text-sm tracking-[0.1em] text-[#0A0A0A] hover:opacity-70 transition-opacity"
          >
            <span style={{ color: item.color }}>{item.shape}</span>
            {item.label}
          </a>
        ))}
      </nav>
    </section>
  );
}
```

---

## Section Headers

### Diagonal Header

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ╱──────────────────────────────────────────────────────────────────╲      │
│  ╱                                                                    ╲     │
│ ╱   A B O U T                                                          ╲    │
│╱_______________________________________________________________________ ╲   │
│                                                                             │
│   font: Bebas Neue                                                          │
│   tracking: 0.2em                                                           │
│   clip-path: polygon(0 20%, 100% 0, 100% 80%, 0 100%)                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```tsx
// components/constructivist/SectionHeader.tsx

interface SectionHeaderProps {
  title: string;
  variant?: "diagonal" | "vertical" | "block";
}

export function SectionHeader({ title, variant = "diagonal" }: SectionHeaderProps) {
  if (variant === "diagonal") {
    return (
      <header 
        className="bg-[#0A0A0A] py-12 px-16"
        style={{ clipPath: "polygon(0 15%, 100% 0, 100% 85%, 0 100%)" }}
      >
        <h1 className="font-display text-5xl md:text-7xl tracking-[0.2em] text-[#F5F0E6]">
          {title.split("").join(" ")}
        </h1>
      </header>
    );
  }
  
  if (variant === "vertical") {
    return (
      <header className="flex items-start gap-4">
        <div 
          className="font-display text-xl tracking-[0.3em] text-[#CC2936]"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {title}
        </div>
        <div className="w-px h-32 bg-[#0A0A0A]" />
      </header>
    );
  }
  
  if (variant === "block") {
    return (
      <header className="inline-block bg-[#CC2936] px-8 py-4">
        <h1 className="font-display text-3xl tracking-[0.15em] text-white">
          {title}
        </h1>
      </header>
    );
  }
  
  return null;
}
```

---

## List Components

### Shape-Prefixed Lists

```tsx
// components/constructivist/List.tsx

interface ListProps {
  items: string[];
  type?: "circle" | "triangle" | "square";
  numbered?: boolean;
}

export function ConstructivistList({ items, type = "triangle", numbered = false }: ListProps) {
  const shapes = {
    circle: { symbol: "●", color: "#1E5AA8" },
    triangle: { symbol: "▲", color: "#CC2936" },
    square: { symbol: "■", color: "#F4C430" },
  };
  
  const shape = shapes[type];
  
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          {numbered ? (
            <span 
              className="font-display text-2xl min-w-[2rem]"
              style={{ color: shape.color }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          ) : (
            <span style={{ color: shape.color }}>{shape.symbol}</span>
          )}
          <span className="font-body text-[#0A0A0A]">{item}</span>
        </li>
      ))}
    </ul>
  );
}
```

---

## Dividers

### Geometric Dividers

```tsx
// components/constructivist/Divider.tsx

interface DividerProps {
  variant?: "line" | "shapes" | "diagonal";
}

export function ConstructivistDivider({ variant = "line" }: DividerProps) {
  if (variant === "line") {
    return (
      <div className="flex items-center gap-4 my-8">
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
      <div className="flex items-center justify-center gap-6 my-8">
        <span className="text-xl text-[#1E5AA8]">●</span>
        <span className="text-xl text-[#CC2936]">▲</span>
        <span className="text-xl text-[#F4C430]">■</span>
      </div>
    );
  }
  
  if (variant === "diagonal") {
    return (
      <div 
        className="h-8 bg-[#CC2936] my-8"
        style={{ clipPath: "polygon(0 50%, 100% 0, 100% 50%, 0 100%)" }}
      />
    );
  }
  
  return null;
}
```

---

## Filter/Toggle Buttons

### Shape-Coded Filters

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   FILTER:  ▲ Poems   ● Essays   ■ Art   ◆ All                               │
│            ───────   ────────   ─────   ─────                               │
│            (active)                                                         │
│                                                                             │
│   Active state: filled shape, underline, bold text                          │
│   Inactive: outline shape, no underline                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```tsx
// components/constructivist/FilterButtons.tsx

interface FilterOption {
  id: string;
  label: string;
  shape: "circle" | "triangle" | "square" | "diamond";
}

interface FilterButtonsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterButtons({ options, value, onChange }: FilterButtonsProps) {
  const shapeSymbols = {
    circle: "●",
    triangle: "▲",
    square: "■",
    diamond: "◆",
  };
  
  const shapeColors = {
    circle: "#1E5AA8",
    triangle: "#CC2936",
    square: "#F4C430",
    diamond: "#0A0A0A",
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className="font-display text-xs tracking-[0.2em] text-[#0A0A0A]/60 mr-2">
        FILTER:
      </span>
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 font-display text-xs tracking-[0.15em] transition-all",
              isActive 
                ? "border-b-2 border-current font-bold" 
                : "opacity-60 hover:opacity-100"
            )}
            style={{ color: isActive ? shapeColors[option.shape] : "#0A0A0A" }}
          >
            <span>{shapeSymbols[option.shape]}</span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
```

---

## Summary

This component library includes:

1. **Loading Screen** — 4 variants with scaled animations (Gears, Suprematist, Factory, Minimal)
2. **Navigation** — 3 variants (Diagonal Bar, Vertical Sidebar, Overlapping Blocks)
3. **Cards** — Diagonal clip-paths, shape prefixes, geometric accents
4. **Buttons** — 4 variants (Primary, Secondary, Accent, Ghost)
5. **Hero Section** — Vertical text, circle-clipped images, shape-coded nav
6. **Section Headers** — 3 variants (Diagonal, Vertical, Block)
7. **Lists** — Shape-prefixed, numbered options
8. **Dividers** — 3 geometric styles
9. **Filter Buttons** — Shape-coded toggle buttons

Next: [constructivist-3-layouts.md](./constructivist-3-layouts.md) — Page Layouts
