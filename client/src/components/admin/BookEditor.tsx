import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Star, Loader2, Book as BookIcon, Save, Upload, ImagePlus, Link, X, Edit3, Trash2 } from "lucide-react";
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
  onUpdate?: (updatedBook: Book) => void;
  onDelete?: (bookId: string) => void;
}

export default function BookEditor({ initialBooks, onSave, onUpdate, onDelete }: BookEditorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GoogleBookVolume[]>([]);
  const [selectedBook, setSelectedBook] = useState<Partial<Book> | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [customCover, setCustomCover] = useState<string | null>(null);
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { register, handleSubmit, reset, setValue, watch } = useForm<Book>({
    defaultValues: {
      rating: 5,
      review: "",
      color: "#123524"
    }
  });

  const rating = watch("rating");

  // Populate form when editing existing book
  useEffect(() => {
    if (editingBook) {
      setValue("id", editingBook.id);
      setValue("title", editingBook.title);
      setValue("author", editingBook.author);
      setValue("description", editingBook.description);
      setValue("synopsis", editingBook.synopsis);
      setValue("cover", editingBook.cover);
      setValue("rating", editingBook.rating);
      setValue("review", editingBook.review);
      setValue("link", editingBook.link);
      setValue("color", editingBook.color);
      setCustomCover(null);
    }
  }, [editingBook, setValue]);

  const searchBooks = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(searchQuery)}`);
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
    setEditingBook(null);
    setValue("title", bookData.title);
    setValue("author", bookData.author);
    setValue("description", bookData.description);
    setValue("synopsis", bookData.synopsis);
    setValue("cover", bookData.cover);
    setValue("id", crypto.randomUUID());
    
    setSearchResults([]);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setSelectedBook(null);
    setSearchResults([]);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setCustomCover(base64);
        setValue("cover", base64);
        if (selectedBook) {
          setSelectedBook(prev => prev ? { ...prev, cover: base64 } : prev);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUrl = () => {
    if (coverUrlInput) {
      setCustomCover(coverUrlInput);
      setValue("cover", coverUrlInput);
      if (selectedBook) {
        setSelectedBook(prev => prev ? { ...prev, cover: coverUrlInput } : prev);
      }
      setCoverUrlInput("");
      setShowUrlInput(false);
      toast({
        title: "Cover Updated",
        description: "Cover image URL has been applied.",
      });
    }
  };

  const onSubmit = (data: Book) => {
    if (editingBook && onUpdate) {
      onUpdate(data);
      toast({
        title: "Book Updated",
        description: `${data.title} has been updated.`,
      });
    } else {
      onSave(data);
      toast({
        title: "Book Saved",
        description: `${data.title} has been added to your bookshelf.`,
      });
    }
    setSelectedBook(null);
    setEditingBook(null);
    setCustomCover(null);
    reset();
    setSearchQuery("");
  };

  const handleDelete = () => {
    if (editingBook && onDelete) {
      onDelete(editingBook.id);
      toast({
        title: "Book Deleted",
        description: `${editingBook.title} has been removed from your bookshelf.`,
      });
      setEditingBook(null);
      reset();
    }
  };

  const cancelEdit = () => {
    setSelectedBook(null);
    setEditingBook(null);
    setCustomCover(null);
    setShowUrlInput(false);
    reset();
  };

  const currentCover = customCover || (editingBook?.cover) || (selectedBook?.cover);

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

      {/* Existing Books Shelf - Click to Edit */}
      {!selectedBook && !editingBook && initialBooks.length > 0 && (
        <div className="border rounded-lg p-4 bg-muted/10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Your Books (Click to Edit)
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {initialBooks.map((book) => (
              <div 
                key={book.id} 
                className="relative aspect-[2/3] bg-muted rounded-sm overflow-hidden cursor-pointer group"
                onClick={() => handleEditBook(book)}
              >
                <img 
                  src={book.cover} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor Form - For New or Editing */}
      {(selectedBook || editingBook) && (
        <Card className="animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {editingBook ? "Edit Book" : "Add New Book"}
              </h3>
              <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-6">
                <div className="w-32 shrink-0 space-y-2">
                  <div className="aspect-[2/3] rounded-md overflow-hidden border border-border shadow-sm bg-muted relative group">
                     {currentCover ? (
                       <img src={currentCover} alt="Cover" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                         <BookIcon className="w-8 h-8" />
                       </div>
                     )}
                     {/* Upload overlay */}
                     <div 
                       className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                       onClick={() => fileInputRef.current?.click()}
                     >
                       <Upload className="w-6 h-6 text-white mb-1" />
                       <span className="text-white text-xs">Upload Cover</span>
                     </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <div className="flex gap-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs px-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="w-3 h-3" />
                    </Button>
                    <Button 
                      type="button" 
                      variant={showUrlInput ? "secondary" : "outline"}
                      size="sm" 
                      className="flex-1 text-xs px-2"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                    >
                      <Link className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {/* URL Input */}
                  {showUrlInput && (
                    <div className="space-y-1">
                      <Input 
                        placeholder="Image URL..." 
                        value={coverUrlInput}
                        onChange={(e) => setCoverUrlInput(e.target.value)}
                        className="text-xs h-8"
                      />
                      <Button 
                        type="button" 
                        size="sm" 
                        className="w-full text-xs h-7"
                        onClick={handleCoverUrl}
                        disabled={!coverUrlInput}
                      >
                        Apply URL
                      </Button>
                    </div>
                  )}
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

              <div className="flex justify-between items-center pt-4">
                <div>
                  {editingBook && onDelete && (
                    <Button type="button" variant="destructive" size="sm" onClick={handleDelete} className="gap-1">
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                  <Button type="submit" className="gap-2">
                    <Save className="w-4 h-4" /> {editingBook ? "Update Book" : "Save to Bookshelf"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
