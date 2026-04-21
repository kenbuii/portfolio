import { useState, useEffect, useCallback, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, Trash2, Quote, FileText, Palette, Loader2, Check, Pencil, 
  Image as ImageIcon, Save, Search, BookOpen, ExternalLink, MessageSquareQuote,
  GripVertical
} from "lucide-react";
import { Inspiration, fetchInspirations, saveInspirationsToCloud, saveInspirationToCloud, deleteInspirationFromCloud } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "portfolio_inspirations";

type InspirationFormData = Omit<Inspiration, "id" | "created_at" | "updated_at">;

const defaultFormData: InspirationFormData = {
  type: "poem",
  title: "",
  content: "",
  attribution: "",
  source: "",
  year: "",
  blurb: "",
  size: "medium",
  rotation: 0,
  featured: false,
  fontSize: 1,
  imageUrl: "",
  link: "",
};

interface PoemSearchResult {
  title: string;
  author: string;
  content: string;
  source: string;
  tags?: string;
}

type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

interface InspirationsEditorProps {
  onSave?: (inspirations: Inspiration[]) => void;
}

const typeIcons = {
  poem: Quote,
  essay: FileText,
  art: Palette,
  quote: MessageSquareQuote,
};

const typeLabels = {
  poem: "Poem",
  essay: "Essay",
  art: "Art",
  quote: "Quote",
};

function SortableEditorRow({
  item,
  onEdit,
  onDelete,
}: {
  item: Inspiration;
  onEdit: () => void;
  onDelete: () => void;
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

  const Icon = typeIcons[item.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30 group ${
        isDragging ? "z-50 shadow-lg ring-2 ring-secondary/30" : ""
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0 touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <Icon className="w-4 h-4 text-secondary shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">
            {item.title || item.content.slice(0, 50)}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {item.attribution}
            {item.year && ` (${item.year})`}
          </p>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="ghost" onClick={onEdit}>
          <Pencil className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export default function InspirationsEditor({ onSave }: InspirationsEditorProps) {
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<InspirationFormData>(defaultFormData);
  const [activeType, setActiveType] = useState<"poem" | "essay" | "art" | "quote">("poem");
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  
  const [poemSearchQuery, setPoemSearchQuery] = useState("");
  const [poemSearchResults, setPoemSearchResults] = useState<PoemSearchResult[]>([]);
  const [poemSearchLoading, setPoemSearchLoading] = useState(false);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const poemSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // Load from localStorage first, then override with Supabase data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setInspirations(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved inspirations");
      }
    }
    fetchInspirations()
      .then((data) => {
        if (data?.length > 0) {
          setInspirations(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          window.dispatchEvent(new Event("inspirations-updated"));
        }
      })
      .catch((err) => console.error("[InspirationsEditor] Failed to fetch from Supabase:", err.message))
      .finally(() => {
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 100);
      });
  }, []);

  // Auto-save function — saves locally then syncs to Supabase
  const performAutoSave = useCallback(async (data: Inspiration[]) => {
    setAutoSaveStatus("saving");
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event("inspirations-updated"));
      onSave?.(data);

      // Sync to Supabase in background
      if (data.length > 0) {
        saveInspirationsToCloud(data).catch((err) =>
          console.error("[InspirationsEditor] Cloud sync failed:", err)
        );
      }

      setAutoSaveStatus("saved");
      setLastSaved(new Date());
      
      setTimeout(() => setAutoSaveStatus("idle"), 2000);
    } catch (error) {
      setAutoSaveStatus("error");
      toast({
        variant: "destructive",
        title: "Auto-save Failed",
        description: "Could not save inspirations.",
      });
    }
  }, [onSave, toast]);

  // Debounced auto-save when inspirations change
  useEffect(() => {
    if (isInitialLoad.current) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      performAutoSave(inspirations);
    }, 1000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [inspirations, performAutoSave]);

  const handleOpenDialog = (type: "poem" | "essay" | "art" | "quote", inspiration?: Inspiration) => {
    if (inspiration) {
      setEditingId(inspiration.id);
      setFormData({
        type: inspiration.type,
        title: inspiration.title,
        content: inspiration.content,
        attribution: inspiration.attribution,
        source: inspiration.source || "",
        year: inspiration.year || "",
        blurb: inspiration.blurb || "",
        size: inspiration.size || "medium",
        rotation: inspiration.rotation || 0,
        featured: inspiration.featured || false,
        fontSize: inspiration.fontSize || 1,
        imageUrl: inspiration.imageUrl || "",
        link: inspiration.link || "",
      });
      setActiveType(inspiration.type);
    } else {
      setEditingId(null);
      setFormData({ ...defaultFormData, type });
      setActiveType(type);
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const hasContent = !!formData.content || (formData.type === "poem" && !!formData.imageUrl);
    const titleRequired = formData.type !== "quote";
    if ((titleRequired && !formData.title) || !hasContent || !formData.attribution) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: formData.type === "poem"
          ? "Title, attribution, and either poem text or an image are required."
          : formData.type === "quote"
          ? "Quote text and attribution are required."
          : "Title, content, and attribution are required.",
      });
      return;
    }

    if (editingId) {
      // Update existing
      setInspirations(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, ...formData, updated_at: new Date().toISOString() }
          : item
      ));
      toast({ title: "Updated", description: "Inspiration has been updated." });
    } else {
      // Create new
      const newInspiration: Inspiration = {
        ...formData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      setInspirations(prev => [newInspiration, ...prev]);
      toast({ title: "Added", description: "New inspiration has been added." });
    }

    setIsDialogOpen(false);
    setFormData(defaultFormData);
    setEditingId(null);
    setPoemSearchQuery("");
    setPoemSearchResults([]);
  };

  const handleDelete = (id: string) => {
    setInspirations(prev => prev.filter(item => item.id !== id));
    deleteInspirationFromCloud(id).catch((err) =>
      console.error("[InspirationsEditor] Cloud delete failed:", err)
    );
    toast({ title: "Deleted", description: "Inspiration has been removed." });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, content: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePoemImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePoemSearch = useCallback((query: string) => {
    setPoemSearchQuery(query);
    
    if (poemSearchTimeoutRef.current) {
      clearTimeout(poemSearchTimeoutRef.current);
    }

    if (query.trim().length < 2) {
      setPoemSearchResults([]);
      return;
    }

    poemSearchTimeoutRef.current = setTimeout(async () => {
      setPoemSearchLoading(true);
      try {
        const q = query.trim();
        
        const serverSearch = fetch(`/api/poems/search?q=${encodeURIComponent(q)}`)
          .then(r => r.ok ? r.json() : { results: [] })
          .then(d => (d.results || []) as PoemSearchResult[])
          .catch(() => [] as PoemSearchResult[]);

        const poetryDbTitle = fetch(`https://poetrydb.org/title/${encodeURIComponent(q)}`)
          .then(r => r.ok ? r.json() : [])
          .then(data => {
            if (!Array.isArray(data)) return [];
            return data.slice(0, 8).map((p: any) => ({
              title: p.title || "",
              author: p.author || "",
              content: (p.lines || []).join("\n"),
              source: "PoetryDB",
            }));
          })
          .catch(() => [] as PoemSearchResult[]);

        const poetryDbAuthor = fetch(`https://poetrydb.org/author/${encodeURIComponent(q)}`)
          .then(r => r.ok ? r.json() : [])
          .then(data => {
            if (!Array.isArray(data)) return [];
            return data.slice(0, 8).map((p: any) => ({
              title: p.title || "",
              author: p.author || "",
              content: (p.lines || []).join("\n"),
              source: "PoetryDB",
            }));
          })
          .catch(() => [] as PoemSearchResult[]);

        const [serverResults, titleResults, authorResults] = await Promise.all([
          serverSearch, poetryDbTitle, poetryDbAuthor,
        ]);

        const seen = new Set<string>();
        const combined: PoemSearchResult[] = [];
        for (const r of [...serverResults, ...titleResults, ...authorResults]) {
          const key = `${r.title.toLowerCase()}|${r.author.toLowerCase()}`;
          if (!seen.has(key) && r.title) {
            seen.add(key);
            combined.push(r);
          }
          if (combined.length >= 20) break;
        }
        
        setPoemSearchResults(combined);
      } catch (error) {
        console.error("Poem search failed:", error);
        setPoemSearchResults([]);
      } finally {
        setPoemSearchLoading(false);
      }
    }, 400);
  }, []);

  const handleSelectPoem = (result: PoemSearchResult) => {
    setFormData(prev => ({
      ...prev,
      title: result.title,
      content: result.content,
      attribution: result.author,
      source: result.source,
    }));
    setPoemSearchResults([]);
    setPoemSearchQuery("");
  };

  const renderAutoSaveStatus = () => {
    switch (autoSaveStatus) {
      case "saving":
        return (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Saving...</span>
          </span>
        );
      case "saved":
        return (
          <span className="flex items-center gap-1.5 text-green-600">
            <Check className="w-3 h-3" />
            <span>Saved</span>
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-1.5 text-destructive">
            <span>Save failed</span>
          </span>
        );
      default:
        return lastSaved ? (
          <span className="text-muted-foreground">
            Last saved: {lastSaved.toLocaleTimeString()}
          </span>
        ) : null;
    }
  };

  const filteredInspirations = (type: "poem" | "essay" | "art" | "quote") => 
    inspirations.filter(item => item.type === type);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleTypeReorder = (type: "poem" | "essay" | "art" | "quote", event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setInspirations(prev => {
      const typeItems = prev.filter(i => i.type === type);
      const others = prev.filter(i => i.type !== type);
      const oldIdx = typeItems.findIndex(i => i.id === active.id);
      const newIdx = typeItems.findIndex(i => i.id === over.id);
      const reordered = arrayMove(typeItems, oldIdx, newIdx);
      // Rebuild preserving overall cross-type order positions
      const result: Inspiration[] = [];
      let typePtr = 0;
      for (const item of prev) {
        if (item.type === type) {
          result.push(reordered[typePtr++]);
        } else {
          result.push(item);
        }
      }
      return result;
    });
  };

  return (
    <div className="space-y-6">
      {/* Auto-save indicator */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-2">
          {renderAutoSaveStatus()}
        </div>
        <span className="text-muted-foreground/60">Auto-save enabled</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => handleOpenDialog("poem")} variant="outline" className="gap-2">
          <Quote className="w-4 h-4" />
          Add Poem
        </Button>
        <Button onClick={() => handleOpenDialog("essay")} variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Add Essay
        </Button>
        <Button onClick={() => handleOpenDialog("quote")} variant="outline" className="gap-2">
          <MessageSquareQuote className="w-4 h-4" />
          Add Quote
        </Button>
        <Button onClick={() => handleOpenDialog("art")} variant="outline" className="gap-2">
          <Palette className="w-4 h-4" />
          Add Art
        </Button>
      </div>

      {/* Items list by type */}
      <Tabs defaultValue="poem" className="w-full">
        <TabsList>
          <TabsTrigger value="poem" className="gap-2">
            <Quote className="w-3 h-3" /> Poems ({filteredInspirations("poem").length})
          </TabsTrigger>
          <TabsTrigger value="essay" className="gap-2">
            <FileText className="w-3 h-3" /> Essays ({filteredInspirations("essay").length})
          </TabsTrigger>
          <TabsTrigger value="quote" className="gap-2">
            <MessageSquareQuote className="w-3 h-3" /> Quotes ({filteredInspirations("quote").length})
          </TabsTrigger>
          <TabsTrigger value="art" className="gap-2">
            <Palette className="w-3 h-3" /> Art ({filteredInspirations("art").length})
          </TabsTrigger>
        </TabsList>

        {(["poem", "essay", "quote", "art"] as const).map(type => {
          const items = filteredInspirations(type);
          return (
            <TabsContent key={type} value={type} className="space-y-2 mt-4">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No {type}s yet. Click "Add {typeLabels[type]}" to create one.
                </p>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleTypeReorder(type, e)}
                >
                  <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1.5">
                      {items.map(item => (
                        <SortableEditorRow
                          key={item.id}
                          item={item}
                          onEdit={() => handleOpenDialog(item.type, item)}
                          onDelete={() => handleDelete(item.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingId ? "Edit" : "Add"} {typeLabels[activeType]}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {activeType === "poem" && (
              <div className="space-y-3 pb-4 border-b border-border/30">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-secondary" />
                  <Label className="text-sm font-semibold">Search Poetry Database</Label>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={poemSearchQuery}
                    onChange={e => handlePoemSearch(e.target.value)}
                    placeholder="Search by title or poet name..."
                    className="pl-9"
                  />
                  {poemSearchLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {poemSearchResults.length > 0 && (
                  <div className="max-h-64 overflow-y-auto rounded-lg border border-border/50 divide-y divide-border/30 bg-card">
                    {poemSearchResults.map((result, i) => (
                      <button
                        key={`${result.title}-${result.author}-${i}`}
                        type="button"
                        className="w-full text-left p-3 hover:bg-muted/50 transition-colors"
                        onClick={() => handleSelectPoem(result)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{result.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {result.author}
                            </p>
                          </div>
                          <span className={cn(
                            "shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                            result.source === "PoetryDB"
                              ? "bg-blue-500/10 text-blue-600"
                              : "bg-amber-500/10 text-amber-600"
                          )}>
                            {result.source === "PoetryDB" ? "PoetryDB" : "PF"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground/60 mt-1 line-clamp-2 whitespace-pre-line">
                          {result.content.split("\n").slice(0, 2).join("\n")}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                {poemSearchQuery.length >= 2 && !poemSearchLoading && poemSearchResults.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    No poems found. You can enter details manually below.
                  </p>
                )}
              </div>
            )}

            {activeType !== "quote" && (
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={activeType === "poem" ? "Poem title..." : "Title..."}
                />
              </div>
            )}

            {/* Attribution */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="attribution">Author/Artist</Label>
                <Input
                  id="attribution"
                  value={formData.attribution}
                  onChange={e => setFormData(prev => ({ ...prev, attribution: e.target.value }))}
                  placeholder="Name..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={e => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="1913"
                />
              </div>
            </div>

            {/* Source */}
            <div className="space-y-2">
              <Label htmlFor="source">Source (optional)</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))}
                placeholder="Book title, publication, museum..."
              />
            </div>

            {activeType === "essay" && (
              <div className="space-y-2">
                <Label htmlFor="link" className="flex items-center gap-1.5">
                  Link
                  <span className="text-xs text-muted-foreground font-normal">(optional — URL to the full essay)</span>
                </Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link || ""}
                  onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="content">
                {activeType === "art" ? "Image" : activeType === "quote" ? "Quote Text" : "Content"}
              </Label>
              {activeType === "art" ? (
                <div className="space-y-3">
                  {formData.content && (
                    <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={formData.content} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      id="content"
                      value={formData.content.startsWith("data:") ? "" : formData.content}
                      onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Image URL..."
                      className="flex-1"
                    />
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Button variant="outline">
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder={
                    activeType === "poem" ? "Full poem text..." :
                    activeType === "quote" ? "The quote text..." :
                    "Excerpt or passage..."
                  }
                  rows={Math.max(activeType === "quote" ? 3 : 6, Math.min(20, formData.content.split("\n").length + 2))}
                  className="font-serif"
                />
              )}
            </div>

            {activeType === "poem" && (
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  Poem Image (optional)
                </Label>
                <p className="text-xs text-muted-foreground -mt-1">
                  Upload a scan or screenshot. When set, this image is shown instead of text.
                </p>
                {formData.imageUrl && (
                  <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border/50">
                    <img
                      src={formData.imageUrl}
                      alt="Poem image"
                      className="w-full h-auto object-contain max-h-80"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={(formData.imageUrl || "").startsWith("data:") ? "" : (formData.imageUrl || "")}
                    onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Image URL..."
                    className="flex-1"
                  />
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePoemImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Button type="button" variant="outline">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Blurb */}
            <div className="space-y-2">
              <Label htmlFor="blurb">Your Take (optional)</Label>
              <Textarea
                id="blurb"
                value={formData.blurb}
                onChange={e => setFormData(prev => ({ ...prev, blurb: e.target.value }))}
                placeholder="Why does this inspire you? What does it mean to you?"
                rows={3}
              />
            </div>

            <div className="border-t border-border/30 pt-4 space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Display Options
              </Label>
              
              {activeType !== "art" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Font Size</Label>
                    <span className="text-xs text-muted-foreground font-mono">{(formData.fontSize || 1).toFixed(2)}x</span>
                  </div>
                  <Slider
                    value={[formData.fontSize || 1]}
                    onValueChange={([value]) => setFormData(prev => ({ ...prev, fontSize: value }))}
                    min={0.7}
                    max={1.5}
                    step={0.05}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground/50">
                    <span>Smaller</span>
                    <span>Default</span>
                    <span>Larger</span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Rotation: {formData.rotation}°</Label>
                  <Slider
                    value={[formData.rotation || 0]}
                    onValueChange={([value]) => setFormData(prev => ({ ...prev, rotation: value }))}
                    min={-3}
                    max={3}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Featured</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={checked => setFormData(prev => ({ ...prev, featured: checked }))}
                    />
                    <span className="text-xs text-muted-foreground">Pin to top</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              {editingId ? "Update" : "Add"} {typeLabels[activeType]}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
