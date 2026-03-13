import { useState } from "react";
import { cn } from "@/lib/utils";

const PALETTE = {
  bg: "#F0EFE3",
  bgTint: "#E8E7D8",
  bgCenter: "#F4F3E8",
  bgEdge: "#E4E3D2",
  text: "#3B3830",
  textFade: "rgba(59, 56, 48, 0.4)",
  grainWash: "rgba(180, 172, 150, 0.15)",
  vignette: "rgba(180, 170, 140, 0.25)",
  textShadow: "0px 1px 3px rgba(30, 28, 20, 0.2)",
};

interface VintageScriptDemoProps {
  intensity: number;
}

export default function VintageScriptDemo({ intensity }: VintageScriptDemoProps) {
  const [activeSection, setActiveSection] = useState<"composition" | "tokens" | "specimens">("composition");
  const opacity = intensity / 100;

  return (
    <div className="space-y-6">
      {/* Section Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Vintage Script Design System
        </h3>
        <div className="flex gap-1 p-0.5 bg-muted/30 rounded-md">
          {(["composition", "tokens", "specimens"] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={cn(
                "px-2.5 py-1 text-[10px] font-medium rounded transition-all capitalize tracking-wider",
                activeSection === section
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {activeSection === "composition" && <LogoComposition opacity={opacity} />}
      {activeSection === "tokens" && <DesignTokens />}
      {activeSection === "specimens" && <TypeSpecimens opacity={opacity} />}
    </div>
  );
}

function LogoComposition({ opacity }: { opacity: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-lg"
      style={{
        backgroundColor: PALETTE.bg,
        minHeight: 480,
      }}
    >
      {/* Radial gradient: lighter center, darker edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${PALETTE.bgCenter} 0%, ${PALETTE.bgEdge} 100%)`,
        }}
      />

      {/* Paper texture background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/textures/vintage-script-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: opacity * 0.7,
          mixBlendMode: "multiply",
        }}
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/textures/vintage-script-grain.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          opacity: Math.min(0.15, opacity * 0.15),
          mixBlendMode: "multiply",
        }}
      />

      {/* Crease lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/textures/vintage-script-creases.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: Math.min(0.08, opacity * 0.08),
          mixBlendMode: "multiply",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 80px ${PALETTE.vignette}, inset 0 0 160px rgba(180,170,140,0.12)`,
        }}
      />

      {/* Logo: centered with lower weighting per spec */}
      <div className="relative z-10 flex items-center justify-center" style={{ minHeight: 480, paddingTop: "4%" }}>
        <div className="text-center" style={{ width: "60%" }}>
          {/* Script logo text */}
          <div className="relative">
            <h1
              style={{
                fontFamily: "'Pacifico', cursive",
                fontSize: "clamp(3rem, 8vw, 5.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: PALETTE.text,
                textShadow: PALETTE.textShadow,
                filter: "blur(0.3px)",
                WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 60%, rgba(0,0,0,0.4) 100%)",
                maskImage: "radial-gradient(ellipse at 50% 50%, black 60%, rgba(0,0,0,0.4) 100%)",
              }}
            >
              compute
            </h1>
            {/* Registered trademark */}
            <span
              style={{
                position: "absolute",
                top: "15%",
                right: "-2%",
                fontFamily: "'Pacifico', cursive",
                fontSize: "0.6rem",
                color: PALETTE.textFade,
                fontWeight: 300,
              }}
            >
              &reg;
            </span>
          </div>

          {/* Ink texture overlay on text (multiply blend) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url(/textures/vintage-script-grain.png)",
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
              mixBlendMode: "multiply",
              opacity: opacity * 0.3,
            }}
          />
        </div>
      </div>

      {/* Composition guides (subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500">
        {/* Center cross */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: "rgba(59,56,48,0.08)" }} />
        <div className="absolute top-1/2 left-0 right-0 h-px" style={{ backgroundColor: "rgba(59,56,48,0.08)" }} />
        {/* 20% padding guides */}
        <div className="absolute left-[20%] top-0 bottom-0 w-px" style={{ backgroundColor: "rgba(59,56,48,0.05)" }} />
        <div className="absolute right-[20%] top-0 bottom-0 w-px" style={{ backgroundColor: "rgba(59,56,48,0.05)" }} />
      </div>
    </div>
  );
}

function DesignTokens() {
  const colorTokens = [
    { name: "Background Base", value: "#F0EFE3", desc: "Warm off-white, aged parchment" },
    { name: "Background Tint", value: "#E8E7D8", desc: "Deeper tone for texture depth" },
    { name: "Center Gradient", value: "#F4F3E8", desc: "Radial gradient center" },
    { name: "Edge Gradient", value: "#E4E3D2", desc: "Radial gradient edges" },
    { name: "Text Primary", value: "#3B3830", desc: "Dark charcoal-brown, aged ink" },
    { name: "Text Fade", value: "rgba(59,56,48,0.4)", desc: "Soft ink fade for blending" },
    { name: "Grain Wash", value: "rgba(180,172,150,0.15)", desc: "Subtle warm grain overlay" },
  ];

  const spacingTokens = [
    { name: "Base Unit", value: "8px" },
    { name: "Container Padding", value: "48px (6\u00d7)" },
    { name: "Logo Margin", value: "32px (4\u00d7)" },
    { name: "TM Offset", value: "4px top, 2px right" },
  ];

  return (
    <div className="space-y-6">
      {/* Color Palette */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Color Palette
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {colorTokens.map((token) => (
            <div key={token.name} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded border border-border/50 flex-shrink-0"
                style={{ backgroundColor: token.value.startsWith("rgba") ? undefined : token.value }}
              >
                {token.value.startsWith("rgba") && (
                  <div className="w-full h-full rounded" style={{ backgroundColor: token.value }} />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{token.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{token.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Tokens */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Typography
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Font</span>
            <span className="font-medium" style={{ fontFamily: "'Pacifico', cursive" }}>Pacifico</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weight</span>
            <span className="font-mono text-xs">400 (natural bold strokes)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Letter Spacing</span>
            <span className="font-mono text-xs">-0.02em</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Line Height</span>
            <span className="font-mono text-xs">1.2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Text Transform</span>
            <span className="font-mono text-xs">lowercase</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ink Blur</span>
            <span className="font-mono text-xs">filter: blur(0.3px)</span>
          </div>
        </div>
      </div>

      {/* Spacing Tokens */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Spacing & Layout
        </h4>
        <div className="space-y-2 text-sm">
          {spacingTokens.map((token) => (
            <div key={token.name} className="flex justify-between">
              <span className="text-muted-foreground">{token.name}</span>
              <span className="font-mono text-xs">{token.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Effects */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Depth & Effects
        </h4>
        <div className="space-y-3 text-xs">
          <div>
            <p className="text-muted-foreground mb-1">Text Shadow</p>
            <code className="text-[10px] font-mono bg-muted/30 px-2 py-1 rounded block">
              0px 1px 3px rgba(30, 28, 20, 0.2)
            </code>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Vignette</p>
            <code className="text-[10px] font-mono bg-muted/30 px-2 py-1 rounded block">
              inset 0 0 80px rgba(180,170,140,0.25)
            </code>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Edge Fade Mask</p>
            <code className="text-[10px] font-mono bg-muted/30 px-2 py-1 rounded block">
              radial-gradient(ellipse, black 60%, rgba(0,0,0,0.4) 100%)
            </code>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Grain Blend</p>
            <code className="text-[10px] font-mono bg-muted/30 px-2 py-1 rounded block">
              mix-blend-mode: multiply; opacity: 0.10-0.15
            </code>
          </div>
        </div>
      </div>

      {/* Mood */}
      <div
        className="rounded-lg p-5 space-y-3"
        style={{ backgroundColor: PALETTE.bg, color: PALETTE.text }}
      >
        <h4 className="text-xs font-semibold uppercase tracking-wider opacity-60">
          Mood & Style
        </h4>
        <p className="text-sm leading-relaxed opacity-80">
          Mid-20th century American print design. Warm, handcrafted, nostalgic, approachable.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {["Aged sepia", "Kraft paper", "Muted earth tones", "Handcrafted", "Nostalgic"].map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full border"
              style={{ borderColor: "rgba(59,56,48,0.2)" }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="pt-2 text-xs opacity-50">
          Avoid: hard edges, high contrast, modern sans-serif, bright whites, pure blacks
        </div>
      </div>
    </div>
  );
}

function TypeSpecimens({ opacity }: { opacity: number }) {
  const specimens = [
    { text: "compute", size: "clamp(3rem, 8vw, 5rem)" },
    { text: "vintage press", size: "clamp(2rem, 5vw, 3.5rem)" },
    { text: "ink & paper co.", size: "clamp(1.5rem, 4vw, 2.5rem)" },
    { text: "the quiet type foundry", size: "clamp(1.2rem, 3vw, 2rem)" },
  ];

  return (
    <div className="space-y-4">
      {/* Type specimens on textured backgrounds */}
      {specimens.map((spec, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-lg"
          style={{
            backgroundColor: PALETTE.bg,
            padding: "48px 32px",
          }}
        >
          {/* Texture layers */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${PALETTE.bgCenter} 0%, ${PALETTE.bgEdge} 100%)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url(/textures/vintage-script-bg.jpg)",
              backgroundSize: "cover",
              opacity: opacity * 0.5,
              mixBlendMode: "multiply",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url(/textures/vintage-script-grain.png)",
              backgroundRepeat: "repeat",
              backgroundSize: "256px 256px",
              opacity: 0.12,
              mixBlendMode: "multiply",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: `inset 0 0 60px ${PALETTE.vignette}` }}
          />

          {/* Text */}
          <div className="relative z-10 text-center">
            <p
              style={{
                fontFamily: "'Pacifico', cursive",
                fontSize: spec.size,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: PALETTE.text,
                textShadow: PALETTE.textShadow,
                filter: "blur(0.3px)",
                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, black 15%, black 85%, rgba(0,0,0,0.4) 100%)",
                maskImage: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, black 15%, black 85%, rgba(0,0,0,0.4) 100%)",
              }}
            >
              {spec.text}
            </p>
          </div>
        </div>
      ))}

      {/* Effect comparison: with vs without */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-white p-6 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Without effects</p>
          <p
            style={{
              fontFamily: "'Pacifico', cursive",
              fontSize: "2rem",
              color: "#000",
            }}
          >
            compute
          </p>
        </div>
        <div
          className="relative overflow-hidden rounded-lg p-6 text-center"
          style={{ backgroundColor: PALETTE.bg }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url(/textures/vintage-script-bg.jpg)",
              backgroundSize: "cover",
              opacity: 0.5,
              mixBlendMode: "multiply",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url(/textures/vintage-script-grain.png)",
              backgroundRepeat: "repeat",
              backgroundSize: "256px 256px",
              opacity: 0.12,
              mixBlendMode: "multiply",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: `inset 0 0 50px ${PALETTE.vignette}` }}
          />
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3 relative z-10">With full system</p>
          <p
            className="relative z-10"
            style={{
              fontFamily: "'Pacifico', cursive",
              fontSize: "2rem",
              color: PALETTE.text,
              textShadow: PALETTE.textShadow,
              filter: "blur(0.3px)",
              letterSpacing: "-0.02em",
              WebkitMaskImage: "radial-gradient(ellipse, black 60%, rgba(0,0,0,0.5) 100%)",
              maskImage: "radial-gradient(ellipse, black 60%, rgba(0,0,0,0.5) 100%)",
            }}
          >
            compute
          </p>
        </div>
      </div>
    </div>
  );
}
