-- Supabase Schema for kenbui.net Portfolio
-- Run this in your Supabase SQL Editor

-- Profile table (single row)
CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL DEFAULT 'Ken Bui',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_profile CHECK (id = 1)
);

-- About table (single row)
CREATE TABLE IF NOT EXISTS about (
  id INTEGER PRIMARY KEY DEFAULT 1,
  content TEXT,
  profile_image TEXT,
  gallery JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_about CHECK (id = 1)
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  synopsis TEXT,
  description TEXT,
  cover TEXT,
  rating REAL DEFAULT 0,
  review TEXT,
  link TEXT,
  color TEXT DEFAULT '#123524',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inspirations table (poems, essays, art, quotes)
CREATE TABLE IF NOT EXISTS inspirations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('poem', 'essay', 'art', 'quote')),
  title TEXT,
  content TEXT NOT NULL DEFAULT '',
  attribution TEXT NOT NULL,
  source TEXT,
  year TEXT,
  blurb TEXT,
  size TEXT DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large')),
  rotation REAL DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  "fontSize" REAL DEFAULT 1.0,
  "imageUrl" TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inspirations_type ON inspirations(type);
CREATE INDEX IF NOT EXISTS idx_inspirations_created_at ON inspirations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inspirations_featured ON inspirations(featured) WHERE featured = true;

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspirations ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies (safe to re-run)
DROP POLICY IF EXISTS "Public read access for profiles" ON profiles;
DROP POLICY IF EXISTS "Public read access for about" ON about;
DROP POLICY IF EXISTS "Public read access for books" ON books;
DROP POLICY IF EXISTS "Public read access for inspirations" ON inspirations;
DROP POLICY IF EXISTS "Service write access for profiles" ON profiles;
DROP POLICY IF EXISTS "Service write access for about" ON about;
DROP POLICY IF EXISTS "Service write access for books" ON books;
DROP POLICY IF EXISTS "Service write access for inspirations" ON inspirations;
DROP POLICY IF EXISTS "Anon insert for profiles" ON profiles;
DROP POLICY IF EXISTS "Anon update for profiles" ON profiles;
DROP POLICY IF EXISTS "Anon delete for profiles" ON profiles;
DROP POLICY IF EXISTS "Anon insert for about" ON about;
DROP POLICY IF EXISTS "Anon update for about" ON about;
DROP POLICY IF EXISTS "Anon delete for about" ON about;
DROP POLICY IF EXISTS "Anon insert for books" ON books;
DROP POLICY IF EXISTS "Anon update for books" ON books;
DROP POLICY IF EXISTS "Anon delete for books" ON books;
DROP POLICY IF EXISTS "Anon insert for inspirations" ON inspirations;
DROP POLICY IF EXISTS "Anon update for inspirations" ON inspirations;
DROP POLICY IF EXISTS "Anon delete for inspirations" ON inspirations;

-- Public read access (anyone can view the portfolio)
CREATE POLICY "Public read access for profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read access for about" ON about FOR SELECT USING (true);
CREATE POLICY "Public read access for books" ON books FOR SELECT USING (true);
CREATE POLICY "Public read access for inspirations" ON inspirations FOR SELECT USING (true);

-- Write access via anon key (admin operations from the client)
CREATE POLICY "Anon insert for profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update for profiles" ON profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anon delete for profiles" ON profiles FOR DELETE USING (true);

CREATE POLICY "Anon insert for about" ON about FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update for about" ON about FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anon delete for about" ON about FOR DELETE USING (true);

CREATE POLICY "Anon insert for books" ON books FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update for books" ON books FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anon delete for books" ON books FOR DELETE USING (true);

CREATE POLICY "Anon insert for inspirations" ON inspirations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update for inspirations" ON inspirations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anon delete for inspirations" ON inspirations FOR DELETE USING (true);

-- Insert default profile row
INSERT INTO profiles (id, name, bio) 
VALUES (1, 'Ken Bui', '<p>I am fascinated by systems.</p>')
ON CONFLICT (id) DO NOTHING;

-- Insert default about row
INSERT INTO about (id, content, profile_image, gallery) 
VALUES (1, '<p>Welcome to my corner of the internet.</p>', '/State_Quality_Mark_Of_The_USSR_(Black).png', '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- MIGRATIONS (run these in Supabase SQL Editor for existing databases)
-- ===========================================

-- Migration: add fontSize, imageUrl columns and quote type support
-- Run this if your inspirations table already exists and is missing these columns.

-- 1. Add new columns (safe to run multiple times)
ALTER TABLE inspirations ADD COLUMN IF NOT EXISTS "fontSize" REAL DEFAULT 1.0;
ALTER TABLE inspirations ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

-- 2. Make title nullable (quotes don't require a title)
ALTER TABLE inspirations ALTER COLUMN title DROP NOT NULL;

-- 3. Allow empty content for image-only poems (imageUrl substitutes content)
ALTER TABLE inspirations ALTER COLUMN content SET DEFAULT '';
ALTER TABLE inspirations ALTER COLUMN content DROP NOT NULL;

-- 4. Add 'quote' to the allowed types
--    PostgreSQL doesn't support ALTER ... CHECK directly, so drop & recreate.
ALTER TABLE inspirations DROP CONSTRAINT IF EXISTS inspirations_type_check;
ALTER TABLE inspirations ADD CONSTRAINT inspirations_type_check
  CHECK (type IN ('poem', 'essay', 'art', 'quote'));

-- 5. Add essay hyperlink column
ALTER TABLE inspirations ADD COLUMN IF NOT EXISTS link TEXT;
