# Inspirations Page - Design Document

A digital commonplace book / cabinet of curiosities featuring curated poems, essay excerpts, and visual art that inspire you.

---

## Overview

**Route**: `/inspirations`  
**Nav Label**: "Inspirations" (replaces "Writings" in navigation)

The page showcases a curated collection of creative works with personal commentary, displayed in an artistic masonry layout with collage-like visual interest.

---

## Visual Design

### Layout Concept: "Structured Chaos"

```
┌─────────────────────────────────────────────────────────┐
│  INSPIRATIONS                    [Poems] [Essays] [Art] │
│  ───────────────────────────────────────────────────────│
│                                                         │
│  ┌──────────┐  ┌─────────────────────┐                 │
│  │          │  │                     │  ┌────────────┐ │
│  │  IMAGE   │  │    POEM TEXT        │  │            │ │
│  │  (large) │  │    with blurb       │  │   ESSAY    │ │
│  │          │  │                     │  │   QUOTE    │ │
│  └──────────┘  └─────────────────────┘  │            │ │
│       ┌─────────────┐                    └────────────┘ │
│       │   IMAGE     │  ┌──────────────────┐            │
│       │   (tilted)  │  │                  │            │
│       │             │  │   POEM           │            │
│       └─────────────┘  │   (overlapping)  │            │
│  ┌───────────────────┐ └──────────────────┘            │
│  │ ESSAY EXCERPT     │       ┌───────────┐             │
│  │ longer form...    │       │  ART      │             │
│  └───────────────────┘       └───────────┘             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Masonry Base**: Items flow in columns with varied heights
2. **Collage Accents**: Some items have slight rotation (-2° to 2°), drop shadows, or overlap
3. **Visual Hierarchy**: Art pieces are larger/more prominent; text items are contained in cards
4. **White Space**: Despite the collage aesthetic, maintain breathing room
5. **Mid-Century Touch**: Subtle geometric accents (circles, lines) echoing your site's aesthetic

### Item Card Variants

#### Poem Card
```
┌─────────────────────────┐
│ POEM                    │  ← Type label (small, muted)
├─────────────────────────┤
│                         │
│  "The apparition of     │  ← Poem text (serif, italic)
│   these faces in the    │
│   crowd; Petals on a    │
│   wet, black bough."    │
│                         │
│  — Ezra Pound           │  ← Attribution
│    "In a Station..."    │
│                         │
├─────────────────────────┤
│ My take: The compression│  ← Your blurb (sans-serif)
│ of image is perfect...  │
└─────────────────────────┘
```

#### Essay Excerpt Card
```
┌─────────────────────────┐
│ ESSAY                   │
├─────────────────────────┤
│                         │
│  "The medium is the     │  ← Quote (larger text)
│   message."             │
│                         │
│  — Marshall McLuhan     │
│    Understanding Media  │
│                         │
├─────────────────────────┤
│ Why this matters: ...   │  ← Your blurb
└─────────────────────────┘
```

#### Art Card
```
┌─────────────────────────┐
│                         │
│  ┌───────────────────┐  │
│  │                   │  │
│  │      IMAGE        │  │  ← Full image display
│  │                   │  │
│  └───────────────────┘  │
│                         │
│  Kazimir Malevich       │  ← Artist + Title
│  "Black Square" (1915)  │
│                         │
│  On this: The void as   │  ← Your blurb
│  ultimate form...       │
└─────────────────────────┘
```

---

## Filter System

### Filter Bar Design
```
┌──────────────────────────────────────────────────┐
│  Show:  [● All]  [○ Poems]  [○ Essays]  [○ Art] │
└──────────────────────────────────────────────────┘
```

- Toggle buttons (radio-style, one active at a time OR multi-select)
- Smooth CSS transitions when filtering (items fade out/in, grid reflows)
- URL params for shareable filtered views: `/inspirations?type=poems`

### Animation on Filter
- Items not matching filter: `opacity: 0`, `scale: 0.95`, then `display: none`
- Matching items: Staggered `fade-in` + `slide-up`
- Grid smoothly reflows using CSS Grid or Masonry.js

---

## Data Model

### TypeScript Interface

```typescript
interface Inspiration {
  id: string;
  type: "poem" | "essay" | "art";
  
  // Content
  title: string;
  content: string;        // Full text for poems/essays, or image URL for art
  attribution: string;    // Author name
  source?: string;        // Book title, publication, etc.
  year?: string;
  
  // Your commentary
  blurb: string;          // Your personal take
  
  // Display options
  size?: "small" | "medium" | "large";  // Affects grid span
  rotation?: number;      // -3 to 3 degrees for collage effect
  featured?: boolean;     // Larger display, first position
  
  // Meta
  createdAt: string;
  updatedAt: string;
}
```

### Supabase Table Schema

```sql
CREATE TABLE inspirations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('poem', 'essay', 'art')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  attribution TEXT NOT NULL,
  source TEXT,
  year TEXT,
  blurb TEXT,
  size TEXT DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large')),
  rotation REAL DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Admin Editor

### Location
Add new tab in existing Admin page: **Inspirations Editor**

### Editor UI

```
┌─────────────────────────────────────────────────────────┐
│ INSPIRATIONS EDITOR                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [+ Add Poem]  [+ Add Essay]  [+ Add Art]            │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📜 "In a Station of the Metro" - Ezra Pound   [✏️][🗑️]│ │
│ │ 📖 "The medium is the message" - McLuhan      [✏️][🗑️]│ │
│ │ 🎨 "Black Square" - Malevich                  [✏️][🗑️]│ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Add/Edit Modal

```
┌─────────────────────────────────────────────────────────┐
│ Add Poem                                            [X] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Title:        [________________________]                │
│ Author:       [________________________]                │
│ Source:       [________________________] (optional)     │
│ Year:         [______]                                  │
│                                                         │
│ Content:                                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ The apparition of these faces in the crowd;        │ │
│ │ Petals on a wet, black bough.                      │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Your Take:                                              │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ The compression of image here is perfect...        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Display Options:                                        │
│ Size:     (○) Small  (●) Medium  (○) Large             │
│ Rotation: [──●──────] 0°                               │
│ Featured: [ ] Pin to top                               │
│                                                         │
│                              [Cancel]  [Save]          │
└─────────────────────────────────────────────────────────┘
```

For **Art** type, the Content field becomes an image upload/URL input.

---

## Implementation Plan

### Files to Create

```
client/src/
├── pages/
│   └── Inspirations.tsx          # Main page component
├── components/
│   ├── InspirationCard.tsx       # Individual item card
│   ├── InspirationGrid.tsx       # Masonry grid container
│   ├── InspirationFilter.tsx     # Filter toggle bar
│   └── admin/
│       └── InspirationsEditor.tsx # Admin CRUD interface
```

### Dependencies
- **Masonry layout**: CSS Grid with `grid-auto-rows: masonry` (Firefox) OR `react-masonry-css` for cross-browser
- No additional dependencies needed for collage effects (pure CSS transforms)

### CSS Techniques

```css
/* Collage-style card variations */
.inspiration-card {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.inspiration-card[data-rotation="1"] { transform: rotate(1deg); }
.inspiration-card[data-rotation="-1"] { transform: rotate(-1deg); }
.inspiration-card[data-rotation="2"] { transform: rotate(2deg); }
/* etc. */

.inspiration-card[data-size="large"] {
  grid-column: span 2;
}

.inspiration-card:hover {
  transform: scale(1.02) rotate(0deg);
  z-index: 10;
}
```

---

## Interaction Details

### Hover States
- Cards lift slightly (`translateY(-4px)`) with enhanced shadow
- Rotation resets to 0° on hover for readability
- Blurb text fades in if hidden by default on smaller cards

### Click/Tap Behavior
- **Poems/Essays**: Expand to modal with full text + your blurb
- **Art**: Lightbox-style image view with caption

### Mobile Considerations
- Single column layout on small screens
- Rotation effects disabled on mobile (cleaner reading)
- Filters become horizontal scroll or dropdown

---

## Example Content

### Poem Example
```json
{
  "type": "poem",
  "title": "In a Station of the Metro",
  "content": "The apparition of these faces in the crowd;\nPetals on a wet, black bough.",
  "attribution": "Ezra Pound",
  "source": "Poetry Magazine",
  "year": "1913",
  "blurb": "Two lines. One complete world. This is what compression can achieve.",
  "size": "medium",
  "rotation": 1
}
```

### Essay Example
```json
{
  "type": "essay",
  "title": "The medium is the message",
  "content": "The medium is the message. This is merely to say that the personal and social consequences of any medium—that is, of any extension of ourselves—result from the new scale that is introduced into our affairs by each extension of ourselves, or by any new technology.",
  "attribution": "Marshall McLuhan",
  "source": "Understanding Media: The Extensions of Man",
  "year": "1964",
  "blurb": "McLuhan saw the internet coming. Every time I open Twitter, I think of this.",
  "size": "large",
  "featured": true
}
```

### Art Example
```json
{
  "type": "art",
  "title": "Black Square",
  "content": "https://upload.wikimedia.org/wikipedia/commons/5/57/Malevich.black-square.jpg",
  "attribution": "Kazimir Malevich",
  "year": "1915",
  "blurb": "The zero point of painting. Everything that came after had to reckon with this void.",
  "size": "large",
  "rotation": -2
}
```

---

## Integration with Main Plan

This feature integrates with the main deployment plan:

1. **Supabase**: Add `inspirations` table alongside existing tables
2. **Navigation**: "Inspirations" replaces "Writings" in [`Layout.tsx`](client/src/components/Layout.tsx)
3. **Admin**: New tab in Admin page for Inspirations Editor
4. **Cloudflare**: Static build includes new route

---

## Future Enhancements (Out of Scope)

- Tags/categories beyond type (e.g., "minimalism", "politics", "form")
- Search functionality
- Random "inspiration of the day" feature
- External API integrations (Goodreads quotes, museum APIs)
- RSS feed of new additions
