import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, RefreshCw, Cloud, CloudOff, FileText, Eye } from "lucide-react";
import { Profile, getStoredProfile, saveProfile, defaultProfile } from "@/lib/data";
import { saveProfileToCloud } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "./RichTextEditor";

interface ProfileEditorProps {
  onSave?: (profile: Profile) => void;
}

export default function ProfileEditor({ onSave }: ProfileEditorProps) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setProfile(getStoredProfile());
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Save to localStorage
    saveProfile(profile);
    
    // Dispatch event to update Hero component
    window.dispatchEvent(new Event("profile-updated"));
    
    // Call optional onSave callback
    onSave?.(profile);

    toast({
      title: "Profile Saved",
      description: "Your profile has been updated locally.",
    });
    
    setIsSaving(false);
  };

  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    
    try {
      console.log("[ProfileEditor] Syncing to Supabase...", profile);
      await saveProfileToCloud(profile);
      setLastSynced(new Date());
      toast({
        title: "Synced to Cloud",
        description: "Your profile has been saved to Supabase.",
      });
    } catch (error: any) {
      const msg = error?.message || String(error);
      console.error("[ProfileEditor] Sync failed:", error);
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
    setProfile(defaultProfile);
    toast({
      title: "Reset to Default",
      description: "Profile has been reset. Save to apply changes.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Name
          </label>
          <Input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="mt-1 font-serif text-lg font-bold"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
            Bio
          </label>
          
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="edit" className="gap-2">
                <FileText className="w-3 h-3" /> Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="w-3 h-3" /> Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="mt-0">
              <RichTextEditor
                content={profile.bio}
                onChange={(html) => setProfile({ ...profile, bio: html })}
                placeholder="Write about yourself..."
              />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <Card className="min-h-[200px] bg-card">
                <CardContent className="p-8">
                  <div className="space-y-8 max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary tracking-tight leading-[1.1]">
                      {profile.name || "Your Name"}
                    </h1>
                    <div 
                      className="text-xl md:text-2xl leading-relaxed text-foreground/90 font-light prose prose-neutral dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: profile.bio || "<p>Your bio will appear here...</p>" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

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
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" /> 
            {isSaving ? "Saving..." : "Save Locally"}
          </Button>
        </div>
      </div>
    </div>
  );
}
