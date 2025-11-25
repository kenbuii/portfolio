import { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Book } from "@/lib/data";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BookMotionProps {
  book: Book;
}

export default function BookMotion({ book }: BookMotionProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Motion values for tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
    stiffness: 150,
    damping: 20,
  });

  const brightness = useSpring(useTransform(y, [-0.5, 0.5], [1.1, 0.9]), {
     stiffness: 150,
     damping: 20
  });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <>
      <motion.div
        className="relative group perspective-1000 w-[240px] h-[360px] cursor-pointer z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        data-testid={`book-motion-${book.id}`}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            filter: useTransform(brightness, (b) => `brightness(${b})`),
          }}
          className="w-full h-full relative preserve-3d transition-shadow duration-300 ease-out group-hover:shadow-2xl group-hover:shadow-primary/20 rounded-r-md"
        >
          {/* Spine */}
          <div 
             className="absolute left-0 top-0 bottom-0 w-[40px] origin-left bg-neutral-800 transform -rotate-y-90 translate-z-[1px]"
             style={{ backgroundColor: book.color, filter: 'brightness(0.8)' }}
          />
          
          {/* Front Cover */}
          <div className="absolute inset-0 backface-hidden rounded-r-sm overflow-hidden bg-card border-l-4 border-l-neutral-900/20">
             <img 
               src={book.cover} 
               alt={book.title} 
               className="w-full h-full object-cover"
             />
             {/* Glossy overlay */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>

          {/* Pages (Right side) */}
          <div className="absolute right-0 top-2 bottom-2 w-[10px] bg-neutral-100 transform rotate-y-90 origin-right translate-x-[-5px] shadow-inner" />

          {/* Popup Card */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[280px] bg-card border border-border p-4 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 pointer-events-none z-50 rounded-sm">
             <h3 className="font-serif font-bold text-lg leading-tight mb-1">{book.title}</h3>
             <p className="text-xs text-muted-foreground mb-2">by {book.author}</p>
             <p className="text-sm leading-snug mb-3 line-clamp-3">{book.synopsis}</p>
             
             <div className="flex items-center justify-between border-t border-border/20 pt-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(book.rating) ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-secondary">Click to Read</span>
             </div>
          </div>
        </motion.div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background border-none shadow-2xl sm:rounded-lg">
          <div className="grid md:grid-cols-2 h-full">
             <div className="h-[300px] md:h-full relative bg-neutral-100 p-8 flex items-center justify-center">
                <img src={book.cover} alt={book.title} className="max-h-full max-w-full shadow-2xl rotate-y-12 rounded-sm" />
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]"></div>
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
                       <span className="text-sm font-mono text-muted-foreground">{book.rating}/5.0</span>
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
