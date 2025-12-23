import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, BookOpen, PenTool, User, Cloud, Info, GripVertical, Trash2, CloudUpload, CloudDownload, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BookEditor from "@/components/admin/BookEditor";
import WritingsEditor from "@/components/admin/WritingsEditor";
import ProfileEditor from "@/components/admin/ProfileEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import { books as initialBooks, Book, STORAGE_KEYS, getStoredProfile, getStoredAbout } from "@/lib/data";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TabType = "profile" | "about" | "books" | "writings";

// Sortable Book Item Component
function SortableBookItem({ book, onDelete }: { book: Book; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: book.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`aspect-[2/3] bg-muted rounded-sm overflow-hidden relative group ${
        isDragging ? "z-50 shadow-xl" : ""
      }`}
    >
      <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
      
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1.5 bg-black/70 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-white" />
      </div>
      
      {/* Delete Button */}
      <button
        onClick={() => onDelete(book.id)}
        className="absolute top-2 right-2 p-1.5 bg-destructive rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
      >
        <Trash2 className="w-4 h-4 text-white" />
      </button>
      
      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-xs font-medium truncate">{book.title}</p>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [isLoadingFromCloud, setIsLoadingFromCloud] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<"unknown" | "connected" | "error">("unknown");
  const { toast } = useToast();

  // Load saved books from localStorage
  useEffect(() => {
    const savedBooks = localStorage.getItem(STORAGE_KEYS.BOOKS);
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
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(updatedBooks));
  };

  const handleUpdateBook = (updatedBook: Book) => {
    const updatedBooks = books.map((book) => 
      book.id === updatedBook.id ? updatedBook : book
    );
    setBooks(updatedBooks);
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(updatedBooks));
  };

  const handleSaveWriting = (post: any) => {
    // Save to localStorage
    const savedWritings = localStorage.getItem(STORAGE_KEYS.WRITINGS);
    const writings = savedWritings ? JSON.parse(savedWritings) : [];
    writings.unshift(post);
    localStorage.setItem(STORAGE_KEYS.WRITINGS, JSON.stringify(writings));
  };

  const handleSyncBooksToSupabase = async () => {
    try {
      const response = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(books),
      });
      
      if (!response.ok) throw new Error("Failed to sync");
      
      toast({
        title: "Books Synced",
        description: "Your bookshelf has been saved to Supabase.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Could not sync books to Supabase.",
      });
    }
  };

  // Sync ALL local data to cloud
  const handleSyncAllToCloud = async () => {
    setIsSyncingAll(true);
    
    const results = { profile: false, about: false, books: false, writings: false };
    
    try {
      // Sync Profile
      const profile = getStoredProfile();
      const profileRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      results.profile = profileRes.ok;
    } catch {
      results.profile = false;
    }

    try {
      // Sync About
      const about = getStoredAbout();
      const aboutRes = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });
      results.about = aboutRes.ok;
    } catch {
      results.about = false;
    }

    try {
      // Sync Books
      const booksRes = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(books),
      });
      results.books = booksRes.ok;
    } catch {
      results.books = false;
    }

    try {
      // Sync Writings
      const savedWritings = localStorage.getItem(STORAGE_KEYS.WRITINGS);
      const writings = savedWritings ? JSON.parse(savedWritings) : [];
      const writingsRes = await fetch("/api/writings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(writings),
      });
      results.writings = writingsRes.ok;
    } catch {
      results.writings = false;
    }

    setIsSyncingAll(false);

    const successCount = Object.values(results).filter(Boolean).length;
    
    if (successCount === 4) {
      setCloudStatus("connected");
      toast({
        title: "All Data Synced!",
        description: "Profile, About, Books, and Writings have been saved to the cloud.",
      });
    } else if (successCount > 0) {
      setCloudStatus("connected");
      toast({
        title: "Partial Sync",
        description: `${successCount}/4 items synced. Some items may have failed.`,
      });
    } else {
      setCloudStatus("error");
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Could not connect to the cloud. Check your connection.",
      });
    }
  };

  // Load ALL data from cloud to localStorage
  const handleLoadFromCloud = async () => {
    setIsLoadingFromCloud(true);
    
    const results = { profile: false, about: false, books: false, writings: false };
    
    try {
      // Load Profile
      const profileRes = await fetch("/api/profile");
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profileData));
        window.dispatchEvent(new Event("profile-updated"));
        results.profile = true;
      }
    } catch {
      results.profile = false;
    }

    try {
      // Load About
      const aboutRes = await fetch("/api/about");
      if (aboutRes.ok) {
        const aboutData = await aboutRes.json();
        // Map snake_case to camelCase
        const mappedAbout = {
          content: aboutData.content,
          profileImage: aboutData.profile_image || aboutData.profileImage,
          gallery: aboutData.gallery || [],
        };
        localStorage.setItem(STORAGE_KEYS.ABOUT, JSON.stringify(mappedAbout));
        window.dispatchEvent(new Event("about-updated"));
        results.about = true;
      }
    } catch {
      results.about = false;
    }

    try {
      // Load Books
      const booksRes = await fetch("/api/books");
      if (booksRes.ok) {
        const booksData = await booksRes.json();
        if (booksData && booksData.length > 0) {
          setBooks(booksData);
          localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(booksData));
          results.books = true;
        }
      }
    } catch {
      results.books = false;
    }

    try {
      // Load Writings
      const writingsRes = await fetch("/api/writings");
      if (writingsRes.ok) {
        const writingsData = await writingsRes.json();
        if (writingsData && writingsData.length > 0) {
          localStorage.setItem(STORAGE_KEYS.WRITINGS, JSON.stringify(writingsData));
          results.writings = true;
        }
      }
    } catch {
      results.writings = false;
    }

    setIsLoadingFromCloud(false);

    const successCount = Object.values(results).filter(Boolean).length;
    
    if (successCount > 0) {
      setCloudStatus("connected");
      toast({
        title: "Loaded from Cloud",
        description: `${successCount}/4 items loaded. Local data has been updated.`,
      });
      // Reload the page to refresh all components with new data
      window.location.reload();
    } else {
      setCloudStatus("error");
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: "Could not load from cloud. Supabase may not be configured.",
      });
    }
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = books.findIndex((book) => book.id === active.id);
      const newIndex = books.findIndex((book) => book.id === over.id);
      
      const reorderedBooks = arrayMove(books, oldIndex, newIndex);
      setBooks(reorderedBooks);
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(reorderedBooks));
      
      toast({
        title: "Order Updated",
        description: "Book order has been saved.",
      });
    }
  };

  const handleDeleteBook = (id: string) => {
    const updatedBooks = books.filter((book) => book.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(updatedBooks));
    toast({
      title: "Book Removed",
      description: "The book has been removed from your shelf.",
    });
  };

  if (isLoggedIn) {
    return (
      <Layout>
         <div className="pt-32 px-6 max-w-5xl mx-auto pb-24">
            <div className="flex justify-between items-center mb-12">
               <h1 className="text-4xl font-serif font-bold text-primary">Content Management</h1>
               <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant={activeTab === "profile" ? "default" : "outline"}
                    onClick={() => setActiveTab("profile")}
                    className="gap-2"
                    size="sm"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Button>
                  <Button 
                    variant={activeTab === "about" ? "default" : "outline"}
                    onClick={() => setActiveTab("about")}
                    className="gap-2"
                    size="sm"
                  >
                    <Info className="w-4 h-4" /> About
                  </Button>
                  <Button 
                    variant={activeTab === "books" ? "default" : "outline"}
                    onClick={() => setActiveTab("books")}
                    className="gap-2"
                    size="sm"
                  >
                    <BookOpen className="w-4 h-4" /> Bookshelf
                  </Button>
                  <Button 
                    variant={activeTab === "writings" ? "default" : "outline"}
                    onClick={() => setActiveTab("writings")}
                    className="gap-2"
                    size="sm"
                  >
                    <PenTool className="w-4 h-4" /> Writings
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLoadFromCloud}
                    disabled={isLoadingFromCloud}
                    className="gap-2"
                  >
                    {isLoadingFromCloud ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CloudDownload className="w-4 h-4" />
                    )}
                    {isLoadingFromCloud ? "Loading..." : "Load"}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleSyncAllToCloud}
                    disabled={isSyncingAll}
                    className="gap-2"
                  >
                    {isSyncingAll ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CloudUpload className="w-4 h-4" />
                    )}
                    {isSyncingAll ? "Syncing..." : "Save ALL"}
                  </Button>
                  {/* Cloud Status Indicator */}
                  <div className="flex items-center gap-1 px-2">
                    {cloudStatus === "connected" && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                    {cloudStatus === "error" && (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                    {cloudStatus === "unknown" && (
                      <Cloud className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(false)}>Logout</Button>
               </div>
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               {activeTab === "profile" && (
                 <Card className="border-primary/10 shadow-lg">
                    <CardHeader className="bg-muted/20 border-b border-border/40">
                       <CardTitle>Edit Profile</CardTitle>
                       <CardDescription>Update your name and bio displayed on the homepage.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                       <ProfileEditor />
                    </CardContent>
                 </Card>
               )}

               {activeTab === "about" && (
                 <Card className="border-primary/10 shadow-lg">
                    <CardHeader className="bg-muted/20 border-b border-border/40">
                       <CardTitle>Edit About Page</CardTitle>
                       <CardDescription>Update your about section with text and images.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                       <AboutEditor />
                    </CardContent>
                 </Card>
               )}
               
               {activeTab === "books" && (
                 <Card className="border-primary/10 shadow-lg">
                    <CardHeader className="bg-muted/20 border-b border-border/40 flex flex-row items-center justify-between">
                       <div>
                         <CardTitle>Add to Bookshelf</CardTitle>
                         <CardDescription>Search Google Books to auto-fill details or enter manually.</CardDescription>
                       </div>
                       <Button variant="outline" size="sm" onClick={handleSyncBooksToSupabase} className="gap-2">
                         <Cloud className="w-4 h-4" /> Sync All to Cloud
                       </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                       <BookEditor 
                         initialBooks={books} 
                         onSave={handleSaveBook} 
                         onUpdate={handleUpdateBook}
                         onDelete={handleDeleteBook}
                       />
                    </CardContent>
                 </Card>
               )}
               
               {activeTab === "writings" && (
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

            {/* Current Items Preview with Drag & Drop */}
            {activeTab === "books" && (
              <div className="mt-16 border-t border-border/40 pt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-serif font-bold text-muted-foreground">
                    Current Books ({books.length})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Drag to reorder • Hover to delete
                  </p>
                </div>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={books.map(b => b.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {books.map((book) => (
                        <SortableBookItem 
                          key={book.id} 
                          book={book} 
                          onDelete={handleDeleteBook}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
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
