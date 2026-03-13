import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Cloud, CloudOff, FileText, Eye, Image as ImageIcon, Plus, Trash2, Check, Loader2, Save } from "lucide-react";
import { About, getStoredAbout, saveAbout, defaultAbout } from "@/lib/data";
import { saveAboutToCloud } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "./RichTextEditor";

interface AboutEditorProps {
  onSave?: (about: About) => void;
}

type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

export default function AboutEditor({ onSave }: AboutEditorProps) {
  const [about, setAbout] = useState<About>(defaultAbout);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  
  // Refs for debouncing and tracking initial load
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);
  const skipNextAutoSave = useRef(false);

  // Load initial data
  useEffect(() => {
    setAbout(getStoredAbout());
    // Mark initial load complete after a tick
    setTimeout(() => {
      isInitialLoad.current = false;
    }, 100);
  }, []);

  // Auto-save function
  const performAutoSave = useCallback(async (dataToSave: About) => {
    setAutoSaveStatus("saving");
    
    try {
      await saveAbout(dataToSave);
      window.dispatchEvent(new Event("about-updated"));
      onSave?.(dataToSave);
      setAutoSaveStatus("saved");
      setLastSaved(new Date());
      
      // Reset status after 2 seconds
      setTimeout(() => setAutoSaveStatus("idle"), 2000);
    } catch (error) {
      setAutoSaveStatus("error");
      toast({
        variant: "destructive",
        title: "Auto-save Failed",
        description: error instanceof Error ? error.message : "Could not save. Try using smaller images.",
      });
    }
  }, [onSave, toast]);

  // Debounced auto-save when about changes
  useEffect(() => {
    // Skip auto-save on initial load
    if (isInitialLoad.current) return;
    
    // Skip auto-save when reset flag is set (e.g., after clicking Reset)
    if (skipNextAutoSave.current) {
      skipNextAutoSave.current = false;
      return;
    }
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for auto-save (debounce 1 second)
    saveTimeoutRef.current = setTimeout(() => {
      performAutoSave(about);
    }, 1000);
    
    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [about, performAutoSave]);

  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    
    try {
      console.log("[AboutEditor] Syncing to Supabase...");
      await saveAboutToCloud(about);
      setLastSynced(new Date());
      toast({
        title: "Synced to Cloud",
        description: "Your about section has been saved to Supabase.",
      });
    } catch (error: any) {
      const msg = error?.message || String(error);
      console.error("[AboutEditor] Sync failed:", error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: `Could not sync to Supabase: ${msg}`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleReset = () => {
    skipNextAutoSave.current = true;  // Prevent auto-save from saving default content
    setAbout(defaultAbout);
    toast({
      title: "Reset to Default",
      description: "About section has been reset. Changes are not saved until you edit again.",
    });
  };

  // Manual save to localStorage
  const handleSaveLocally = async () => {
    setIsSaving(true);
    try {
      await saveAbout(about);
      window.dispatchEvent(new Event("about-updated"));
      onSave?.(about);
      setLastSaved(new Date());
      toast({
        title: "About Saved",
        description: "Your about section has been saved locally.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Could not save.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAbout({ ...about, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl) {
      setAbout({ ...about, gallery: [...about.gallery, newGalleryUrl] });
      setNewGalleryUrl("");
    }
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAbout({ ...about, gallery: [...about.gallery, reader.result as string] });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setAbout({ 
      ...about, 
      gallery: about.gallery.filter((_, i) => i !== index) 
    });
  };

  // Auto-save status indicator
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

  return (
    <div className="space-y-6">
      {/* Auto-save indicator bar */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-2">
          {renderAutoSaveStatus()}
        </div>
        <span className="text-muted-foreground/60">Auto-save enabled</span>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="content" className="gap-2">
            <FileText className="w-3 h-3" /> Content
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            <ImageIcon className="w-3 h-3" /> Images
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="w-3 h-3" /> Preview
          </TabsTrigger>
        </TabsList>
        
        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
              About Content
            </label>
            <RichTextEditor
              content={about.content}
              onChange={(html) => setAbout({ ...about, content: html })}
              placeholder="Write about yourself, your interests, your work..."
            />
          </div>
        </TabsContent>
        
        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          {/* Profile Image */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Profile Image
            </label>
            <div className="flex gap-4 items-start">
              <div className="w-32 h-32 bg-muted rounded-sm overflow-hidden border border-border">
                {about.profileImage && (
                  <img 
                    src={about.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-contain p-2"
                  />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Or enter a URL:
                </p>
                <Input
                  placeholder="Image URL..."
                  value={about.profileImage.startsWith("data:") ? "" : about.profileImage}
                  onChange={(e) => setAbout({ ...about, profileImage: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="space-y-3 border-t border-border/40 pt-6">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Gallery Images
            </label>
            
            {/* Add new image */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter image URL..."
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddGalleryImage()}
              />
              <Button onClick={handleAddGalleryImage} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button size="sm" variant="outline">
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Gallery preview */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {about.gallery.map((image, index) => (
                <div 
                  key={index} 
                  className="aspect-square bg-muted rounded-sm overflow-hidden relative group"
                >
                  <img 
                    src={image} 
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Preview Tab */}
        <TabsContent value="preview">
          <Card className="bg-card">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-40 h-40 shrink-0 relative">
                  <div className="absolute inset-0 bg-secondary/10 rounded-sm -rotate-3" />
                  <img 
                    src={about.profileImage} 
                    alt="Profile" 
                    className="relative w-full h-full object-contain bg-background rounded-sm shadow-lg p-2"
                  />
                </div>
                
                <div className="flex-1 space-y-4">
                  <h1 className="text-3xl font-serif font-bold text-primary">About</h1>
                  <div 
                    className="prose prose-neutral dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: about.content || "<p>Your about content will appear here...</p>" }}
                  />
                </div>
              </div>

              {about.gallery.length > 0 && (
                <div className="border-t border-border/40 pt-8 mt-8">
                  <h2 className="text-xl font-serif font-bold text-primary mb-4">Gallery</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {about.gallery.map((image, index) => (
                      <div key={index} className="aspect-square bg-muted rounded-sm overflow-hidden">
                        <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {lastSynced ? (
            <>
              <Cloud className="w-3 h-3 text-green-500" />
              <span>Last synced: {lastSynced.toLocaleTimeString()}</span>
            </>
          ) : (
            <>
              <CloudOff className="w-3 h-3" />
              <span>Not synced to cloud</span>
            </>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSyncToSupabase}
            disabled={isSyncing}
          >
            <Cloud className="w-4 h-4 mr-2" /> 
            {isSyncing ? "Syncing..." : "Sync to Cloud"}
          </Button>
          <Button onClick={handleSaveLocally} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" /> 
            {isSaving ? "Saving..." : "Save Locally"}
          </Button>
        </div>
      </div>
    </div>
  );
}
