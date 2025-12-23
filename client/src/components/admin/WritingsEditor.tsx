import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, FileText, Eye, Cloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "./RichTextEditor";

interface Writing {
  id: number;
  title: string;
  date: string;
  content: string;
  excerpt: string;
  readTime: string;
}

interface WritingsEditorProps {
  onSave: (post: Writing) => void;
}

export default function WritingsEditor({ onSave }: WritingsEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  // Strip HTML for excerpt and word count
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleSave = () => {
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please provide both a title and content.",
      });
      return;
    }

    const plainText = stripHtml(content);
    const newPost: Writing = {
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      excerpt: plainText.substring(0, 100) + "...",
      readTime: `${Math.ceil(plainText.split(" ").length / 200)} min read`
    };

    onSave(newPost);
    toast({
      title: "Post Published",
      description: "Your new writing has been published successfully.",
    });
    
    // Reset
    setTitle("");
    setContent("");
  };

  const handleSyncToSupabase = async () => {
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please provide both a title and content before syncing.",
      });
      return;
    }

    setIsSyncing(true);
    
    try {
      const plainText = stripHtml(content);
      const response = await fetch("/api/writings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Date.now().toString(),
          title,
          content,
          excerpt: plainText.substring(0, 100) + "...",
          readTime: `${Math.ceil(plainText.split(" ").length / 200)} min read`
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to sync");
      }
      
      toast({
        title: "Synced to Cloud",
        description: "Your writing has been saved to Supabase.",
      });

      // Also save locally
      handleSave();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Could not sync to Supabase. Check your connection.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter article title..."
            className="font-serif text-2xl font-bold mt-1 h-auto py-3"
          />
        </div>

        <Tabs defaultValue="write" className="w-full">
          <div className="flex items-center justify-between mb-2">
             <TabsList>
                <TabsTrigger value="write" className="gap-2"><FileText className="w-3 h-3" /> Write</TabsTrigger>
                <TabsTrigger value="preview" className="gap-2"><Eye className="w-3 h-3" /> Preview</TabsTrigger>
             </TabsList>
          </div>
          
          <TabsContent value="write" className="mt-0">
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Write your story..."
              className="min-h-[400px]"
            />
          </TabsContent>
          
          <TabsContent value="preview" className="mt-0">
             <Card className="min-h-[400px] bg-card">
                <CardContent className="p-8 prose prose-neutral dark:prose-invert max-w-none">
                   <h1 className="mb-4 text-3xl font-serif font-bold">{title || "Untitled Post"}</h1>
                   <div className="text-sm text-muted-foreground mb-8">
                     {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                     {content && ` · ${Math.ceil(stripHtml(content).split(" ").length / 200)} min read`}
                   </div>
                   {content ? (
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                   ) : (
                      <p className="text-muted-foreground italic">Nothing to preview yet...</p>
                   )}
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
           <Button 
             variant="outline" 
             onClick={handleSyncToSupabase} 
             disabled={isSyncing}
             className="gap-2"
           >
              <Cloud className="w-4 h-4" /> {isSyncing ? "Syncing..." : "Sync to Cloud"}
           </Button>
           <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" /> Publish Writing
           </Button>
        </div>
      </div>
    </div>
  );
}
