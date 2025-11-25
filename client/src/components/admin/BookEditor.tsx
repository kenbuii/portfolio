import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Star, Loader2, Book as BookIcon, Save } from "lucide-react";
import { Book } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

// Google Books API Type Definitions (Partial)
interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
  };
}

interface BookEditorProps {
  initialBooks: Book[];
  onSave: (newBook: Book) => void;
}

export default function BookEditor({ initialBooks, onSave }: BookEditorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GoogleBookVolume[]>([]);
  const [selectedBook, setSelectedBook] = useState<Partial<Book> | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, reset, setValue, watch } = useForm<Book>({
    defaultValues: {
      rating: 5,
      review: "",
      color: "#123524"
    }
  });

  const rating = watch("rating");

  const searchBooks = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch books from Google.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const selectBook = (volume: GoogleBookVolume) => {
    const bookData = {
      title: volume.volumeInfo.title,
      author: volume.volumeInfo.authors?.join(", ") || "Unknown Author",
      description: volume.volumeInfo.description || "No description available.",
      synopsis: volume.volumeInfo.description ? volume.volumeInfo.description.substring(0, 150) + "..." : "No synopsis.",
      cover: volume.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") || "",
    };
    
    setSelectedBook(bookData);
    setValue("title", bookData.title);
    setValue("author", bookData.author);
    setValue("description", bookData.description);
    setValue("synopsis", bookData.synopsis);
    setValue("cover", bookData.cover);
    setValue("id", crypto.randomUUID());
    
    setSearchResults([]); // Clear search results to show form
  };

  const onSubmit = (data: Book) => {
    onSave(data);
    toast({
      title: "Book Saved",
      description: `${data.title} has been added to your bookshelf.`,
    });
    setSelectedBook(null);
    reset();
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search Google Books..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            onKeyDown={(e) => e.key === "Enter" && searchBooks()}
          />
        </div>
        <Button onClick={searchBooks} disabled={isSearching}>
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      {/* Search Results Grid */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-2 border rounded-md bg-muted/10">
          {searchResults.map((volume) => (
            <div 
              key={volume.id} 
              className="flex flex-col gap-2 p-2 cursor-pointer hover:bg-muted rounded-md transition-colors group"
              onClick={() => selectBook(volume)}
            >
              <div className="aspect-[2/3] bg-muted relative overflow-hidden rounded-sm">
                {volume.volumeInfo.imageLinks?.thumbnail ? (
                  <img 
                    src={volume.volumeInfo.imageLinks.thumbnail.replace("http:", "https:")} 
                    alt={volume.volumeInfo.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <BookIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <p className="text-xs font-medium truncate">{volume.volumeInfo.title}</p>
            </div>
          ))}
        </div>
      )}

      {/* Editor Form */}
      {selectedBook && (
        <Card className="animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-6">
                <div className="w-32 shrink-0">
                  <div className="aspect-[2/3] rounded-md overflow-hidden border border-border shadow-sm bg-muted">
                     {selectedBook.cover && <img src={selectedBook.cover} alt="Cover" className="w-full h-full object-cover" />}
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</label>
                    <Input {...register("title")} className="font-serif text-lg font-bold" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Author</label>
                    <Input {...register("author")} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rating (1-5)</label>
                        <div className="flex items-center gap-2 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setValue("rating", star)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star 
                                className={`w-5 h-5 ${star <= rating ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`} 
                              />
                            </button>
                          ))}
                        </div>
                     </div>
                     <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Spine Color</label>
                        <div className="flex items-center gap-2 mt-2">
                           <Input type="color" {...register("color")} className="w-12 h-8 p-1" />
                           <span className="text-xs text-muted-foreground font-mono">{watch("color")}</span>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Synopsis (Short)</label>
                <Input {...register("synopsis")} className="mt-1" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Review</label>
                <Textarea 
                  {...register("review")} 
                  className="mt-1 min-h-[100px] font-serif" 
                  placeholder="Write your thoughts on this book..." 
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={() => setSelectedBook(null)}>Cancel</Button>
                <Button type="submit" className="gap-2">
                  <Save className="w-4 h-4" /> Save to Bookshelf
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
