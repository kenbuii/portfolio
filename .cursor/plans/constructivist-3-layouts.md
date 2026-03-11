# Constructivist Design System — Part 3: Page Layouts

Complete page layouts for Home, About, and Inspirations in radical Constructivist style.

---

## Page Structure Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   PAGE ANATOMY                                                              │
│   ────────────                                                              │
│                                                                             │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │                        LOADING SCREEN                             │    │
│   │                  (ConstructivistGears or Suprematist)             │    │
│   │                        z-index: 50                                │    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                               │                                             │
│                               ▼ fade out after 2-3s                         │
│                                                                             │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │ NAVIGATION                                                        │    │
│   │ (Diagonal Bar or Vertical Sidebar)                                │    │
│   ├───────────────────────────────────────────────────────────────────┤    │
│   │                                                                   │    │
│   │                         PAGE CONTENT                              │    │
│   │                                                                   │    │
│   │   ┌─────────────────────────────────────────────────────────┐    │    │
│   │   │ SECTION HEADER (diagonal/vertical)                      │    │    │
│   │   └─────────────────────────────────────────────────────────┘    │    │
│   │                                                                   │    │
│   │   ┌──────────────────┐  ┌──────────────────────────────────┐    │    │
│   │   │                  │  │                                  │    │    │
│   │   │  7-col content   │  │      5-col content               │    │    │
│   │   │  (asymmetric)    │  │      (asymmetric)                │    │    │
│   │   │                  │  │                                  │    │    │
│   │   └──────────────────┘  └──────────────────────────────────┘    │    │
│   │                                                                   │    │
│   │   ════════════▲════════════  (geometric divider)                 │    │
│   │                                                                   │    │
│   ├───────────────────────────────────────────────────────────────────┤    │
│   │ FOOTER (diagonal bar, red)                                        │    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Home Page

### Full Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   HOME PAGE — RADICAL CONSTRUCTIVIST                                        │
│   ──────────────────────────────────                                        │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                                                                     │  │
│   │ ╲                                                                   │  │
│   │  ╲   HOME    ABOUT    INSPIRATIONS    EXPERIMENTS                   │  │
│   │   ╲_______________________________________________________________  │  │
│   │    ╲                                                           ╲    │  │
│   │                                                                     │  │
│   ├─────────────────────────────────────────────────────────────────────┤  │
│   │                                                                     │  │
│   │   ╲                                                                 │  │
│   │    ╲                                                                │  │
│   │     ╲   K                                                           │  │
│   │      ╲  E                                                           │  │
│   │       ╲ N                    ┌──────────────────┐                   │  │
│   │        ╲                    ╱                    ╲                  │  │
│   │         ╲ B                │    ┌──────────────┐ │                  │  │
│   │          ╲ U               │    │              │ │                  │  │
│   │           ╲ I              │    │  [PROFILE]   │ │   CIRCLE         │  │
│   │            ╲               │    │              │ │   CLIPPED        │  │
│   │             ╲              │    └──────────────┘ │   PHOTO          │  │
│   │                            │                     │                  │  │
│   │                             ╲                   ╱                   │  │
│   │                              ╲_________________╱                    │  │
│   │                                                                     │  │
│   │          ■ DESIGNER                             ▲                   │  │
│   │          ■ DEVELOPER                           ╱ ╲                  │  │
│   │          ■ THINKER                            ╱   ╲  Decorative     │  │
│   │                                              ╱     ╲ triangle       │  │
│   │          ─────────────────────────────────────────────────          │  │
│   │                                                                     │  │
│   │   ●  About    ▲  Inspirations    ■  Bookshelf    ◆  Experiments     │  │
│   │                                                                     │  │
│   ├─────────────────────────────────────────────────────────────────────┤  │
│   │ ╲                                                               ╱   │  │
│   │  ╲  kenbui.net  ·  2024                                        ╱    │  │
│   │   ╲___________________________________________________________╱     │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### React Implementation

```tsx
// pages/Home.tsx (Constructivist variant)

import { NavigationDiagonal } from "@/components/constructivist/NavigationDiagonal";
import { ConstructivistHero } from "@/components/constructivist/Hero";
import { LoadingScreen } from "@/components/constructivist/LoadingScreen";
import { useState } from "react";

export default function HomeConstructivist() {
  const [loading, setLoading] = useState(true);
  
  return (
    <>
      {loading && (
        <LoadingScreen 
          variant="gears" 
          onComplete={() => setLoading(false)} 
        />
      )}
      
      <div className="min-h-screen bg-[#F5F0E6]">
        <NavigationDiagonal />
        
        <ConstructivistHero
          name="KEN BUI"
          roles={["DESIGNER", "DEVELOPER", "THINKER"]}
          profileImage="/images/profile.jpg"
        />
        
        {/* Footer */}
        <footer 
          className="bg-[#CC2936] py-6 px-8 text-[#F5F0E6] font-display text-sm tracking-[0.15em]"
          style={{ clipPath: "polygon(0 30%, 100% 0, 100% 100%, 0 100%)" }}
        >
          <div className="flex justify-between items-center">
            <span>KENBUI.NET</span>
            <span>2024</span>
          </div>
        </footer>
      </div>
    </>
  );
}
```

### CSS Grid Structure

```css
.home-hero {
  display: grid;
  grid-template-columns: 80px 1fr 1fr 80px;
  grid-template-rows: 1fr auto;
  min-height: 100vh;
  gap: 2rem;
}

.home-vertical-name {
  grid-column: 1;
  grid-row: 1 / -1;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.home-profile {
  grid-column: 3;
  grid-row: 1;
  justify-self: center;
  align-self: center;
}

.home-roles {
  grid-column: 2;
  grid-row: 1;
  align-self: center;
}

.home-nav {
  grid-column: 2 / 4;
  grid-row: 2;
}
```

---

## About Page

### Full Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ABOUT PAGE — RADICAL CONSTRUCTIVIST                                       │
│   ───────────────────────────────────                                       │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                                                                     │  │
│   │   ╱─────────────────────────────────────────────────────────────╲   │  │
│   │  ╱                                                               ╲  │  │
│   │ ╱   A B O U T                                                     ╲ │  │
│   │╱_____________________________________________________________________╲│  │
│   │                                                                     │  │
│   │   ┌────────────────┐                                                │  │
│   │   │                │                                                │  │
│   │   │  [PORTRAIT]    │        ● WHO I AM                              │  │
│   │   │  triangle      │        ───────────────────────────────         │  │
│   │   │  clip-path     │        I'm a designer and developer who        │  │
│   │   │     ▲          │        believes in the power of purposeful     │  │
│   │   │                │        design. Every pixel has meaning.        │  │
│   │   └────────────────┘                                                │  │
│   │                                                                     │  │
│   │   ┌─────┐  ┌─────┐          ▲ WHAT I BUILD                          │  │
│   │   │ ●   │  │ ▲   │          ───────────────────────────────         │  │
│   │   │IMG 1│  │IMG 2│          Experiences that challenge and          │  │
│   │   │     │  │     │          delight. Systems that scale.            │  │
│   │   └─────┘  └─────┘          Tools that empower.                     │  │
│   │         ┌─────┐                                                     │  │
│   │         │ ■   │             ■ HOW I WORK                            │  │
│   │         │IMG 3│             ───────────────────────────────         │  │
│   │         │     │             With intention, craft, and purpose.     │  │
│   │         └─────┘             Collaboration is key.                   │  │
│   │                                                                     │  │
│   │   ════════════════════════════════════════════════════════════      │  │
│   │                                                                     │  │
│   │   EXPERIENCE                                                        │  │
│   │   ──────────                                                        │  │
│   │                                                                     │  │
│   │   01  Company Name                                    2020-2024     │  │
│   │       Role Title                                                    │  │
│   │       ────────────────────────────────────────────                  │  │
│   │                                                                     │  │
│   │   02  Previous Company                                2018-2020     │  │
│   │       Role Title                                                    │  │
│   │       ────────────────────────────────────────────                  │  │
│   │                                                                     │  │
│   │   ╲                                                             ╱   │  │
│   │    ╲  Red diagonal footer bar                                  ╱    │  │
│   │     ╲_________________________________________________________╱     │  │
│   │                                                                     │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### React Implementation

```tsx
// pages/About.tsx (Constructivist variant)

import { NavigationDiagonal } from "@/components/constructivist/NavigationDiagonal";
import { SectionHeader } from "@/components/constructivist/SectionHeader";
import { ConstructivistDivider } from "@/components/constructivist/Divider";
import { LoadingScreen } from "@/components/constructivist/LoadingScreen";
import { useState } from "react";

export default function AboutConstructivist() {
  const [loading, setLoading] = useState(true);
  
  const sections = [
    { 
      shape: "circle", 
      title: "WHO I AM", 
      content: "I'm a designer and developer who believes in the power of purposeful design. Every pixel has meaning." 
    },
    { 
      shape: "triangle", 
      title: "WHAT I BUILD", 
      content: "Experiences that challenge and delight. Systems that scale. Tools that empower." 
    },
    { 
      shape: "square", 
      title: "HOW I WORK", 
      content: "With intention, craft, and purpose. Collaboration is key." 
    },
  ];
  
  const experience = [
    { id: "01", company: "Company Name", role: "Role Title", years: "2020-2024" },
    { id: "02", company: "Previous Company", role: "Role Title", years: "2018-2020" },
  ];
  
  return (
    <>
      {loading && (
        <LoadingScreen 
          variant="suprematist" 
          onComplete={() => setLoading(false)} 
        />
      )}
      
      <div className="min-h-screen bg-[#F5F0E6]">
        <NavigationDiagonal />
        
        {/* Header */}
        <SectionHeader title="ABOUT" variant="diagonal" />
        
        {/* Main content */}
        <main className="max-w-6xl mx-auto px-8 py-16">
          <div className="grid grid-cols-12 gap-8">
            {/* Left column - Images */}
            <div className="col-span-4 space-y-4">
              {/* Main portrait with triangle clip */}
              <div 
                className="aspect-[3/4] bg-cover bg-center"
                style={{ 
                  backgroundImage: "url(/images/portrait.jpg)",
                  clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                }}
              />
              
              {/* Smaller gallery */}
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-[#1E5AA8] flex items-center justify-center">
                  <span className="text-4xl text-[#F5F0E6]">●</span>
                </div>
                <div className="aspect-square bg-[#CC2936] flex items-center justify-center">
                  <span className="text-4xl text-[#F5F0E6]">▲</span>
                </div>
              </div>
              <div className="w-1/2 mx-auto aspect-square bg-[#F4C430] flex items-center justify-center">
                <span className="text-4xl text-[#0A0A0A]">■</span>
              </div>
            </div>
            
            {/* Right column - Text content */}
            <div className="col-span-8 space-y-12">
              {sections.map((section) => {
                const shapes = {
                  circle: { symbol: "●", color: "#1E5AA8" },
                  triangle: { symbol: "▲", color: "#CC2936" },
                  square: { symbol: "■", color: "#F4C430" },
                };
                const shape = shapes[section.shape as keyof typeof shapes];
                
                return (
                  <div key={section.title}>
                    <h2 className="font-display text-2xl tracking-[0.15em] text-[#0A0A0A] flex items-center gap-3 mb-4">
                      <span style={{ color: shape.color }}>{shape.symbol}</span>
                      {section.title}
                    </h2>
                    <div className="w-48 h-0.5 bg-[#0A0A0A] mb-4" />
                    <p className="font-body text-lg leading-relaxed text-[#0A0A0A]/80 max-w-xl">
                      {section.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          
          <ConstructivistDivider variant="line" />
          
          {/* Experience section */}
          <section className="mt-16">
            <h2 className="font-display text-3xl tracking-[0.15em] text-[#0A0A0A] mb-8">
              EXPERIENCE
            </h2>
            
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="flex gap-6">
                  <span className="font-display text-3xl text-[#CC2936]">{exp.id}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-display text-xl tracking-[0.1em]">{exp.company}</h3>
                      <span className="font-body text-sm text-[#0A0A0A]/60">{exp.years}</span>
                    </div>
                    <p className="font-body text-[#0A0A0A]/70">{exp.role}</p>
                    <div className="mt-2 h-px bg-[#0A0A0A]/20" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer 
          className="bg-[#CC2936] py-6 px-8 text-[#F5F0E6] font-display text-sm tracking-[0.15em]"
          style={{ clipPath: "polygon(0 30%, 100% 0, 100% 100%, 0 100%)" }}
        />
      </div>
    </>
  );
}
```

### Grid Overlay

```css
.about-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem;
}

.about-images {
  grid-column: 1 / 5;  /* 4 columns */
}

.about-content {
  grid-column: 5 / 13; /* 8 columns */
}

/* Image gallery - staggered collage */
.about-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto auto;
  gap: 1rem;
}

.about-gallery-main {
  grid-column: 1 / -1;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}

.about-gallery-thumb-1 {
  grid-column: 1;
}

.about-gallery-thumb-2 {
  grid-column: 2;
}

.about-gallery-thumb-3 {
  grid-column: 1 / -1;
  width: 50%;
  margin: 0 auto;
}
```

---

## Inspirations Page

### Full Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   INSPIRATIONS PAGE — RADICAL CONSTRUCTIVIST (Collage Layout)               │
│   ───────────────────────────────────────────────────────────               │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                                                                     │  │
│   │ I  ════════════════════════════════════════════════════════════     │  │
│   │ N                                                                   │  │
│   │ S   FILTER:  ▲ Poems   ● Essays   ■ Art   ◆ All                     │  │
│   │ P            ───────                                                │  │
│   │ I                                                                   │  │
│   │ R    ┌──────────────┐        ╱─────────────────────────╲            │  │
│   │ A    │              │       ╱                           ╲           │  │
│   │ T    │    POEM      │      ╱                             ╲          │  │
│   │ I    │    CARD      │     ╱      V I S U A L   A R T      ╲         │  │
│   │ O    │              │    ╱        (large feature card)     ╲        │  │
│   │ N    │     ▲        │   ╱                                   ╲       │  │
│   │ S    │              │  ╱   Blurb about the artwork and       ╲      │  │
│   │      └──────────────┘ ╱    why it resonates...                ╲     │  │
│   │           rotate(-3°) ╲_____________________________________╱       │  │
│   │                                                                     │  │
│   │         ┌──────────────────────────────────┐    ┌────────────┐      │  │
│   │         │                                  │    │            │      │  │
│   │         │      E S S A Y   E X C E R P T   │    │   QUOTE    │      │  │
│   │         │         (wide card layout)       │    │   CARD     │      │  │
│   │         │                                  │    │     ●      │      │  │
│   │         │              ■                   │    │            │      │  │
│   │         └──────────────────────────────────┘    └────────────┘      │  │
│   │                rotate(2°)                          rotate(-5°)      │  │
│   │                                                                     │  │
│   │    ┌────────────┐   ╱─────────────╲   ┌────────────────────────┐    │  │
│   │    │            │  ╱               ╲  │                        │    │  │
│   │    │   POEM 2   │ ╱    ART PIECE    ╲ │     ESSAY EXCERPT 2    │    │  │
│   │    │     ▲      │╱                   ╲│           ■            │    │  │
│   │    └────────────┘╲                   ╱└────────────────────────┘    │  │
│   │                   ╲_________________╱                               │  │
│   │                                                                     │  │
│   │   ═══════════════════════════════════════════════════════════════   │  │
│   │                                                                     │  │
│   │   ╲                                                             ╱   │  │
│   │    ╲  More to explore...                                       ╱    │  │
│   │     ╲_________________________________________________________╱     │  │
│   │                                                                     │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Card Type Layouts

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   POEM CARD                                                                 │
│   ─────────                                                                 │
│                                                                             │
│   ┌────────────────────────┐                                                │
│   │                        │                                                │
│   │   "The fog comes       │   • Aspect ratio: 3:4                          │
│   │    on little cat feet. │   • Shape prefix: ▲ (triangle)                 │
│   │    It sits looking..." │   • Rotation: random ±5°                       │
│   │                        │   • Border: left 4px red                       │
│   │   — Carl Sandburg      │   • Shadow on hover                            │
│   │        ▲               │                                                │
│   └────────────────────────┘                                                │
│                                                                             │
│   ESSAY CARD (Wide)                                                         │
│   ─────────────────                                                         │
│                                                                             │
│   ┌──────────────────────────────────────────────────────────────────────┐ │
│   │                                                                      │ │
│   │   "The best design is as little design as possible."                 │ │
│   │                                                                      │ │
│   │   — Dieter Rams, 10 Principles of Good Design                    ■   │ │
│   │                                                                      │ │
│   └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│   • Aspect ratio: 3:1 (landscape)                                           │
│   • Shape prefix: ■ (square)                                                │
│   • Bottom border: 4px yellow                                               │
│   • Rotation: ±2° subtle                                                    │
│                                                                             │
│   ART CARD (Featured)                                                       │
│   ────────────────────                                                      │
│                                                                             │
│   ╱─────────────────────────────────────────────────────────╲              │
│  ╱                                                           ╲             │
│ ╱                    [IMAGE AREA]                             ╲            │
│╱                (diagonal clip-path on image)                  ╲           │
│╲                                                               ╱           │
│ ╲    ● Title of Artwork                                       ╱            │
│  ╲   Artist name, year                                       ╱             │
│   ╲  Why this piece resonates with me...                    ╱              │
│    ╲───────────────────────────────────────────────────────╱               │
│                                                                             │
│   • Shape prefix: ● (circle)                                                │
│   • Diagonal clip on image                                                  │
│   • Larger size for featured works                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### React Implementation

```tsx
// pages/Inspirations.tsx (Constructivist variant)

import { NavigationDiagonal } from "@/components/constructivist/NavigationDiagonal";
import { FilterButtons } from "@/components/constructivist/FilterButtons";
import { ConstructivistDivider } from "@/components/constructivist/Divider";
import { LoadingScreen } from "@/components/constructivist/LoadingScreen";
import { useState } from "react";

type InspirationItem = {
  id: string;
  type: "poem" | "essay" | "art";
  title: string;
  author?: string;
  content: string;
  image?: string;
  featured?: boolean;
};

export default function InspirationsConstructivist() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  const items: InspirationItem[] = [
    { 
      id: "1", 
      type: "poem", 
      title: "Fog",
      author: "Carl Sandburg",
      content: "The fog comes on little cat feet. It sits looking over harbor and city...",
    },
    { 
      id: "2", 
      type: "art", 
      title: "Beat the Whites with the Red Wedge",
      author: "El Lissitzky, 1919",
      content: "Revolutionary visual language that continues to influence design.",
      image: "/images/lissitzky.jpg",
      featured: true,
    },
    { 
      id: "3", 
      type: "essay", 
      title: "10 Principles of Good Design",
      author: "Dieter Rams",
      content: "Good design is as little design as possible.",
    },
  ];
  
  const filteredItems = filter === "all" 
    ? items 
    : items.filter(item => item.type === filter);
  
  return (
    <>
      {loading && (
        <LoadingScreen 
          variant="suprematist" 
          onComplete={() => setLoading(false)} 
        />
      )}
      
      <div className="min-h-screen bg-[#F5F0E6]">
        <NavigationDiagonal />
        
        {/* Vertical title + horizontal line */}
        <div className="flex items-start pt-24 px-8">
          <div 
            className="font-display text-xl tracking-[0.3em] text-[#0A0A0A]"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            INSPIRATIONS
          </div>
          <div className="flex-1 h-0.5 bg-[#0A0A0A] mt-8 ml-4" />
        </div>
        
        {/* Filter buttons */}
        <div className="px-8 py-8 ml-12">
          <FilterButtons
            options={[
              { id: "all", label: "All", shape: "diamond" },
              { id: "poem", label: "Poems", shape: "triangle" },
              { id: "essay", label: "Essays", shape: "square" },
              { id: "art", label: "Art", shape: "circle" },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>
        
        {/* Collage grid */}
        <main className="px-8 pb-16 ml-12">
          <div className="grid grid-cols-12 gap-6 auto-rows-min">
            {filteredItems.map((item, i) => {
              const rotation = Math.random() * 6 - 3; // -3 to +3 degrees
              
              if (item.featured && item.type === "art") {
                return (
                  <ArtCardFeatured 
                    key={item.id} 
                    item={item} 
                    rotation={rotation}
                    className="col-span-7"
                  />
                );
              }
              
              if (item.type === "poem") {
                return (
                  <PoemCard 
                    key={item.id} 
                    item={item} 
                    rotation={rotation}
                    className="col-span-4"
                  />
                );
              }
              
              if (item.type === "essay") {
                return (
                  <EssayCard 
                    key={item.id} 
                    item={item} 
                    rotation={rotation}
                    className="col-span-8"
                  />
                );
              }
              
              return (
                <ArtCard 
                  key={item.id} 
                  item={item} 
                  rotation={rotation}
                  className="col-span-5"
                />
              );
            })}
          </div>
        </main>
        
        <ConstructivistDivider variant="line" />
        
        {/* Footer */}
        <footer 
          className="bg-[#CC2936] py-6 px-8 text-[#F5F0E6] font-display text-sm tracking-[0.15em]"
          style={{ clipPath: "polygon(0 30%, 100% 0, 100% 100%, 0 100%)" }}
        >
          More to explore...
        </footer>
      </div>
    </>
  );
}

// Poem Card Component
function PoemCard({ 
  item, 
  rotation, 
  className 
}: { 
  item: InspirationItem; 
  rotation: number;
  className?: string;
}) {
  return (
    <article 
      className={`bg-white border-l-4 border-[#CC2936] p-6 transition-all hover:shadow-lg hover:scale-[1.02] ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <blockquote className="font-body text-lg italic leading-relaxed text-[#0A0A0A]/80">
        "{item.content}"
      </blockquote>
      <footer className="mt-4 flex items-center justify-between">
        <cite className="font-display text-sm tracking-[0.1em] not-italic">
          — {item.author}
        </cite>
        <span className="text-[#CC2936] text-xl">▲</span>
      </footer>
    </article>
  );
}

// Essay Card Component
function EssayCard({ 
  item, 
  rotation, 
  className 
}: { 
  item: InspirationItem; 
  rotation: number;
  className?: string;
}) {
  return (
    <article 
      className={`bg-white border-b-4 border-[#F4C430] p-8 transition-all hover:shadow-lg ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <blockquote className="font-display text-2xl tracking-[0.05em] text-[#0A0A0A]">
        "{item.content}"
      </blockquote>
      <footer className="mt-6 flex items-center justify-between">
        <cite className="font-body text-sm text-[#0A0A0A]/60 not-italic">
          — {item.author}
        </cite>
        <span className="text-[#F4C430] text-2xl">■</span>
      </footer>
    </article>
  );
}

// Art Card Featured Component
function ArtCardFeatured({ 
  item, 
  rotation, 
  className 
}: { 
  item: InspirationItem; 
  rotation: number;
  className?: string;
}) {
  return (
    <article 
      className={`bg-white overflow-hidden transition-all hover:shadow-xl ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {item.image && (
        <div 
          className="h-64 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${item.image})`,
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
          }}
        />
      )}
      <div className="p-6">
        <h3 className="font-display text-xl tracking-[0.1em] flex items-center gap-2">
          <span className="text-[#1E5AA8]">●</span>
          {item.title}
        </h3>
        <p className="text-sm text-[#0A0A0A]/60 mt-1">{item.author}</p>
        <p className="font-body text-[#0A0A0A]/80 mt-3 leading-relaxed">
          {item.content}
        </p>
      </div>
    </article>
  );
}

// Art Card Standard Component
function ArtCard({ 
  item, 
  rotation, 
  className 
}: { 
  item: InspirationItem; 
  rotation: number;
  className?: string;
}) {
  return (
    <article 
      className={`bg-white transition-all hover:shadow-lg ${className}`}
      style={{ 
        transform: `rotate(${rotation}deg)`,
        clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)",
      }}
    >
      {item.image && (
        <div 
          className="h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${item.image})` }}
        />
      )}
      <div className="p-4">
        <h3 className="font-display text-lg tracking-[0.1em] flex items-center gap-2">
          <span className="text-[#1E5AA8]">●</span>
          {item.title}
        </h3>
      </div>
    </article>
  );
}
```

---

## Responsive Breakpoints

```css
/* Mobile: Stack everything vertically */
@media (max-width: 640px) {
  .constructivist-grid {
    grid-template-columns: 1fr;
  }
  
  .vertical-text {
    display: none;
  }
  
  .diagonal-nav {
    clip-path: none;
  }
}

/* Tablet: 2-column grid */
@media (min-width: 641px) and (max-width: 1024px) {
  .constructivist-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .about-images {
    grid-column: 1 / 3;
  }
  
  .about-content {
    grid-column: 3 / 7;
  }
}

/* Desktop: Full 12-column grid */
@media (min-width: 1025px) {
  .constructivist-grid {
    grid-template-columns: repeat(12, 1fr);
  }
}
```

---

## Animation Sequences

### Page Load Sequence

```
STEP 1: Loading Screen
       ├─ Gears/Suprematist animation (2x scale, centered)
       └─ Duration: 2-3 seconds, then fade out

STEP 2: Navigation Entrance
       ├─ Diagonal bar slides down from top
       └─ Duration: 300ms, ease-constructivist

STEP 3: Header Reveal
       ├─ Title letters animate in staggered (50ms delay each)
       └─ Diagonal clip-path expands

STEP 4: Content Cascade
       ├─ Cards fade in with slight upward motion
       ├─ Stagger: 100ms between cards
       └─ Slight rotation settlement (rotate from ±5° to final rotation)

STEP 5: Decorative Elements
       ├─ Shape prefixes pulse once
       └─ Geometric accents draw in (stroke-dasharray animation)
```

### CSS Keyframes

```css
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
    transform: translateY(30px) rotate(calc(var(--rotation) + 5deg));
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(var(--rotation));
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
```

---

## Summary

Three page layouts in radical Constructivist style:

1. **Home** — Vertical name, circle-clipped profile, shape-coded nav
2. **About** — Asymmetric grid, triangle-clipped portrait, numbered experience
3. **Inspirations** — Collage layout, rotated cards, shape-coded filters

Each page includes:
- Loading screen with scaled Constructivist animations
- Diagonal navigation bar
- Geometric dividers and accents
- Diagonal clip-paths on images
- Shape-prefixed headings
- Asymmetric layouts (7/5, 4/8 splits)
- Staggered page load animations

Next: [constructivist-4-implementation.md](./constructivist-4-implementation.md) — Toggle System & Implementation
