import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, FileText, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleSave = () => {
    if (!title || !content) return;

    const newPost: Writing = {
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      excerpt: content.substring(0, 100) + "...",
      readTime: `${Math.ceil(content.split(" ").length / 200)} min read`
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
             <Textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Write your story in Markdown..."
                className="min-h-[400px] font-mono text-sm leading-relaxed p-6 resize-y"
             />
          </TabsContent>
          
          <TabsContent value="preview" className="mt-0">
             <Card className="min-h-[400px] bg-card">
                <CardContent className="p-8 prose prose-neutral dark:prose-invert max-w-none">
                   <h1 className="mb-8">{title || "Untitled Post"}</h1>
                   {content ? (
                      <ReactMarkdown>{content}</ReactMarkdown>
                   ) : (
                      <p className="text-muted-foreground italic">Nothing to preview yet...</p>
                   )}
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
           <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" /> Publish Writing
           </Button>
        </div>
      </div>
    </div>
  );
}
