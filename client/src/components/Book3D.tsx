import { useState } from "react";
import { Book } from "@/lib/data";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Book3DProps {
  book: Book;
}

export default function Book3D({ book }: Book3DProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className="group relative w-[220px] h-[330px] cursor-pointer perspective-1000"
        onClick={() => setIsOpen(true)}
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background border-none shadow-2xl sm:rounded-lg">
          <div className="grid md:grid-cols-2 h-full">
             <div className="h-[300px] md:h-full relative bg-neutral-100 p-8 flex items-center justify-center">
                <img src={book.cover} alt={book.title} className="max-h-full max-w-full shadow-2xl" />
             </div>
             <div className="p-8 md:p-12 flex flex-col h-full overflow-y-auto">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">{book.title}</DialogTitle>
                  <DialogDescription className="text-lg text-muted-foreground font-medium">by {book.author}</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 flex-grow">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Synopsis</h4>
                    <p className="leading-relaxed text-foreground/80">{book.description}</p>
                  </div>
                  
                  <div className="bg-secondary/5 p-4 rounded-sm border border-secondary/10">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Review</h4>
                    <p className="italic text-foreground/90 mb-3">"{book.review}"</p>
                    <div className="flex items-center gap-2">
                       <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
                        ))}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-serif rounded-sm">
                    Purchase Copy
                  </Button>
                </div>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
