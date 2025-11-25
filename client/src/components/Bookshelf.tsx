import { useState, useEffect, useRef } from "react";
import { books, Book } from "@/lib/data";
import BookMotion from "./BookMotion";
import Book3D from "./Book3D";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function Bookshelf() {
  const [mode, setMode] = useState<"motion" | "css">("motion");
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>(books);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite Scroll Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreBooks();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [displayedBooks, isLoading]);

  const loadMoreBooks = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const newBooks = books.map(book => ({
        ...book,
        id: crypto.randomUUID() // Generate new ID for React keys
      }));
      setDisplayedBooks(prev => [...prev, ...newBooks]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section 
      id="bookshelf" 
      className="py-24 px-6 md:px-12 min-h-screen relative bg-card"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">Curated Bookshelf</h2>
            <p className="text-muted-foreground max-w-lg">
              A collection of texts that have shaped my perspective on design, technology, and the spaces in between.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-background p-3 rounded-lg border border-border/50 shadow-sm">
            <Label htmlFor="mode-toggle" className={`text-xs font-bold uppercase tracking-wider ${mode === "css" ? "text-primary" : "text-muted-foreground"}`}>Lightweight (CSS)</Label>
            <Switch 
              id="mode-toggle" 
              checked={mode === "motion"}
              onCheckedChange={(checked) => setMode(checked ? "motion" : "css")}
              data-testid="switch-mode"
            />
            <Label htmlFor="mode-toggle" className={`text-xs font-bold uppercase tracking-wider ${mode === "motion" ? "text-secondary" : "text-muted-foreground"}`}>Interactive (Motion)</Label>
          </div>
        </div>

        <div className="space-y-16">
          {/* Group books into rows of 4 for the shelf effect */}
          {Array.from({ length: Math.ceil(displayedBooks.length / 4) }).map((_, rowIndex) => (
            <div key={rowIndex} className="relative">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center relative z-10 pb-2">
                {displayedBooks.slice(rowIndex * 4, (rowIndex + 1) * 4).map((book) => (
                  mode === "motion" ? (
                    <BookMotion key={book.id} book={book} />
                  ) : (
                    <Book3D key={book.id} book={book} />
                  )
                ))}
              </div>
              
              {/* Shelf Graphic */}
              <div className="absolute -bottom-8 left-[-50px] right-[-50px] h-8 bg-[#3e2723] shadow-[0_10px_20px_rgba(0,0,0,0.15)] rounded-sm transform perspective-[1000px] rotate-x-12 border-t border-[#5d4037]">
                 <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Indicator / Intersection Target */}
        <div ref={observerTarget} className="flex justify-center py-12 mt-8">
          {isLoading && (
            <div className="bg-card/80 p-4 rounded-full shadow-xl backdrop-blur-sm border border-border">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
