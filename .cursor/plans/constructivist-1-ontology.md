# Constructivist Design System — Part 1: Ontology

A radical design language inspired by Russian Constructivism (1920s) and Bauhaus (1919-1933).

---

## Philosophy

### Core Principles

| Principle | Description | Application |
|-----------|-------------|-------------|
| **Form Follows Function** | Every visual element serves a purpose | No decorative flourishes without meaning |
| **Dynamic Tension** | Compositions feel alive through asymmetry | Diagonal lines, off-center layouts |
| **Geometric Truth** | Circle, triangle, square as universal forms | Shape-coded navigation, iconography |
| **Revolutionary Spirit** | Bold, unapologetic visual statements | High contrast, aggressive angles |
| **Unity of Art and Industry** | Design as a tool for progress | Clean, reproducible, systematic |

### Visual Manifesto

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   "CONSTRUCTION IS THE MODERN DEMAND FOR ORGANIZATION AND                   │
│    THE PURPOSEFUL USE OF MATERIALS." — Aleksei Gan, 1922                    │
│                                                                             │
│                        ╲                                                    │
│                         ╲                                                   │
│                          ╲                                                  │
│               ●           ╲          ■                                      │
│              ╱ ╲           ╲        ╱                                       │
│             ╱   ╲           ╲      ╱                                        │
│            ╱     ╲           ╲    ╱                                         │
│           ╱   ▲   ╲           ╲  ╱                                          │
│          ╱         ╲           ╲╱                                           │
│         ╱           ╲          ╱                                            │
│        ╱_____________╲________╱                                             │
│                                                                             │
│   Every line has direction. Every shape has meaning. Every color speaks.    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Shapes: The Three Absolutes

### Primary Forms

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│      ●                    ▲                    ■                            │
│     ╱ ╲                  ╱ ╲                  ┌─┐                           │
│    │   │                ╱   ╲                 │ │                           │
│    │   │               ╱     ╲                └─┘                           │
│     ╲ ╱               ╱       ╲                                             │
│      ●               ▲─────────▲               ■                            │
│                                                                             │
│   CIRCLE            TRIANGLE              SQUARE                            │
│   ──────            ────────              ──────                            │
│   Unity             Dynamism              Stability                         │
│   Wholeness         Movement              Foundation                        │
│   Infinity          Aspiration            Structure                         │
│                                                                             │
│   Color: Blue       Color: Red            Color: Yellow                     │
│   (#1E5AA8)         (#CC2936)             (#F4C430)                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Shape Applications

| Context | Circle ● | Triangle ▲ | Square ■ |
|---------|----------|------------|----------|
| **Navigation** | Home (origin point) | About (direction) | Work/Portfolio |
| **Buttons** | Secondary action | Primary CTA | Tertiary/neutral |
| **Section markers** | Intro/welcome | Key points | Supporting info |
| **List bullets** | Ideas/concepts | Actions/steps | Facts/data |
| **Image masks** | Profile photos | Hero images | Gallery items |

### Shape Prefixes in Typography

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   HEADINGS WITH SHAPE PREFIXES                                              │
│   ─────────────────────────────                                             │
│                                                                             │
│   ● WHO I AM                                                                │
│     Designer, developer, thinker.                                           │
│                                                                             │
│   ▲ WHAT I BUILD                                                            │
│     Experiences that challenge and delight.                                 │
│                                                                             │
│   ■ HOW I WORK                                                              │
│     With intention, craft, and purpose.                                     │
│                                                                             │
│   Shape size: 0.6em relative to heading                                     │
│   Gap: 0.5em between shape and text                                         │
│   Alignment: baseline with first character                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Colors: The Palette of Revolution

### Primary Palette

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   COLOR SYSTEM                                                              │
│   ────────────                                                              │
│                                                                             │
│   ████████████████  #CC2936  REVOLUTIONARY RED                              │
│                     HSL: 355, 65%, 48%                                      │
│                     Role: Primary action, emphasis, danger                  │
│                     Associations: Power, urgency, the Red Wedge             │
│                                                                             │
│   ████████████████  #1E5AA8  BAUHAUS BLUE                                   │
│                     HSL: 216, 70%, 39%                                      │
│                     Role: Secondary action, links, information              │
│                     Associations: Depth, trust, the Circle                  │
│                                                                             │
│   ████████████████  #F4C430  PRIMARY YELLOW                                 │
│                     HSL: 47, 90%, 57%                                       │
│                     Role: Highlights, accents, warnings                     │
│                     Associations: Energy, attention, the Square             │
│                                                                             │
│   ████████████████  #0A0A0A  NEAR BLACK                                     │
│                     HSL: 0, 0%, 4%                                          │
│                     Role: Text, borders, dramatic backgrounds               │
│                     Associations: Authority, weight, foundation             │
│                                                                             │
│   ████████████████  #F5F0E6  PAPER/CREAM                                    │
│                     HSL: 40, 35%, 93%                                       │
│                     Role: Backgrounds, cards, breathing room                │
│                     Associations: Canvas, warmth, texture                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Color Usage Rules

```
BACKGROUNDS
───────────
• Paper (#F5F0E6) — Default, light mode
• Near Black (#0A0A0A) — Dark mode, dramatic sections, loading screens

TEXT
────
• Near Black on Paper — Primary body text
• Paper on Near Black — Inverted sections
• Red on Paper — Links, emphasis (use sparingly)

ACCENTS
───────
• Red — Primary buttons, active states, critical UI
• Blue — Secondary buttons, informational elements
• Yellow — Highlights, hover states, warnings

CONTRAST RATIOS (WCAG AA)
─────────────────────────
• Near Black on Paper: 15.8:1 ✓
• Red on Paper: 5.2:1 ✓
• Blue on Paper: 6.4:1 ✓
• Paper on Near Black: 15.8:1 ✓
```

### CSS Custom Properties

```css
:root[data-theme="constructivist"] {
  /* Primary Palette */
  --color-revolutionary-red: hsl(355 65% 48%);
  --color-bauhaus-blue: hsl(216 70% 39%);
  --color-primary-yellow: hsl(47 90% 57%);
  --color-near-black: hsl(0 0% 4%);
  --color-paper: hsl(40 35% 93%);
  
  /* Semantic Mapping */
  --color-background: var(--color-paper);
  --color-foreground: var(--color-near-black);
  --color-primary: var(--color-revolutionary-red);
  --color-secondary: var(--color-bauhaus-blue);
  --color-accent: var(--color-primary-yellow);
  --color-muted: hsl(40 20% 88%);
  --color-muted-foreground: hsl(0 0% 35%);
  --color-border: hsl(0 0% 4% / 0.15);
  
  /* Shape-Color Associations */
  --color-circle: var(--color-bauhaus-blue);
  --color-triangle: var(--color-revolutionary-red);
  --color-square: var(--color-primary-yellow);
}
```

---

## Typography: Bold Voices

### Type Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   DISPLAY / HEADLINES                                                       │
│   ───────────────────                                                       │
│   Font: Bebas Neue                                                          │
│   Weight: 400 (single weight)                                               │
│   Style: Uppercase always                                                   │
│   Tracking: 0.1em — 0.2em                                                   │
│                                                                             │
│   ╔═══════════════════════════════════════════════════════════════════╗    │
│   ║                                                                   ║    │
│   ║   A B O U T                                                       ║    │
│   ║   ─────────                                                       ║    │
│   ║   tracking: 0.15em                                                ║    │
│   ║   font-size: clamp(3rem, 8vw, 6rem)                               ║    │
│   ║                                                                   ║    │
│   ╚═══════════════════════════════════════════════════════════════════╝    │
│                                                                             │
│   BODY TEXT                                                                 │
│   ─────────                                                                 │
│   Font: DM Sans                                                             │
│   Weights: 400, 500, 700                                                    │
│   Size: 1rem (16px base)                                                    │
│   Line-height: 1.7                                                          │
│   Max-width: 65ch                                                           │
│                                                                             │
│   ACCENT / LABELS                                                           │
│   ──────────────                                                            │
│   Font: DM Sans or Bebas Neue                                               │
│   Style: Uppercase, wide tracking (0.3em — 0.4em)                           │
│   Size: 0.75rem — 0.875rem                                                  │
│   Use: Labels, captions, nav items                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Vertical Text

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   VERTICAL TEXT TREATMENT                                                   │
│   ───────────────────────                                                   │
│                                                                             │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │                                                                   │    │
│   │   K                                                               │    │
│   │   E           Main content area                                   │    │
│   │   N           ─────────────────                                   │    │
│   │               Text flows horizontally here while                  │    │
│   │   B           vertical text creates visual anchor                 │    │
│   │   U           on the left edge.                                   │    │
│   │   I                                                               │    │
│   │                                                                   │    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│   CSS:                                                                      │
│   writing-mode: vertical-rl;                                                │
│   text-orientation: mixed;                                                  │
│   transform: rotate(180deg);                                                │
│   letter-spacing: 0.3em;                                                    │
│   font-family: 'Bebas Neue';                                                │
│   text-transform: uppercase;                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Font Loading

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
```

```css
:root[data-theme="constructivist"] {
  --font-display: 'Bebas Neue', Impact, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
}
```

---

## Angles: The Diagonal Imperative

### Primary Angles

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ANGLE SYSTEM                                                              │
│   ────────────                                                              │
│                                                                             │
│              ╱                                                              │
│             ╱  45°                                                          │
│            ╱   Primary diagonal                                             │
│           ╱    Most dynamic, aggressive                                     │
│          ╱___                                                               │
│                                                                             │
│               ╱                                                             │
│              ╱  30°                                                         │
│             ╱   Secondary diagonal                                          │
│            ╱    Subtler, transitional                                       │
│           ╱____                                                             │
│                                                                             │
│                  ╱                                                          │
│                 ╱  15°                                                      │
│                ╱   Accent diagonal                                          │
│               ╱    Subtle tilt, cards, images                               │
│              ╱_____                                                         │
│                                                                             │
│   ROTATION DIRECTIONS                                                       │
│   ───────────────────                                                       │
│   • Positive (clockwise): Forward motion, progress                          │
│   • Negative (counter-clockwise): Tension, opposition                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Clip Paths

```css
:root[data-theme="constructivist"] {
  /* Diagonal clips */
  --clip-diagonal-right: polygon(0 0, 100% 10%, 100% 100%, 0 90%);
  --clip-diagonal-left: polygon(0 10%, 100% 0, 100% 90%, 0 100%);
  --clip-diagonal-steep: polygon(0 0, 100% 20%, 100% 100%, 0 80%);
  
  /* Shape clips */
  --clip-triangle-up: polygon(50% 0%, 100% 100%, 0% 100%);
  --clip-triangle-right: polygon(0 0, 100% 50%, 0 100%);
  --clip-wedge: polygon(0 20%, 0 80%, 100% 50%);
  
  /* Corner cuts */
  --clip-corner-tr: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
  --clip-corner-bl: polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px));
}
```

### Transform Utilities

```css
.rotate-5 { transform: rotate(5deg); }
.rotate-15 { transform: rotate(15deg); }
.rotate-30 { transform: rotate(30deg); }
.rotate-45 { transform: rotate(45deg); }
.-rotate-5 { transform: rotate(-5deg); }
.-rotate-15 { transform: rotate(-15deg); }
.-rotate-30 { transform: rotate(-30deg); }
.-rotate-45 { transform: rotate(-45deg); }

.skew-x-5 { transform: skewX(5deg); }
.skew-x-15 { transform: skewX(15deg); }
.-skew-x-5 { transform: skewX(-5deg); }
.-skew-x-15 { transform: skewX(-15deg); }
```

---

## Composition: Asymmetric Balance

### The Grid

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   12-COLUMN ASYMMETRIC GRID                                                 │
│   ─────────────────────────                                                 │
│                                                                             │
│   │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │10 │11 │12 │                        │
│   ├───┴───┴───┴───┼───┴───┴───┴───┴───┼───┴───┴───┤                        │
│   │               │                   │           │                        │
│   │   NARROW      │      WIDE         │  ACCENT   │                        │
│   │   (4 cols)    │     (5 cols)      │  (3 cols) │                        │
│   │               │                   │           │                        │
│                                                                             │
│   COMMON SPLITS:                                                            │
│   • 7/5 — Hero image / text                                                 │
│   • 4/5/3 — Sidebar / main / accent                                         │
│   • 8/4 — Content / marginalia                                              │
│   • 5/7 — Text / image (reversed)                                           │
│                                                                             │
│   AVOID: 6/6 (too symmetrical)                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Overlap Rules

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ELEMENT OVERLAP SYSTEM                                                    │
│   ──────────────────────                                                    │
│                                                                             │
│          ┌─────────────────────┐                                            │
│          │                     │                                            │
│          │   BACKGROUND        │                                            │
│          │   ELEMENT           │                                            │
│          │         ┌───────────┼─────────────┐                              │
│          │         │           │             │                              │
│          └─────────┼───────────┘             │                              │
│                    │   FOREGROUND            │                              │
│                    │   ELEMENT               │                              │
│                    │                         │                              │
│                    └─────────────────────────┘                              │
│                                                                             │
│   OVERLAP AMOUNTS:                                                          │
│   • Subtle: 10-15% of smaller element                                       │
│   • Standard: 20-30% overlap                                                │
│   • Dramatic: 40-50% overlap                                                │
│                                                                             │
│   Z-INDEX LAYERS:                                                           │
│   • Background shapes: z-0                                                  │
│   • Content cards: z-10                                                     │
│   • Overlapping text: z-20                                                  │
│   • Navigation: z-30                                                        │
│   • Modals/overlays: z-40                                                   │
│   • Loading screen: z-50                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Visual Weight Distribution

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ASYMMETRIC BALANCE                                                        │
│   ──────────────────                                                        │
│                                                                             │
│   Instead of mirroring, balance through:                                    │
│                                                                             │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │                                                                   │    │
│   │   ████████████                              ████                  │    │
│   │   ████████████                              ████                  │    │
│   │   LARGE ELEMENT                         SMALL ELEMENT             │    │
│   │   (lighter color)                       (dark color)              │    │
│   │                                                                   │    │
│   │   Visual weight is balanced despite different sizes               │    │
│   │                                                                   │    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│   WEIGHT FACTORS:                                                           │
│   • Size (larger = heavier)                                                 │
│   • Color darkness (darker = heavier)                                       │
│   • Saturation (more saturated = heavier)                                   │
│   • Position (lower = heavier, edge = heavier)                              │
│   • Density (more detail = heavier)                                         │
│   • Angle (tilted = more dynamic weight)                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Motion: Purposeful Animation

### Easing Functions

```css
:root[data-theme="constructivist"] {
  /* Snappy, mechanical feel */
  --ease-constructivist: cubic-bezier(0.16, 1, 0.3, 1);
  
  /* Step function for glitchy effects */
  --ease-stepped: steps(8);
  
  /* Spring-like bounce */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  /* Timing durations */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 600ms;
  --duration-dramatic: 1000ms;
}
```

### Animation Principles

| Principle | Description | Example |
|-----------|-------------|---------|
| **Geometric** | Motion follows geometric paths | Rotate, scale around center |
| **Mechanical** | Sharp starts/stops, industrial feel | Stepped easing, gear rotation |
| **Purposeful** | Animation conveys meaning | Direction indicates progress |
| **Restrained** | Less is more, decisive movements | Single transform per element |

---

## Summary

This ontology defines the visual DNA of the Constructivist design system:

1. **Three shapes** (circle, triangle, square) as universal building blocks
2. **Five colors** (red, blue, yellow, black, cream) as the palette
3. **Three angles** (15°, 30°, 45°) for dynamic compositions
4. **Two typefaces** (Bebas Neue, DM Sans) for hierarchy
5. **Asymmetric balance** through visual weight, not symmetry
6. **Purposeful motion** that feels mechanical and decisive

Next: [constructivist-2-components.md](./constructivist-2-components.md) — Component Library
