import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, RotateCcw, Palette, Eye } from "lucide-react";

interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    primary: string;
    secondary: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    border: string;
  };
}

const palettes: ColorPalette[] = [
  {
    id: "current",
    name: "Current Site",
    description: "Mid-century modern - Eggshell, Dark Green, Cerulean",
    colors: {
      background: "hsl(46 46% 92%)",
      foreground: "hsl(151 49% 14%)",
      card: "hsl(46 46% 95%)",
      primary: "hsl(151 49% 14%)",
      secondary: "hsl(196 100% 33%)",
      muted: "hsl(151 20% 85%)",
      mutedForeground: "hsl(151 49% 25%)",
      accent: "hsl(196 100% 33%)",
      border: "hsl(151 49% 14% / 0.1)",
    },
  },
  {
    id: "sage-gold",
    name: "Sage + Gold",
    description: "Wellness aesthetic - Olive tones with warm gold accents",
    colors: {
      background: "hsl(100 15% 67%)",
      foreground: "hsl(100 15% 25%)",
      card: "hsl(100 15% 72%)",
      primary: "hsl(100 15% 25%)",
      secondary: "hsl(45 70% 52%)",
      muted: "hsl(100 10% 60%)",
      mutedForeground: "hsl(100 15% 35%)",
      accent: "hsl(45 70% 52%)",
      border: "hsl(100 15% 25% / 0.15)",
    },
  },
  {
    id: "brutalist",
    name: "High Contrast Brutalist",
    description: "Black, white, and red - Bold editorial style",
    colors: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(0 0% 0%)",
      card: "hsl(0 0% 98%)",
      primary: "hsl(0 0% 0%)",
      secondary: "hsl(0 85% 50%)",
      muted: "hsl(0 0% 92%)",
      mutedForeground: "hsl(0 0% 40%)",
      accent: "hsl(0 85% 50%)",
      border: "hsl(0 0% 0%)",
    },
  },
  {
    id: "dark-editorial",
    name: "Dark Mode Editorial",
    description: "Near black with yellow accents - Night mode",
    colors: {
      background: "hsl(0 0% 4%)",
      foreground: "hsl(0 0% 96%)",
      card: "hsl(0 0% 8%)",
      primary: "hsl(0 0% 96%)",
      secondary: "hsl(50 100% 50%)",
      muted: "hsl(0 0% 15%)",
      mutedForeground: "hsl(0 0% 60%)",
      accent: "hsl(50 100% 50%)",
      border: "hsl(0 0% 100% / 0.1)",
    },
  },
  {
    id: "bauhaus",
    name: "Bauhaus Primary",
    description: "Warm white with red, blue, yellow accents",
    colors: {
      background: "hsl(40 30% 95%)",
      foreground: "hsl(0 0% 10%)",
      card: "hsl(40 30% 98%)",
      primary: "hsl(0 0% 10%)",
      secondary: "hsl(210 80% 50%)",
      muted: "hsl(40 20% 90%)",
      mutedForeground: "hsl(0 0% 40%)",
      accent: "hsl(0 75% 50%)",
      border: "hsl(0 0% 10% / 0.1)",
    },
  },
  {
    id: "muted",
    name: "Muted / Desaturated",
    description: "Warm grays with slate and tan accents",
    colors: {
      background: "hsl(35 15% 90%)",
      foreground: "hsl(210 30% 25%)",
      card: "hsl(35 15% 93%)",
      primary: "hsl(210 30% 25%)",
      secondary: "hsl(30 30% 45%)",
      muted: "hsl(35 10% 85%)",
      mutedForeground: "hsl(210 10% 50%)",
      accent: "hsl(30 30% 45%)",
      border: "hsl(210 30% 25% / 0.1)",
    },
  },
  {
    id: "risograph",
    name: "Risograph / Lo-fi",
    description: "Paper texture feel with burgundy and blue",
    colors: {
      background: "hsl(40 35% 94%)",
      foreground: "hsl(0 0% 10%)",
      card: "hsl(40 35% 97%)",
      primary: "hsl(0 0% 10%)",
      secondary: "hsl(345 75% 30%)",
      muted: "hsl(40 20% 88%)",
      mutedForeground: "hsl(0 0% 45%)",
      accent: "hsl(210 70% 40%)",
      border: "hsl(0 0% 10% / 0.12)",
    },
  },
  {
    id: "soviet",
    name: "Soviet Constructivist",
    description: "Red, black, and cream - Revolutionary propaganda aesthetic",
    colors: {
      background: "hsl(40 30% 90%)",
      foreground: "hsl(0 0% 8%)",
      card: "hsl(40 30% 93%)",
      primary: "hsl(0 0% 8%)",
      secondary: "hsl(0 75% 45%)",
      muted: "hsl(40 20% 85%)",
      mutedForeground: "hsl(0 0% 35%)",
      accent: "hsl(0 75% 45%)",
      border: "hsl(0 0% 8% / 0.15)",
    },
  },
  {
    id: "forest",
    name: "Deep Forest",
    description: "Dark greens with warm amber highlights",
    colors: {
      background: "hsl(150 20% 12%)",
      foreground: "hsl(45 50% 90%)",
      card: "hsl(150 20% 15%)",
      primary: "hsl(45 50% 90%)",
      secondary: "hsl(35 80% 55%)",
      muted: "hsl(150 15% 20%)",
      mutedForeground: "hsl(45 30% 65%)",
      accent: "hsl(35 80% 55%)",
      border: "hsl(45 50% 90% / 0.1)",
    },
  },
];

const STORAGE_KEY = "experiments_active_palette";
const ORIGINAL_PALETTE_KEY = "experiments_original_palette";

export default function ColorTab() {
  const [selectedPalette, setSelectedPalette] = useState<string>("current");
  const [appliedPalette, setAppliedPalette] = useState<string | null>(null);
  const [originalVars, setOriginalVars] = useState<Record<string, string>>({});

  // Load applied palette from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAppliedPalette(stored);
      setSelectedPalette(stored);
      const palette = palettes.find(p => p.id === stored);
      if (palette) {
        applyPaletteToDOM(palette.colors);
      }
    }
  }, []);

  // Save original CSS variables
  const saveOriginalVars = () => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const vars: Record<string, string> = {};
    
    // Save current values
    const varNames = [
      "--color-background", "--color-foreground", "--color-card",
      "--color-primary", "--color-secondary", "--color-muted",
      "--color-muted-foreground", "--color-accent", "--color-border"
    ];
    
    varNames.forEach(name => {
      vars[name] = style.getPropertyValue(name).trim();
    });
    
    setOriginalVars(vars);
    localStorage.setItem(ORIGINAL_PALETTE_KEY, JSON.stringify(vars));
  };

  const applyPaletteToDOM = (colors: ColorPalette["colors"]) => {
    const root = document.documentElement;
    root.style.setProperty("--color-background", colors.background);
    root.style.setProperty("--color-foreground", colors.foreground);
    root.style.setProperty("--color-card", colors.card);
    root.style.setProperty("--color-primary", colors.primary);
    root.style.setProperty("--color-secondary", colors.secondary);
    root.style.setProperty("--color-muted", colors.muted);
    root.style.setProperty("--color-muted-foreground", colors.mutedForeground);
    root.style.setProperty("--color-accent", colors.accent);
    root.style.setProperty("--color-border", colors.border);
  };

  const handleApply = () => {
    // Save original first if not already saved
    if (Object.keys(originalVars).length === 0) {
      saveOriginalVars();
    }
    
    const palette = palettes.find(p => p.id === selectedPalette);
    if (palette) {
      applyPaletteToDOM(palette.colors);
      setAppliedPalette(selectedPalette);
      localStorage.setItem(STORAGE_KEY, selectedPalette);
    }
  };

  const handleRevert = () => {
    // Restore original CSS variables
    const stored = localStorage.getItem(ORIGINAL_PALETTE_KEY);
    if (stored) {
      const vars = JSON.parse(stored);
      const root = document.documentElement;
      Object.entries(vars).forEach(([name, value]) => {
        root.style.setProperty(name, value as string);
      });
    } else {
      // Fallback: apply "current" palette
      const currentPalette = palettes.find(p => p.id === "current");
      if (currentPalette) {
        applyPaletteToDOM(currentPalette.colors);
      }
    }
    
    setAppliedPalette(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const currentPalette = palettes.find(p => p.id === selectedPalette);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-primary">Color Palettes</h2>
          <p className="text-sm text-muted-foreground">
            Preview and apply different color schemes to the site
          </p>
        </div>
        <div className="flex gap-2">
          {appliedPalette && (
            <button
              onClick={handleRevert}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Revert to Original
            </button>
          )}
          <button
            onClick={handleApply}
            disabled={appliedPalette === selectedPalette}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
              appliedPalette === selectedPalette
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
            )}
          >
            <Eye className="w-4 h-4" />
            {appliedPalette === selectedPalette ? "Applied" : "Apply to Site"}
          </button>
        </div>
      </div>

      {/* Palette Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {palettes.map((palette) => (
          <button
            key={palette.id}
            onClick={() => setSelectedPalette(palette.id)}
            className={cn(
              "p-4 rounded-lg border text-left transition-all",
              selectedPalette === palette.id
                ? "ring-2 ring-secondary border-secondary"
                : "border-border/50 hover:border-border"
            )}
          >
            {/* Color swatches */}
            <div className="flex gap-1 mb-3">
              <div
                className="w-8 h-8 rounded-sm border border-black/10"
                style={{ backgroundColor: palette.colors.background }}
                title="Background"
              />
              <div
                className="w-8 h-8 rounded-sm border border-black/10"
                style={{ backgroundColor: palette.colors.primary }}
                title="Primary"
              />
              <div
                className="w-8 h-8 rounded-sm border border-black/10"
                style={{ backgroundColor: palette.colors.secondary }}
                title="Secondary"
              />
              <div
                className="w-8 h-8 rounded-sm border border-black/10"
                style={{ backgroundColor: palette.colors.accent }}
                title="Accent"
              />
              <div
                className="w-8 h-8 rounded-sm border border-black/10"
                style={{ backgroundColor: palette.colors.muted }}
                title="Muted"
              />
            </div>
            
            {/* Name + description */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm">{palette.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {palette.description}
                </p>
              </div>
              {appliedPalette === palette.id && (
                <Check className="w-4 h-4 text-secondary shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Live Preview */}
      {currentPalette && (
        <div className="border-t border-border/40 pt-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Live Preview: {currentPalette.name}
          </h3>
          
          {/* Preview card */}
          <div
            className="rounded-lg overflow-hidden border"
            style={{
              backgroundColor: currentPalette.colors.background,
              borderColor: currentPalette.colors.border,
            }}
          >
            <div
              className="p-6"
              style={{ backgroundColor: currentPalette.colors.card }}
            >
              <h4
                className="text-2xl font-serif font-bold mb-2"
                style={{ color: currentPalette.colors.primary }}
              >
                Sample Heading
              </h4>
              <p
                className="mb-4"
                style={{ color: currentPalette.colors.foreground }}
              >
                This is body text showing how content would appear with this palette.
                The quick brown fox jumps over the lazy dog.
              </p>
              <p
                className="text-sm mb-4"
                style={{ color: currentPalette.colors.mutedForeground }}
              >
                This is muted text for secondary information.
              </p>
              
              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: currentPalette.colors.primary,
                    color: currentPalette.colors.background,
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: currentPalette.colors.secondary,
                    color: currentPalette.colors.background,
                  }}
                >
                  Secondary
                </button>
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium border"
                  style={{
                    borderColor: currentPalette.colors.border,
                    color: currentPalette.colors.foreground,
                  }}
                >
                  Outline
                </button>
              </div>
            </div>
            
            {/* Muted section */}
            <div
              className="p-4"
              style={{ backgroundColor: currentPalette.colors.muted }}
            >
              <p
                className="text-xs"
                style={{ color: currentPalette.colors.mutedForeground }}
              >
                Muted background section with subtle text
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
