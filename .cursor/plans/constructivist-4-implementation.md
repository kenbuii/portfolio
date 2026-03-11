# Constructivist Design System — Part 4: Implementation

Complete implementation guide: toggle system, state management, file structure, and integration.

---

## Rollback System

A persistent, always-visible toggle button ensures instant rollback to the classic design at any time.

### Floating Toggle Button (Always Visible)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   FLOATING TOGGLE — Fixed position, always accessible                       │
│   ────────────────────────────────────────────────────                      │
│                                                                             │
│                                                 ┌─────────────────────┐     │
│                                                 │ ● CLASSIC           │     │
│                                                 │ ▲ CONSTRUCTIVIST ◄──│     │
│                                                 └─────────────────────┘     │
│                                                        ↑                    │
│                                                   Fixed bottom-right        │
│                                                   z-index: 9999             │
│                                                   Always clickable          │
│                                                                             │
│   FEATURES:                                                                 │
│   • Persists to localStorage (survives refresh)                             │
│   • One-click instant switch                                                │
│   • Visual indicator of current mode                                        │
│   • Keyboard shortcut: Ctrl/Cmd + Shift + T                                 │
│   • Collapse to icon-only mode                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### React Component

```tsx
// components/DesignSystemToggle.tsx

import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function DesignSystemToggle() {
  const { designSystem, setDesignSystem } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  
  // Keyboard shortcut: Ctrl/Cmd + Shift + T
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
        e.preventDefault();
        setDesignSystem(designSystem === "classic" ? "constructivist" : "classic");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [designSystem, setDesignSystem]);
  
  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-6 right-6 z-[9999] w-12 h-12 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        title="Expand design toggle"
      >
        {designSystem === "constructivist" ? "▲" : "●"}
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-6 right-6 z-[9999] bg-white border border-[#0A0A0A]/20 rounded-lg shadow-xl p-1 flex flex-col gap-1">
      {/* Classic option */}
      <button
        onClick={() => setDesignSystem("classic")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded text-sm font-display tracking-wide transition-all",
          designSystem === "classic"
            ? "bg-[#2F4F4F] text-[#F5F0E6]"
            : "hover:bg-[#0A0A0A]/5"
        )}
      >
        <span className="text-[#1E5AA8]">●</span>
        CLASSIC
        {designSystem === "classic" && <span className="ml-auto text-xs">✓</span>}
      </button>
      
      {/* Constructivist option */}
      <button
        onClick={() => setDesignSystem("constructivist")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded text-sm font-display tracking-wide transition-all",
          designSystem === "constructivist"
            ? "bg-[#CC2936] text-white"
            : "hover:bg-[#CC2936]/10"
        )}
      >
        <span className="text-[#CC2936]">▲</span>
        CONSTRUCTIVIST
        {designSystem === "constructivist" && <span className="ml-auto text-xs">✓</span>}
      </button>
      
      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(true)}
        className="text-xs text-[#0A0A0A]/40 hover:text-[#0A0A0A]/60 text-center py-1"
      >
        minimize
      </button>
    </div>
  );
}
```

### Integration in App

```tsx
// App.tsx

import { DesignSystemToggle } from "@/components/DesignSystemToggle";

export default function App() {
  return (
    <>
      {/* Always render the toggle - it floats above everything */}
      <DesignSystemToggle />
      
      {/* Rest of app */}
      <Routes />
    </>
  );
}
```

### Rollback Guarantees

| Feature | Implementation |
|---------|----------------|
| **Instant switch** | Single click toggles immediately, no page reload needed |
| **Persisted state** | `localStorage.setItem("designSystem", value)` survives refresh |
| **Always accessible** | Fixed position, z-index: 9999, never hidden by modals |
| **Keyboard shortcut** | `Ctrl/Cmd + Shift + T` for power users |
| **Visual feedback** | Current mode clearly indicated with checkmark |
| **Collapsible** | Minimize to icon-only to reduce visual clutter |
| **No data loss** | Toggle only affects styling, not content/data |

---

## Architecture Overview

```mermaid
flowchart TD
    subgraph ExperimentsPage [Experiments Page]
        ThemeToggle[Design System Toggle]
        PreviewMode[Live Preview]
        ComponentPicker[Component Overrides]
    end
    
    subgraph ThemeContext [ThemeContext Provider]
        ActiveTheme[activeTheme: classic | constructivist]
        Components[componentOverrides: Map]
        LoadingVariant[loadingVariant: gears | suprematist | factory]
    end
    
    subgraph Router [Route Layer]
        ClassicRoutes[Classic Pages]
        ConstructivistRoutes[Constructivist Pages]
    end
    
    subgraph UI [Rendered UI]
        LoadingScreen
        Navigation
        Hero
        Cards
        Footer
    end
    
    ThemeToggle --> ActiveTheme
    ComponentPicker --> Components
    ActiveTheme --> Router
    Router --> ClassicRoutes
    Router --> ConstructivistRoutes
    ClassicRoutes --> UI
    ConstructivistRoutes --> UI
    ThemeContext --> LoadingScreen
```

---

## File Structure

```
client/src/
├── contexts/
│   └── ThemeContext.tsx              # Global design system state
│
├── components/
│   ├── constructivist/
│   │   ├── LoadingScreen.tsx         # Full-screen loading with scaled animations
│   │   ├── NavigationDiagonal.tsx    # Variant A: diagonal bar
│   │   ├── NavigationSidebar.tsx     # Variant B: shape icons
│   │   ├── NavigationBlocks.tsx      # Variant C: overlapping blocks
│   │   ├── Hero.tsx                  # Constructivist hero layout
│   │   ├── Card.tsx                  # Diagonal-clip cards
│   │   ├── Button.tsx                # Shape-prefixed buttons
│   │   ├── SectionHeader.tsx         # Diagonal/vertical headers
│   │   ├── Divider.tsx               # Geometric dividers
│   │   ├── List.tsx                  # Shape-prefixed lists
│   │   └── FilterButtons.tsx         # Shape-coded filters
│   │
│   └── experiments/
│       └── ThemePlayground.tsx       # Toggle UI for Experiments page
│
├── pages/
│   ├── Home.tsx                      # Switches between classic/constructivist
│   ├── About.tsx                     # Switches between classic/constructivist
│   └── Inspirations.tsx              # Switches between classic/constructivist
│
├── styles/
│   └── constructivist.css            # CSS variables, clip-paths, keyframes
│
└── lib/
    └── utils.ts                      # cn() helper, etc.
```

---

## Theme Context

### Implementation

```tsx
// contexts/ThemeContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type DesignSystem = "classic" | "constructivist";
type LoadingVariant = "gears" | "suprematist" | "factory" | "minimal";
type NavVariant = "diagonal" | "sidebar" | "blocks";

interface ThemeState {
  // Core toggle
  designSystem: DesignSystem;
  setDesignSystem: (ds: DesignSystem) => void;
  
  // Loading screen
  loadingVariant: LoadingVariant;
  setLoadingVariant: (v: LoadingVariant) => void;
  showLoading: boolean;
  setShowLoading: (show: boolean) => void;
  
  // Navigation variant
  navVariant: NavVariant;
  setNavVariant: (v: NavVariant) => void;
  
  // Component overrides (for fine-grained control)
  overrides: Record<string, string>;
  setOverride: (component: string, variant: string) => void;
  clearOverrides: () => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Persist to localStorage
  const [designSystem, setDesignSystem] = useState<DesignSystem>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("designSystem") as DesignSystem) || "classic";
    }
    return "classic";
  });
  
  const [loadingVariant, setLoadingVariant] = useState<LoadingVariant>("gears");
  const [showLoading, setShowLoading] = useState(true);
  const [navVariant, setNavVariant] = useState<NavVariant>("diagonal");
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  
  // Persist design system choice
  useEffect(() => {
    localStorage.setItem("designSystem", designSystem);
    document.documentElement.setAttribute("data-theme", designSystem);
  }, [designSystem]);
  
  const setOverride = (component: string, variant: string) => {
    setOverrides(prev => ({ ...prev, [component]: variant }));
  };
  
  const clearOverrides = () => setOverrides({});
  
  return (
    <ThemeContext.Provider value={{
      designSystem,
      setDesignSystem,
      loadingVariant,
      setLoadingVariant,
      showLoading,
      setShowLoading,
      navVariant,
      setNavVariant,
      overrides,
      setOverride,
      clearOverrides,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

// Emergency reset - can be called from browser console: window.resetDesignSystem()
if (typeof window !== "undefined") {
  (window as any).resetDesignSystem = () => {
    localStorage.setItem("designSystem", "classic");
    document.documentElement.setAttribute("data-theme", "classic");
    window.location.reload();
    console.log("✓ Design system reset to classic");
  };
}
```

### Wrapping the App

```tsx
// main.tsx

import { ThemeProvider } from "./contexts/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

---

## Theme Playground (Experiments Page Tab)

### Full Implementation

```tsx
// components/experiments/ThemePlayground.tsx

import { useTheme } from "@/contexts/ThemeContext";
import { LoadingScreen } from "@/components/constructivist/LoadingScreen";
import { ConstructivistCard } from "@/components/constructivist/Card";
import { ConstructivistButton } from "@/components/constructivist/Button";
import { SectionHeader } from "@/components/constructivist/SectionHeader";
import { ConstructivistDivider } from "@/components/constructivist/Divider";
import { useState } from "react";

export function ThemePlayground() {
  const { 
    designSystem, 
    setDesignSystem, 
    loadingVariant, 
    setLoadingVariant,
    navVariant,
    setNavVariant,
  } = useTheme();
  
  const [previewLoading, setPreviewLoading] = useState(false);
  
  return (
    <div className="space-y-12">
      {/* Design System Toggle */}
      <section>
        <h2 className="text-xl font-display tracking-wide mb-6">DESIGN SYSTEM</h2>
        
        <div className="flex gap-4">
          <button
            onClick={() => setDesignSystem("classic")}
            className={`px-6 py-3 font-display text-sm tracking-wide transition-all ${
              designSystem === "classic"
                ? "bg-[#2F4F4F] text-[#F5F0E6]"
                : "border border-[#0A0A0A]/20 hover:border-[#0A0A0A]/40"
            }`}
          >
            CLASSIC (Current)
          </button>
          <button
            onClick={() => setDesignSystem("constructivist")}
            className={`px-6 py-3 font-display text-sm tracking-wide transition-all ${
              designSystem === "constructivist"
                ? "bg-[#CC2936] text-white"
                : "border border-[#0A0A0A]/20 hover:border-[#CC2936]"
            }`}
          >
            CONSTRUCTIVIST
          </button>
        </div>
        
        <p className="mt-4 text-sm text-[#0A0A0A]/60">
          {designSystem === "constructivist" 
            ? "Radical Constructivist/Bauhaus design active. Navigate to Home, About, or Inspirations to see the full effect."
            : "Classic mid-century modern design active."}
        </p>
      </section>
      
      {/* Loading Screen Variants */}
      <section>
        <h2 className="text-xl font-display tracking-wide mb-6">LOADING SCREEN VARIANT</h2>
        
        <div className="grid grid-cols-4 gap-4">
          {(["gears", "suprematist", "factory", "minimal"] as const).map((variant) => (
            <button
              key={variant}
              onClick={() => setLoadingVariant(variant)}
              className={`p-4 border text-center font-display text-sm tracking-wide uppercase transition-all ${
                loadingVariant === variant
                  ? "border-[#CC2936] bg-[#CC2936]/10"
                  : "border-[#0A0A0A]/20 hover:border-[#0A0A0A]/40"
              }`}
            >
              {variant}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setPreviewLoading(true)}
          className="mt-4 px-6 py-2 bg-[#0A0A0A] text-white font-display text-sm tracking-wide"
        >
          PREVIEW LOADING SCREEN
        </button>
        
        {previewLoading && (
          <LoadingScreen
            variant={loadingVariant}
            onComplete={() => setPreviewLoading(false)}
            duration={3000}
          />
        )}
      </section>
      
      {/* Navigation Variants */}
      <section>
        <h2 className="text-xl font-display tracking-wide mb-6">NAVIGATION VARIANT</h2>
        
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: "diagonal", label: "Diagonal Bar", desc: "Angled header navigation" },
            { id: "sidebar", label: "Vertical Sidebar", desc: "Shape icons on left edge" },
            { id: "blocks", label: "Overlapping Blocks", desc: "Staggered color blocks" },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => setNavVariant(nav.id as any)}
              className={`p-4 border text-left transition-all ${
                navVariant === nav.id
                  ? "border-[#1E5AA8] bg-[#1E5AA8]/10"
                  : "border-[#0A0A0A]/20 hover:border-[#0A0A0A]/40"
              }`}
            >
              <div className="font-display text-sm tracking-wide">{nav.label}</div>
              <div className="text-xs text-[#0A0A0A]/60 mt-1">{nav.desc}</div>
            </button>
          ))}
        </div>
      </section>
      
      {/* Component Previews */}
      <section>
        <h2 className="text-xl font-display tracking-wide mb-6">COMPONENT PREVIEW</h2>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Cards */}
          <div>
            <h3 className="text-sm font-display tracking-wide mb-4 text-[#0A0A0A]/60">CARDS</h3>
            <ConstructivistCard
              title="Sample Card"
              description="This card uses diagonal clip-paths and shape prefixes."
              type="triangle"
            />
          </div>
          
          {/* Buttons */}
          <div>
            <h3 className="text-sm font-display tracking-wide mb-4 text-[#0A0A0A]/60">BUTTONS</h3>
            <div className="space-y-4">
              <ConstructivistButton variant="primary">Primary Action</ConstructivistButton>
              <ConstructivistButton variant="secondary">Secondary</ConstructivistButton>
              <ConstructivistButton variant="accent">Accent</ConstructivistButton>
              <ConstructivistButton variant="ghost">Ghost Button</ConstructivistButton>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Headers */}
      <section>
        <h2 className="text-xl font-display tracking-wide mb-6">SECTION HEADERS</h2>
        
        <div className="space-y-8">
          <div>
            <span className="text-xs text-[#0A0A0A]/60 block mb-2">Diagonal</span>
            <SectionHeader title="ABOUT" variant="diagonal" />
          </div>
          <div>
            <span className="text-xs text-[#0A0A0A]/60 block mb-2">Vertical</span>
            <SectionHeader title="INSPIRATIONS" variant="vertical" />
          </div>
          <div>
            <span className="text-xs text-[#0A0A0A]/60 block mb-2">Block</span>
            <SectionHeader title="CONTACT" variant="block" />
          </div>
        </div>
      </section>
      
      {/* Dividers */}
      <section>
        <h2 className="text-xl font-display tracking-wide mb-6">DIVIDERS</h2>
        
        <div className="space-y-8">
          <div>
            <span className="text-xs text-[#0A0A0A]/60 block mb-2">Line with shape</span>
            <ConstructivistDivider variant="line" />
          </div>
          <div>
            <span className="text-xs text-[#0A0A0A]/60 block mb-2">Three shapes</span>
            <ConstructivistDivider variant="shapes" />
          </div>
          <div>
            <span className="text-xs text-[#0A0A0A]/60 block mb-2">Diagonal bar</span>
            <ConstructivistDivider variant="diagonal" />
          </div>
        </div>
      </section>
    </div>
  );
}
```

### Adding to Experiments Page

```tsx
// pages/Experiments.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimationsTab } from "@/components/experiments/AnimationsTab";
import { TypographyTab } from "@/components/experiments/TypographyTab";
import { LayoutTab } from "@/components/experiments/LayoutTab";
import { HierarchyTab } from "@/components/experiments/HierarchyTab";
import { ColorTab } from "@/components/experiments/ColorTab";
import { ThemePlayground } from "@/components/experiments/ThemePlayground";

export default function Experiments() {
  return (
    <Layout>
      <main className="max-w-6xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-display tracking-wide mb-8">EXPERIMENTS</h1>
        
        <Tabs defaultValue="theme">
          <TabsList>
            <TabsTrigger value="theme">Design System</TabsTrigger>
            <TabsTrigger value="animations">Animations</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
            <TabsTrigger value="color">Color</TabsTrigger>
          </TabsList>
          
          <TabsContent value="theme">
            <ThemePlayground />
          </TabsContent>
          <TabsContent value="animations">
            <AnimationsTab />
          </TabsContent>
          <TabsContent value="typography">
            <TypographyTab />
          </TabsContent>
          <TabsContent value="layout">
            <LayoutTab />
          </TabsContent>
          <TabsContent value="hierarchy">
            <HierarchyTab />
          </TabsContent>
          <TabsContent value="color">
            <ColorTab />
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
}
```

---

## Page Integration

### Conditional Rendering Pattern

```tsx
// pages/Home.tsx

import { useTheme } from "@/contexts/ThemeContext";
import HomeClassic from "@/components/classic/Home";
import HomeConstructivist from "@/components/constructivist/Home";

export default function Home() {
  const { designSystem } = useTheme();
  
  if (designSystem === "constructivist") {
    return <HomeConstructivist />;
  }
  
  return <HomeClassic />;
}
```

### Alternative: Lazy Loading

```tsx
// pages/Home.tsx

import { useTheme } from "@/contexts/ThemeContext";
import { lazy, Suspense } from "react";
import { LoadingScreen } from "@/components/constructivist/LoadingScreen";

const HomeClassic = lazy(() => import("@/components/classic/Home"));
const HomeConstructivist = lazy(() => import("@/components/constructivist/Home"));

export default function Home() {
  const { designSystem, loadingVariant } = useTheme();
  
  return (
    <Suspense fallback={<LoadingScreen variant={loadingVariant} />}>
      {designSystem === "constructivist" 
        ? <HomeConstructivist /> 
        : <HomeClassic />}
    </Suspense>
  );
}
```

---

## CSS Variables & Styles

### constructivist.css

```css
/* styles/constructivist.css */

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTRUCTIVIST DESIGN SYSTEM
   ═══════════════════════════════════════════════════════════════════════════ */

/* Colors */
:root[data-theme="constructivist"] {
  /* Primary Palette */
  --color-revolutionary-red: hsl(355 65% 48%);
  --color-bauhaus-blue: hsl(216 70% 39%);
  --color-primary-yellow: hsl(47 90% 57%);
  --color-near-black: hsl(0 0% 4%);
  --color-paper: hsl(40 35% 93%);
  
  /* Semantic Mapping */
  --background: var(--color-paper);
  --foreground: var(--color-near-black);
  --primary: var(--color-revolutionary-red);
  --primary-foreground: white;
  --secondary: var(--color-bauhaus-blue);
  --secondary-foreground: white;
  --accent: var(--color-primary-yellow);
  --accent-foreground: var(--color-near-black);
  --muted: hsl(40 20% 88%);
  --muted-foreground: hsl(0 0% 35%);
  --border: hsl(0 0% 4% / 0.15);
  
  /* Shape Colors */
  --color-circle: var(--color-bauhaus-blue);
  --color-triangle: var(--color-revolutionary-red);
  --color-square: var(--color-primary-yellow);
}

/* Clip Paths */
:root[data-theme="constructivist"] {
  --clip-diagonal-right: polygon(0 0, 100% 10%, 100% 100%, 0 90%);
  --clip-diagonal-left: polygon(0 10%, 100% 0, 100% 90%, 0 100%);
  --clip-diagonal-steep: polygon(0 0, 100% 20%, 100% 100%, 0 80%);
  --clip-header: polygon(0 15%, 100% 0, 100% 85%, 0 100%);
  --clip-footer: polygon(0 30%, 100% 0, 100% 100%, 0 100%);
  --clip-triangle-up: polygon(50% 0%, 100% 100%, 0% 100%);
  --clip-triangle-right: polygon(0 0, 100% 50%, 0 100%);
  --clip-wedge: polygon(0 20%, 0 80%, 100% 50%);
  --clip-corner-tr: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
}

/* Easing & Timing */
:root[data-theme="constructivist"] {
  --ease-constructivist: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-stepped: steps(8);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 600ms;
  --duration-dramatic: 1000ms;
}

/* Typography */
:root[data-theme="constructivist"] {
  --font-display: 'Bebas Neue', Impact, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

@keyframes slideInDiagonal {
  from {
    transform: translateY(-100%) rotate(-5deg);
    opacity: 0;
  }
  to {
    transform: translateY(0) rotate(0);
    opacity: 1;
  }
}

@keyframes letterReveal {
  from {
    opacity: 0;
    transform: translateY(20px) rotate(-10deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
}

@keyframes cardSettle {
  from {
    opacity: 0;
    transform: translateY(30px) rotate(calc(var(--rotation, 0deg) + 5deg));
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(var(--rotation, 0deg));
  }
}

@keyframes shapeHover {
  0%, 100% {
    transform: scale(1) rotate(0);
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes lineGrow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITY CLASSES
   ═══════════════════════════════════════════════════════════════════════════ */

/* Rotation utilities */
.rotate-5 { transform: rotate(5deg); }
.rotate-15 { transform: rotate(15deg); }
.rotate-30 { transform: rotate(30deg); }
.rotate-45 { transform: rotate(45deg); }
.-rotate-5 { transform: rotate(-5deg); }
.-rotate-15 { transform: rotate(-15deg); }
.-rotate-30 { transform: rotate(-30deg); }
.-rotate-45 { transform: rotate(-45deg); }

/* Skew utilities */
.skew-x-5 { transform: skewX(5deg); }
.skew-x-15 { transform: skewX(15deg); }
.-skew-x-5 { transform: skewX(-5deg); }
.-skew-x-15 { transform: skewX(-15deg); }

/* Vertical text */
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.vertical-text-reversed {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}

/* Shape prefixes */
.shape-circle::before { content: "●"; margin-right: 0.5em; color: var(--color-circle); }
.shape-triangle::before { content: "▲"; margin-right: 0.5em; color: var(--color-triangle); }
.shape-square::before { content: "■"; margin-right: 0.5em; color: var(--color-square); }
.shape-diamond::before { content: "◆"; margin-right: 0.5em; }

/* Clip-path utilities */
.clip-diagonal-right { clip-path: var(--clip-diagonal-right); }
.clip-diagonal-left { clip-path: var(--clip-diagonal-left); }
.clip-diagonal-steep { clip-path: var(--clip-diagonal-steep); }
.clip-header { clip-path: var(--clip-header); }
.clip-footer { clip-path: var(--clip-footer); }
.clip-triangle { clip-path: var(--clip-triangle-up); }
.clip-wedge { clip-path: var(--clip-wedge); }

/* Animation utilities */
.animate-slide-diagonal { animation: slideInDiagonal var(--duration-normal) var(--ease-constructivist); }
.animate-letter-reveal { animation: letterReveal var(--duration-fast) var(--ease-constructivist) backwards; }
.animate-card-settle { animation: cardSettle var(--duration-normal) var(--ease-constructivist) backwards; }
.animate-shape-hover:hover { animation: shapeHover var(--duration-normal) var(--ease-constructivist); }
.animate-fade-up { animation: fadeInUp var(--duration-normal) var(--ease-constructivist) backwards; }
.animate-line-grow { animation: lineGrow var(--duration-slow) var(--ease-constructivist); transform-origin: left; }

/* Stagger delays */
.stagger-1 { animation-delay: 50ms; }
.stagger-2 { animation-delay: 100ms; }
.stagger-3 { animation-delay: 150ms; }
.stagger-4 { animation-delay: 200ms; }
.stagger-5 { animation-delay: 250ms; }
.stagger-6 { animation-delay: 300ms; }
.stagger-7 { animation-delay: 350ms; }
.stagger-8 { animation-delay: 400ms; }
```

### Import in index.css

```css
/* index.css */

@import "./styles/constructivist.css";

/* Rest of your existing styles... */
```

---

## Fonts Setup

### Google Fonts (recommended)

```html
<!-- index.html -->
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
</head>
```

### Self-hosted alternative

```css
/* fonts.css */
@font-face {
  font-family: 'Bebas Neue';
  src: url('/fonts/BebasNeue-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'DM Sans';
  src: url('/fonts/DMSans-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'DM Sans';
  src: url('/fonts/DMSans-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'DM Sans';
  src: url('/fonts/DMSans-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

---

## Loading Screen Integration

### Using Existing Animations

The LoadingScreen component imports and scales existing animations from AnimationsTab:

```tsx
// components/constructivist/LoadingScreen.tsx

import { 
  ConstructivistGears, 
  SuprematistLoader, 
  FactoryCogs 
} from "@/components/experiments/AnimationsTab";

// These are wrapped in a container with transform: scale(2)
// to make them prominent on the full-screen loading view
```

### Route-Level Loading

```tsx
// App.tsx

import { useTheme } from "@/contexts/ThemeContext";
import { LoadingScreen } from "@/components/constructivist/LoadingScreen";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function App() {
  const { designSystem, loadingVariant } = useTheme();
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();
  
  // Show loading on route change (only for constructivist)
  useEffect(() => {
    if (designSystem === "constructivist") {
      setLoading(true);
    }
  }, [location, designSystem]);
  
  return (
    <>
      {loading && designSystem === "constructivist" && (
        <LoadingScreen 
          variant={loadingVariant}
          onComplete={() => setLoading(false)}
          duration={2000}
        />
      )}
      
      {/* Routes */}
    </>
  );
}
```

---

## Implementation Checklist

### Phase 1: Foundation (Priority)
- [ ] Create `ThemeContext.tsx` with toggle state
- [ ] Create `constructivist.css` with variables and utilities
- [ ] Add Google Fonts to `index.html`
- [ ] Wrap app in `ThemeProvider`

### Phase 2: Loading Screen
- [ ] Create `LoadingScreen.tsx` component
- [ ] Import existing animations from AnimationsTab
- [ ] Add 2x scaling container
- [ ] Implement fade-out animation
- [ ] Add text cycling (LOADING / CONSTRUCTING / BUILDING)

### Phase 3: Core Components
- [ ] Create `NavigationDiagonal.tsx`
- [ ] Create `Card.tsx` with diagonal clip-paths
- [ ] Create `Button.tsx` with shape variants
- [ ] Create `SectionHeader.tsx` with 3 variants
- [ ] Create `Divider.tsx` with 3 styles

### Phase 4: Page Layouts
- [ ] Create constructivist `Home.tsx`
- [ ] Create constructivist `About.tsx`
- [ ] Create constructivist `Inspirations.tsx`

### Phase 5: Experiments Integration
- [ ] Create `ThemePlayground.tsx` tab
- [ ] Add to Experiments page tabs
- [ ] Add loading screen preview
- [ ] Add navigation variant picker
- [ ] Add component previews

### Phase 6: Polish
- [ ] Page load animation sequences
- [ ] Staggered card animations
- [ ] Hover micro-interactions
- [ ] Responsive adjustments

---

## Summary

This implementation provides:

1. **ThemeContext** — Global state for design system toggle, loading variants, nav variants
2. **ThemePlayground** — Full UI for toggling all options in Experiments page
3. **LoadingScreen** — Scaled animations (Gears, Suprematist, Factory, Minimal)
4. **constructivist.css** — All CSS variables, clip-paths, animations, utilities
5. **Page Integration** — Conditional rendering based on `designSystem` state
6. **Route-level loading** — Show loading screen on page transitions

The toggle system allows seamless switching between classic and constructivist design systems, with all state persisted to localStorage.
