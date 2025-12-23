// React Hooks for Supabase Data Management
// Provides hooks for loading/saving data with cloud sync capabilities

import { useState, useEffect, useCallback } from "react";
import {
  fetchProfile,
  fetchAbout,
  fetchBooks,
  fetchWritings,
  saveProfileToCloud,
  saveAboutToCloud,
  saveBooksToCloud,
  saveWritingsToCloud,
  loadAllFromCloud,
  type Writing,
} from "@/lib/supabase";
import { 
  Profile, 
  About, 
  Book, 
  getStoredProfile, 
  getStoredAbout, 
  STORAGE_KEYS,
  defaultProfile,
  defaultAbout,
} from "@/lib/data";

// ============================================
// HOOK: Load all data from cloud on app init
// ============================================

export function useCloudData() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCloudAvailable, setIsCloudAvailable] = useState(false);

  const loadFromCloud = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const cloudData = await loadAllFromCloud();

      // If cloud data exists, save to localStorage
      if (cloudData.profile) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(cloudData.profile));
        window.dispatchEvent(new Event("profile-updated"));
      }
      if (cloudData.about) {
        localStorage.setItem(STORAGE_KEYS.ABOUT, JSON.stringify(cloudData.about));
        window.dispatchEvent(new Event("about-updated"));
      }
      if (cloudData.books && cloudData.books.length > 0) {
        localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(cloudData.books));
      }
      if (cloudData.writings && cloudData.writings.length > 0) {
        localStorage.setItem(STORAGE_KEYS.WRITINGS, JSON.stringify(cloudData.writings));
      }

      setIsCloudAvailable(
        cloudData.profile !== null || 
        cloudData.about !== null || 
        cloudData.books !== null
      );
    } catch (err) {
      setError("Cloud not available. Using local data.");
      setIsCloudAvailable(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFromCloud();
  }, [loadFromCloud]);

  return { isLoading, error, isCloudAvailable, refetch: loadFromCloud };
}

// ============================================
// HOOK: Profile with cloud sync
// ============================================

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setProfile(getStoredProfile());
  }, []);

  const syncToCloud = useCallback(async (): Promise<boolean> => {
    setIsSyncing(true);
    try {
      await saveProfileToCloud(profile);
      setLastSynced(new Date());
      return true;
    } catch {
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [profile]);

  const loadFromCloud = useCallback(async (): Promise<boolean> => {
    try {
      const cloudProfile = await fetchProfile();
      setProfile(cloudProfile);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(cloudProfile));
      window.dispatchEvent(new Event("profile-updated"));
      return true;
    } catch {
      return false;
    }
  }, []);

  return { 
    profile, 
    setProfile, 
    syncToCloud, 
    loadFromCloud,
    isSyncing, 
    lastSynced 
  };
}

// ============================================
// HOOK: About with cloud sync
// ============================================

export function useAbout() {
  const [about, setAbout] = useState<About>(defaultAbout);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setAbout(getStoredAbout());
  }, []);

  const syncToCloud = useCallback(async (): Promise<boolean> => {
    setIsSyncing(true);
    try {
      await saveAboutToCloud(about);
      setLastSynced(new Date());
      return true;
    } catch {
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [about]);

  const loadFromCloud = useCallback(async (): Promise<boolean> => {
    try {
      const cloudAbout = await fetchAbout();
      setAbout(cloudAbout);
      localStorage.setItem(STORAGE_KEYS.ABOUT, JSON.stringify(cloudAbout));
      window.dispatchEvent(new Event("about-updated"));
      return true;
    } catch {
      return false;
    }
  }, []);

  return { 
    about, 
    setAbout, 
    syncToCloud, 
    loadFromCloud,
    isSyncing, 
    lastSynced 
  };
}

// ============================================
// HOOK: Books with cloud sync
// ============================================

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (saved) {
      try {
        setBooks(JSON.parse(saved));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const syncToCloud = useCallback(async (): Promise<boolean> => {
    setIsSyncing(true);
    try {
      await saveBooksToCloud(books);
      setLastSynced(new Date());
      return true;
    } catch {
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [books]);

  const loadFromCloud = useCallback(async (): Promise<boolean> => {
    try {
      const cloudBooks = await fetchBooks();
      setBooks(cloudBooks);
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(cloudBooks));
      return true;
    } catch {
      return false;
    }
  }, []);

  return { 
    books, 
    setBooks, 
    syncToCloud, 
    loadFromCloud,
    isSyncing, 
    lastSynced 
  };
}

// ============================================
// HOOK: Writings with cloud sync
// ============================================

export function useWritings() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WRITINGS);
    if (saved) {
      try {
        setWritings(JSON.parse(saved));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const syncToCloud = useCallback(async (): Promise<boolean> => {
    setIsSyncing(true);
    try {
      await saveWritingsToCloud(writings);
      setLastSynced(new Date());
      return true;
    } catch {
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [writings]);

  const loadFromCloud = useCallback(async (): Promise<boolean> => {
    try {
      const cloudWritings = await fetchWritings();
      setWritings(cloudWritings);
      localStorage.setItem(STORAGE_KEYS.WRITINGS, JSON.stringify(cloudWritings));
      return true;
    } catch {
      return false;
    }
  }, []);

  return { 
    writings, 
    setWritings, 
    syncToCloud, 
    loadFromCloud,
    isSyncing, 
    lastSynced 
  };
}

