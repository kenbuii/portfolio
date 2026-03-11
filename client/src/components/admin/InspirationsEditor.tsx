import { useState, useEffect, useCallback, useRef } from "react";
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
  Image as ImageIcon, Save
} from "lucide-react";
import { Inspiration } from "@/lib/supabase";
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
};

type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

interface InspirationsEditorProps {
  onSave?: (inspirations: Inspiration[]) => void;
}

const typeIcons = {
  poem: Quote,
  essay: FileText,
  art: Palette,
};

const typeLabels = {
  poem: "Poem",
  essay: "Essay",
  art: "Art",
};

export default function InspirationsEditor({ onSave }: InspirationsEditorProps) {
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<InspirationFormData>(defaultFormData);
  const [activeType, setActiveType] = useState<"poem" | "essay" | "art">("poem");
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setInspirations(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved inspirations");
      }
    }
    setTimeout(() => {
      isInitialLoad.current = false;
    }, 100);
  }, []);

  // Auto-save function
  const performAutoSave = useCallback(async (data: Inspiration[]) => {
    setAutoSaveStatus("saving");
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event("inspirations-updated"));
      onSave?.(data);
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

  const handleOpenDialog = (type: "poem" | "essay" | "art", inspiration?: Inspiration) => {
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
    if (!formData.title || !formData.content || !formData.attribution) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Title, content, and attribution are required.",
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
  };

  const handleDelete = (id: string) => {
    setInspirations(prev => prev.filter(item => item.id !== id));
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

  const filteredInspirations = (type: "poem" | "essay" | "art") => 
    inspirations.filter(item => item.type === type);

  return (
    <div className="space-y-6">
      {/* Auto-save indicator */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-2">
          {renderAutoSaveStatus()}
        </div>
        <span className="text-muted-foreground/60">Auto-save enabled</span>
      </div>

      {/* Add buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => handleOpenDialog("poem")} variant="outline" className="gap-2">
          <Quote className="w-4 h-4" />
          Add Poem
        </Button>
        <Button onClick={() => handleOpenDialog("essay")} variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Add Essay
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
          <TabsTrigger value="art" className="gap-2">
            <Palette className="w-3 h-3" /> Art ({filteredInspirations("art").length})
          </TabsTrigger>
        </TabsList>

        {(["poem", "essay", "art"] as const).map(type => (
          <TabsContent key={type} value={type} className="space-y-2 mt-4">
            {filteredInspirations(type).length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No {type}s yet. Click "Add {typeLabels[type]}" to create one.
              </p>
            ) : (
              filteredInspirations(type).map(item => {
                const Icon = typeIcons[item.type];
                return (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30 group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Icon className="w-4 h-4 text-secondary shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.attribution}
                          {item.year && ` (${item.year})`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(item.type, item)}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>
        ))}
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
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={activeType === "poem" ? "Poem title or first line..." : "Quote or excerpt title..."}
              />
            </div>

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

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">
                {activeType === "art" ? "Image" : "Content"}
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
                  placeholder={activeType === "poem" ? "Full poem text..." : "Quote or excerpt..."}
                  rows={6}
                  className="font-serif"
                />
              )}
            </div>

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

            {/* Display Options */}
            <div className="border-t border-border/30 pt-4 space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Display Options
              </Label>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Size */}
                <div className="space-y-2">
                  <Label className="text-sm">Size</Label>
                  <div className="flex gap-1">
                    {(["small", "medium", "large"] as const).map(size => (
                      <Button
                        key={size}
                        type="button"
                        size="sm"
                        variant={formData.size === size ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({ ...prev, size }))}
                        className="flex-1 text-xs"
                      >
                        {size.charAt(0).toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Rotation */}
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

                {/* Featured */}
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
