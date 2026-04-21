import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, BookOpen, Sparkles, User, Cloud, Info, GripVertical, Trash2, CloudUpload, CloudDownload, Loader2, CheckCircle2, XCircle, AlertTriangle, Quote, FileText, Palette, MessageSquareQuote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BookEditor from "@/components/admin/BookEditor";
import InspirationsEditor from "@/components/admin/InspirationsEditor";
import ProfileEditor from "@/components/admin/ProfileEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import { books as initialBooks, Book, STORAGE_KEYS, getStoredProfile, getStoredAbout } from "@/lib/data";
import { Inspiration } from "@/lib/supabase";
import {
  testSupabaseConnection,
  getSupabaseStatus,
  saveProfileToCloud,
  saveAboutToCloud,
  saveBooksToCloud,
  saveInspirationsToCloud,
  fetchProfile,
  fetchAbout,
  fetchBooks,
  fetchInspirations,
} from "@/lib/supabase";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TabType = "profile" | "about" | "books" | "inspirations";

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

const INSPIRATION_ICONS = {
  poem: Quote,
  essay: FileText,
  art: Palette,
  quote: MessageSquareQuote,
} as const;

const INSPIRATION_COLORS = {
  poem: "bg-violet-500/10 text-violet-600",
  essay: "bg-blue-500/10 text-blue-600",
  art: "bg-amber-500/10 text-amber-600",
  quote: "bg-emerald-500/10 text-emerald-600",
} as const;

function SortableInspirationRow({
  item,
  onDelete,
}: {
  item: Inspiration;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const Icon = INSPIRATION_ICONS[item.type] ?? Quote;
  const colorClass = INSPIRATION_COLORS[item.type] ?? "";

  const label = item.title || item.attribution || item.content.slice(0, 40);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-background border border-border/40 rounded-lg ${
        isDragging ? "z-50 shadow-xl ring-2 ring-secondary/40" : ""
      }`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors shrink-0 touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Type badge */}
      <span className={`shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${colorClass}`}>
        <Icon className="w-3 h-3" />
        {item.type}
      </span>

      {/* Content preview */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{label}</p>
        {item.attribution && item.title && (
          <p className="text-xs text-muted-foreground truncate">{item.attribution}</p>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(item.id)}
        className="shrink-0 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
        title="Remove"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

const ADMIN_PASSWORD_HASH = "39091e26b601cbbc7bc7277bf183bc93fdfb1ad684d72d2afa1930fb3790a336";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [isLoadingFromCloud, setIsLoadingFromCloud] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<"unknown" | "connected" | "error" | "misconfigured">("unknown");
  const [cloudDiagnostic, setCloudDiagnostic] = useState<string | null>(null);
  const { toast } = useToast();

  // Load books from localStorage first, then override with Supabase
  useEffect(() => {
    const savedBooks = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (savedBooks) {
       try {
         setBooks(JSON.parse(savedBooks));
       } catch (e) {
         console.error("Failed to parse saved books");
       }
    }
    fetchBooks()
      .then((data) => {
        if (data?.length > 0) {
          setBooks(data);
          localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(data));
        }
      })
      .catch((err) => console.error("[Admin] Failed to fetch books from Supabase:", err.message));
  }, []);

  // Load inspirations from localStorage, then override with Supabase
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("portfolio_inspirations");
      if (saved) {
        try { setInspirations(JSON.parse(saved)); } catch {}
      }
    };
    load();
    fetchInspirations()
      .then((data) => {
        if (data?.length > 0) {
          setInspirations(data);
          localStorage.setItem("portfolio_inspirations", JSON.stringify(data));
          window.dispatchEvent(new Event("inspirations-updated"));
        }
      })
      .catch((err) => console.error("[Admin] Failed to fetch inspirations from Supabase:", err.message));
    window.addEventListener("inspirations-updated", load);
    return () => window.removeEventListener("inspirations-updated", load);
  }, []);

  // Test Supabase connection on admin login
  useEffect(() => {
    if (!isLoggedIn) return;
    const status = getSupabaseStatus();
    if (!status.configured) {
      setCloudStatus("misconfigured");
      setCloudDiagnostic(status.reason ?? "Supabase not configured");
      console.error("[Admin] Supabase config issue:", status.reason);
      toast({
        variant: "destructive",
        title: "Supabase Not Configured",
        description: status.reason,
      });
      return;
    }
    testSupabaseConnection().then((result) => {
      if (result.ok) {
        setCloudStatus("connected");
        setCloudDiagnostic(null);
        console.log("[Admin] Supabase connected:", status.url);
      } else {
        setCloudStatus("error");
        setCloudDiagnostic(result.error ?? "Unknown error");
        console.error("[Admin] Supabase connection failed:", result.error);
        toast({
          variant: "destructive",
          title: "Supabase Connection Failed",
          description: result.error,
        });
      }
    });
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const hash = await hashPassword(password);
    if (hash === ADMIN_PASSWORD_HASH) {
      setIsLoggedIn(true);
      localStorage.setItem("portfolio_admin_logged_in", "true");
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
    saveBooksToCloud(updatedBooks).catch((err) =>
      console.error("[Admin] Book cloud sync failed:", err)
    );
  };

  const handleUpdateBook = (updatedBook: Book) => {
    const updatedBooks = books.map((book) =>
      book.id === updatedBook.id ? updatedBook : book
    );
    setBooks(updatedBooks);
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(updatedBooks));
    saveBooksToCloud(updatedBooks).catch((err) =>
      console.error("[Admin] Book cloud sync failed:", err)
    );
  };


  const handleSyncBooksToSupabase = async () => {
    try {
      console.log("[Admin] Syncing books to Supabase...", { count: books.length });
      await saveBooksToCloud(books);
      setCloudStatus("connected");
      toast({
        title: "Books Synced",
        description: "Your bookshelf has been saved to Supabase.",
      });
    } catch (error: any) {
      const msg = error?.message || String(error);
      console.error("[Admin] Book sync failed:", error);
      setCloudStatus("error");
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: `Could not sync books: ${msg}`,
      });
    }
  };

  // Sync ALL local data to cloud
  const handleSyncAllToCloud = async () => {
    setIsSyncingAll(true);
    console.log("[Admin] Starting full cloud sync...");
    
    const results: Record<string, { ok: boolean; error?: string }> = {};
    
    // Sync Profile
    try {
      const profile = getStoredProfile();
      console.log("[Admin] Syncing profile:", profile);
      await saveProfileToCloud(profile);
      results.profile = { ok: true };
    } catch (err: any) {
      results.profile = { ok: false, error: err?.message || String(err) };
      console.error("[Admin] Profile sync failed:", err);
    }

    // Sync About
    try {
      const about = getStoredAbout();
      console.log("[Admin] Syncing about:", { contentLen: about.content?.length, profileImage: about.profileImage?.substring(0, 50) });
      await saveAboutToCloud(about);
      results.about = { ok: true };
    } catch (err: any) {
      results.about = { ok: false, error: err?.message || String(err) };
      console.error("[Admin] About sync failed:", err);
    }

    // Sync Books
    try {
      console.log("[Admin] Syncing books:", { count: books.length });
      await saveBooksToCloud(books);
      results.books = { ok: true };
    } catch (err: any) {
      results.books = { ok: false, error: err?.message || String(err) };
      console.error("[Admin] Books sync failed:", err);
    }

    // Sync Inspirations
    try {
      const savedInspirations = localStorage.getItem("portfolio_inspirations");
      const inspirations = savedInspirations ? JSON.parse(savedInspirations) : [];
      console.log("[Admin] Syncing inspirations:", { count: inspirations.length });
      if (inspirations.length > 0) {
        await saveInspirationsToCloud(inspirations);
      }
      results.inspirations = { ok: true };
    } catch (err: any) {
      results.inspirations = { ok: false, error: err?.message || String(err) };
      console.error("[Admin] Inspirations sync failed:", err);
    }

    setIsSyncingAll(false);
    console.log("[Admin] Sync results:", results);

    const entries = Object.entries(results);
    const successCount = entries.filter(([, r]) => r.ok).length;
    const failures = entries.filter(([, r]) => !r.ok);
    
    if (successCount === entries.length) {
      setCloudStatus("connected");
      toast({
        title: "All Data Synced!",
        description: "Profile, About, Books, and Inspirations have been saved to the cloud.",
      });
    } else if (successCount > 0) {
      setCloudStatus("connected");
      const failNames = failures.map(([k]) => k).join(", ");
      const failReasons = failures.map(([k, r]) => `${k}: ${r.error}`).join("; ");
      console.error("[Admin] Partial sync failures:", failReasons);
      toast({
        title: "Partial Sync",
        description: `${successCount}/${entries.length} synced. Failed: ${failNames}. Check console for details.`,
      });
    } else {
      setCloudStatus("error");
      const firstError = failures[0]?.[1]?.error || "Unknown error";
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: `${firstError}. Open browser console (F12) for full details.`,
      });
    }
  };

  // Load ALL data from cloud to localStorage
  const handleLoadFromCloud = async () => {
    setIsLoadingFromCloud(true);
    console.log("[Admin] Loading all data from cloud...");
    
    const results: Record<string, { ok: boolean; error?: string }> = {};
    let anyDataLoaded = false;
    
    // Load Profile
    try {
      const profileData = await fetchProfile();
      console.log("[Admin] Profile loaded:", profileData);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profileData));
      window.dispatchEvent(new Event("profile-updated"));
      results.profile = { ok: true };
      anyDataLoaded = true;
    } catch (err: any) {
      results.profile = { ok: false, error: err?.message || String(err) };
      console.error("[Admin] Profile load failed:", err);
    }

    // Load About
    try {
      const aboutData = await fetchAbout();
      console.log("[Admin] About loaded:", aboutData);
      localStorage.setItem(STORAGE_KEYS.ABOUT, JSON.stringify(aboutData));
      window.dispatchEvent(new Event("about-updated"));
      results.about = { ok: true };
      anyDataLoaded = true;
    } catch (err: any) {
      results.about = { ok: false, error: err?.message || String(err) };
      console.error("[Admin] About load failed:", err);
    }

    // Load Books
    try {
      const booksData = await fetchBooks();
      console.log("[Admin] Books loaded:", { count: booksData.length });
      if (booksData && booksData.length > 0) {
        setBooks(booksData);
        localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(booksData));
        anyDataLoaded = true;
      }
      results.books = { ok: true };
    } catch (err: any) {
      results.books = { ok: false, error: err?.message || String(err) };
      console.error("[Admin] Books load failed:", err);
    }

    // Load Inspirations
    try {
      const inspirationsData = await fetchInspirations();
      console.log("[Admin] Inspirations loaded:", { count: inspirationsData.length });
      if (inspirationsData && inspirationsData.length > 0) {
        localStorage.setItem("portfolio_inspirations", JSON.stringify(inspirationsData));
        window.dispatchEvent(new Event("inspirations-updated"));
        anyDataLoaded = true;
      }
      results.inspirations = { ok: true };
    } catch (err: any) {
      results.inspirations = { ok: false, error: err?.message || String(err) };
      console.error("[Admin] Inspirations load failed:", err);
    }

    setIsLoadingFromCloud(false);
    console.log("[Admin] Load results:", results);

    const entries = Object.entries(results);
    const successCount = entries.filter(([, r]) => r.ok).length;
    const failures = entries.filter(([, r]) => !r.ok);
    
    if (successCount > 0) {
      setCloudStatus("connected");
      toast({
        title: "Loaded from Cloud",
        description: `${successCount}/${entries.length} items loaded. Local data has been updated.`,
      });
      if (anyDataLoaded) {
        window.location.reload();
      }
    } else {
      setCloudStatus("error");
      const firstError = failures[0]?.[1]?.error || "Unknown error";
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: `${firstError}. Open browser console (F12) for full details.`,
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
      saveBooksToCloud(reorderedBooks).catch((err) =>
        console.error("[Admin] Book reorder sync failed:", err)
      );
      
      toast({
        title: "Order Updated",
        description: "Book order saved and synced to cloud.",
      });
    }
  };

  const handleInspirationDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = inspirations.findIndex((i) => i.id === active.id);
      const newIndex = inspirations.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(inspirations, oldIndex, newIndex);
      setInspirations(reordered);
      localStorage.setItem("portfolio_inspirations", JSON.stringify(reordered));
      window.dispatchEvent(new Event("inspirations-updated"));
    }
  };

  const handleDeleteInspiration = (id: string) => {
    const updated = inspirations.filter((i) => i.id !== id);
    setInspirations(updated);
    localStorage.setItem("portfolio_inspirations", JSON.stringify(updated));
    window.dispatchEvent(new Event("inspirations-updated"));
    toast({ title: "Removed", description: "Inspiration deleted." });
  };

  const handleDeleteBook = (id: string) => {
    const updatedBooks = books.filter((book) => book.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(updatedBooks));
    saveBooksToCloud(updatedBooks).catch((err) =>
      console.error("[Admin] Book cloud sync failed:", err)
    );
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
                    variant={activeTab === "inspirations" ? "default" : "outline"}
                    onClick={() => setActiveTab("inspirations")}
                    className="gap-2"
                    size="sm"
                  >
                    <Sparkles className="w-4 h-4" /> Inspirations
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
                  <div className="flex items-center gap-1 px-2" title={cloudDiagnostic || undefined}>
                    {cloudStatus === "connected" && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                    {cloudStatus === "error" && (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                    {cloudStatus === "misconfigured" && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                    {cloudStatus === "unknown" && (
                      <Cloud className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setIsLoggedIn(false); localStorage.removeItem("portfolio_admin_logged_in"); }}>Logout</Button>
               </div>
            </div>
            
            {cloudDiagnostic && (
              <div className="mb-6 p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-600 dark:text-yellow-400">Supabase Configuration Issue</p>
                  <p className="text-muted-foreground mt-1">{cloudDiagnostic}</p>
                  <p className="text-muted-foreground mt-1">
                    Update your <code className="px-1.5 py-0.5 bg-muted rounded text-xs">.env</code> file with your Supabase project credentials, then restart the dev server.
                  </p>
                </div>
              </div>
            )}

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
               
               {activeTab === "inspirations" && (
                 <Card className="border-primary/10 shadow-lg">
                    <CardHeader className="bg-muted/20 border-b border-border/40">
                       <CardTitle>Inspirations</CardTitle>
                       <CardDescription>Curate poems, essays, and art that inspire you.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                       <InspirationsEditor />
                    </CardContent>
                 </Card>
               )}
            </div>

            {/* Inspirations Arrange Section */}
            {activeTab === "inspirations" && inspirations.length > 0 && (
              <div className="mt-10 border-t border-border/40 pt-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-muted-foreground">
                      Arrange ({inspirations.length})
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Drag rows to reorder how they appear on the page
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground items-center">
                    {Object.entries(INSPIRATION_COLORS).map(([type, cls]) => {
                      const Icon = INSPIRATION_ICONS[type as keyof typeof INSPIRATION_ICONS];
                      return (
                        <span key={type} className={`flex items-center gap-1 px-2 py-0.5 rounded font-bold uppercase tracking-wider ${cls}`}>
                          <Icon className="w-3 h-3" />{type}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleInspirationDragEnd}
                >
                  <SortableContext
                    items={inspirations.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-1.5">
                      {inspirations.map((item) => (
                        <SortableInspirationRow
                          key={item.id}
                          item={item}
                          onDelete={handleDeleteInspiration}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}

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
