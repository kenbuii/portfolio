import { useState } from "react";
import { cn } from "@/lib/utils";
import { TEXTURE_FAMILIES, type TextureState } from "./textureConfig";
import VintageScriptDemo from "./VintageScriptDemo";

interface TextureCanvasProps {
  state: TextureState;
}

export default function TextureCanvas({ state }: TextureCanvasProps) {
  const family = TEXTURE_FAMILIES.find((f) => f.id === state.selectedFamily);
  if (!family) return null;

  const opacity = state.intensity / 100;
  const isMonochrome = state.colorMode === "monochrome";

  const textureOverlayStyle = (element: string): React.CSSProperties => {
    if (!state.activeElements.has(element as any)) return {};
    return {
      backgroundImage: `url(${family.tilePath})`,
      backgroundRepeat: family.tileMode === "repeat" ? "repeat" : "no-repeat",
      backgroundSize: family.tileMode === "repeat" ? "256px 256px" : "cover",
      backgroundPosition: "center",
      opacity,
      mixBlendMode: state.blendMode,
      ...(isMonochrome ? { filter: "grayscale(100%)" } : {}),
    };
  };

  const fullImageStyle = (): React.CSSProperties => {
    const src = family.fullPath || family.tilePath;
    return {
      backgroundImage: `url(${src})`,
      backgroundRepeat: family.tileMode === "repeat" ? "repeat" : "no-repeat",
      backgroundSize: family.tileMode === "repeat" ? "256px 256px" : "cover",
      backgroundPosition: "center",
      opacity,
      mixBlendMode: state.blendMode,
      ...(isMonochrome ? { filter: "grayscale(100%)" } : {}),
    };
  };

  if (family.id === "vintage-script") {
    return <VintageScriptDemo intensity={state.intensity} />;
  }

  return (
    <div className="space-y-6">
      {/* Layer Decomposition — shown when family has bg/fg separation */}
      {family.bgPath && family.fgPath && (
        <LayerDecomposition family={family} opacity={opacity} isMonochrome={isMonochrome} blendMode={state.blendMode} />
      )}

      {/* Hero Area */}
      {state.activeElements.has("hero") && (
        <HeroSection textureStyle={textureOverlayStyle("hero")} />
      )}

      {/* Background Demo */}
      {state.activeElements.has("background") && (
        <BackgroundSection
          textureStyle={fullImageStyle()}
          familyName={family.name}
          intensity={state.intensity}
          family={family}
          opacity={opacity}
          isMonochrome={isMonochrome}
        />
      )}

      {/* Cards */}
      {state.activeElements.has("cards") && (
        <CardsSection textureStyle={textureOverlayStyle("cards")} />
      )}

      {/* Typography */}
      {state.activeElements.has("typography") && (
        <TypographySection
          family={family}
          opacity={opacity}
          isMonochrome={isMonochrome}
        />
      )}

      {/* Dividers */}
      {state.activeElements.has("dividers") && (
        <DividersSection textureStyle={textureOverlayStyle("dividers")} />
      )}

      {/* Hover States */}
      {state.activeElements.has("hover") && (
        <HoverSection textureStyle={textureOverlayStyle("hover")} />
      )}

      {/* Decorative Accents */}
      {state.activeElements.has("decorative") && (
        <DecorativeSection family={family} opacity={opacity} />
      )}

      {/* Empty state */}
      {state.activeElements.size === 0 && (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground text-sm">
            Select elements on the left to preview textures
          </p>
        </div>
      )}
    </div>
  );
}

function LayerDecomposition({
  family,
  opacity,
  isMonochrome,
  blendMode,
}: {
  family: (typeof TEXTURE_FAMILIES)[number];
  opacity: number;
  isMonochrome: boolean;
  blendMode: string;
}) {
  const [activeLayer, setActiveLayer] = useState<"combined" | "bg" | "fg">("combined");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Layer Decomposition
        </h3>
        <div className="flex gap-1 p-0.5 bg-muted/30 rounded-md">
          {(["combined", "bg", "fg"] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={cn(
                "px-2.5 py-1 text-[10px] font-medium rounded transition-all uppercase tracking-wider",
                activeLayer === layer
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {layer === "combined" ? "Combined" : layer === "bg" ? "Background" : "Foreground"}
            </button>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-border bg-background min-h-[220px]">
        {/* Background layer */}
        {(activeLayer === "combined" || activeLayer === "bg") && family.bgPath && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${family.bgPath})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: activeLayer === "bg" ? Math.min(1, opacity + 0.4) : opacity * 0.6,
              ...(isMonochrome ? { filter: "grayscale(100%)" } : {}),
            }}
          />
        )}

        {/* Foreground layer */}
        {(activeLayer === "combined" || activeLayer === "fg") && family.fgPath && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${family.fgPath})`,
              backgroundSize: family.tileMode === "repeat" ? "256px 256px" : "cover",
              backgroundRepeat: family.tileMode === "repeat" ? "repeat" : "no-repeat",
              backgroundPosition: "center",
              opacity: activeLayer === "fg" ? Math.min(1, opacity + 0.2) : opacity,
              mixBlendMode: activeLayer === "combined" ? blendMode as any : undefined,
            }}
          />
        )}

        {/* Sample content overlay */}
        <div className="relative z-10 p-6 space-y-3">
          <h4 className="font-serif text-2xl font-bold text-primary">
            {family.name}
          </h4>
          <p className="text-sm text-foreground/80 max-w-sm leading-relaxed">
            Toggle between layers to see the separated background surface
            and foreground design marks independently.
          </p>
          <div className="flex gap-3 pt-1 text-[10px] text-muted-foreground">
            <span className="px-2 py-0.5 bg-muted/40 rounded">
              {activeLayer === "bg" ? "Surface only" : activeLayer === "fg" ? "Marks only" : "Both layers"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection({ textureStyle }: { textureStyle: React.CSSProperties }) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-primary text-primary-foreground p-8 min-h-[180px] flex flex-col justify-end">
      <div className="absolute inset-0 pointer-events-none" style={textureStyle} />
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.2em] opacity-70 mb-2">
          Section Header
        </p>
        <h2 className="font-serif text-3xl font-bold mb-1">
          The Texture of Memory
        </h2>
        <p className="text-sm opacity-80 max-w-md">
          Every surface tells a story through its imperfections, grain, and patina.
        </p>
      </div>
    </div>
  );
}

function BackgroundSection({
  textureStyle,
  familyName,
  intensity,
  family,
  opacity,
  isMonochrome,
}: {
  textureStyle: React.CSSProperties;
  familyName: string;
  intensity: number;
  family: (typeof TEXTURE_FAMILIES)[number];
  opacity: number;
  isMonochrome: boolean;
}) {
  const hasSeparation = family.bgPath && family.fgPath;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Page Background
      </h3>

      {/* Combined texture view */}
      <div className="relative overflow-hidden rounded-lg border border-border bg-background p-6 min-h-[200px]">
        <div className="absolute inset-0 pointer-events-none" style={textureStyle} />
        <div className="relative z-10 space-y-3">
          <div className="flex items-baseline gap-2">
            <h3 className="font-serif text-xl font-bold text-primary">
              Combined
            </h3>
            <span className="text-xs text-muted-foreground">
              {familyName} at {intensity}%
            </span>
          </div>
          <p className="text-sm text-foreground/80 max-w-md leading-relaxed">
            The full texture applied as a page background overlay.
            Content remains readable while the texture adds depth and character.
          </p>
          <div className="flex gap-2 pt-2">
            <span className="inline-block px-3 py-1 text-xs bg-primary text-background rounded">
              Primary
            </span>
            <span className="inline-block px-3 py-1 text-xs bg-secondary text-white rounded">
              Secondary
            </span>
            <span className="inline-block px-3 py-1 text-xs border border-border rounded text-muted-foreground">
              Muted
            </span>
          </div>
        </div>
      </div>

      {/* Layered view: bg only, then fg only */}
      {hasSeparation && (
        <div className="grid grid-cols-2 gap-3">
          <div className="relative overflow-hidden rounded-lg border border-border p-4 min-h-[120px]">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${family.bgPath})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: Math.min(1, opacity + 0.3),
                ...(isMonochrome ? { filter: "grayscale(100%)" } : {}),
              }}
            />
            <div className="relative z-10">
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-background/80 px-2 py-0.5 rounded text-muted-foreground">
                Background Only
              </span>
              <p className="text-xs text-foreground/70 mt-2 leading-relaxed">
                The surface texture without any marks or design elements.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-border bg-background p-4 min-h-[120px]">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${family.fgPath})`,
                backgroundSize: family.tileMode === "repeat" ? "256px 256px" : "cover",
                backgroundRepeat: family.tileMode === "repeat" ? "repeat" : "no-repeat",
                backgroundPosition: "center",
                opacity,
              }}
            />
            <div className="relative z-10">
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-background/80 px-2 py-0.5 rounded text-muted-foreground">
                Foreground Only
              </span>
              <p className="text-xs text-foreground/70 mt-2 leading-relaxed">
                The design marks, isolated as a transparent overlay.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CardsSection({ textureStyle }: { textureStyle: React.CSSProperties }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Cards
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4">
          <div className="absolute inset-0 pointer-events-none" style={textureStyle} />
          <div className="relative z-10">
            <div className="w-8 h-8 bg-primary/10 rounded mb-3 flex items-center justify-center">
              <span className="text-primary text-sm font-serif">I</span>
            </div>
            <h4 className="font-serif font-bold text-primary text-sm mb-1">
              The Elements of Style
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Strunk & White
            </p>
            <div className="flex gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-xs text-primary/60">
                  {i <= 4 ? "\u2605" : "\u2606"}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4">
          <div className="absolute inset-0 pointer-events-none" style={textureStyle} />
          <div className="relative z-10">
            <div className="w-8 h-8 bg-secondary/10 rounded mb-3 flex items-center justify-center">
              <span className="text-secondary text-sm font-serif">II</span>
            </div>
            <h4 className="font-serif font-bold text-primary text-sm mb-1">
              Grid Systems in Design
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Josef M\u00fcller-Brockmann
            </p>
            <div className="flex gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-xs text-primary/60">
                  {i <= 5 ? "\u2605" : "\u2606"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypographySection({
  family,
  opacity,
  isMonochrome,
}: {
  family: (typeof TEXTURE_FAMILIES)[number];
  opacity: number;
  isMonochrome: boolean;
}) {
  const src = family.fullPath || family.tilePath;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Typography
      </h3>
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        {/* Letterpress effect heading */}
        <div
          className="font-serif text-4xl font-bold leading-tight"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: family.tileMode === "repeat" ? "256px 256px" : "cover",
            backgroundPosition: "center",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: Math.min(1, opacity + 0.3),
            ...(isMonochrome ? { filter: "grayscale(100%) contrast(1.5)" } : {}),
          }}
        >
          Ink & Paper
        </div>

        {/* Normal text with texture behind */}
        <div className="relative">
          <div
            className="absolute inset-0 pointer-events-none rounded"
            style={{
              backgroundImage: `url(${family.tilePath})`,
              backgroundRepeat: "repeat",
              backgroundSize: "256px 256px",
              opacity: opacity * 0.5,
              mixBlendMode: "multiply",
              ...(isMonochrome ? { filter: "grayscale(100%)" } : {}),
            }}
          />
          <p className="relative text-sm text-foreground/80 leading-relaxed font-sans">
            The texture of letterpress printing is unmistakable — each character pressed
            into the paper leaves a slight impression, the ink pooling at the edges with
            microscopic imperfections that give warmth to the coldness of type.
          </p>
        </div>

        {/* Type scale */}
        <div className="space-y-1 pt-2 border-t border-border/50">
          <p className="font-serif text-2xl font-bold text-primary">Display — 24px</p>
          <p className="font-serif text-lg text-primary">Heading — 18px</p>
          <p className="text-sm text-foreground">Body — 14px</p>
          <p className="text-xs text-muted-foreground">Caption — 12px</p>
        </div>
      </div>
    </div>
  );
}

function DividersSection({ textureStyle }: { textureStyle: React.CSSProperties }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Dividers
      </h3>
      <div className="space-y-4 p-4 rounded-lg border border-border bg-card">
        {/* Textured horizontal rule */}
        <div className="relative h-3 overflow-hidden rounded">
          <div className="absolute inset-0" style={textureStyle} />
        </div>

        <p className="text-xs text-muted-foreground text-center">Thin textured rule</p>

        {/* Thick textured band */}
        <div className="relative h-8 overflow-hidden rounded">
          <div className="absolute inset-0" style={textureStyle} />
        </div>

        <p className="text-xs text-muted-foreground text-center">Thick textured band</p>

        {/* Dotted with texture */}
        <div className="relative h-1 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              ...textureStyle,
              maskImage: "repeating-linear-gradient(to right, black 0px, black 4px, transparent 4px, transparent 12px)",
              WebkitMaskImage: "repeating-linear-gradient(to right, black 0px, black 4px, transparent 4px, transparent 12px)",
            }}
          />
        </div>

        <p className="text-xs text-muted-foreground text-center">Dotted textured rule</p>
      </div>
    </div>
  );
}

function HoverSection({ textureStyle }: { textureStyle: React.CSSProperties }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Hover States
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {["Explore", "Read More", "Details"].map((label, i) => (
          <button
            key={label}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative overflow-hidden rounded-md border border-border bg-card px-4 py-6 text-sm font-medium text-primary transition-all hover:shadow-md"
          >
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500"
              style={{
                ...textureStyle,
                opacity: hoveredIndex === i ? textureStyle.opacity : 0,
              }}
            />
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Hover over the buttons to reveal texture
      </p>
    </div>
  );
}

function DecorativeSection({
  family,
  opacity,
}: {
  family: (typeof TEXTURE_FAMILIES)[number];
  opacity: number;
}) {
  const isGeometric = family.id === "bauhaus";
  const shapeSrc = isGeometric
    ? "/textures/bauhaus-shape-01.png"
    : family.fullPath || family.tilePath;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Decorative Accents
      </h3>
      <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 min-h-[160px]">
        {/* Floating decorative element - top right */}
        <div
          className="absolute -top-4 -right-4 w-32 h-32 pointer-events-none"
          style={{
            backgroundImage: `url(${shapeSrc})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: opacity * 0.8,
            transform: "rotate(15deg)",
          }}
        />

        {/* Floating decorative element - bottom left */}
        <div
          className="absolute -bottom-6 -left-6 w-24 h-24 pointer-events-none"
          style={{
            backgroundImage: `url(${family.tilePath})`,
            backgroundSize: family.tileMode === "repeat" ? "128px 128px" : "cover",
            backgroundRepeat: family.tileMode === "repeat" ? "repeat" : "no-repeat",
            opacity: opacity * 0.6,
            borderRadius: "50%",
            transform: "rotate(-10deg)",
          }}
        />

        <div className="relative z-10">
          <h4 className="font-serif text-lg font-bold text-primary mb-2">
            Decorative Context
          </h4>
          <p className="text-sm text-foreground/80 max-w-xs leading-relaxed">
            Texture fragments placed as accents in margins and corners, adding visual
            interest without overwhelming the content.
          </p>
        </div>
      </div>
    </div>
  );
}
