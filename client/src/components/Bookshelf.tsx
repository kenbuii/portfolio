import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { books as defaultBooks, Book, STORAGE_KEYS } from "@/lib/data";
import { fetchBooks } from "@/lib/supabase";
import BookMotion from "./BookMotion";
import Book3D from "./Book3D";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Star, X, ChevronRight } from "lucide-react";

type ViewMode = "visual" | "text";

function BookTextItem({ book }: { book: Book }) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const isFavorite = book.rating >= 5;

  return (
    <>
      <div className="group py-5 border-b border-border/30 last:border-b-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-bold text-lg text-primary leading-tight">
              {book.title}
              {isFavorite && <span className="text-secondary ml-1">*</span>}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">{book.author}</p>
          </div>
          <button
            onClick={() => setIsReviewOpen(true)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary transition-colors shrink-0 group-hover:text-secondary"
          >
            <span className="hidden sm:inline">Review</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isReviewOpen && createPortal(
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
            onClick={() => setIsReviewOpen(false)}
          />

          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <div className="relative w-full max-w-md bg-background rounded-lg shadow-2xl pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
              <button
                onClick={() => setIsReviewOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="font-serif font-bold text-xl text-primary">
                    {book.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    by {book.author}
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(book.rating)
                            ? "fill-secondary text-secondary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">
                    {book.rating}/5
                  </span>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    My Review
                  </p>
                  <p className="text-foreground/90 italic leading-relaxed">
                    "{book.review}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export default function Bookshelf() {
  const [mode, setMode] = useState<ViewMode>("visual");
  const [allBooks, setAllBooks] = useState<Book[]>(defaultBooks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedBooks = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (savedBooks) {
      try {
        const parsed = JSON.parse(savedBooks);
        if (parsed.length > 0) setAllBooks(parsed);
      } catch (e) {
        console.error("Failed to parse saved books");
      }
    }

    fetchBooks()
      .then((data) => {
        if (data?.length > 0) setAllBooks(data);
      })
      .catch((err) => console.error("[Bookshelf] Failed to fetch from Supabase:", err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="bookshelf" className="py-24 px-6 md:px-12 min-h-screen relative">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-3 mb-12">
            <div className="h-10 w-48 bg-muted/60 rounded animate-pulse" />
            <div className="h-5 w-80 bg-muted/40 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-28 h-40 bg-muted/50 rounded shadow-md animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="bookshelf"
      className="py-24 px-6 md:px-12 min-h-screen relative"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
              Bookshelf
            </h2>
            <p className="text-muted-foreground max-w-lg">
              A non-exhaustive collection of things I've read.
              {mode === "text" && (
                <span className="block mt-1 text-sm">
                  <span className="text-secondary">*</span> = favorite
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-background p-3 rounded-lg border border-border/50 shadow-sm">
            <Label
              htmlFor="view-toggle"
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer ${
                mode === "text" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Text
            </Label>
            <Switch
              id="view-toggle"
              checked={mode === "visual"}
              onCheckedChange={(checked) => setMode(checked ? "visual" : "text")}
              data-testid="switch-view-mode"
            />
            <Label
              htmlFor="view-toggle"
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer ${
                mode === "visual" ? "text-secondary" : "text-muted-foreground"
              }`}
            >
              Visual
            </Label>
          </div>
        </div>

        {mode === "visual" && (
          <div className="space-y-16">
            {Array.from({ length: Math.ceil(allBooks.length / 4) }).map(
              (_, rowIndex) => (
                <div key={rowIndex} className="relative">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center relative z-10 pb-2">
                    {allBooks
                      .slice(rowIndex * 4, (rowIndex + 1) * 4)
                      .map((book) => (
                        <BookMotion key={book.id} book={book} />
                      ))}
                  </div>

                  <div
                    className="absolute -bottom-8 left-[-50px] right-[-50px] h-8 shadow-[0_10px_20px_rgba(0,0,0,0.15)] rounded-sm transform perspective-[1000px] rotate-x-12"
                    style={{ backgroundImage: "url('/textures/wood.png')", backgroundSize: "cover", backgroundPosition: "center" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {mode === "text" && (
          <div className="max-w-2xl">
            {allBooks.map((book) => (
              <BookTextItem key={book.id} book={book} />
            ))}
          </div>
        )}

        <div className="text-center py-8 mt-12 border-t border-border/20">
          <p className="text-sm text-muted-foreground">
            {allBooks.length} book{allBooks.length !== 1 ? "s" : ""} in collection
          </p>
        </div>
      </div>
    </section>
  );
}
