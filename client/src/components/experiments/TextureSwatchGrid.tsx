import { cn } from "@/lib/utils";
import { TEXTURE_FAMILIES, type TextureFamily } from "./textureConfig";

interface TextureSwatchGridProps {
  selectedFamily: string;
  onSelect: (id: string) => void;
}

export default function TextureSwatchGrid({ selectedFamily, onSelect }: TextureSwatchGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TEXTURE_FAMILIES.map((family) => (
        <SwatchItem
          key={family.id}
          family={family}
          isSelected={selectedFamily === family.id}
          onClick={() => onSelect(family.id)}
        />
      ))}
    </div>
  );
}

function SwatchItem({
  family,
  isSelected,
  onClick,
}: {
  family: TextureFamily;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative aspect-square rounded overflow-hidden border-2 transition-all",
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-transparent hover:border-muted-foreground/30"
      )}
    >
      <img
        src={family.swatchPath}
        alt={family.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div
        className={cn(
          "absolute inset-0 flex items-end p-1.5 transition-opacity",
          "bg-gradient-to-t from-black/60 via-transparent to-transparent",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <span className="text-[10px] font-medium text-white leading-tight">
          {family.name}
        </span>
      </div>
    </button>
  );
}
