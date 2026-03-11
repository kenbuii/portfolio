import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type DesignSystem = "classic" | "constructivist";
type LoadingVariant = "gears" | "suprematist" | "factory" | "minimal";
type NavVariant = "diagonal" | "sidebar" | "blocks";

interface ThemeState {
  // Core toggle
  designSystem: DesignSystem;
  setDesignSystem: (ds: DesignSystem) => void;
  
  // Loading screen
  loadingVariant: LoadingVariant;
  setLoadingVariant: (v: LoadingVariant) => void;
  showLoading: boolean;
  setShowLoading: (show: boolean) => void;
  
  // Navigation variant
  navVariant: NavVariant;
  setNavVariant: (v: NavVariant) => void;
  
  // Component overrides (for fine-grained control)
  overrides: Record<string, string>;
  setOverride: (component: string, variant: string) => void;
  clearOverrides: () => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Persist to localStorage
  const [designSystem, setDesignSystemState] = useState<DesignSystem>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("designSystem") as DesignSystem) || "classic";
    }
    return "classic";
  });
  
  const [loadingVariant, setLoadingVariant] = useState<LoadingVariant>("gears");
  const [showLoading, setShowLoading] = useState(false);
  const [navVariant, setNavVariant] = useState<NavVariant>("diagonal");
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  
  // Wrapper to persist and update data-theme
  const setDesignSystem = (ds: DesignSystem) => {
    setDesignSystemState(ds);
    localStorage.setItem("designSystem", ds);
    document.documentElement.setAttribute("data-theme", ds);
  };
  
  // Set initial data-theme on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", designSystem);
  }, []);
  
  const setOverride = (component: string, variant: string) => {
    setOverrides(prev => ({ ...prev, [component]: variant }));
  };
  
  const clearOverrides = () => setOverrides({});
  
  return (
    <ThemeContext.Provider value={{
      designSystem,
      setDesignSystem,
      loadingVariant,
      setLoadingVariant,
      showLoading,
      setShowLoading,
      navVariant,
      setNavVariant,
      overrides,
      setOverride,
      clearOverrides,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

// Emergency reset - can be called from browser console: window.resetDesignSystem()
if (typeof window !== "undefined") {
  (window as any).resetDesignSystem = () => {
    localStorage.setItem("designSystem", "classic");
    document.documentElement.setAttribute("data-theme", "classic");
    window.location.reload();
    console.log("✓ Design system reset to classic");
  };
}
