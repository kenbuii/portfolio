// Supabase API Client Library
// Connects to backend API routes that interface with Supabase

import { Profile, About, Book } from "./data";

// API Base URL (uses same origin)
const API_BASE = "";

// ============================================
// API CLIENT FUNCTIONS
// ============================================

// Generic fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
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
  return apiFetch<Profile>("/api/profile");
}

export async function saveProfileToCloud(profile: Profile): Promise<Profile> {
  return apiFetch<Profile>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}

// ============================================
// ABOUT API
// ============================================

export async function fetchAbout(): Promise<About> {
  const data = await apiFetch<any>("/api/about");
  // Map snake_case from DB to camelCase
  return {
    content: data.content,
    profileImage: data.profile_image || data.profileImage,
    gallery: data.gallery || [],
  };
}

export async function saveAboutToCloud(about: About): Promise<About> {
  return apiFetch<About>("/api/about", {
    method: "PUT",
    body: JSON.stringify(about),
  });
}

// ============================================
// BOOKS API
// ============================================

export async function fetchBooks(): Promise<Book[]> {
  return apiFetch<Book[]>("/api/books");
}

export async function saveBooksToCloud(books: Book[]): Promise<Book[]> {
  return apiFetch<Book[]>("/api/books", {
    method: "PUT",
    body: JSON.stringify(books),
  });
}

// ============================================
// WRITINGS API
// ============================================

export interface Writing {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  read_time: string;
  published_at?: string;
  is_published?: boolean;
  date?: string;
  readTime?: string;
}

export async function fetchWritings(): Promise<Writing[]> {
  return apiFetch<Writing[]>("/api/writings");
}

export async function saveWritingToCloud(writing: Omit<Writing, "id">): Promise<Writing> {
  return apiFetch<Writing>("/api/writings", {
    method: "POST",
    body: JSON.stringify(writing),
  });
}

export async function saveWritingsToCloud(writings: Writing[]): Promise<Writing[]> {
  return apiFetch<Writing[]>("/api/writings", {
    method: "PUT",
    body: JSON.stringify(writings),
  });
}

// ============================================
// SYNC ALL DATA TO CLOUD
// ============================================

export interface SyncResult {
  profile: boolean;
  about: boolean;
  books: boolean;
  writings: boolean;
}

export async function syncAllToCloud(data: {
  profile: Profile;
  about: About;
  books: Book[];
  writings: Writing[];
}): Promise<SyncResult> {
  const results: SyncResult = {
    profile: false,
    about: false,
    books: false,
    writings: false,
  };

  // Run all syncs in parallel
  const [profileRes, aboutRes, booksRes, writingsRes] = await Promise.allSettled([
    saveProfileToCloud(data.profile),
    saveAboutToCloud(data.about),
    saveBooksToCloud(data.books),
    saveWritingsToCloud(data.writings),
  ]);

  results.profile = profileRes.status === "fulfilled";
  results.about = aboutRes.status === "fulfilled";
  results.books = booksRes.status === "fulfilled";
  results.writings = writingsRes.status === "fulfilled";

  return results;
}

// ============================================
// LOAD ALL DATA FROM CLOUD
// ============================================

export interface CloudData {
  profile: Profile | null;
  about: About | null;
  books: Book[] | null;
  writings: Writing[] | null;
}

export async function loadAllFromCloud(): Promise<CloudData> {
  const [profile, about, books, writings] = await Promise.allSettled([
    fetchProfile(),
    fetchAbout(),
    fetchBooks(),
    fetchWritings(),
  ]);

  return {
    profile: profile.status === "fulfilled" ? profile.value : null,
    about: about.status === "fulfilled" ? about.value : null,
    books: books.status === "fulfilled" ? books.value : null,
    writings: writings.status === "fulfilled" ? writings.value : null,
  };
}

