import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { getStoredAbout, About as AboutType, defaultAbout } from "@/lib/data";
import { fetchAbout } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type LayoutVariant = "classic" | "split" | "cards" | "brutalist";

const layoutLabels: Record<LayoutVariant, string> = {
  classic: "Classic",
  split: "Split",
  cards: "Cards",
  brutalist: "Brutalist",
};

export default function About() {
  const [about, setAbout] = useState<AboutType>(defaultAbout);
  const [layout, setLayout] = useState<LayoutVariant>("classic");

  useEffect(() => {
    setAbout(getStoredAbout());

    fetchAbout()
      .then((data) => {
        if (data?.content) setAbout(data);
      })
      .catch(() => {});
    
    const savedLayout = localStorage.getItem("about_layout");
    if (savedLayout && (savedLayout as LayoutVariant) in layoutLabels) {
      setLayout(savedLayout as LayoutVariant);
    }
    
    // Listen for about updates from admin
    const handleStorageChange = () => {
      setAbout(getStoredAbout());
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("about-updated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("about-updated", handleStorageChange);
    };
  }, []);

  const handleLayoutChange = (newLayout: LayoutVariant) => {
    setLayout(newLayout);
    localStorage.setItem("about_layout", newLayout);
  };

  // Parse content to separate list items from main bio
  const { bioContent, listContent } = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(about.content, "text/html");
    
    // Find the first <ul> or <ol> element
    const list = doc.body.querySelector("ul, ol");
    
    if (list) {
      // Clone and remove the list from the document
      const listHtml = list.outerHTML;
      list.remove();
      
      // Also remove the "Things I've done before:" text if it's in a <p> tag right before the list
      const paragraphs = doc.body.querySelectorAll("p");
      paragraphs.forEach(p => {
        if (p.textContent?.toLowerCase().includes("things i've done before") || 
            p.textContent?.toLowerCase().includes("things i've done:")) {
          p.remove();
        }
      });
      
      return {
        bioContent: doc.body.innerHTML,
        listContent: listHtml
      };
    }
    
    return {
      bioContent: about.content,
      listContent: null
    };
  }, [about.content]);

  const contentStyles = "[&_p]:my-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_li]:leading-relaxed [&_strong]:font-bold [&_em]:italic [&_h1]:text-3xl [&_h1]:font-serif [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-serif [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2";

  // Layout selector component
  const LayoutSelector = () => (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-1 bg-card/90 backdrop-blur-sm p-1.5 rounded-lg border border-border/50 shadow-lg">
      {(Object.keys(layoutLabels) as LayoutVariant[]).map((variant) => (
        <button
          key={variant}
          onClick={() => handleLayoutChange(variant)}
          className={cn(
            "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
            layout === variant
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-primary hover:bg-muted/50"
          )}
        >
          {layoutLabels[variant]}
        </button>
      ))}
    </div>
  );

  // Classic Layout (original)
  const ClassicLayout = () => (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Left Column: Picture + List */}
        <div className="w-full md:w-64 shrink-0 space-y-8">
          <div className="w-48 h-48 md:w-64 md:h-64 relative">
            <div className="absolute inset-0 bg-secondary/10 rounded-sm -rotate-3" />
            <img 
              src={about.profileImage} 
              alt="Profile" 
              className="relative w-full h-full object-contain bg-background rounded-sm shadow-lg p-4"
            />
          </div>
          
          {listContent && (
            <div className="w-48 md:w-64">
              <h3 className="text-sm font-serif font-bold text-primary mb-3 uppercase tracking-wide">
                Things I've done
              </h3>
              <div 
                className={`text-sm leading-relaxed ${contentStyles}`}
                dangerouslySetInnerHTML={{ __html: listContent }}
              />
            </div>
          )}
        </div>
        
        {/* Right Column: Title + Bio */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
            About
          </h1>
          <div 
            className={`text-lg leading-relaxed ${contentStyles}`}
            dangerouslySetInnerHTML={{ __html: bioContent }}
          />
        </div>
      </div>
    </div>
  );

  // Split Scroll Layout - Left fixed, right scrolls
  const SplitLayout = () => (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-0 min-h-[70vh]">
        {/* Left Column: Fixed on desktop */}
        <div className="w-full md:w-1/3 md:sticky md:top-32 md:self-start bg-card p-8 rounded-lg md:rounded-none md:rounded-l-lg border border-border/30 md:border-r-0">
          <div className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-secondary/20 rounded-full" />
            <img 
              src={about.profileImage} 
              alt="Profile" 
              className="relative w-full h-full object-contain rounded-full bg-background p-3"
            />
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-primary text-center mb-4">
            About
          </h1>
          
          {listContent && (
            <div className="mt-6 pt-6 border-t border-border/30">
              <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest text-center">
                Background
              </h3>
              <div 
                className={`text-xs leading-relaxed text-center ${contentStyles}`}
                dangerouslySetInnerHTML={{ __html: listContent }}
              />
            </div>
          )}
        </div>
        
        {/* Right Column: Scrollable */}
        <div className="w-full md:w-2/3 bg-background p-8 md:p-12 rounded-lg md:rounded-none md:rounded-r-lg border border-border/30">
          <div 
            className={`text-lg leading-relaxed ${contentStyles}`}
            dangerouslySetInnerHTML={{ __html: bioContent }}
          />
        </div>
      </div>
    </div>
  );

  // Cards Layout - Expandable cards
  const CardsLayout = () => {
    const [expandedCard, setExpandedCard] = useState<number | null>(0);
    
    // Split bio into paragraphs for cards
    const paragraphs = useMemo(() => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(bioContent, "text/html");
      const ps = doc.body.querySelectorAll("p");
      return Array.from(ps).map(p => p.outerHTML);
    }, []);
    
    const cards = [
      { title: "Who I Am", content: paragraphs[0] || "" },
      { title: "What I Do", content: paragraphs.slice(1).join("") || "" },
      { title: "Background", content: listContent || "" },
    ].filter(card => card.content);
    
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="w-32 h-32 relative shrink-0">
            <img 
              src={about.profileImage} 
              alt="Profile" 
              className="w-full h-full object-contain bg-card rounded-lg shadow-lg p-3"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
            About
          </h1>
        </div>
        
        <div className="space-y-4">
          {cards.map((card, index) => (
            <div 
              key={index}
              className={cn(
                "border border-border/50 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer",
                expandedCard === index ? "bg-card shadow-lg" : "bg-background hover:bg-card/50"
              )}
              onClick={() => setExpandedCard(expandedCard === index ? null : index)}
            >
              <div className="flex items-center justify-between p-4">
                <h3 className="font-serif font-bold text-lg text-primary">{card.title}</h3>
                <span className={cn(
                  "text-2xl text-secondary transition-transform duration-300",
                  expandedCard === index && "rotate-45"
                )}>
                  +
                </span>
              </div>
              
              <div className={cn(
                "overflow-hidden transition-all duration-300",
                expandedCard === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div 
                  className={`px-4 pb-4 ${contentStyles}`}
                  dangerouslySetInnerHTML={{ __html: card.content }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Brutalist Layout - Bold, asymmetric
  const BrutalistLayout = () => (
    <div className="max-w-5xl mx-auto">
      {/* Giant title */}
      <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-primary mb-8 leading-none">
        ABOUT
      </h1>
      
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Image - spans 5 columns, offset */}
        <div className="col-span-12 md:col-span-5 md:col-start-2 row-span-2">
          <div className="relative">
            <div className="absolute -inset-2 bg-secondary/20 -rotate-2" />
            <img 
              src={about.profileImage} 
              alt="Profile" 
              className="relative w-full aspect-square object-contain bg-background p-4"
            />
          </div>
        </div>
        
        {/* Bio text - spans 5 columns */}
        <div className="col-span-12 md:col-span-5">
          <div 
            className={`text-lg leading-relaxed ${contentStyles}`}
            dangerouslySetInnerHTML={{ __html: bioContent }}
          />
        </div>
        
        {/* List content - bottom, full width with offset */}
        {listContent && (
          <div className="col-span-12 md:col-span-8 md:col-start-4 mt-8 md:mt-16">
            <div className="border-l-4 border-secondary pl-6">
              <h3 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-[0.3em]">
                PREVIOUSLY
              </h3>
              <div 
                className={`text-sm ${contentStyles}`}
                dangerouslySetInnerHTML={{ __html: listContent }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Gallery component (shared)
  const Gallery = () => about.gallery.length > 0 ? (
    <div className={cn(
      "border-t border-border/40 pt-12 mt-16 max-w-4xl mx-auto",
      layout === "brutalist" && "max-w-5xl"
    )}>
      <h2 className={cn(
        "text-2xl font-serif font-bold text-primary mb-8",
        layout === "brutalist" && "text-4xl uppercase tracking-wider"
      )}>
        Gallery
      </h2>
      <div className={cn(
        "grid gap-4",
        layout === "brutalist" 
          ? "grid-cols-2 md:grid-cols-4" 
          : "grid-cols-2 md:grid-cols-3"
      )}>
        {about.gallery.map((image, index) => (
          <div 
            key={index} 
            className={cn(
              "aspect-square bg-muted rounded-sm overflow-hidden group cursor-pointer",
              layout === "brutalist" && index === 0 && "md:col-span-2 md:row-span-2"
            )}
          >
            <img 
              src={image} 
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <Layout>
      <section className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
        {layout === "classic" && <ClassicLayout />}
        {layout === "split" && <SplitLayout />}
        {layout === "cards" && <CardsLayout />}
        {layout === "brutalist" && <BrutalistLayout />}
        
        <Gallery />
      </section>
      
      <LayoutSelector />
    </Layout>
  );
}
