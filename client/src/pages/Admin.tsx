import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, BookOpen, PenTool } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BookEditor from "@/components/admin/BookEditor";
import WritingsEditor from "@/components/admin/WritingsEditor";
import { books as initialBooks, Book } from "@/lib/data";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [activeTab, setActiveTab] = useState<"books" | "writings">("books");
  const { toast } = useToast();

  // Mock persistence
  useEffect(() => {
    const savedBooks = localStorage.getItem("bookshelf_books");
    if (savedBooks) {
       try {
         setBooks(JSON.parse(savedBooks));
       } catch (e) {
         console.error("Failed to parse saved books");
       }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin") {
      setIsLoggedIn(true);
      toast({
        title: "Welcome back",
        description: "You have successfully logged in to the CMS.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Incorrect password provided.",
      });
    }
  };

  const handleSaveBook = (newBook: Book) => {
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem("bookshelf_books", JSON.stringify(updatedBooks));
    // In a real app, we'd also update the server/file
  };

  const handleSaveWriting = (post: any) => {
    // In a real app, this would save to DB
    console.log("Saved post:", post);
  };

  if (isLoggedIn) {
    return (
      <Layout>
         <div className="pt-32 px-6 max-w-5xl mx-auto pb-24">
            <div className="flex justify-between items-center mb-12">
               <h1 className="text-4xl font-serif font-bold text-primary">Content Management</h1>
               <div className="flex gap-4">
                  <Button 
                    variant={activeTab === "books" ? "default" : "outline"}
                    onClick={() => setActiveTab("books")}
                    className="gap-2"
                  >
                    <BookOpen className="w-4 h-4" /> Bookshelf
                  </Button>
                  <Button 
                    variant={activeTab === "writings" ? "default" : "outline"}
                    onClick={() => setActiveTab("writings")}
                    className="gap-2"
                  >
                    <PenTool className="w-4 h-4" /> Writings
                  </Button>
                  <Button variant="ghost" onClick={() => setIsLoggedIn(false)}>Logout</Button>
               </div>
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               {activeTab === "books" ? (
                 <Card className="border-primary/10 shadow-lg">
                    <CardHeader className="bg-muted/20 border-b border-border/40">
                       <CardTitle>Add to Bookshelf</CardTitle>
                       <CardDescription>Search Google Books to auto-fill details or enter manually.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                       <BookEditor initialBooks={books} onSave={handleSaveBook} />
                    </CardContent>
                 </Card>
               ) : (
                 <Card className="border-primary/10 shadow-lg">
                    <CardHeader className="bg-muted/20 border-b border-border/40">
                       <CardTitle>New Writing</CardTitle>
                       <CardDescription>Compose a new article using Markdown.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                       <WritingsEditor onSave={handleSaveWriting} />
                    </CardContent>
                 </Card>
               )}
            </div>

            {/* Current Items Preview */}
            <div className="mt-16 border-t border-border/40 pt-8">
              <h3 className="text-xl font-serif font-bold mb-6 text-muted-foreground">
                {activeTab === "books" ? `Current Books (${books.length})` : "Recent Writings"}
              </h3>
              
              {activeTab === "books" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  {books.map((book) => (
                    <div key={book.id} className="aspect-[2/3] bg-muted rounded-sm overflow-hidden relative group">
                       <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold">Edit</span>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
         </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-secondary">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
               <Lock className="w-6 h-6 text-secondary" />
            </div>
            <CardTitle className="text-2xl font-serif">Admin Access</CardTitle>
            <CardDescription>Enter your credentials to modify the site.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Enter password..." 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-mono"
                  data-testid="input-password"
                />
              </div>
              <Button type="submit" className="w-full font-bold tracking-wide" data-testid="button-login">
                Unlock Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
