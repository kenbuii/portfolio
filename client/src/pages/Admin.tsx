import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin") { // Mock password
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

  if (isLoggedIn) {
    return (
      <Layout>
         <div className="pt-32 px-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-12">
               <h1 className="text-4xl font-serif font-bold text-primary">Content Management</h1>
               <Button variant="outline" onClick={() => setIsLoggedIn(false)}>Logout</Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
               <Card>
                  <CardHeader>
                     <CardTitle>Edit Bookshelf</CardTitle>
                     <CardDescription>Manage your curated book list</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="h-40 bg-muted/30 rounded-md flex items-center justify-center border border-dashed border-muted-foreground/20">
                        <p className="text-muted-foreground">Book list editor placeholder</p>
                     </div>
                  </CardContent>
               </Card>
               
               <Card>
                  <CardHeader>
                     <CardTitle>Edit Writings</CardTitle>
                     <CardDescription>Manage your blog posts and articles</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="h-40 bg-muted/30 rounded-md flex items-center justify-center border border-dashed border-muted-foreground/20">
                        <p className="text-muted-foreground">Markdown editor placeholder</p>
                     </div>
                  </CardContent>
               </Card>
            </div>
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
