# Experiments Page - Design System Playground

A comprehensive design exploration page with toggleable demos for animations, typography, layouts, and color palettes.

---

## Structure

**Route**: `/experiments`  
**Organization**: Single page with tabbed sections

```
┌─────────────────────────────────────────────────────────────────┐
│  EXPERIMENTS                                                    │
│  ─────────────────────────────────────────────────────────────  │
│  [Animations] [Typography] [Layout] [Color] [Hierarchy]         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │           INTERACTIVE DEMO AREA                        │   │
│  │           with controls (sliders, toggles)             │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │ Variant 1      │  │ Variant 2      │  │ Variant 3      │    │
│  │ [selected]     │  │                │  │                │    │
│  └────────────────┘  └────────────────┘  └────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tab 1: Animations

### Categories & Variants

#### A. Page Transitions (3 variants)
| Variant | Description | Reference |
|---------|-------------|-----------|
| **Fade Slide** | Opacity + translateY, staggered elements | Minimal |
| **Curtain Wipe** | Black/colored div wipes across screen | Editorial |
| **Clip Reveal** | clip-path circle/rect expanding from center | Dramatic |

#### B. Scroll Reveals (3 variants)
| Variant | Description | Reference |
|---------|-------------|-----------|
| **Subtle Rise** | Elements fade + rise 20px on scroll | Wellness aesthetic |
| **Stagger Grid** | Grid items appear one-by-one with delay | Portfolio sites |
| **Parallax Float** | Different speeds for layers | Editorial depth |

#### C. Hover Micro-interactions (3 variants)
| Variant | Description | Reference |
|---------|-------------|-----------|
| **Underline Draw** | Line draws under text on hover | Minimal |
| **Background Fill** | Color fills from left/bottom | Button interaction |
| **Glitch Shake** | Subtle RGB split + shake | Lo-fi/punk |

#### D. Loading States (3 variants)
| Variant | Description | Reference |
|---------|-------------|-----------|
| **Skeleton Shimmer** | Placeholder shapes with gradient sweep | Standard |
| **Bauhaus Spinner** | Circle/triangle/square rotating | Geometric |
| **Typewriter Dots** | "Loading..." typed out | Retro terminal |

#### E. Hero Entrances (3 variants)
| Variant | Description | Reference |
|---------|-------------|-----------|
| **Split Text** | Characters animate in individually | Kinetic type |
| **Mask Reveal** | Text revealed by moving mask | Cinematic |
| **Scattered Assemble** | Letters scattered, then snap to position | Playful |

### Animation Mood Variants

For each animation above, offer mood toggles:

| Mood | Timing | Easing | Feel |
|------|--------|--------|------|
| **Minimal** | 300-500ms | ease-out | Barely there |
| **Bouncy** | 400-600ms | spring(1, 80, 10) | Playful overshoot |
| **Cinematic** | 800-1200ms | cubic-bezier(0.16, 1, 0.3, 1) | Slow, dramatic |
| **Glitchy** | 150-300ms | steps(8) | Stuttered, digital |
| **Organic** | 600-900ms | cubic-bezier(0.34, 1.56, 0.64, 1) | Natural, flowing |

---

## Tab 2: Typography

### A. Scale Systems (3 variants)

```
Variant 1: Perfect Fourth (1.333)
──────────────────────────────────
H1: 4.209rem  │  H2: 3.157rem  │  H3: 2.369rem  │  H4: 1.777rem

Variant 2: Major Third (1.25)
──────────────────────────────────
H1: 3.052rem  │  H2: 2.441rem  │  H3: 1.953rem  │  H4: 1.563rem

Variant 3: Minor Second (1.067) - Tight
──────────────────────────────────
H1: 1.867rem  │  H2: 1.5rem    │  H3: 1.2rem    │  H4: 1rem
```

### B. Font Pairing Previews (4 combos)

| Pair | Heading | Body | Mood |
|------|---------|------|------|
| **Current** | Clarendon | Century Gothic | Mid-century |
| **Swiss** | Haffer/Suisse | Inter | Clean modernist |
| **Brutalist** | Druk Wide | Neue Haas Grotesk | Bold editorial |
| **Humanist** | Freight Display | Source Serif | Literary |

### C. Kinetic Typography (3 effects)

| Effect | Description |
|--------|-------------|
| **Letter Stagger** | Each letter fades in with delay |
| **Word Reveal** | Words appear one at a time |
| **Scramble Decode** | Random chars resolve to text (Matrix-style) |

### D. Text Treatment Styles (from moodboard)

| Style | Characteristics | Reference |
|-------|-----------------|-----------|
| **Scattered Float** | Text positioned freely over images | Arquen aesthetic |
| **Stacked Vertical** | Vertical text + horizontal mix | Japanese editorial |
| **Track Wide** | letter-spacing: 0.3em, uppercase | HAFFER style |
| **Compressed Stack** | Tight leading, stacked phrases | Le Nid poster |

---

## Tab 3: Layout

### A. Magazine/Editorial Layouts (3 variants)

#### Variant 1: Asymmetric Grid
```
┌──────────────────────────────────────────┐
│                    │                      │
│      IMAGE         │        TEXT          │
│      (large)       │     (offset top)     │
│                    │                      │
├────────────────────┴──────────────────────┤
│   CAPTION              │     PULL QUOTE   │
└────────────────────────┴──────────────────┘
```

#### Variant 2: Overlap Collage
```
┌──────────────────────────────────────────┐
│           ┌─────────────────┐            │
│           │     IMAGE       │            │
│    TEXT   │   (overlapping) │   TEXT     │
│ (rotated) └─────────────────┘            │
│                  │                       │
│                  │    MORE TEXT          │
└──────────────────┴───────────────────────┘
```

#### Variant 3: Full-Bleed + Float
```
┌──────────────────────────────────────────┐
│ TEXT                            TEXT     │
│ (corner)          IMAGE         (corner) │
│              (full bleed)                │
│                                          │
│    TEXT              TEXT       TEXT     │
│  (scattered)      (center)   (scattered) │
└──────────────────────────────────────────┘
```

### B. Card Variations (3 variants)

| Variant | Description |
|---------|-------------|
| **Uniform Grid** | Equal cards, 3-4 columns |
| **Masonry** | Varied heights, Pinterest-style |
| **Horizontal Scroll** | Cards in horizontal strip |

### C. Scroll-Driven Layouts (3 variants)

| Variant | Description |
|---------|-------------|
| **Horizontal Scroll** | Sections scroll left-right |
| **Parallax Sections** | Layers move at different speeds |
| **Sticky Reveal** | Elements pin and reveal as you scroll |

---

## Tab 4: Color Palettes

### Curated Palette Library

#### A. Current Site (Reference)
```
Background:  #F0EAD6 (Eggshell)
Primary:     #123524 (Dark Green)
Secondary:   #007BA7 (Cerulean)
```

#### B. Sage + Gold (Moodboard)
```
Background:  #A8B5A0 (Sage)
Primary:     #4A5544 (Deep Olive)
Secondary:   #D4A934 (Gold)
Accent:      #F5F2E8 (Cream)
```

#### C. High Contrast Brutalist
```
Background:  #FFFFFF (White)
Primary:     #000000 (Black)
Secondary:   #FF0000 (Red) or #FFE500 (Yellow)
Accent:      #808080 (Gray)
```

#### D. Dark Mode Editorial
```
Background:  #0A0A0A (Near Black)
Primary:     #F5F5F5 (Off White)
Secondary:   #FFE500 (Yellow - like moodboard)
Muted:       #333333 (Dark Gray)
```

#### E. Bauhaus Primary
```
Background:  #F4F1E8 (Warm White)
Primary:     #1A1A1A (Black)
Accent 1:    #E53935 (Red)
Accent 2:    #1E88E5 (Blue)
Accent 3:    #FDD835 (Yellow)
```

#### F. Muted/Desaturated
```
Background:  #E8E4DC (Warm Gray)
Primary:     #2C3E50 (Slate)
Secondary:   #7F8C8D (Gray)
Accent:      #9B7653 (Muted Tan)
```

#### G. Risograph/Lo-fi
```
Background:  #F5F0E6 (Paper)
Primary:     #1A1A1A (Black)
Accent 1:    #8B1538 (Burgundy - from moodboard)
Accent 2:    #1E5AA8 (Riso Blue)
```

### Palette Preview Mode
- Show same sample UI (card, button, text) in each palette
- Toggle to apply palette site-wide temporarily
- Accessibility contrast checker overlay

---

## Tab 5: Hierarchy

### A. Heading Treatments (4 styles)

| Style | Visual |
|-------|--------|
| **Underline** | Text with animated underline |
| **Background Block** | Text on colored background strip |
| **Outline** | Stroke only, no fill |
| **Split Color** | Half one color, half another |

### B. List Styles (3 variants)

| Style | Visual |
|-------|--------|
| **Numbered Minimal** | 01. 02. 03. with extra tracking |
| **Bullet Circle** | Filled/hollow circles |
| **Icon Prefix** | Custom icons or shapes before items |

### C. Blockquote/Pullquote Styles (3 variants)

| Style | Visual |
|-------|--------|
| **Left Border** | Thick colored left border |
| **Large Serif** | Oversized italic serif quote |
| **Quotation Marks** | Giant decorative quotation marks |

### D. Caption Treatments (2 variants)

| Style | Visual |
|-------|--------|
| **Minimal** | Small, muted, uppercase tracking |
| **Label** | Background pill/badge style |

---

## Implementation Notes

### Component Structure

```
/client/src/pages/Experiments.tsx
  ├── AnimationsTab.tsx
  │   ├── PageTransitions/
  │   ├── ScrollReveals/
  │   ├── HoverInteractions/
  │   ├── LoadingStates/
  │   └── HeroEntrances/
  ├── TypographyTab.tsx
  │   ├── ScaleSystems/
  │   ├── FontPairings/
  │   ├── KineticType/
  │   └── TextTreatments/
  ├── LayoutTab.tsx
  │   ├── EditorialLayouts/
  │   ├── CardVariations/
  │   └── ScrollLayouts/
  ├── ColorTab.tsx
  │   ├── PaletteLibrary/
  │   └── PalettePreview/
  └── HierarchyTab.tsx
      ├── HeadingStyles/
      ├── ListStyles/
      ├── BlockquoteStyles/
      └── CaptionStyles/
```

### State Management
- Each demo has its own "variant" state
- Mood/timing modifiers stored as sliders
- Color palette selection can optionally be applied site-wide via CSS variables

### Controls
- Toggle buttons for variant selection
- Sliders for timing/easing
- Play/Reset buttons for animations
- Apply/Preview buttons for colors

---

## Priority Order

1. **Color Palettes** - Most impactful, sets the tone
2. **Typography** - Font pairings and scale
3. **Animations** - Page transitions and scroll reveals
4. **Layout** - Editorial and card variations
5. **Hierarchy** - Heading and list styles

---

## Moodboard Reference Summary

| Source | Key Takeaway |
|--------|--------------|
| HAFFER typography | Clean sans-serif, sage green, wide tracking |
| Arquen | Scattered text on photography, gold accents |
| Le Nid poster | Black/white, condensed type, editorial grid |
| Bandidos cassette | Glitch, repetition, lo-fi aesthetic |
| Burgundy/black prints | Texture, grain, analog imperfection |
| Bauhaus studies | Circle/triangle/square, primary colors, construction |
