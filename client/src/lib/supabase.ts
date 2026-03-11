// Supabase API Client Library
// Supports both direct Supabase calls (production) and Express proxy (development)

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Profile, About, Book } from "./data";

// ============================================
// SUPABASE CLIENT SETUP
// ============================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client if credentials are available
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Check if we should use direct Supabase or fallback to API
const useDirectSupabase = () => !!supabase;

// ============================================
// FALLBACK API FETCH (for development without Supabase)
// ============================================

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================
// PROFILE API
// ============================================

export async function fetchProfile(): Promise<Profile> {
  if (useDirectSupabase()) {
    const { data, error } = await supabase!
      .from("profiles")
      .select("*")
      .single();
    if (error) throw error;
    return data as Profile;
  }
  return apiFetch<Profile>("/api/profile");
}

export async function saveProfileToCloud(profile: Profile): Promise<Profile> {
  if (useDirectSupabase()) {
    const { data, error } = await supabase!
      .from("profiles")
      .upsert({ id: 1, ...profile, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  }
  return apiFetch<Profile>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}

// ============================================
// ABOUT API
// ============================================

export async function fetchAbout(): Promise<About> {
  if (useDirectSupabase()) {
    const { data, error } = await supabase!
      .from("about")
      .select("*")
      .single();
    if (error) throw error;
    return {
      content: data.content,
      profileImage: data.profile_image || data.profileImage,
      gallery: data.gallery || [],
    };
  }
  const data = await apiFetch<any>("/api/about");
  return {
    content: data.content,
    profileImage: data.profile_image || data.profileImage,
    gallery: data.gallery || [],
  };
}

export async function saveAboutToCloud(about: About): Promise<About> {
  if (useDirectSupabase()) {
    const { data, error } = await supabase!
      .from("about")
      .upsert({
        id: 1,
        content: about.content,
        profile_image: about.profileImage,
        gallery: about.gallery,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return {
      content: data.content,
      profileImage: data.profile_image,
      gallery: data.gallery || [],
    };
  }
  return apiFetch<About>("/api/about", {
    method: "PUT",
    body: JSON.stringify(about),
  });
}

// ============================================
// BOOKS API
// ============================================

export async function fetchBooks(): Promise<Book[]> {
  if (useDirectSupabase()) {
    const { data, error } = await supabase!
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Book[];
  }
  return apiFetch<Book[]>("/api/books");
}

export async function saveBooksToCloud(books: Book[]): Promise<Book[]> {
  if (useDirectSupabase()) {
    const { data, error } = await supabase!
      .from("books")
      .upsert(
        books.map((book) => ({
          ...book,
          updated_at: new Date().toISOString(),
        }))
      )
      .select();
    if (error) throw error;
    return data as Book[];
  }
  return apiFetch<Book[]>("/api/books", {
    method: "PUT",
    body: JSON.stringify(books),
  });
}

// ============================================
// INSPIRATIONS API
// ============================================

export interface Inspiration {
  id: string;
  type: "poem" | "essay" | "art";
  title: string;
  content: string;
  attribution: string;
  source?: string;
  year?: string;
  blurb: string;
  size?: "small" | "medium" | "large";
  rotation?: number;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function fetchInspirations(): Promise<Inspiration[]> {
  if (useDirectSupabase()) {
    const { data, error } = await supabase!
      .from("inspirations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Inspiration[];
  }
  return apiFetch<Inspiration[]>("/api/inspirations");
}

export async function saveInspirationToCloud(inspiration: Omit<Inspiration, "id">): Promise<Inspiration> {
  if (useDirectSupabase()) {
    const { data, error } = await supabase!
      .from("inspirations")
      .insert({
        ...inspiration,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data as Inspiration;
  }
  return apiFetch<Inspiration>("/api/inspirations", {
    method: "POST",
    body: JSON.stringify(inspiration),
  });
}

export async function saveInspirationsToCloud(inspirations: Inspiration[]): Promise<Inspiration[]> {
  if (useDirectSupabase()) {
    const { data, error } = await supabase!
      .from("inspirations")
      .upsert(
        inspirations.map((item) => ({
          ...item,
          updated_at: new Date().toISOString(),
        }))
      )
      .select();
    if (error) throw error;
    return data as Inspiration[];
  }
  return apiFetch<Inspiration[]>("/api/inspirations", {
    method: "PUT",
    body: JSON.stringify(inspirations),
  });
}

export async function deleteInspirationFromCloud(id: string): Promise<void> {
  if (useDirectSupabase()) {
    const { error } = await supabase!
      .from("inspirations")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return;
  }
  return apiFetch<void>(`/api/inspirations/${id}`, {
    method: "DELETE",
  });
}

// ============================================
// SYNC ALL DATA TO CLOUD
// ============================================

export interface SyncResult {
  profile: boolean;
  about: boolean;
  books: boolean;
  inspirations: boolean;
}

export async function syncAllToCloud(data: {
  profile: Profile;
  about: About;
  books: Book[];
  inspirations: Inspiration[];
}): Promise<SyncResult> {
  const results: SyncResult = {
    profile: false,
    about: false,
    books: false,
    inspirations: false,
  };

  // Run all syncs in parallel
  const [profileRes, aboutRes, booksRes, inspirationsRes] = await Promise.allSettled([
    saveProfileToCloud(data.profile),
    saveAboutToCloud(data.about),
    saveBooksToCloud(data.books),
    saveInspirationsToCloud(data.inspirations),
  ]);

  results.profile = profileRes.status === "fulfilled";
  results.about = aboutRes.status === "fulfilled";
  results.books = booksRes.status === "fulfilled";
  results.inspirations = inspirationsRes.status === "fulfilled";

  return results;
}

// ============================================
// LOAD ALL DATA FROM CLOUD
// ============================================

export interface CloudData {
  profile: Profile | null;
  about: About | null;
  books: Book[] | null;
  inspirations: Inspiration[] | null;
}

export async function loadAllFromCloud(): Promise<CloudData> {
  const [profile, about, books, inspirations] = await Promise.allSettled([
    fetchProfile(),
    fetchAbout(),
    fetchBooks(),
    fetchInspirations(),
  ]);

  return {
    profile: profile.status === "fulfilled" ? profile.value : null,
    about: about.status === "fulfilled" ? about.value : null,
    books: books.status === "fulfilled" ? books.value : null,
    inspirations: inspirations.status === "fulfilled" ? inspirations.value : null,
  };
}

