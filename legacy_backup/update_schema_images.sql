-- ==========================================
-- UPDATE SCHEMA TO SUPPORT IMAGE UPLOADS
-- Run this script in Supabase SQL Editor
-- ==========================================

-- Add 'images' column to 'projects' table to store array of image URLs
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS images text[];

-- Update RLS policies for storage if needed
-- (The existing schema might not have covered storage policies fully)

-- Create a storage bucket for portfolio images if it doesn't exist
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Set up storage policies for 'portfolio' bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'portfolio' );

create policy "Authenticated Upload"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'portfolio' );

create policy "Authenticated Update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'portfolio' );

create policy "Authenticated Delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'portfolio' );
