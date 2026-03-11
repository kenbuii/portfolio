import { useTheme } from "@/contexts/ThemeContext";
import { LoadingScreen } from "@/components/constructivist/LoadingScreen";
import { ConstructivistCard } from "@/components/constructivist/Card";
import { ConstructivistButton } from "@/components/constructivist/Button";
import { SectionHeader } from "@/components/constructivist/SectionHeader";
import { ConstructivistDivider } from "@/components/constructivist/Divider";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ThemePlayground() {
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
        <h2 className="text-xl font-semibold tracking-wide mb-6">DESIGN SYSTEM</h2>
        
        <div className="flex gap-4">
          <button
            onClick={() => setDesignSystem("classic")}
            className={cn(
              "px-6 py-3 text-sm tracking-wide transition-all",
              designSystem === "classic"
                ? "bg-[#2F4F4F] text-[#F5F0E6]"
                : "border border-[#0A0A0A]/20 hover:border-[#0A0A0A]/40"
            )}
          >
            CLASSIC (Current)
          </button>
          <button
            onClick={() => setDesignSystem("constructivist")}
            className={cn(
              "px-6 py-3 text-sm tracking-wide transition-all",
              designSystem === "constructivist"
                ? "bg-[#CC2936] text-white"
                : "border border-[#0A0A0A]/20 hover:border-[#CC2936]"
            )}
          >
            CONSTRUCTIVIST
          </button>
        </div>
        
        <p className="mt-4 text-sm text-muted-foreground">
          {designSystem === "constructivist" 
            ? "Radical Constructivist/Bauhaus design active. Navigate to Home, About, or Inspirations to see the full effect."
            : "Classic mid-century modern design active. Toggle to Constructivist for the radical redesign."}
        </p>
        
        <p className="mt-2 text-xs text-muted-foreground">
          Keyboard shortcut: <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl/Cmd + Shift + T</kbd>
        </p>
      </section>
      
      {/* Loading Screen Variants */}
      <section>
        <h2 className="text-xl font-semibold tracking-wide mb-6">LOADING SCREEN VARIANT</h2>
        
        <div className="grid grid-cols-4 gap-4">
          {(["gears", "suprematist", "factory", "minimal"] as const).map((variant) => (
            <button
              key={variant}
              onClick={() => setLoadingVariant(variant)}
              className={cn(
                "p-4 border text-center text-sm tracking-wide uppercase transition-all",
                loadingVariant === variant
                  ? "border-[#CC2936] bg-[#CC2936]/10"
                  : "border-[#0A0A0A]/20 hover:border-[#0A0A0A]/40"
              )}
            >
              {variant}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setPreviewLoading(true)}
          className="mt-4 px-6 py-2 bg-[#0A0A0A] text-white text-sm tracking-wide"
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
        <h2 className="text-xl font-semibold tracking-wide mb-6">NAVIGATION VARIANT</h2>
        
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: "diagonal", label: "Diagonal Bar", desc: "Angled header navigation" },
            { id: "sidebar", label: "Vertical Sidebar", desc: "Shape icons on left edge" },
            { id: "blocks", label: "Overlapping Blocks", desc: "Staggered color blocks" },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => setNavVariant(nav.id as "diagonal" | "sidebar" | "blocks")}
              className={cn(
                "p-4 border text-left transition-all",
                navVariant === nav.id
                  ? "border-[#1E5AA8] bg-[#1E5AA8]/10"
                  : "border-[#0A0A0A]/20 hover:border-[#0A0A0A]/40"
              )}
            >
              <div className="text-sm font-medium tracking-wide">{nav.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{nav.desc}</div>
            </button>
          ))}
        </div>
      </section>
      
      {/* Component Previews */}
      <section>
        <h2 className="text-xl font-semibold tracking-wide mb-6">COMPONENT PREVIEW</h2>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Cards */}
          <div>
            <h3 className="text-sm font-medium tracking-wide mb-4 text-muted-foreground">CARDS</h3>
            <ConstructivistCard
              title="Sample Card"
              description="This card uses diagonal clip-paths and shape prefixes."
              type="triangle"
            />
          </div>
          
          {/* Buttons */}
          <div>
            <h3 className="text-sm font-medium tracking-wide mb-4 text-muted-foreground">BUTTONS</h3>
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
        <h2 className="text-xl font-semibold tracking-wide mb-6">SECTION HEADERS</h2>
        
        <div className="space-y-8">
          <div>
            <span className="text-xs text-muted-foreground block mb-2">Diagonal</span>
            <SectionHeader title="ABOUT" variant="diagonal" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-2">Vertical</span>
            <SectionHeader title="INSPIRATIONS" variant="vertical" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-2">Block</span>
            <SectionHeader title="CONTACT" variant="block" />
          </div>
        </div>
      </section>
      
      {/* Dividers */}
      <section>
        <h2 className="text-xl font-semibold tracking-wide mb-6">DIVIDERS</h2>
        
        <div className="space-y-8">
          <div>
            <span className="text-xs text-muted-foreground block mb-2">Line with shape</span>
            <ConstructivistDivider variant="line" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-2">Three shapes</span>
            <ConstructivistDivider variant="shapes" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-2">Diagonal bar</span>
            <ConstructivistDivider variant="diagonal" />
          </div>
        </div>
      </section>
      
      {/* Rollback Info */}
      <section className="bg-muted/50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold tracking-wide mb-4">ROLLBACK OPTIONS</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• <strong>Toggle button:</strong> Use the floating toggle in the bottom-right corner</li>
          <li>• <strong>Keyboard:</strong> Press <kbd className="px-1.5 py-0.5 bg-background rounded">Ctrl/Cmd + Shift + T</kbd></li>
          <li>• <strong>Emergency:</strong> Open browser console and run <code className="px-1.5 py-0.5 bg-background rounded">window.resetDesignSystem()</code></li>
          <li>• <strong>Persisted:</strong> Your choice is saved to localStorage and survives page refresh</li>
        </ul>
      </section>
    </div>
  );
}
