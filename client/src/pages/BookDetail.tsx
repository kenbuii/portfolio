import { useRoute, useLocation } from "wouter";
import { books as defaultBooks, Book, STORAGE_KEYS } from "@/lib/data";
import { fetchBooks } from "@/lib/supabase";
import { Star, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";

export default function BookDetail() {
  const [, params] = useRoute("/book/:id");
  const [, navigate] = useLocation();
  const [allBooks, setAllBooks] = useState<Book[]>(defaultBooks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed with localStorage immediately while Supabase loads
    const savedBooks = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (savedBooks) {
      try {
        const parsed = JSON.parse(savedBooks);
        if (parsed.length > 0) setAllBooks(parsed);
      } catch (e) {}
    }

    fetchBooks()
      .then((data) => { if (data?.length > 0) setAllBooks(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const book = allBooks.find((b) => b.id === params?.id);

  if (loading && !book) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-card">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!loading && !book) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-card">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold text-primary mb-4">Book not found</h1>
            <Button onClick={() => navigate("/bookshelf")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bookshelf
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-card">
        {/* Back Button */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/20">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <button
              onClick={() => navigate("/bookshelf")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Bookshelf
            </button>
          </div>
        </div>

        {/* Book Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-[300px_1fr] gap-12">
            {/* Book Cover */}
            <div className="relative">
              <div className="sticky top-24">
                <div className="relative bg-neutral-100 p-8 rounded-lg shadow-xl">
                  {/* Page fold effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/10 to-transparent rounded-l-lg" />
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-auto max-h-[450px] object-contain shadow-2xl rounded-sm mx-auto"
                  />
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.08)] rounded-lg" />
                </div>

                {/* Purchase Button */}
                {book.link && book.link !== "#" && (
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block"
                  >
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-serif rounded-sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Purchase Copy
                    </Button>
                  </a>
                )}
                {(!book.link || book.link === "#") && (
                  <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-serif rounded-sm">
                    Purchase Copy
                  </Button>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">
                  {book.title}
                </h1>
                <p className="text-lg text-muted-foreground font-medium">
                  by {book.author}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(book.rating)
                          ? "fill-secondary text-secondary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-mono text-muted-foreground">
                  {book.rating}/5.0
                </span>
              </div>

              {/* Synopsis */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Synopsis
                </h2>
                <p className="text-base leading-relaxed text-foreground/90">
                  {book.synopsis}
                </p>
              </div>

              {/* Full Description */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  About This Book
                </h2>
                <p className="text-base leading-relaxed text-foreground/80">
                  {book.description}
                </p>
              </div>

              {/* Review */}
              <div className="bg-secondary/5 p-6 rounded-lg border border-secondary/10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
                  My Review
                </h2>
                <blockquote className="italic text-base text-foreground/90 leading-relaxed">
                  "{book.review}"
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

