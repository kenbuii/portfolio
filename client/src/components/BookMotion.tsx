import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Book } from "@/lib/data";
import { Star, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface BookMotionProps {
  book: Book;
}

export default function BookMotion({ book }: BookMotionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, navigate] = useLocation();
  const bookRef = useRef<HTMLDivElement>(null);
  
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

  function handleOpenBook() {
    setIsOpen(true);
  }

  function handleCloseBook() {
    setIsOpen(false);
  }

  function handleShowMore() {
    setIsOpen(false);
    navigate(`/book/${book.id}`);
  }

  // Check if description is long - always truncate in modal
  const isLongDescription = book.description.length > 200;

  return (
    <>
      <motion.div
        ref={bookRef}
        className="relative group perspective-1000 w-[140px] h-[210px] cursor-pointer z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleOpenBook}
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

          {/* Popup Card - above book, aligned right */}
          <div className="absolute bottom-full right-0 mb-4 w-[280px] bg-card border border-border p-4 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none z-[60] rounded-sm">
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

      {/* Custom Modal with Page-Turn Animation - Rendered via Portal */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop - Higher z-index to cover everything */}
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleCloseBook}
              />

              {/* Book Modal */}
              <motion.div
                className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="relative w-full max-w-3xl max-h-[85vh] bg-background rounded-lg shadow-2xl overflow-hidden pointer-events-auto"
                  initial={{
                    scale: 0.3,
                    rotateY: -90,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    rotateY: 0,
                    opacity: 1,
                  }}
                  exit={{
                    scale: 0.3,
                    rotateY: 90,
                    opacity: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    duration: 0.5,
                  }}
                  style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Close Button */}
                  <button
                    onClick={handleCloseBook}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/90 hover:bg-background shadow-lg transition-colors border border-border"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="grid md:grid-cols-[280px_1fr] h-full max-h-[85vh]">
                    {/* Book Cover Side - Left Page */}
                    <motion.div 
                      className="h-[200px] md:h-auto relative bg-neutral-100 p-6 flex items-center justify-center overflow-hidden"
                      initial={{ rotateY: -20 }}
                      animate={{ rotateY: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      {/* Page fold effect */}
                      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/10 to-transparent" />
                      <motion.img 
                        src={book.cover} 
                        alt={book.title} 
                        className="w-auto h-auto max-h-[160px] md:max-h-[350px] max-w-full object-contain shadow-2xl rounded-sm"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      />
                      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.08)]" />
                    </motion.div>

                    {/* Content Side - Right Page */}
                    <motion.div 
                      className="p-6 md:p-8 flex flex-col overflow-y-auto bg-background"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      {/* Page texture */}
                      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />
                      
                      <div className="mb-4">
                        <motion.h2 
                          className="text-2xl md:text-3xl font-serif font-bold text-primary mb-1"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {book.title}
                        </motion.h2>
                        <motion.p 
                          className="text-base text-muted-foreground font-medium"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.45 }}
                        >
                          by {book.author}
                        </motion.p>
                      </div>
                      
                      <div className="space-y-4 flex-grow">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Synopsis</h4>
                          <p className="text-sm leading-relaxed text-foreground/80 line-clamp-4">
                            {book.description}
                          </p>
                          {isLongDescription && (
                            <button
                              onClick={handleShowMore}
                              className="mt-2 text-xs font-medium text-secondary hover:text-secondary/80 flex items-center gap-1 transition-colors"
                            >
                              Show more <ChevronDown className="w-3 h-3" />
                            </button>
                          )}
                        </motion.div>
                        
                        <motion.div 
                          className="bg-secondary/5 p-4 rounded-sm border border-secondary/10"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.55 }}
                        >
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
                        </motion.div>
                      </div>

                      <motion.div 
                        className="mt-6 pt-4 border-t border-border"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-serif rounded-sm">
                          Purchase Copy
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
