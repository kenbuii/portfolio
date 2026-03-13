export interface TextureFamily {
  id: string;
  name: string;
  description: string;
  swatchPath: string;
  tilePath: string;
  fullPath?: string;
  bgPath?: string;
  fgPath?: string;
  tileMode: "repeat" | "cover";
  defaultBlendMode: BlendMode;
  defaultIntensity: number;
  hasColoredVariant: boolean;
}

export type BlendMode = "multiply" | "overlay" | "soft-light" | "normal" | "screen" | "darken";

export type DesignElement =
  | "background"
  | "cards"
  | "typography"
  | "dividers"
  | "hover"
  | "hero"
  | "decorative";

export const DESIGN_ELEMENTS: { id: DesignElement; label: string }[] = [
  { id: "background", label: "Page Background" },
  { id: "cards", label: "Cards" },
  { id: "typography", label: "Typography" },
  { id: "dividers", label: "Dividers" },
  { id: "hover", label: "Hover States" },
  { id: "hero", label: "Hero Area" },
  { id: "decorative", label: "Decorative Accents" },
];

export const BLEND_MODES: { value: BlendMode; label: string }[] = [
  { value: "multiply", label: "Multiply" },
  { value: "overlay", label: "Overlay" },
  { value: "soft-light", label: "Soft Light" },
  { value: "screen", label: "Screen" },
  { value: "darken", label: "Darken" },
  { value: "normal", label: "Normal" },
];

export const TEXTURE_FAMILIES: TextureFamily[] = [
  {
    id: "paper-grain",
    name: "Paper Grain",
    description: "Subtle noise overlay extracted from printed paper stock. The foundational texture layer.",
    swatchPath: "/textures/paper-grain-swatch.jpg",
    tilePath: "/textures/paper-grain.png",
    bgPath: "/textures/paper-grain-bg.jpg",
    fgPath: "/textures/paper-grain-fg.png",
    tileMode: "repeat",
    defaultBlendMode: "overlay",
    defaultIntensity: 40,
    hasColoredVariant: false,
  },
  {
    id: "aged-paper",
    name: "Aged Paper",
    description: "Warm, slightly yellowed newsprint with natural fiber texture and gentle creasing.",
    swatchPath: "/textures/aged-paper-swatch.jpg",
    tilePath: "/textures/aged-paper.jpg",
    tileMode: "repeat",
    defaultBlendMode: "multiply",
    defaultIntensity: 30,
    hasColoredVariant: true,
  },
  {
    id: "ink-bleed",
    name: "Ink Bleed",
    description: "Letterpress ink artifacts and micro-splatter marks from hand-stamped printing.",
    swatchPath: "/textures/ink-bleed-swatch.jpg",
    tilePath: "/textures/ink-bleed.png",
    fullPath: "/textures/ink-bleed-full.jpg",
    bgPath: "/textures/ink-bleed-bg.jpg",
    fgPath: "/textures/ink-bleed-fg.png",
    tileMode: "repeat",
    defaultBlendMode: "multiply",
    defaultIntensity: 50,
    hasColoredVariant: true,
  },
  {
    id: "woven-grid",
    name: "Woven Grid",
    description: "Intricate Jacquard loom patterns \u2014 interlocking geometric weave structures.",
    swatchPath: "/textures/woven-grid-swatch.jpg",
    tilePath: "/textures/woven-grid.png",
    fullPath: "/textures/woven-grid-01.jpg",
    bgPath: "/textures/woven-grid-bg.jpg",
    fgPath: "/textures/woven-grid-01-fg.png",
    tileMode: "repeat",
    defaultBlendMode: "multiply",
    defaultIntensity: 25,
    hasColoredVariant: false,
  },
  {
    id: "charcoal-mono",
    name: "Charcoal Monotype",
    description: "Atmospheric darkness from monotype printing. Dense, moody, with luminous breaks.",
    swatchPath: "/textures/charcoal-mono-swatch.jpg",
    tilePath: "/textures/charcoal-grain.png",
    fullPath: "/textures/charcoal-mono.jpg",
    tileMode: "cover",
    defaultBlendMode: "multiply",
    defaultIntensity: 35,
    hasColoredVariant: true,
  },
  {
    id: "bauhaus",
    name: "Bauhaus Geometric",
    description: "Bold primary-colored geometric shapes from constructivist illustration traditions.",
    swatchPath: "/textures/bauhaus-swatch.jpg",
    tilePath: "/textures/bauhaus-full.jpg",
    fullPath: "/textures/bauhaus-full.jpg",
    tileMode: "cover",
    defaultBlendMode: "normal",
    defaultIntensity: 60,
    hasColoredVariant: true,
  },
  {
    id: "gestural-ink",
    name: "Gestural Ink",
    description: "Loose, expressive ink strokes and marks from abstract illustration.",
    swatchPath: "/textures/gestural-ink-swatch.jpg",
    tilePath: "/textures/gestural-ink.png",
    fullPath: "/textures/gestural-ink-full.jpg",
    tileMode: "cover",
    defaultBlendMode: "multiply",
    defaultIntensity: 30,
    hasColoredVariant: false,
  },
  {
    id: "vintage-script",
    name: "Vintage Script",
    description: "Mid-century American print design system. Warm parchment, fluid script, ink absorption, vignette.",
    swatchPath: "/textures/vintage-script-swatch.jpg",
    tilePath: "/textures/vintage-script-grain.png",
    fullPath: "/textures/vintage-script-bg.jpg",
    bgPath: "/textures/vintage-script-bg.jpg",
    fgPath: "/textures/vintage-script-creases.png",
    tileMode: "cover",
    defaultBlendMode: "multiply",
    defaultIntensity: 80,
    hasColoredVariant: true,
  },
];

export interface TextureState {
  selectedFamily: string;
  intensity: number;
  blendMode: BlendMode;
  colorMode: "monochrome" | "colored";
  activeElements: Set<DesignElement>;
}

export const DEFAULT_STATE: TextureState = {
  selectedFamily: "paper-grain",
  intensity: 40,
  blendMode: "overlay",
  colorMode: "monochrome",
  activeElements: new Set(["background", "cards"]),
};
