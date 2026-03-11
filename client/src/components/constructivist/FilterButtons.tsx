import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  label: string;
  shape: "circle" | "triangle" | "square" | "diamond";
}

interface FilterButtonsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const shapeSymbols = {
  circle: "●",
  triangle: "▲",
  square: "■",
  diamond: "◆",
};

const shapeColors = {
  circle: "#1E5AA8",
  triangle: "#CC2936",
  square: "#F4C430",
  diamond: "#0A0A0A",
};

export function FilterButtons({ options, value, onChange, className }: FilterButtonsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span 
        className="text-xs tracking-[0.2em] text-[#0A0A0A]/60 mr-2"
        style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
      >
        FILTER:
      </span>
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-xs tracking-[0.15em] transition-all",
              isActive 
                ? "border-b-2 border-current font-bold" 
                : "opacity-60 hover:opacity-100"
            )}
            style={{ 
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              color: isActive ? shapeColors[option.shape] : "#0A0A0A" 
            }}
          >
            <span>{shapeSymbols[option.shape]}</span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
