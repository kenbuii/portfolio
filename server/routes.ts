import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Supabase client setup (optional - only used if SUPABASE_URL and SUPABASE_KEY are set)
const getSupabaseClient = async () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  
  // Dynamic import to avoid issues if @supabase/supabase-js isn't installed
  try {
    const { createClient } = await import("@supabase/supabase-js");
    return createClient(supabaseUrl, supabaseKey);
  } catch {
    return null;
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Google Books API proxy endpoint
  app.get("/api/books/search", async (req, res) => {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ error: "Missing search query parameter 'q'" });
    }

    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    
    try {
      const url = new URL("https://www.googleapis.com/books/v1/volumes");
      url.searchParams.set("q", query);
      if (apiKey && apiKey !== "your_api_key_here") {
        url.searchParams.set("key", apiKey);
      }

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      
      res.json(data);
    } catch (error) {
      console.error("Google Books API error:", error);
      res.status(500).json({ error: "Failed to fetch from Google Books API" });
    }
  });

  // ============================================
  // Supabase-backed API endpoints for admin data
  // ============================================

  // Profile endpoints
  app.get("/api/profile", async (req, res) => {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not configured" });
    }
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not configured" });
    }
    
    try {
      const { name, bio } = req.body;
      
      const { data, error } = await supabase
        .from("profiles")
        .upsert({ id: 1, name, bio, updated_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Failed to save profile:", error);
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  // Books endpoints
  app.get("/api/books", async (req, res) => {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not configured" });
    }
    
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      res.status(500).json({ error: "Failed to fetch books" });
    }
  });

  app.put("/api/books", async (req, res) => {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not configured" });
    }
    
    try {
      const books = req.body;
      
      // Upsert all books
      const { data, error } = await supabase
        .from("books")
        .upsert(
          books.map((book: any) => ({
            ...book,
            updated_at: new Date().toISOString(),
          }))
        )
        .select();
      
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Failed to save books:", error);
      res.status(500).json({ error: "Failed to save books" });
    }
  });

  // About endpoints
  app.get("/api/about", async (req, res) => {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not configured" });
    }
    
    try {
      const { data, error } = await supabase
        .from("about")
        .select("*")
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Failed to fetch about:", error);
      res.status(500).json({ error: "Failed to fetch about" });
    }
  });

  app.put("/api/about", async (req, res) => {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not configured" });
    }
    
    try {
      const { content, profileImage, gallery } = req.body;
      
      const { data, error } = await supabase
        .from("about")
        .upsert({ 
          id: 1, 
          content, 
          profile_image: profileImage, 
          gallery,
          updated_at: new Date().toISOString() 
        })
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Failed to save about:", error);
      res.status(500).json({ error: "Failed to save about" });
    }
  });

  // Inspirations endpoints
  app.get("/api/inspirations", async (req, res) => {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not configured" });
    }
    
    try {
      const { data, error } = await supabase
        .from("inspirations")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Failed to fetch inspirations:", error);
      res.status(500).json({ error: "Failed to fetch inspirations" });
    }
  });

  app.post("/api/inspirations", async (req, res) => {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not configured" });
    }
    
    try {
      const inspiration = req.body;
      
      const { data, error } = await supabase
        .from("inspirations")
        .insert({
          ...inspiration,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Failed to save inspiration:", error);
      res.status(500).json({ error: "Failed to save inspiration" });
    }
  });

  app.put("/api/inspirations", async (req, res) => {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not configured" });
    }
    
    try {
      const inspirations = req.body;
      
      const { data, error } = await supabase
        .from("inspirations")
        .upsert(
          inspirations.map((item: any) => ({
            ...item,
            updated_at: new Date().toISOString(),
          }))
        )
        .select();
      
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Failed to save inspirations:", error);
      res.status(500).json({ error: "Failed to save inspirations" });
    }
  });

  app.delete("/api/inspirations/:id", async (req, res) => {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not configured" });
    }
    
    try {
      const { id } = req.params;
      
      const { error } = await supabase
        .from("inspirations")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete inspiration:", error);
      res.status(500).json({ error: "Failed to delete inspiration" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
