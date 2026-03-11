import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface NavLink {
  href: string;
  label: string;
  shape: string;
  color: string;
}

const links: NavLink[] = [
  { href: "/", label: "HOME", shape: "●", color: "#1E5AA8" },
  { href: "/about", label: "ABOUT", shape: "▲", color: "#CC2936" },
  { href: "/inspirations", label: "INSPIRATIONS", shape: "■", color: "#F4C430" },
  { href: "/experiments", label: "EXPERIMENTS", shape: "◆", color: "#0A0A0A" },
];

// Variant A: Diagonal Bar Navigation
export function NavigationDiagonal() {
  const [location] = useLocation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-30">
      {/* Diagonal background */}
      <div 
        className="absolute inset-0 bg-[#0A0A0A]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)" }}
      />
      
      <div className="relative flex items-center gap-8 px-8 py-6">
        {links.map((link) => {
          const isActive = location === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "group relative text-[#F5F0E6] text-sm tracking-[0.2em] transition-colors",
                isActive ? "text-[#F5F0E6]" : "hover:text-[#CC2936]"
              )}
              style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
            >
              <span 
                className={cn(
                  "mr-2 transition-opacity",
                  isActive ? "opacity-100" : "opacity-50 group-hover:opacity-100"
                )}
                style={{ color: link.color }}
              >
                {link.shape}
              </span>
              {link.label}
              
              {/* Active indicator */}
              {isActive && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <svg width="8" height="6" viewBox="0 0 8 6">
                    <polygon points="4,6 0,0 8,0" fill="#CC2936" />
                  </svg>
                </span>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

// Variant B: Vertical Sidebar with Shapes
export function NavigationSidebar() {
  const [location] = useLocation();
  
  const shapeLinks = [
    { href: "/", type: "circle", color: "#1E5AA8" },
    { href: "/about", type: "triangle", color: "#CC2936" },
    { href: "/inspirations", type: "square", color: "#F4C430" },
    { href: "/experiments", type: "diamond", color: "#0A0A0A" },
  ];
  
  return (
    <nav className="fixed left-0 top-0 bottom-0 w-16 bg-[#F5F0E6] border-r border-[#0A0A0A]/10 z-30 flex flex-col items-center justify-center gap-6">
      {shapeLinks.map((link) => {
        const isActive = location === link.href;
        return (
          <a
            key={link.href}
            href={link.href}
            className="group w-10 h-10 flex items-center justify-center transition-transform hover:scale-110"
          >
            <Shape 
              type={link.type} 
              className={cn(
                "w-6 h-6 stroke-2 transition-all",
                isActive ? "fill-current" : "fill-transparent stroke-[#0A0A0A] group-hover:fill-current"
              )}
              style={{ color: link.color }}
            />
          </a>
        );
      })}
    </nav>
  );
}

// Variant C: Overlapping Blocks
export function NavigationBlocks() {
  const [location] = useLocation();
  
  const blockLinks = [
    { href: "/", label: "HOME", bg: "#1E5AA8" },
    { href: "/about", label: "ABOUT", bg: "#CC2936" },
    { href: "/inspirations", label: "INSPIRATIONS", bg: "#F4C430" },
    { href: "/experiments", label: "EXPERIMENTS", bg: "#0A0A0A" },
  ];
  
  return (
    <nav className="fixed top-8 left-8 z-30">
      {blockLinks.map((link, i) => {
        const isActive = location === link.href;
        return (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              "block px-4 py-2 text-sm tracking-[0.15em] text-white transition-all",
              isActive ? "scale-105" : "hover:scale-105"
            )}
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              backgroundColor: link.bg,
              marginLeft: `${i * 24}px`,
              marginTop: i > 0 ? "-4px" : "0",
              position: "relative",
              zIndex: blockLinks.length - i,
            }}
          >
            {link.label}
            {isActive && <span className="ml-2">◄</span>}
          </a>
        );
      })}
    </nav>
  );
}

function Shape({ 
  type, 
  className, 
  style 
}: { 
  type: string; 
  className?: string; 
  style?: React.CSSProperties;
}) {
  if (type === "circle") {
    return (
      <svg viewBox="0 0 24 24" className={className} style={style}>
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  }
  if (type === "triangle") {
    return (
      <svg viewBox="0 0 24 24" className={className} style={style}>
        <polygon points="12,2 22,22 2,22" />
      </svg>
    );
  }
  if (type === "square") {
    return (
      <svg viewBox="0 0 24 24" className={className} style={style}>
        <rect x="2" y="2" width="20" height="20" />
      </svg>
    );
  }
  if (type === "diamond") {
    return (
      <svg viewBox="0 0 24 24" className={className} style={style}>
        <polygon points="12,2 22,12 12,22 2,12" />
      </svg>
    );
  }
  return null;
}
