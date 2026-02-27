-- ============================================
-- LongTalkDoo: Instructors Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- =====================
-- 1. Instructors Table (ผู้สอน)
-- =====================
create table if not exists public.instructors (
  id uuid primary key default gen_random_uuid(),

  -- Profile
  name text not null,
  slug text not null unique,
  highlight text,                          -- จุดเด่น / tagline
  bio text,                                -- ประวัติแบบเต็ม

  -- Media
  image text,                              -- รูปโปรไฟล์
  cover_photo text,                        -- รูปปก (banner)

  -- Ratings (denormalized cache)
  rating numeric(3,2) default 0,           -- คะแนนเฉลี่ย
  rating_count int default 0,              -- จำนวนรีวิวทั้งหมด

  -- Display
  sort_order int default 0,
  is_featured boolean default false,       -- ผู้สอนแนะนำ

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================
-- 2. Add instructor_id FK on courses
-- =====================
alter table public.courses
  add column if not exists instructor_id uuid references public.instructors(id) on delete set null;

-- =====================
-- 3. Indexes
-- =====================
create index if not exists idx_instructors_slug on public.instructors(slug);
create index if not exists idx_instructors_featured on public.instructors(is_featured) where is_featured = true;
create index if not exists idx_courses_instructor on public.courses(instructor_id);

-- =====================
-- 4. Auto-update updated_at trigger
-- =====================
drop trigger if exists instructors_updated_at on public.instructors;
create trigger instructors_updated_at
  before update on public.instructors
  for each row execute function public.update_updated_at();

-- =====================
-- 5. Enable RLS
-- =====================
alter table public.instructors enable row level security;

-- =====================
-- 6. RLS Policies
-- =====================

-- Anyone can read instructors (public profiles)
drop policy if exists "Anyone can read instructors" on public.instructors;
create policy "Anyone can read instructors" on public.instructors for select
  using (true);

-- Admins can insert instructors
drop policy if exists "Admins can insert instructors" on public.instructors;
create policy "Admins can insert instructors" on public.instructors for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Admins can update instructors
drop policy if exists "Admins can update instructors" on public.instructors;
create policy "Admins can update instructors" on public.instructors for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Admins can delete instructors
drop policy if exists "Admins can delete instructors" on public.instructors;
create policy "Admins can delete instructors" on public.instructors for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- =====================
-- 7. Computed View: instructor_stats
--    Live calculation from course_reviews table
--    - rating    = average of all reviews across all courses
--    - courses   = count of courses this instructor teaches
--    - reviews   = count of all reviews across all courses
-- =====================
drop view if exists public.instructor_stats;
create view public.instructor_stats
  with (security_invoker = on) as
select
  i.id,
  i.name,
  i.slug,
  i.highlight,
  i.bio,
  i.image,
  i.cover_photo,
  i.is_featured,
  i.sort_order,
  i.created_at,

  -- Number of courses this instructor teaches
  count(distinct c.id)::int as total_courses,

  -- Total reviews across ALL courses this instructor teaches
  count(distinct r.id)::int as total_reviews,

  -- Average rating = average of every review across all courses
  coalesce(round(avg(r.rating), 2), 0) as average_rating

from public.instructors i
left join public.courses c
  on c.instructor_id = i.id
left join public.course_reviews r
  on r.course_id = c.id
group by i.id;

-- ============================================
-- Done! After running this SQL:
-- 1. Verify 'instructors' table in Table Editor
-- 2. Verify 'instructor_stats' view works:
--    SELECT * FROM instructor_stats;
-- 3. Link courses to instructors:
--    UPDATE courses SET instructor_id = '<instructor_uuid>'
--    WHERE instructor_name = 'ครูวรรณ';
-- ============================================
