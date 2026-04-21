import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { getStoredAbout, About as AboutType, defaultAbout } from "@/lib/data";
import { fetchAbout } from "@/lib/supabase";

export default function About() {
  const [about, setAbout] = useState<AboutType>(getStoredAbout());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout()
      .then((data) => {
        if (data?.content) {
          const merged = { ...data };
          const localImages = defaultAbout.gallery;
          merged.gallery = [
            ...localImages,
            ...(data.gallery || []).filter((url: string) => !localImages.includes(url)),
          ];
          setAbout(merged);
        }
      })
      .catch((err) => console.error("[About] Failed to fetch from Supabase:", err.message))
      .finally(() => setLoading(false));

    const handleStorageChange = () => {
      setAbout(getStoredAbout());
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("about-updated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("about-updated", handleStorageChange);
    };
  }, []);

  const { bioContent, listContent } = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(about.content, "text/html");
    const list = doc.body.querySelector("ul, ol");
    
    if (list) {
      const listHtml = list.outerHTML;
      list.remove();
      
      const paragraphs = doc.body.querySelectorAll("p");
      paragraphs.forEach(p => {
        if (p.textContent?.toLowerCase().includes("things i've done before") || 
            p.textContent?.toLowerCase().includes("things i've done:")) {
          p.remove();
        }
      });
      
      return { bioContent: doc.body.innerHTML, listContent: listHtml };
    }
    
    return { bioContent: about.content, listContent: null };
  }, [about.content]);

  const contentStyles = "[&_p]:my-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_li]:leading-relaxed [&_strong]:font-bold [&_em]:italic [&_h1]:text-3xl [&_h1]:font-serif [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-serif [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2";

  if (loading) {
    return (
      <Layout>
        <section className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="w-full md:w-64 shrink-0 space-y-8">
                <div className="w-48 h-48 md:w-64 md:h-64 bg-muted/50 rounded-sm animate-pulse" />
                <div className="w-48 md:w-64 space-y-2">
                  <div className="h-4 w-32 bg-muted/40 rounded animate-pulse" />
                  <div className="h-3 w-full bg-muted/30 rounded animate-pulse" style={{ animationDelay: "100ms" }} />
                  <div className="h-3 w-3/4 bg-muted/30 rounded animate-pulse" style={{ animationDelay: "200ms" }} />
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div className="h-10 w-32 bg-muted/60 rounded animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-muted/40 rounded animate-pulse" style={{ animationDelay: "50ms" }} />
                  <div className="h-4 w-full bg-muted/40 rounded animate-pulse" style={{ animationDelay: "100ms" }} />
                  <div className="h-4 w-5/6 bg-muted/40 rounded animate-pulse" style={{ animationDelay: "150ms" }} />
                  <div className="h-4 w-full bg-muted/40 rounded animate-pulse" style={{ animationDelay: "200ms" }} />
                  <div className="h-4 w-2/3 bg-muted/40 rounded animate-pulse" style={{ animationDelay: "250ms" }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
        {/* Classic Layout */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-64 shrink-0 space-y-8">
              <div className="w-48 h-48 md:w-64 md:h-64 relative">
                <div className="absolute inset-0 bg-secondary/10 rounded-sm -rotate-3" />
                <img 
                  src={about.profileImage} 
                  alt="Profile" 
                  className="relative w-full h-full object-contain bg-background rounded-sm shadow-lg p-4"
                />
              </div>
              
              {listContent && (
                <div className="w-48 md:w-64">
                  <h3 className="text-sm font-serif font-bold text-primary mb-3 uppercase tracking-wide">
                    Things I've done
                  </h3>
                  <div 
                    className={`text-sm leading-relaxed ${contentStyles}`}
                    dangerouslySetInnerHTML={{ __html: listContent }}
                  />
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
                About
              </h1>
              <div 
                className={`text-lg leading-relaxed ${contentStyles}`}
                dangerouslySetInnerHTML={{ __html: bioContent }}
              />
            </div>
          </div>
        </div>

        {/* Gallery */}
        {about.gallery.length > 0 && (
          <div className="border-t border-border/40 pt-12 mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-primary mb-8">
              Gallery
            </h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
              {about.gallery.map((image, index) => (
                <div 
                  key={index} 
                  className="aspect-square bg-muted rounded-sm overflow-hidden group cursor-pointer"
                >
                  <img 
                    src={image} 
                    alt={`Gallery image ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
