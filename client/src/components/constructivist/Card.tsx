import { cn } from "@/lib/utils";

interface CardProps {
  image?: string;
  title: string;
  description?: string;
  type?: "circle" | "triangle" | "square";
  href?: string;
  rotation?: number;
  className?: string;
}

const shapes = {
  circle: { symbol: "●", color: "#1E5AA8" },
  triangle: { symbol: "▲", color: "#CC2936" },
  square: { symbol: "■", color: "#F4C430" },
};

export function ConstructivistCard({
  image,
  title,
  description,
  type = "triangle",
  href,
  rotation = 0,
  className,
}: CardProps) {
  const shape = shapes[type];
  
  const content = (
    <article
      className={cn(
        "group bg-[#F5F0E6] border border-[#0A0A0A]/15 overflow-hidden transition-all duration-300 hover:shadow-lg",
        className
      )}
      style={{ 
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Image with diagonal clip */}
      {image && (
        <div 
          className="h-48 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ 
            backgroundImage: `url(${image})`,
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
          }}
        />
      )}
      
      {/* Content */}
      <div className="p-6 pl-8">
        <h3 
          className="text-xl tracking-[0.1em] text-[#0A0A0A] flex items-center gap-2"
          style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
        >
          <span style={{ color: shape.color }}>{shape.symbol}</span>
          {title.toUpperCase()}
        </h3>
        
        {description && (
          <p 
            className="mt-2 text-sm text-[#0A0A0A]/70 leading-relaxed"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            {description}
          </p>
        )}
        
        {/* Geometric accent line */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-px bg-[#0A0A0A]/20" />
          <span style={{ color: shape.color }}>{shape.symbol}</span>
        </div>
      </div>
    </article>
  );
  
  if (href) {
    return <a href={href} className="block hover:no-underline">{content}</a>;
  }
  
  return content;
}
