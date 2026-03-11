import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function DesignSystemToggle() {
  const { designSystem, setDesignSystem } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  
  // Keyboard shortcut: Ctrl/Cmd + Shift + T
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
        e.preventDefault();
        setDesignSystem(designSystem === "classic" ? "constructivist" : "classic");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [designSystem, setDesignSystem]);
  
  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className={cn(
          "fixed bottom-6 right-6 z-[9999] w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform",
          designSystem === "constructivist" 
            ? "bg-[#CC2936] text-white" 
            : "bg-[#2F4F4F] text-[#F5F0E6]"
        )}
        title="Expand design toggle (Ctrl+Shift+T)"
      >
        {designSystem === "constructivist" ? "▲" : "●"}
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-6 right-6 z-[9999] bg-white border border-[#0A0A0A]/20 rounded-lg shadow-xl p-1 flex flex-col gap-1">
      {/* Classic option */}
      <button
        onClick={() => setDesignSystem("classic")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded text-sm tracking-wide transition-all",
          designSystem === "classic"
            ? "bg-[#2F4F4F] text-[#F5F0E6]"
            : "hover:bg-[#0A0A0A]/5"
        )}
        style={{ fontFamily: "'Century Gothic', sans-serif" }}
      >
        <span className="text-[#1E5AA8]">●</span>
        CLASSIC
        {designSystem === "classic" && <span className="ml-auto text-xs">✓</span>}
      </button>
      
      {/* Constructivist option */}
      <button
        onClick={() => setDesignSystem("constructivist")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded text-sm tracking-wide transition-all",
          designSystem === "constructivist"
            ? "bg-[#CC2936] text-white"
            : "hover:bg-[#CC2936]/10"
        )}
        style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
      >
        <span className={designSystem === "constructivist" ? "text-white" : "text-[#CC2936]"}>▲</span>
        CONSTRUCTIVIST
        {designSystem === "constructivist" && <span className="ml-auto text-xs">✓</span>}
      </button>
      
      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(true)}
        className="text-xs text-[#0A0A0A]/40 hover:text-[#0A0A0A]/60 text-center py-1"
      >
        minimize
      </button>
    </div>
  );
}
