import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/writings", label: "Writings" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary selection:text-secondary-foreground">
      <header className="fixed top-0 left-0 z-50 p-6 flex items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 text-primary transition-colors duration-300"
              data-testid="button-menu"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] bg-card border-r border-border p-0">
            <div className="flex flex-col h-full p-8">
              <div className="mb-12">
                <h2 className="font-serif text-2xl font-bold text-primary tracking-tight">
                  Portfolio.
                </h2>
              </div>
              <nav className="flex flex-col gap-6">
                {links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span
                      className={`text-lg font-medium transition-all duration-300 hover:translate-x-2 cursor-pointer block ${
                        location === link.href
                          ? "text-secondary font-bold"
                          : "text-foreground/80 hover:text-primary"
                      }`}
                      onClick={() => setOpen(false)}
                      data-testid={`link-nav-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                ))}
              </nav>
              <div className="mt-auto pt-8 border-t border-border/20">
                <p className="text-xs text-muted-foreground font-mono">
                  © {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="w-full">{children}</main>
    </div>
  );
}
