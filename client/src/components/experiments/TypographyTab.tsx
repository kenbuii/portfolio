import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Play, RotateCcw } from "lucide-react";

type TypoSection = "scale" | "pairing" | "kinetic" | "treatment";

interface FontPairing {
  id: string;
  name: string;
  heading: string;
  body: string;
  description: string;
}

interface TypeScale {
  id: string;
  name: string;
  ratio: number;
  sizes: { level: string; rem: number }[];
}

const fontPairings: FontPairing[] = [
  {
    id: "current",
    name: "Current (Mid-Century)",
    heading: "'Clarendon', 'Rockwell', Georgia, serif",
    body: "'Instrument Serif', Georgia, serif",
    description: "Classic slab serif with elegant body text",
  },
  {
    id: "warm-editorial",
    name: "Warm Editorial",
    heading: "'Playfair Display', serif",
    body: "'Lora', serif",
    description: "Like a beautifully typeset magazine — high contrast display with warm readable body",
  },
  {
    id: "modernist-warm",
    name: "Modernist but Warm",
    heading: "'DM Serif Display', serif",
    body: "'Libre Baskerville', serif",
    description: "Still modernist/constructivist but with more personality and warmth",
  },
  {
    id: "brutalist",
    name: "Brutalist Industrial",
    heading: "'Oswald', sans-serif",
    body: "'Space Mono', monospace",
    description: "Industrial condensed sans with monospaced body — leans into the constructivist theme",
  },
  {
    id: "humanist",
    name: "Humanist Approachable",
    heading: "'Merriweather', serif",
    body: "'Source Serif 4', serif",
    description: "Softer, more personal feel — optimized for comfortable reading",
  },
  {
    id: "brutalist-editorial",
    name: "Brutalist Editorial",
    heading: "'Bebas Neue', sans-serif",
    body: "'DM Sans', sans-serif",
    description: "Bold condensed with refined geometric body text",
  },
  {
    id: "literary",
    name: "Literary Classic",
    heading: "'Cormorant Garamond', serif",
    body: "'Lora', serif",
    description: "Elegant old-style serifs for long-form reading",
  },
];

const typeScales: TypeScale[] = [
  {
    id: "perfect-fourth",
    name: "Perfect Fourth",
    ratio: 1.333,
    sizes: [
      { level: "H1", rem: 4.209 },
      { level: "H2", rem: 3.157 },
      { level: "H3", rem: 2.369 },
      { level: "H4", rem: 1.777 },
      { level: "Body", rem: 1 },
      { level: "Small", rem: 0.75 },
    ],
  },
  {
    id: "major-third",
    name: "Major Third",
    ratio: 1.25,
    sizes: [
      { level: "H1", rem: 3.052 },
      { level: "H2", rem: 2.441 },
      { level: "H3", rem: 1.953 },
      { level: "H4", rem: 1.563 },
      { level: "Body", rem: 1 },
      { level: "Small", rem: 0.8 },
    ],
  },
  {
    id: "minor-second",
    name: "Minor Second (Tight)",
    ratio: 1.067,
    sizes: [
      { level: "H1", rem: 1.867 },
      { level: "H2", rem: 1.5 },
      { level: "H3", rem: 1.2 },
      { level: "H4", rem: 1.1 },
      { level: "Body", rem: 1 },
      { level: "Small", rem: 0.937 },
    ],
  },
];

const textTreatments = [
  { id: "scattered", name: "Scattered Float", tracking: "normal", transform: "none" },
  { id: "vertical", name: "Stacked Vertical", tracking: "normal", transform: "none" },
  { id: "wide", name: "Track Wide", tracking: "0.3em", transform: "uppercase" },
  { id: "compressed", name: "Compressed Stack", tracking: "-0.02em", transform: "none" },
];

export default function TypographyTab() {
  const [activeSection, setActiveSection] = useState<TypoSection>("scale");
  const [selectedScale, setSelectedScale] = useState("perfect-fourth");
  const [selectedPairing, setSelectedPairing] = useState("current");
  const [selectedTreatment, setSelectedTreatment] = useState("wide");
  
  // Kinetic typography state
  const [kineticEffect, setKineticEffect] = useState<"stagger" | "word" | "scramble">("stagger");
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const sections: { id: TypoSection; label: string }[] = [
    { id: "scale", label: "Scale Systems" },
    { id: "pairing", label: "Font Pairings" },
    { id: "kinetic", label: "Kinetic Type" },
    { id: "treatment", label: "Text Treatments" },
  ];

  const currentScale = typeScales.find(s => s.id === selectedScale);
  const currentPairing = fontPairings.find(p => p.id === selectedPairing);

  const handlePlayKinetic = () => {
    setIsAnimating(false);
    setAnimationKey(k => k + 1);
    setTimeout(() => setIsAnimating(true), 50);
  };

  const handleResetKinetic = () => {
    setIsAnimating(false);
    setAnimationKey(k => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Section tabs */}
      <div className="flex gap-2 flex-wrap">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all",
              activeSection === section.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Scale Systems */}
      {activeSection === "scale" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-primary">Type Scale Systems</h2>
            <p className="text-sm text-muted-foreground">
              Compare different modular scales for typographic hierarchy
            </p>
          </div>

          {/* Scale selector */}
          <div className="flex gap-2">
            {typeScales.map(scale => (
              <button
                key={scale.id}
                onClick={() => setSelectedScale(scale.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg border transition-all",
                  selectedScale === scale.id
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-border/50 hover:border-border"
                )}
              >
                {scale.name} ({scale.ratio})
              </button>
            ))}
          </div>

          {/* Scale preview */}
          {currentScale && (
            <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
              {currentScale.sizes.map((size, i) => (
                <div key={size.level} className="flex items-baseline gap-4">
                  <span className="w-16 text-xs font-mono text-muted-foreground shrink-0">
                    {size.level} • {size.rem.toFixed(3)}rem
                  </span>
                  <span
                    className={cn(
                      "font-serif",
                      i < 4 ? "font-bold" : ""
                    )}
                    style={{ fontSize: `${size.rem}rem` }}
                  >
                    {i < 4 ? "The quick brown fox" : "Body text example with more words to show line length"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Font Pairings */}
      {activeSection === "pairing" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-primary">Font Pairings</h2>
            <p className="text-sm text-muted-foreground">
              Preview different heading + body font combinations
            </p>
          </div>

          {/* Pairing grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fontPairings.map(pairing => (
              <button
                key={pairing.id}
                onClick={() => setSelectedPairing(pairing.id)}
                className={cn(
                  "p-5 rounded-lg border text-left transition-all",
                  selectedPairing === pairing.id
                    ? "ring-2 ring-secondary border-secondary"
                    : "border-border/50 hover:border-border"
                )}
              >
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ fontFamily: pairing.heading }}
                >
                  {pairing.name}
                </h3>
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: pairing.body }}
                >
                  {pairing.description}
                </p>
              </button>
            ))}
          </div>

          {/* Pairing preview — simulates real portfolio content */}
          {currentPairing && (
            <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
              {/* Hero simulation */}
              <div className="p-8 pb-6">
                <div className="flex gap-6 mb-6 text-xs tracking-wider uppercase" style={{ fontFamily: currentPairing.body }}>
                  <span className="text-muted-foreground">Home</span>
                  <span className="text-secondary">About</span>
                  <span className="text-muted-foreground">Bookshelf</span>
                  <span className="text-muted-foreground">Inspirations</span>
                </div>
                <h1
                  className="text-5xl md:text-6xl font-bold mb-4 leading-[1.1]"
                  style={{ fontFamily: currentPairing.heading }}
                >
                  Ken Bui
                </h1>
                <p
                  className="text-lg leading-relaxed max-w-xl"
                  style={{ fontFamily: currentPairing.body }}
                >
                  A curious mind drawn to the intersections of technology, culture, and design. This space serves as both a personal archive and a public notebook.
                </p>
              </div>
              
              {/* About section simulation */}
              <div className="border-t border-border/30 p-8 pt-6">
                <h2
                  className="text-2xl font-bold mb-3"
                  style={{ fontFamily: currentPairing.heading }}
                >
                  About
                </h2>
                <p
                  className="text-base leading-relaxed mb-4"
                  style={{ fontFamily: currentPairing.body }}
                >
                  Welcome to my corner of the internet. This is what longer body text looks like with this font pairing — notice the readability, character spacing, and overall warmth of the typeface combination.
                </p>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: currentPairing.heading }}
                >
                  Bookshelf
                </h3>
                <p
                  className="text-sm"
                  style={{ fontFamily: currentPairing.body }}
                >
                  A non-exhaustive collection of things I've read.
                </p>
              </div>
              
              <div className="bg-muted/30 px-8 py-4 text-xs font-mono text-muted-foreground">
                <p>Heading: {currentPairing.heading}</p>
                <p>Body: {currentPairing.body}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Kinetic Typography */}
      {activeSection === "kinetic" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-primary">Kinetic Typography</h2>
              <p className="text-sm text-muted-foreground">
                Animated text effects for entrances and emphasis
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleResetKinetic}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handlePlayKinetic}
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium">Play</span>
              </button>
            </div>
          </div>

          {/* Effect selector */}
          <div className="flex gap-2">
            {[
              { id: "stagger", name: "Letter Stagger" },
              { id: "word", name: "Word Reveal" },
              { id: "scramble", name: "Scramble Decode" },
            ].map(effect => (
              <button
                key={effect.id}
                onClick={() => {
                  setKineticEffect(effect.id as typeof kineticEffect);
                  setIsAnimating(false);
                  setAnimationKey(k => k + 1);
                }}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg border transition-all",
                  kineticEffect === effect.id
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-border/50 hover:border-border"
                )}
              >
                {effect.name}
              </button>
            ))}
          </div>

          {/* Animation preview */}
          <div className="bg-card rounded-lg border border-border/50 p-8 min-h-[200px] flex items-center justify-center">
            <KineticText
              key={animationKey}
              text="The medium is the message"
              effect={kineticEffect}
              isAnimating={isAnimating}
            />
          </div>
        </div>
      )}

      {/* Text Treatments */}
      {activeSection === "treatment" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-primary">Text Treatments</h2>
            <p className="text-sm text-muted-foreground">
              Different typographic styles for headlines and labels
            </p>
          </div>

          {/* Treatment selector */}
          <div className="flex gap-2 flex-wrap">
            {textTreatments.map(treatment => (
              <button
                key={treatment.id}
                onClick={() => setSelectedTreatment(treatment.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg border transition-all",
                  selectedTreatment === treatment.id
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-border/50 hover:border-border"
                )}
              >
                {treatment.name}
              </button>
            ))}
          </div>

          {/* Treatment previews */}
          <div className="grid gap-6">
            {textTreatments.map(treatment => (
              <div
                key={treatment.id}
                className={cn(
                  "bg-card rounded-lg border p-6 transition-all",
                  selectedTreatment === treatment.id
                    ? "border-secondary ring-1 ring-secondary"
                    : "border-border/50"
                )}
              >
                <p className="text-xs font-mono text-muted-foreground mb-3">
                  {treatment.name}
                </p>
                
                {treatment.id === "scattered" && (
                  <div className="relative h-32">
                    <span className="absolute top-0 left-0 text-2xl font-serif font-bold">BUILT FOR</span>
                    <span className="absolute top-8 right-0 text-2xl font-serif font-bold">HEALTH</span>
                    <span className="absolute bottom-4 left-1/4 text-lg">MADE</span>
                    <span className="absolute bottom-0 right-1/4 text-lg">CLEAR</span>
                  </div>
                )}
                
                {treatment.id === "vertical" && (
                  <div className="flex gap-8">
                    <span className="writing-mode-vertical text-xl font-bold" style={{ writingMode: "vertical-rl" }}>
                      走进山野
                    </span>
                    <div>
                      <h3 className="text-3xl font-serif font-bold">Heading</h3>
                      <p className="text-muted-foreground">Horizontal body text alongside vertical</p>
                    </div>
                  </div>
                )}
                
                {treatment.id === "wide" && (
                  <h3
                    className="text-xl font-bold"
                    style={{
                      letterSpacing: treatment.tracking,
                      textTransform: treatment.transform as any,
                    }}
                  >
                    Typography Specimen
                  </h3>
                )}
                
                {treatment.id === "compressed" && (
                  <div
                    className="text-4xl font-bold leading-none space-y-0"
                    style={{ letterSpacing: treatment.tracking }}
                  >
                    <div>MINDFUL</div>
                    <div>PRACTICE</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Kinetic Text Component
function KineticText({
  text,
  effect,
  isAnimating,
}: {
  text: string;
  effect: "stagger" | "word" | "scramble";
  isAnimating: boolean;
}) {
  const [displayText, setDisplayText] = useState(effect === "scramble" ? "" : text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (effect === "scramble" && isAnimating) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let iteration = 0;
      
      intervalRef.current = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        
        if (iteration >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
        iteration += 1 / 3;
      }, 30);
    } else if (effect === "scramble") {
      setDisplayText(text);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [effect, isAnimating, text]);

  if (effect === "stagger") {
    return (
      <div className="text-4xl font-serif font-bold">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className={cn(
              "inline-block transition-all duration-500",
              isAnimating
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
            style={{
              transitionDelay: isAnimating ? `${i * 40}ms` : "0ms",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    );
  }

  if (effect === "word") {
    const words = text.split(" ");
    return (
      <div className="text-4xl font-serif font-bold flex flex-wrap justify-center gap-3">
        {words.map((word, i) => (
          <span
            key={i}
            className={cn(
              "inline-block transition-all duration-700",
              isAnimating
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
            style={{
              transitionDelay: isAnimating ? `${i * 200}ms` : "0ms",
            }}
          >
            {word}
          </span>
        ))}
      </div>
    );
  }

  // Scramble effect
  return (
    <div className="text-4xl font-mono font-bold tracking-wide">
      {displayText || text}
    </div>
  );
}
