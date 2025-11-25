import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import Bookshelf from "@/components/Bookshelf";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col">
        <Hero />
        
        <Bookshelf />

        <section id="technology" className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
           <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Creative Technology</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  I experiment with code as a medium for expression. From generative art to interactive web experiences, my goal is to humanize the digital landscape.
                </p>
                <Link href="/writings">
                   <span className="inline-flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-sm hover:gap-4 transition-all cursor-pointer">
                     View Projects <ArrowRight className="w-4 h-4" />
                   </span>
                </Link>
              </div>
              <div className="aspect-square rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#123524 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 <div className="w-32 h-32 bg-secondary/80 rounded-full blur-2xl absolute top-1/4 left-1/4 animate-pulse"></div>
                 <div className="w-40 h-40 bg-primary/60 rounded-full blur-2xl absolute bottom-1/3 right-1/3 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
           </div>
        </section>
      </div>
    </Layout>
  );
}
