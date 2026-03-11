import { useState } from "react";
import { cn } from "@/lib/utils";
import { Heading1, List, Quote, Type, Image } from "lucide-react";

type HierarchyCategory = "headings" | "lists" | "blockquotes" | "text" | "captions";

interface HierarchyVariant {
  id: string;
  name: string;
  description: string;
}

const categories: { id: HierarchyCategory; name: string; icon: React.ElementType; variants: HierarchyVariant[] }[] = [
  {
    id: "headings",
    name: "Headings",
    icon: Heading1,
    variants: [
      { id: "classic", name: "Classic Serif", description: "Traditional editorial headings" },
      { id: "modern", name: "Modern Sans", description: "Clean, contemporary style" },
      { id: "brutalist", name: "Brutalist", description: "Bold, oversized, impactful" },
      { id: "decorative", name: "Decorative", description: "With underlines and accents" },
    ],
  },
  {
    id: "lists",
    name: "Lists",
    icon: List,
    variants: [
      { id: "bullets", name: "Custom Bullets", description: "Styled bullet points" },
      { id: "numbers", name: "Stylized Numbers", description: "Large decorative numbers" },
      { id: "timeline", name: "Timeline", description: "Vertical timeline layout" },
      { id: "tags", name: "Tag Style", description: "Pill/badge layout" },
    ],
  },
  {
    id: "blockquotes",
    name: "Blockquotes",
    icon: Quote,
    variants: [
      { id: "pullquote", name: "Pull Quote", description: "Large, centered, dramatic" },
      { id: "sidebar", name: "Sidebar", description: "Offset with border accent" },
      { id: "interview", name: "Interview Style", description: "Q&A format with attribution" },
    ],
  },
  {
    id: "text",
    name: "Text Treatments",
    icon: Type,
    variants: [
      { id: "dropcap", name: "Drop Cap", description: "Large initial letter" },
      { id: "highlight", name: "Highlighted", description: "Background highlight effect" },
      { id: "annotation", name: "Annotated", description: "With margin notes" },
    ],
  },
  {
    id: "captions",
    name: "Captions",
    icon: Image,
    variants: [
      { id: "minimal", name: "Minimal", description: "Small, muted, uppercase tracking" },
      { id: "label", name: "Label/Badge", description: "Background pill/badge style" },
      { id: "overlay", name: "Overlay", description: "Caption overlaid on image" },
    ],
  },
];

export default function HierarchyTab() {
  const [selectedCategory, setSelectedCategory] = useState<HierarchyCategory>("headings");
  const [selectedVariant, setSelectedVariant] = useState("classic");

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-serif font-bold text-primary">Visual Hierarchy</h2>
        <p className="text-sm text-muted-foreground">
          Explore different heading styles, list treatments, and typographic elements
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

      {/* Preview */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/30">
          <h3 className="font-bold text-primary">
            {currentCategory?.variants.find(v => v.id === selectedVariant)?.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {currentCategory?.variants.find(v => v.id === selectedVariant)?.description}
          </p>
        </div>
        
        <div className="p-8 bg-background/50 min-h-[300px]">
          <HierarchyPreview category={selectedCategory} variant={selectedVariant} />
        </div>
      </div>
    </div>
  );
}

function HierarchyPreview({ category, variant }: { category: HierarchyCategory; variant: string }) {
  // Headings
  if (category === "headings") {
    if (variant === "classic") {
      return (
        <div className="space-y-6">
          <h1 className="text-4xl font-serif font-bold text-primary">Main Heading</h1>
          <h2 className="text-2xl font-serif font-bold text-primary/80">Section Heading</h2>
          <h3 className="text-xl font-serif text-primary/70">Subsection Heading</h3>
          <p className="text-muted-foreground">Body text for reference.</p>
        </div>
      );
    }
    
    if (variant === "modern") {
      return (
        <div className="space-y-6">
          <h1 className="text-4xl font-sans font-bold tracking-tight text-primary">Main Heading</h1>
          <h2 className="text-2xl font-sans font-semibold tracking-tight text-primary/80">Section Heading</h2>
          <h3 className="text-lg font-sans font-medium text-primary/70 uppercase tracking-widest">Subsection</h3>
          <p className="text-muted-foreground">Body text for reference.</p>
        </div>
      );
    }
    
    if (variant === "brutalist") {
      return (
        <div className="space-y-6">
          <h1 className="text-6xl font-bold uppercase tracking-tighter text-primary leading-none">
            HEADLINE
          </h1>
          <h2 className="text-3xl font-bold uppercase text-secondary">
            SUBHEAD
          </h2>
          <h3 className="text-xl font-bold text-primary/60 border-b-4 border-current pb-1 inline-block">
            Section
          </h3>
          <p className="text-muted-foreground mt-4">Body text for reference.</p>
        </div>
      );
    }
    
    if (variant === "decorative") {
      return (
        <div className="space-y-8">
          <div className="relative">
            <h1 className="text-4xl font-serif font-bold text-primary">
              Main Heading
            </h1>
            <div className="absolute -bottom-2 left-0 w-24 h-1 bg-secondary rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-primary/40" />
            <h2 className="text-2xl font-serif text-primary/80">Section Heading</h2>
            <div className="flex-1 h-px bg-primary/40" />
          </div>
          <div className="pl-4 border-l-2 border-secondary">
            <h3 className="text-lg font-serif text-primary/70">Subsection with Accent</h3>
          </div>
        </div>
      );
    }
  }

  // Lists
  if (category === "lists") {
    if (variant === "bullets") {
      return (
        <ul className="space-y-3">
          {["First item with custom bullet", "Second item in the list", "Third item here"].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-2 h-2 mt-2 bg-secondary rounded-full shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    if (variant === "numbers") {
      return (
        <ol className="space-y-6">
          {["First numbered item", "Second numbered item", "Third numbered item"].map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="text-4xl font-serif font-bold text-secondary/60 leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-2">
                <span className="font-bold">Step {i + 1}</span>
                <p className="text-muted-foreground text-sm mt-1">{item}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    }
    
    if (variant === "timeline") {
      return (
        <div className="relative pl-6 border-l-2 border-muted space-y-8">
          {[
            { year: "2024", title: "Latest Event" },
            { year: "2023", title: "Previous Event" },
            { year: "2022", title: "Earlier Event" },
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[1.65rem] w-3 h-3 bg-secondary rounded-full ring-4 ring-background" />
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">{item.year}</span>
              <h4 className="font-bold mt-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground">Description of this event.</p>
            </div>
          ))}
        </div>
      );
    }
    
    if (variant === "tags") {
      return (
        <div className="flex flex-wrap gap-2">
          {["Design", "Typography", "Color", "Layout", "Animation", "UX"].map((tag, i) => (
            <span
              key={i}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                i % 3 === 0 ? "bg-primary text-primary-foreground" :
                i % 3 === 1 ? "bg-secondary text-secondary-foreground" :
                "bg-muted text-muted-foreground"
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      );
    }
  }

  // Blockquotes
  if (category === "blockquotes") {
    if (variant === "pullquote") {
      return (
        <div className="text-center py-8">
          <blockquote className="text-3xl font-serif italic text-primary leading-relaxed">
            "Design is not just what it looks like and feels like. Design is how it works."
          </blockquote>
          <cite className="block mt-4 text-sm text-muted-foreground not-italic">
            — Steve Jobs
          </cite>
        </div>
      );
    }
    
    if (variant === "sidebar") {
      return (
        <div className="flex gap-6">
          <div className="flex-1 text-sm text-muted-foreground">
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <blockquote className="w-48 pl-4 border-l-4 border-secondary italic text-lg">
            "The key quote that stands out from the text."
          </blockquote>
        </div>
      );
    }
    
    if (variant === "interview") {
      return (
        <div className="space-y-6">
          <div>
            <span className="font-bold text-secondary">Q:</span>
            <p className="inline ml-2">What's the most important principle in design?</p>
          </div>
          <div className="pl-8 border-l-2 border-muted">
            <span className="font-bold text-primary">A:</span>
            <p className="inline ml-2 italic">
              I believe it's empathy—understanding the user's needs before anything else.
            </p>
            <p className="text-sm text-muted-foreground mt-2">— Interview Subject, 2024</p>
          </div>
        </div>
      );
    }
  }

  // Text Treatments
  if (category === "text") {
    if (variant === "dropcap") {
      return (
        <div className="max-w-lg">
          <p className="text-justify">
            <span className="float-left text-6xl font-serif font-bold leading-none mr-2 mt-1 text-primary">
              T
            </span>
            he quick brown fox jumps over the lazy dog. This classic pangram has been used by typographers for centuries to showcase the complete alphabet in a single sentence. It demonstrates how drop caps can add elegance to the beginning of a chapter or article.
          </p>
        </div>
      );
    }
    
    if (variant === "highlight") {
      return (
        <div className="max-w-lg space-y-4">
          <p>
            Regular text that leads up to{" "}
            <span className="bg-secondary/20 px-1 py-0.5 rounded">highlighted content</span>
            {" "}within a paragraph.
          </p>
          <p>
            You can also use{" "}
            <span className="bg-primary/10 border-b-2 border-primary px-1">
              underline highlights
            </span>
            {" "}for a different effect.
          </p>
          <p>
            Or try{" "}
            <span className="relative">
              <span className="absolute inset-0 bg-secondary/30 transform -rotate-1 rounded" />
              <span className="relative font-medium">angled emphasis</span>
            </span>
            {" "}for playful accents.
          </p>
        </div>
      );
    }
    
    if (variant === "annotation") {
      return (
        <div className="grid grid-cols-[1fr_auto] gap-8 max-w-lg">
          <div>
            <p className="mb-4">
              Main body text that tells the story. This is where the primary content lives.
              <sup className="text-secondary font-bold cursor-help">1</sup>
            </p>
            <p>
              Continue with more text that might reference additional notes.
              <sup className="text-secondary font-bold cursor-help">2</sup>
            </p>
          </div>
          <div className="w-32 border-l border-border pl-4 text-xs text-muted-foreground space-y-4">
            <p><span className="font-bold text-secondary">1.</span> A margin note provides additional context.</p>
            <p><span className="font-bold text-secondary">2.</span> These work like footnotes but remain visible.</p>
          </div>
        </div>
      );
    }
  }

  // Captions
  if (category === "captions") {
    if (variant === "minimal") {
      return (
        <div className="space-y-6">
          <div className="bg-muted rounded-lg h-40 flex items-center justify-center text-muted-foreground">
            [Image Placeholder]
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Figure 1 — Photography by Jane Doe
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Landscape, 2024 • Archival print on cotton paper
            </p>
          </div>
        </div>
      );
    }
    
    if (variant === "label") {
      return (
        <div className="space-y-6">
          <div className="bg-muted rounded-lg h-40 flex items-center justify-center text-muted-foreground relative">
            [Image Placeholder]
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase rounded">
                Featured
              </span>
              <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded">
                New
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
              Photography
            </span>
            <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
              2024
            </span>
            <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
              Landscape
            </span>
          </div>
        </div>
      );
    }
    
    if (variant === "overlay") {
      return (
        <div className="relative rounded-lg overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-secondary h-48 flex items-center justify-center text-white">
            [Image Content]
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h4 className="text-white font-bold text-lg">Image Title</h4>
            <p className="text-white/80 text-sm">
              A brief description that overlays the bottom of the image with a gradient fade.
            </p>
          </div>
        </div>
      );
    }
  }

  return <div className="text-muted-foreground">Select a style</div>;
}
