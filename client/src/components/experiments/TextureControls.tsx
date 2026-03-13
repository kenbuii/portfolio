import { cn } from "@/lib/utils";
import {
  TEXTURE_FAMILIES,
  BLEND_MODES,
  DESIGN_ELEMENTS,
  type TextureState,
  type BlendMode,
  type DesignElement,
} from "./textureConfig";
import TextureSwatchGrid from "./TextureSwatchGrid";

interface TextureControlsProps {
  state: TextureState;
  onFamilyChange: (id: string) => void;
  onIntensityChange: (value: number) => void;
  onBlendModeChange: (mode: BlendMode) => void;
  onColorModeChange: (mode: "monochrome" | "colored") => void;
  onElementToggle: (element: DesignElement) => void;
}

export default function TextureControls({
  state,
  onFamilyChange,
  onIntensityChange,
  onBlendModeChange,
  onColorModeChange,
  onElementToggle,
}: TextureControlsProps) {
  const activeFamily = TEXTURE_FAMILIES.find((f) => f.id === state.selectedFamily);

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-320px)] pr-2 scrollbar-thin">
      {/* Family Selector */}
      <Section title="Texture Family">
        <div className="space-y-1.5">
          {TEXTURE_FAMILIES.map((family) => (
            <button
              key={family.id}
              onClick={() => onFamilyChange(family.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all text-sm",
                state.selectedFamily === family.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <img
                src={family.swatchPath}
                alt=""
                className="w-8 h-8 rounded object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="truncate">{family.name}</div>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Active Family Description */}
      {activeFamily && (
        <div className="px-3 py-2.5 bg-muted/30 rounded-md">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {activeFamily.description}
          </p>
        </div>
      )}

      {/* Intensity Slider */}
      <Section title="Intensity">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <IntensityLabel value={state.intensity} />
            <span className="text-xs font-mono text-muted-foreground tabular-nums">
              {state.intensity}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={state.intensity}
            onChange={(e) => onIntensityChange(Number(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-sm"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60">
            <span>Whisper</span>
            <span>Present</span>
            <span>Bold</span>
          </div>
        </div>
      </Section>

      {/* Blend Mode */}
      <Section title="Blend Mode">
        <select
          value={state.blendMode}
          onChange={(e) => onBlendModeChange(e.target.value as BlendMode)}
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md
            focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          {BLEND_MODES.map((mode) => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </select>
      </Section>

      {/* Color Mode */}
      <Section title="Color Mode">
        <div className="flex gap-1 p-0.5 bg-muted/30 rounded-md">
          {(["monochrome", "colored"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onColorModeChange(mode)}
              className={cn(
                "flex-1 py-1.5 text-xs font-medium rounded transition-all capitalize",
                state.colorMode === mode
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </Section>

      {/* Apply To Elements */}
      <Section title="Apply To">
        <div className="space-y-1">
          {DESIGN_ELEMENTS.map((el) => (
            <label
              key={el.id}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-muted/30 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={state.activeElements.has(el.id)}
                onChange={() => onElementToggle(el.id)}
                className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary/20 cursor-pointer accent-primary"
              />
              <span className="text-sm text-foreground">{el.label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Swatch Grid */}
      <Section title="Quick Select">
        <TextureSwatchGrid
          selectedFamily={state.selectedFamily}
          onSelect={onFamilyChange}
        />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function IntensityLabel({ value }: { value: number }) {
  const label =
    value <= 20 ? "Whisper" : value <= 50 ? "Present" : value <= 75 ? "Strong" : "Bold";
  return <span className="text-xs text-foreground font-medium">{label}</span>;
}
