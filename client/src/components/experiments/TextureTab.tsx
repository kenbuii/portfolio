import { useState, useCallback } from "react";
import {
  DEFAULT_STATE,
  type TextureState,
  type BlendMode,
  type DesignElement,
  TEXTURE_FAMILIES,
} from "./textureConfig";
import TextureControls from "./TextureControls";
import TextureCanvas from "./TextureCanvas";

export default function TextureTab() {
  const [state, setState] = useState<TextureState>({
    ...DEFAULT_STATE,
    activeElements: new Set(DEFAULT_STATE.activeElements),
  });

  const handleFamilyChange = useCallback((id: string) => {
    const family = TEXTURE_FAMILIES.find((f) => f.id === id);
    if (!family) return;
    setState((prev) => ({
      ...prev,
      selectedFamily: id,
      blendMode: family.defaultBlendMode,
      intensity: family.defaultIntensity,
    }));
  }, []);

  const handleIntensityChange = useCallback((value: number) => {
    setState((prev) => ({ ...prev, intensity: value }));
  }, []);

  const handleBlendModeChange = useCallback((mode: BlendMode) => {
    setState((prev) => ({ ...prev, blendMode: mode }));
  }, []);

  const handleColorModeChange = useCallback((mode: "monochrome" | "colored") => {
    setState((prev) => ({ ...prev, colorMode: mode }));
  }, []);

  const handleElementToggle = useCallback((element: DesignElement) => {
    setState((prev) => {
      const next = new Set(prev.activeElements);
      if (next.has(element)) {
        next.delete(element);
      } else {
        next.add(element);
      }
      return { ...prev, activeElements: next };
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-3 mb-2">
        <h2 className="font-serif text-2xl font-bold text-primary">
          Texture Playground
        </h2>
        <p className="text-xs text-muted-foreground">
          Layer, blend, and preview textures across design elements
        </p>
      </div>

      {/* Split View */}
      <div className="flex gap-6 items-start">
        {/* Left Panel: Controls */}
        <div className="w-64 flex-shrink-0 sticky top-32">
          <TextureControls
            state={state}
            onFamilyChange={handleFamilyChange}
            onIntensityChange={handleIntensityChange}
            onBlendModeChange={handleBlendModeChange}
            onColorModeChange={handleColorModeChange}
            onElementToggle={handleElementToggle}
          />
        </div>

        {/* Right Panel: Live Canvas */}
        <div className="flex-1 min-w-0">
          <TextureCanvas state={state} />
        </div>
      </div>
    </div>
  );
}
