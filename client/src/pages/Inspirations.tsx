import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Inspiration, fetchInspirations } from "@/lib/supabase";
import { LoadingScreen } from "@/components/constructivist/LoadingScreen";
import { cn } from "@/lib/utils";
import { X, Quote, Palette, FileText, MessageSquareQuote, ExternalLink } from "lucide-react";

// Sample data for initial display (will be replaced by Supabase data)
const sampleInspirations: Inspiration[] = [
  {
    id: "1",
    type: "poem",
    title: "In a Station of the Metro",
    content: "The apparition of these faces in the crowd;\nPetals on a wet, black bough.",
    attribution: "Ezra Pound",
    source: "Poetry Magazine",
    year: "1913",
    blurb: "Two lines. One complete world. This is what compression can achieve.",
    size: "medium",
    rotation: 1,
  },
  {
    id: "2",
    type: "essay",
    title: "The medium is the message",
    content: "The medium is the message. This is merely to say that the personal and social consequences of any medium—that is, of any extension of ourselves—result from the new scale that is introduced into our affairs by each extension of ourselves, or by any new technology.",
    attribution: "Marshall McLuhan",
    source: "Understanding Media: The Extensions of Man",
    year: "1964",
    blurb: "McLuhan saw the internet coming. Every time I open Twitter, I think of this.",
    size: "large",
    featured: true,
  },
  {
    id: "3",
    type: "art",
    title: "Black Square",
    content: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Malevich.black-square.jpg/800px-Malevich.black-square.jpg",
    attribution: "Kazimir Malevich",
    year: "1915",
    blurb: "The zero point of painting. Everything that came after had to reckon with this void.",
    size: "large",
    rotation: -2,
  },
  {
    id: "4",
    type: "poem",
    title: "This Is Just to Say",
    content: "I have eaten\nthe plums\nthat were in\nthe icebox\n\nand which\nyou were probably\nsaving\nfor breakfast\n\nForgive me\nthey were delicious\nso sweet\nand so cold",
    attribution: "William Carlos Williams",
    year: "1934",
    blurb: "The audacity of the apology that isn't an apology. Pure.",
    size: "small",
    rotation: 2,
  },
  {
    id: "5",
    type: "essay",
    title: "On exactitude in science",
    content: "In that Empire, the Art of Cartography attained such Perfection that the map of a single Province occupied the entirety of a City, and the map of the Empire, the entirety of a Province.",
    attribution: "Jorge Luis Borges",
    source: "A Universal History of Infamy",
    year: "1946",
    blurb: "The map that becomes the territory. Borges in one paragraph.",
    size: "medium",
    rotation: -1,
  },
];

type FilterType = "all" | "poem" | "essay" | "art" | "quote";

const typeIcons = {
  poem: Quote,
  essay: FileText,
  art: Palette,
  quote: MessageSquareQuote,
};

const typeLabels = {
  poem: "Poem",
  essay: "Essay",
  art: "Art",
  quote: "Quote",
};

function InspirationCard({ 
  item, 
  onClick 
}: { 
  item: Inspiration; 
  onClick: () => void;
}) {
  const rotation = item.rotation || 0;
  const Icon = typeIcons[item.type];
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "group bg-background border border-border/50 rounded-sm shadow-md cursor-pointer",
        "transition-all duration-300 ease-out break-inside-avoid",
        "hover:shadow-xl hover:scale-[1.02] hover:z-10",
        item.featured && "ring-2 ring-secondary/30"
      )}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "rotate(0deg) translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rotation}deg)`;
      }}
    >
      {item.type === "art" && (
        <div className="overflow-hidden rounded-t-sm">
          <img 
            src={item.content} 
            alt={item.title}
            className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {item.type === "poem" && item.imageUrl && (
        <div className="overflow-hidden rounded-t-sm">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {item.type === "quote" ? (
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Icon className="w-7 h-7 text-secondary/40 shrink-0 mt-0.5" />
            <blockquote
              className="font-serif italic text-foreground/90 leading-relaxed whitespace-pre-line"
              style={{ fontSize: `${(item.fontSize || 1) * 1.1}rem` }}
            >
              {item.content}
            </blockquote>
          </div>
          <div className="pl-10">
            <p className="font-bold text-primary text-sm">— {item.attribution}</p>
            {(item.source || item.year) && (
              <p className="text-xs text-muted-foreground">
                {item.source}{item.source && item.year && ", "}{item.year}
              </p>
            )}
          </div>
          {item.blurb && (
            <div className="pl-10 pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-bold text-secondary">My take:</span> {item.blurb}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-5">
          <div className="flex items-center gap-1.5 mb-3">
            <Icon className="w-3 h-3 text-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {typeLabels[item.type]}
            </span>
          </div>

          {item.type !== "art" && !(item.type === "poem" && item.imageUrl) && (
            <blockquote
              className={cn(
                "font-serif italic text-foreground/90 leading-relaxed mb-4 whitespace-pre-line",
                item.type === "poem" && "font-[Georgia,serif] leading-[1.8]"
              )}
              style={{ fontSize: `${(item.fontSize || 1) * 0.95}rem` }}
            >
              "{item.content}"
            </blockquote>
          )}

          <div className="mb-4">
            <p className="font-bold text-primary text-sm">{item.attribution}</p>
            <p className="text-xs text-muted-foreground">
              {item.title}
              {item.source && `, ${item.source}`}
              {item.year && ` (${item.year})`}
            </p>
            {item.type === "essay" && item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1 mt-1.5 text-xs text-secondary hover:text-secondary/80 transition-colors"
              >
                Read essay <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {item.blurb && (
            <div className="pt-3 border-t border-border/30">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-bold text-secondary">My take:</span> {item.blurb}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InspirationModal({ 
  item, 
  onClose 
}: { 
  item: Inspiration; 
  onClose: () => void;
}) {
  const Icon = typeIcons[item.type];
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-2xl pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          {item.type === "art" && (
            <div className="w-full overflow-hidden rounded-t-lg bg-muted">
              <img 
                src={item.content} 
                alt={item.title}
                className="w-full h-auto object-contain"
              />
            </div>
          )}

          {item.type === "poem" && item.imageUrl && (
            <div className="w-full overflow-hidden rounded-t-lg bg-muted">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-auto object-contain"
              />
            </div>
          )}
          
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <Icon className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {typeLabels[item.type]}
              </span>
            </div>

            {item.type === "quote" ? (
              <>
                <div className="flex items-start gap-4 mb-6">
                  <Icon className="w-10 h-10 text-secondary/30 shrink-0 mt-1" />
                  <blockquote
                    className="font-serif italic text-foreground/90 leading-relaxed whitespace-pre-line"
                    style={{ fontSize: `${(item.fontSize || 1) * 1.35}rem` }}
                  >
                    {item.content}
                  </blockquote>
                </div>
                <div className="pl-14 mb-6">
                  <p className="font-bold text-primary text-base">— {item.attribution}</p>
                  {(item.source || item.year) && (
                    <p className="text-sm text-muted-foreground">
                      {item.source}{item.source && item.year && ", "}{item.year}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-serif font-bold text-primary mb-2">
                  {item.title}
                </h2>
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    {item.attribution}
                    {item.source && ` — ${item.source}`}
                    {item.year && ` (${item.year})`}
                  </p>
                  {item.type === "essay" && item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Read the full essay
                    </a>
                  )}
                </div>
                {item.type !== "art" && !(item.type === "poem" && item.imageUrl) && (
                  <blockquote
                    className={cn(
                      "font-serif italic text-foreground/90 leading-relaxed mb-8 pl-4 border-l-2 border-secondary/50 whitespace-pre-line",
                      item.type === "poem" && "font-[Georgia,serif] leading-[1.9]"
                    )}
                    style={{ fontSize: `${(item.fontSize || 1) * 1.125}rem` }}
                  >
                    {item.content}
                  </blockquote>
                )}
              </>
            )}

            {item.blurb && (
              <div className="bg-muted/30 rounded-lg p-5 border border-border/50">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  My Take
                </p>
                <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                  {item.blurb}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Inspirations() {
  const [inspirations, setInspirations] = useState<Inspiration[]>(sampleInspirations);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedItem, setSelectedItem] = useState<Inspiration | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchInspirations()
      .then((data) => {
        if (data?.length > 0) setInspirations(data);
      })
      .catch(() => {
        const saved = localStorage.getItem("portfolio_inspirations");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.length > 0) setInspirations(parsed);
          } catch (e) {
            console.error("Failed to parse saved inspirations");
          }
        }
      })
      .finally(() => setLoading(false));
    
    const handleUpdate = () => {
      const updated = localStorage.getItem("portfolio_inspirations");
      if (updated) {
        try {
          setInspirations(JSON.parse(updated));
        } catch (e) {
          console.error("Failed to parse updated inspirations");
        }
      }
    };
    
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("inspirations-updated", handleUpdate);
    
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("inspirations-updated", handleUpdate);
    };
  }, []);
  
  const filteredItems = filter === "all" 
    ? inspirations 
    : inspirations.filter(item => item.type === filter);
  
  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "poem", label: "Poems" },
    { value: "essay", label: "Essays" },
    { value: "quote", label: "Quotes" },
    { value: "art", label: "Art" },
  ];

  if (loading) {
    return (
      <Layout>
        <LoadingScreen variant="suprematist" duration={1500} />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <section className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">
                Inspirations
              </h1>
              <p className="text-muted-foreground max-w-lg">
                A personal anthology of poems, passages, and visual works that have shaped my thinking.
              </p>
            </div>
            
            {/* Filter toggles */}
            <div className="flex items-center gap-1 bg-card p-1.5 rounded-lg border border-border/50 shadow-sm">
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all",
                    filter === value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Masonry Layout */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {filteredItems.map((item) => (
              <div key={item.id} className="mb-6">
                <InspirationCard
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              </div>
            ))}
          </div>
          
          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No {filter === "all" ? "inspirations" : filter + "s"} yet.
              </p>
            </div>
          )}
          
          {/* Count */}
          <div className="text-center py-8 mt-12 border-t border-border/20">
            <p className="text-sm text-muted-foreground">
              {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
              {filter !== "all" && ` in ${filter}s`}
            </p>
          </div>
        </div>
      </section>
      
      {/* Modal */}
      {selectedItem && (
        <InspirationModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </Layout>
  );
}
