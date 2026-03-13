import { useState } from "react";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";
import ColorTab from "@/components/experiments/ColorTab";
import TypographyTab from "@/components/experiments/TypographyTab";
import AnimationsTab from "@/components/experiments/AnimationsTab";
import LayoutTab from "@/components/experiments/LayoutTab";
import HierarchyTab from "@/components/experiments/HierarchyTab";
import ThemePlayground from "@/components/experiments/ThemePlayground";
import TextureTab from "@/components/experiments/TextureTab";
import { Palette, Type, Sparkles, LayoutGrid, Layers, PenTool, Fingerprint } from "lucide-react";

type TabType = "theme" | "animations" | "typography" | "layout" | "color" | "hierarchy" | "texture";

interface Tab {
  id: TabType;
  label: string;
  icon: React.ElementType;
  available: boolean;
}

const tabs: Tab[] = [
  { id: "theme", label: "Design System", icon: PenTool, available: true },
  { id: "color", label: "Color", icon: Palette, available: true },
  { id: "typography", label: "Typography", icon: Type, available: true },
  { id: "animations", label: "Animations", icon: Sparkles, available: true },
  { id: "layout", label: "Layout", icon: LayoutGrid, available: true },
  { id: "hierarchy", label: "Hierarchy", icon: Layers, available: true },
  { id: "texture", label: "Texture", icon: Fingerprint, available: true },
];

export default function Experiments() {
  const [activeTab, setActiveTab] = useState<TabType>("theme");

  return (
    <Layout>
      <section className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">
              Experiments
            </h1>
            <p className="text-muted-foreground max-w-lg">
              A design system playground for exploring animations, typography, layouts, and color palettes.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-muted/30 rounded-lg mb-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => tab.available && setActiveTab(tab.id)}
                  disabled={!tab.available}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-background text-primary shadow-sm"
                      : tab.available
                        ? "text-muted-foreground hover:text-primary hover:bg-background/50"
                        : "text-muted-foreground/50 cursor-not-allowed"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {!tab.available && (
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">Soon</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="animate-in fade-in duration-300">
            {activeTab === "theme" && <ThemePlayground />}
            {activeTab === "color" && <ColorTab />}
            {activeTab === "typography" && <TypographyTab />}
            {activeTab === "animations" && <AnimationsTab />}
            {activeTab === "layout" && <LayoutTab />}
            {activeTab === "hierarchy" && <HierarchyTab />}
            {activeTab === "texture" && <TextureTab />}
          </div>
        </div>
      </section>
    </Layout>
  );
}
