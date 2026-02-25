-- Add new columns for enhanced project details
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS content_ar text, -- الوصف التفصيلي (عربي)
ADD COLUMN IF NOT EXISTS content_en text, -- الوصف التفصيلي (إنجليزي)
ADD COLUMN IF NOT EXISTS link text;       -- رابط المشروع (اختياري)
