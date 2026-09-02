-- Phase 2 - Professional Profile Enhancement
-- Add phone and avatar_url fields to profiles
-- Create storage bucket for profile photos

-- ============================================
-- ADD PHONE COLUMN TO PROFILES
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- ============================================
-- ADD AVATAR_URL COLUMN TO PROFILES
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ============================================
-- ENABLE UUID EXTENSION (for storage if needed)
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CREATE STORAGE BUCKET FOR PROFILE PHOTOS
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  false, -- private bucket
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES FOR AVATARS
-- ============================================

-- Policy: Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Anyone can view avatars (public read)
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- ============================================
-- INDEX FOR PHONE LOOKUP (optional but useful)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone) WHERE phone IS NOT NULL;

-- ============================================
-- UPDATE RLS POLICIES FOR PROFILES
-- Note: Existing policies already handle user_id based access
-- The new phone and avatar_url columns inherit these policies
-- ============================================

-- Add comment for documentation
COMMENT ON COLUMN profiles.phone IS 'User phone number for contact purposes';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to the user profile photo in storage';
