import { Link } from "wouter";

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-[80vh] flex flex-col justify-center px-6 md:px-24 lg:px-32 max-w-5xl mx-auto pt-24">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary tracking-tight leading-[1.1]">
          Alex Morgan
        </h1>
        
        <div className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-foreground/90 font-light max-w-4xl">
          <p>
            I am a multidisciplinary designer and developer based in San Francisco. 
            My work sits at the intersection of{" "}
            <button 
              onClick={() => scrollToSection("bookshelf")}
              className="underline decoration-1 decoration-secondary/50 underline-offset-4 hover:decoration-secondary hover:text-secondary transition-all duration-300 cursor-pointer inline-block bg-transparent border-none p-0 font-light"
              data-testid="link-interest-curation"
            >
              curation
            </button>
            ,{" "}
            <button
              onClick={() => scrollToSection("technology")}
              className="underline decoration-1 decoration-secondary/50 underline-offset-4 hover:decoration-secondary hover:text-secondary transition-all duration-300 cursor-pointer inline-block bg-transparent border-none p-0 font-light"
              data-testid="link-interest-technology"
            >
              creative technology
            </button>
            , and{" "}
            <Link href="/writings">
              <span 
                className="underline decoration-1 decoration-secondary/50 underline-offset-4 hover:decoration-secondary hover:text-secondary transition-all duration-300 cursor-pointer inline-block"
                data-testid="link-interest-writing"
              >
                thoughtful writing
              </span>
            </Link>
            . I believe in building digital spaces that feel calm, collected, and crafted.
          </p>
        </div>
      </div>
    </section>
  );
}
