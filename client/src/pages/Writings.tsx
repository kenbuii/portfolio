import Layout from "@/components/Layout";

const writings = [
  {
    id: 1,
    title: "The Future of Interfaces is Invisible",
    date: "October 24, 2024",
    excerpt: "Why we are moving away from screens and towards ambient computing.",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Mid-Century Modernism in Digital Design",
    date: "September 12, 2024",
    excerpt: "Applying the principles of Eames and Saarinen to UI components.",
    readTime: "8 min read"
  },
  {
    id: 3,
    title: "Slow Web: A Manifesto",
    date: "August 05, 2024",
    excerpt: "Building websites that respect user attention and promote calmness.",
    readTime: "6 min read"
  }
];

export default function Writings() {
  return (
    <Layout>
      <div className="pt-32 px-6 md:px-12 max-w-4xl mx-auto min-h-screen">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-16">Writings</h1>
        
        <div className="space-y-12">
          {writings.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-secondary transition-colors">
                  {post.title}
                </h2>
                <span className="text-sm font-mono text-muted-foreground shrink-0">{post.date}</span>
              </div>
              <p className="text-lg text-muted-foreground mb-4 max-w-2xl">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                 Read Article <span>→</span>
              </div>
              <div className="h-px w-full bg-border mt-8 group-hover:bg-secondary/30 transition-colors" />
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}
