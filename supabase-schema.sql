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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inspirations table (poems, essays, art)
CREATE TABLE IF NOT EXISTS inspirations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('poem', 'essay', 'art')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  attribution TEXT NOT NULL,
  source TEXT,
  year TEXT,
  blurb TEXT,
  size TEXT DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large')),
  rotation REAL DEFAULT 0,
  featured BOOLEAN DEFAULT false,
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

-- Create policies for public read access
CREATE POLICY "Public read access for profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read access for about" ON about FOR SELECT USING (true);
CREATE POLICY "Public read access for books" ON books FOR SELECT USING (true);
CREATE POLICY "Public read access for inspirations" ON inspirations FOR SELECT USING (true);

-- Create policies for authenticated write access (service role)
-- Note: Using service role key bypasses RLS, so these are for reference
CREATE POLICY "Service write access for profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Service write access for about" ON about FOR ALL USING (true);
CREATE POLICY "Service write access for books" ON books FOR ALL USING (true);
CREATE POLICY "Service write access for inspirations" ON inspirations FOR ALL USING (true);

-- Insert default profile row
INSERT INTO profiles (id, name, bio) 
VALUES (1, 'Ken Bui', '<p>I am fascinated by systems.</p>')
ON CONFLICT (id) DO NOTHING;

-- Insert default about row
INSERT INTO about (id, content, profile_image, gallery) 
VALUES (1, '<p>Welcome to my corner of the internet.</p>', '/State_Quality_Mark_Of_The_USSR_(Black).png', '[]')
ON CONFLICT (id) DO NOTHING;
