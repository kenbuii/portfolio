import { Link, useLocation } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/bookshelf", label: "Bookshelf" },
    { href: "/inspirations", label: "Inspirations" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary selection:text-secondary-foreground">
      {/* Left Sidebar Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 w-24 z-50 bg-background/80 backdrop-blur-md border-r border-border/20 flex flex-col items-center py-6">
        {/* Logo - Links to Home */}
        <Link href="/">
          <img 
            src="/State_Quality_Mark_Of_The_USSR_(Black).png" 
            alt="Home" 
            className="w-10 h-10 md:w-12 md:h-12 object-contain cursor-pointer hover:opacity-70 transition-opacity mb-8"
          />
        </Link>

        {/* Navigation Links - Horizontal text, stacked vertically */}
        <nav className="flex flex-col items-center gap-4 flex-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  location === link.href
                    ? "text-secondary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Copyright at bottom */}
        <p className="text-[10px] text-muted-foreground font-mono">
          © {new Date().getFullYear()}
        </p>
      </aside>

      {/* Main content with left padding for sidebar */}
      <main className="w-full pl-24">{children}</main>

      {/* Discrete Admin Button - Bottom Left of viewport (outside sidebar) */}
      <Link href="/admin">
        <button
          className="fixed bottom-6 left-28 z-50 w-10 h-10 rounded-full bg-card/80 hover:bg-card border border-border/50 shadow-lg backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 opacity-40 hover:opacity-100"
          title="Admin"
          data-testid="link-nav-admin"
        >
          <span className="text-lg">✏️</span>
        </button>
      </Link>
    </div>
  );
}
