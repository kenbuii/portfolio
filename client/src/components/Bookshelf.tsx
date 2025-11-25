import { useState } from "react";
import { books } from "@/lib/data";
import BookMotion from "./BookMotion";
import Book3D from "./Book3D";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Bookshelf() {
  const [mode, setMode] = useState<"motion" | "css">("motion");

  return (
    <section id="bookshelf" className="py-24 px-6 md:px-12 bg-card border-y border-border/40">
      <div className="max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 place-items-center">
          {books.map((book) => (
             mode === "motion" ? (
                <BookMotion key={book.id} book={book} />
             ) : (
                <Book3D key={book.id} book={book} />
             )
          ))}
        </div>
      </div>
    </section>
  );
}
