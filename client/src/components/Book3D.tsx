import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Book } from "@/lib/data";
import { Star, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface Book3DProps {
  book: Book;
}

export default function Book3D({ book }: Book3DProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [, navigate] = useLocation();
  const bookRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setIsAnimating(true);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 400);
  };

  const handleShowMore = () => {
    setIsOpen(false);
    navigate(`/book/${book.id}`);
  };

  // Check if description is long - always truncate in modal
  const isLongDescription = book.description.length > 200;

  return (
    <>
      <div 
        ref={bookRef}
        className="group relative w-[130px] h-[195px] cursor-pointer perspective-1000"
        onClick={handleOpen}
        data-testid={`book-css-${book.id}`}
      >
        <div className="w-full h-full relative preserve-3d transition-transform duration-500 ease-out group-hover:rotate-y-[-15deg] group-hover:rotate-x-[5deg] group-hover:translate-z-[20px]">
          
          {/* Shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/20 blur-md rounded-[50%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-8" />

          {/* Front Cover */}
          <div className="absolute inset-0 backface-hidden bg-card shadow-lg rounded-r-sm overflow-hidden z-10 border-l-2 border-neutral-800/10">
            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
          </div>
          
          {/* Spine (Left) */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-[30px] origin-left rotate-y-90 bg-neutral-800 flex items-center justify-center"
            style={{ backgroundColor: book.color, filter: 'brightness(0.8)' }}
          >
          </div>
          
          {/* Pages (Right) */}
          <div className="absolute right-0 top-2 bottom-2 w-[8px] bg-neutral-100 origin-right rotate-y-90 translate-x-[-4px] shadow-inner" />

           {/* Simple CSS Popup */}
           <div className="absolute top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center z-20">
              <h3 className="font-serif font-bold text-xl mb-2">{book.title}</h3>
              <p className="text-sm opacity-80 mb-4">{book.author}</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? "fill-white text-white" : "text-white/30"}`} />
                ))}
              </div>
              <span className="mt-4 text-xs uppercase tracking-widest border border-white/30 px-3 py-1 rounded-full">View Details</span>
           </div>
        </div>
      </div>

      {/* Custom Modal with CSS Page-Turn Animation - Rendered via Portal */}
      {isOpen && createPortal(
        <>
          {/* Backdrop - Higher z-index */}
          <div
            className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[100] transition-opacity duration-300 ${
              isAnimating && !isOpen ? "opacity-0" : "opacity-100"
            }`}
            onClick={handleClose}
          />

          {/* Book Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <div
              className={`relative w-full max-w-3xl max-h-[85vh] bg-background rounded-lg shadow-2xl overflow-hidden pointer-events-auto transform transition-all duration-500 ease-out ${
                isAnimating && !isOpen
                  ? "scale-50 rotate-y-90 opacity-0"
                  : "scale-100 rotate-y-0 opacity-100"
              }`}
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
                animation: isOpen && isAnimating ? "bookOpen 0.5s ease-out forwards" : undefined,
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/90 hover:bg-background shadow-lg transition-colors border border-border"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-[280px_1fr] h-full max-h-[85vh]">
                {/* Book Cover Side */}
                <div className="h-[200px] md:h-auto relative bg-neutral-100 p-6 flex items-center justify-center">
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/10 to-transparent" />
                  <img 
                    src={book.cover} 
                    alt={book.title} 
                    className="w-auto h-auto max-h-[160px] md:max-h-[350px] max-w-full object-contain shadow-2xl rounded-sm" 
                  />
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.08)]"></div>
                </div>

                {/* Content Side */}
                <div className="p-6 md:p-8 flex flex-col overflow-y-auto">
                  <div className="mb-4">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-1">{book.title}</h2>
                    <p className="text-base text-muted-foreground font-medium">by {book.author}</p>
                  </div>
                  
                  <div className="space-y-4 flex-grow">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Synopsis</h4>
                      <p className="text-sm leading-relaxed text-foreground/80 line-clamp-4">{book.description}</p>
                      {isLongDescription && (
                        <button
                          onClick={handleShowMore}
                          className="mt-2 text-xs font-medium text-secondary hover:text-secondary/80 flex items-center gap-1 transition-colors"
                        >
                          Show more <ChevronDown className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    
                    <div className="bg-secondary/5 p-4 rounded-sm border border-secondary/10">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Review</h4>
                      <p className="italic text-sm text-foreground/90 mb-3 line-clamp-3">"{book.review}"</p>
                      <div className="flex items-center gap-2">
                         <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
                          ))}
                         </div>
                         <span className="text-sm font-mono text-muted-foreground">{book.rating}/5.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-serif rounded-sm">
                      Purchase Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes bookOpen {
              0% {
                transform: scale(0.3) rotateY(-90deg);
                opacity: 0;
              }
              100% {
                transform: scale(1) rotateY(0deg);
                opacity: 1;
              }
            }
          `}</style>
        </>,
        document.body
      )}
    </>
  );
}
