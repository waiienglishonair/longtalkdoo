-- ============================================
-- LongTalkDoo: Course/Product Schema
-- WooCommerce-style course-as-product design
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- =====================
-- 1. Categories (hierarchical like WooCommerce)
-- =====================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references public.categories(id) on delete set null,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================
-- 2. Courses (main product table)
-- =====================
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),

  -- Core product info
  name text not null,
  slug text not null unique,
  description text,
  short_description text,

  -- Product type (like WooCommerce)
  product_type text not null default 'simple' check (product_type in ('simple', 'variable', 'bundle')),

  -- Status (like WordPress post status)
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),

  -- Pricing (like WooCommerce)
  price numeric(10,2) default 0,
  sale_price numeric(10,2),
  sale_start timestamptz,
  sale_end timestamptz,

  -- Inventory (like WooCommerce)
  sku text unique,
  manage_stock boolean default false,
  stock_quantity int default 0,

  -- Media
  featured_image text,

  -- Visibility & sorting
  is_featured boolean default false,
  visibility text default 'visible' check (visibility in ('visible', 'hidden', 'catalog', 'search')),
  sort_order int default 0,
  menu_order int default 0,

  -- SEO
  seo_title text,
  seo_description text,

  -- Course-specific
  difficulty_level text default 'beginner' check (difficulty_level in ('beginner', 'intermediate', 'advanced', 'all_levels')),
  duration_hours numeric(6,1),
  total_lessons int default 0,

  -- Tracking
  total_sales int default 0,
  average_rating numeric(3,2) default 0,
  rating_count int default 0,

  -- Managed by
  created_by uuid references auth.users(id) on delete set null,

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz
);

-- =====================
-- 3. Course Images (product gallery)
-- =====================
create table if not exists public.course_images (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- =====================
-- 4. Course ↔ Category (many-to-many)
-- =====================
create table if not exists public.course_categories (
  course_id uuid not null references public.courses(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (course_id, category_id)
);

-- =====================
-- 5. Tags
-- =====================
create table if not exists public.course_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz default now()
);

-- =====================
-- 6. Course ↔ Tag (many-to-many)
-- =====================
create table if not exists public.course_tag_map (
  course_id uuid not null references public.courses(id) on delete cascade,
  tag_id uuid not null references public.course_tags(id) on delete cascade,
  primary key (course_id, tag_id)
);

-- =====================
-- 7. Course Meta (like WP post_meta - unlimited extensibility)
-- =====================
create table if not exists public.course_meta (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  meta_key text not null,
  meta_value text,
  created_at timestamptz default now(),
  unique (course_id, meta_key)
);

-- =====================
-- 8. Enrollments (user ↔ course)
-- =====================
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled', 'expired')),
  progress numeric(5,2) default 0,
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  expires_at timestamptz,
  unique (user_id, course_id)
);

-- =====================
-- Indexes for performance
-- =====================
create index if not exists idx_courses_status on public.courses(status);
create index if not exists idx_courses_slug on public.courses(slug);
create index if not exists idx_courses_sku on public.courses(sku);
create index if not exists idx_courses_created_at on public.courses(created_at desc);
create index if not exists idx_course_images_course on public.course_images(course_id);
create index if not exists idx_course_meta_course on public.course_meta(course_id);
create index if not exists idx_course_meta_key on public.course_meta(meta_key);
create index if not exists idx_enrollments_user on public.enrollments(user_id);
create index if not exists idx_enrollments_course on public.enrollments(course_id);
create index if not exists idx_categories_parent on public.categories(parent_id);
create index if not exists idx_categories_slug on public.categories(slug);

-- =====================
-- Auto-update updated_at trigger
-- =====================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists courses_updated_at on public.courses;
create trigger courses_updated_at
  before update on public.courses
  for each row execute function public.update_updated_at();

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at
  before update on public.categories
  for each row execute function public.update_updated_at();

-- =====================
-- Enable RLS on all tables
-- =====================
alter table public.categories enable row level security;
alter table public.courses enable row level security;
alter table public.course_images enable row level security;
alter table public.course_categories enable row level security;
alter table public.course_tags enable row level security;
alter table public.course_tag_map enable row level security;
alter table public.course_meta enable row level security;
alter table public.enrollments enable row level security;

-- =====================
-- RLS Policies (idempotent: drop + create)
-- =====================

-- Categories: anyone can read, admins can CRUD
drop policy if exists "Anyone can read categories" on public.categories;
create policy "Anyone can read categories" on public.categories for select using (true);
drop policy if exists "Admins can insert categories" on public.categories;
create policy "Admins can insert categories" on public.categories for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
drop policy if exists "Admins can update categories" on public.categories;
create policy "Admins can update categories" on public.categories for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
drop policy if exists "Admins can delete categories" on public.categories;
create policy "Admins can delete categories" on public.categories for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Courses: anyone can read published, admins can CRUD all
drop policy if exists "Anyone can read published courses" on public.courses;
create policy "Anyone can read published courses" on public.courses for select
  using (status = 'published' or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
drop policy if exists "Admins can insert courses" on public.courses;
create policy "Admins can insert courses" on public.courses for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
drop policy if exists "Admins can update courses" on public.courses;
create policy "Admins can update courses" on public.courses for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
drop policy if exists "Admins can delete courses" on public.courses;
create policy "Admins can delete courses" on public.courses for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Course images: follow course access
drop policy if exists "Anyone can read course images" on public.course_images;
create policy "Anyone can read course images" on public.course_images for select using (true);
drop policy if exists "Admins can manage course images" on public.course_images;
create policy "Admins can manage course images" on public.course_images for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Course categories join: anyone can read, admins can manage
drop policy if exists "Anyone can read course categories" on public.course_categories;
create policy "Anyone can read course categories" on public.course_categories for select using (true);
drop policy if exists "Admins can manage course categories" on public.course_categories;
create policy "Admins can manage course categories" on public.course_categories for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Tags: anyone can read, admins can manage
drop policy if exists "Anyone can read tags" on public.course_tags;
create policy "Anyone can read tags" on public.course_tags for select using (true);
drop policy if exists "Admins can manage tags" on public.course_tags;
create policy "Admins can manage tags" on public.course_tags for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Tag map: anyone can read, admins can manage
drop policy if exists "Anyone can read tag map" on public.course_tag_map;
create policy "Anyone can read tag map" on public.course_tag_map for select using (true);
drop policy if exists "Admins can manage tag map" on public.course_tag_map;
create policy "Admins can manage tag map" on public.course_tag_map for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Course meta: follow course access
drop policy if exists "Anyone can read course meta" on public.course_meta;
create policy "Anyone can read course meta" on public.course_meta for select using (true);
drop policy if exists "Admins can manage course meta" on public.course_meta;
create policy "Admins can manage course meta" on public.course_meta for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Enrollments: users can read own, admins can see all
drop policy if exists "Users can read own enrollments" on public.enrollments;
create policy "Users can read own enrollments" on public.enrollments for select
  using (auth.uid() = user_id);
drop policy if exists "Admins can read all enrollments" on public.enrollments;
create policy "Admins can read all enrollments" on public.enrollments for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
drop policy if exists "Admins can manage enrollments" on public.enrollments;
create policy "Admins can manage enrollments" on public.enrollments for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ============================================
-- PHASE 2: Enhanced Schema
-- Sections, Lessons, Quizzes, Certificates, Reviews
-- ============================================

-- =====================
-- 9. Alter courses (add instructor, prerequisites, certificate fields)
-- =====================
alter table public.courses
  add column if not exists instructor_name text,
  add column if not exists instructor_bio text,
  add column if not exists instructor_image text,
  add column if not exists prerequisites text,
  add column if not exists what_you_learn text,
  add column if not exists has_certificate boolean default false,
  add column if not exists certificate_template text;

-- =====================
-- 10. Course Sections (บท/Chapters)
-- =====================
create table if not exists public.course_sections (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================
-- 11. Course Lessons (บทเรียน)
-- =====================
create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.course_sections(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  lesson_type text not null default 'video' check (lesson_type in ('video', 'text', 'quiz', 'assignment', 'download')),
  content_url text,
  content_text text,
  duration_minutes int default 0,
  sort_order int default 0,
  is_preview boolean default false,
  is_required boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================
-- 12. Lesson Progress (per-user per-lesson tracking)
-- =====================
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  started_at timestamptz,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

-- =====================
-- 13. Quizzes (แบบทดสอบท้ายบท)
-- =====================
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  section_id uuid references public.course_sections(id) on delete set null,
  lesson_id uuid references public.course_lessons(id) on delete set null,
  title text not null,
  description text,
  passing_score int not null default 80,
  max_attempts int default 0,
  time_limit_minutes int,
  is_required boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================
-- 14. Quiz Questions (คำถาม)
-- =====================
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_text text not null,
  question_type text not null default 'multiple_choice' check (question_type in ('multiple_choice', 'true_false', 'short_answer')),
  options jsonb,
  correct_answer text not null,
  explanation text,
  points int default 1,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- =====================
-- 15. Quiz Attempts (ผลการทดสอบ)
-- =====================
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score int not null default 0,
  max_score int not null default 0,
  percentage numeric(5,2) default 0,
  passed boolean default false,
  answers jsonb,
  started_at timestamptz default now(),
  completed_at timestamptz
);

-- =====================
-- 16. Certificates (วุฒิบัตร/ใบรับรอง)
-- =====================
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrollment_id uuid references public.enrollments(id) on delete set null,
  certificate_number text not null unique,
  certificate_url text,
  issued_at timestamptz default now(),
  unique (user_id, course_id)
);

-- =====================
-- 17. Course Reviews (รีวิว & คะแนน)
-- =====================
create table if not exists public.course_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  review_text text,
  is_approved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, course_id)
);

-- =====================
-- 18. Alter enrollments (add certificate tracking)
-- =====================
alter table public.enrollments
  add column if not exists certificate_issued boolean default false,
  add column if not exists certificate_id uuid references public.certificates(id) on delete set null;

-- =====================
-- Phase 2 Indexes
-- =====================
create index if not exists idx_sections_course on public.course_sections(course_id);
create index if not exists idx_sections_sort on public.course_sections(course_id, sort_order);
create index if not exists idx_lessons_section on public.course_lessons(section_id);
create index if not exists idx_lessons_course on public.course_lessons(course_id);
create index if not exists idx_lessons_sort on public.course_lessons(section_id, sort_order);
create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id);
create index if not exists idx_lesson_progress_lesson on public.lesson_progress(lesson_id);
create index if not exists idx_lesson_progress_course on public.lesson_progress(course_id);
create index if not exists idx_quizzes_course on public.quizzes(course_id);
create index if not exists idx_quizzes_section on public.quizzes(section_id);
create index if not exists idx_quiz_questions_quiz on public.quiz_questions(quiz_id);
create index if not exists idx_quiz_attempts_quiz on public.quiz_attempts(quiz_id);
create index if not exists idx_quiz_attempts_user on public.quiz_attempts(user_id);
create index if not exists idx_certificates_user on public.certificates(user_id);
create index if not exists idx_certificates_course on public.certificates(course_id);
create index if not exists idx_certificates_number on public.certificates(certificate_number);
create index if not exists idx_reviews_course on public.course_reviews(course_id);
create index if not exists idx_reviews_user on public.course_reviews(user_id);

-- =====================
-- Phase 2 Auto-update triggers
-- =====================
drop trigger if exists sections_updated_at on public.course_sections;
create trigger sections_updated_at
  before update on public.course_sections
  for each row execute function public.update_updated_at();

drop trigger if exists lessons_updated_at on public.course_lessons;
create trigger lessons_updated_at
  before update on public.course_lessons
  for each row execute function public.update_updated_at();

drop trigger if exists quizzes_updated_at on public.quizzes;
create trigger quizzes_updated_at
  before update on public.quizzes
  for each row execute function public.update_updated_at();

drop trigger if exists reviews_updated_at on public.course_reviews;
create trigger reviews_updated_at
  before update on public.course_reviews
  for each row execute function public.update_updated_at();

-- =====================
-- Phase 2 RLS
-- =====================
alter table public.course_sections enable row level security;
alter table public.course_lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.certificates enable row level security;
alter table public.course_reviews enable row level security;

-- Sections: anyone can read published course sections, admins CRUD
drop policy if exists "Anyone can read sections" on public.course_sections;
create policy "Anyone can read sections" on public.course_sections for select using (true);
drop policy if exists "Admins can manage sections" on public.course_sections;
create policy "Admins can manage sections" on public.course_sections for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Lessons: anyone can read, admins CRUD
drop policy if exists "Anyone can read lessons" on public.course_lessons;
create policy "Anyone can read lessons" on public.course_lessons for select using (true);
drop policy if exists "Admins can manage lessons" on public.course_lessons;
create policy "Admins can manage lessons" on public.course_lessons for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Lesson progress: users own, admins all
drop policy if exists "Users can read own lesson progress" on public.lesson_progress;
create policy "Users can read own lesson progress" on public.lesson_progress for select
  using (auth.uid() = user_id);
drop policy if exists "Users can update own lesson progress" on public.lesson_progress;
create policy "Users can update own lesson progress" on public.lesson_progress for insert
  with check (auth.uid() = user_id);
drop policy if exists "Users can modify own lesson progress" on public.lesson_progress;
create policy "Users can modify own lesson progress" on public.lesson_progress for update
  using (auth.uid() = user_id);
drop policy if exists "Admins can manage all lesson progress" on public.lesson_progress;
create policy "Admins can manage all lesson progress" on public.lesson_progress for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Quizzes: anyone can read, admins CRUD
drop policy if exists "Anyone can read quizzes" on public.quizzes;
create policy "Anyone can read quizzes" on public.quizzes for select using (true);
drop policy if exists "Admins can manage quizzes" on public.quizzes;
create policy "Admins can manage quizzes" on public.quizzes for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Quiz questions: enrolled users can read, admins CRUD
drop policy if exists "Enrolled users can read quiz questions" on public.quiz_questions;
create policy "Enrolled users can read quiz questions" on public.quiz_questions for select
  using (
    exists (
      select 1 from public.quizzes q
      join public.enrollments e on e.course_id = q.course_id
      where q.id = quiz_id and e.user_id = auth.uid() and e.status = 'active'
    )
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
drop policy if exists "Admins can manage quiz questions" on public.quiz_questions;
create policy "Admins can manage quiz questions" on public.quiz_questions for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Quiz attempts: users own, admins all
drop policy if exists "Users can read own quiz attempts" on public.quiz_attempts;
create policy "Users can read own quiz attempts" on public.quiz_attempts for select
  using (auth.uid() = user_id);
drop policy if exists "Users can insert own quiz attempts" on public.quiz_attempts;
create policy "Users can insert own quiz attempts" on public.quiz_attempts for insert
  with check (auth.uid() = user_id);
drop policy if exists "Admins can manage all quiz attempts" on public.quiz_attempts;
create policy "Admins can manage all quiz attempts" on public.quiz_attempts for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Certificates: users own, admins all, public verify by number
drop policy if exists "Users can read own certificates" on public.certificates;
create policy "Users can read own certificates" on public.certificates for select
  using (auth.uid() = user_id);
drop policy if exists "Anyone can verify certificate" on public.certificates;
create policy "Anyone can verify certificate" on public.certificates for select
  using (true);
drop policy if exists "Admins can manage certificates" on public.certificates;
create policy "Admins can manage certificates" on public.certificates for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Reviews: anyone can read approved, users can manage own
drop policy if exists "Anyone can read approved reviews" on public.course_reviews;
create policy "Anyone can read approved reviews" on public.course_reviews for select
  using (is_approved = true or auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
drop policy if exists "Users can insert own reviews" on public.course_reviews;
create policy "Users can insert own reviews" on public.course_reviews for insert
  with check (auth.uid() = user_id);
drop policy if exists "Users can update own reviews" on public.course_reviews;
create policy "Users can update own reviews" on public.course_reviews for update
  using (auth.uid() = user_id);
drop policy if exists "Admins can manage all reviews" on public.course_reviews;
create policy "Admins can manage all reviews" on public.course_reviews for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ============================================
-- Schema complete! Total tables: 16
-- Phase 1: categories, courses, course_images,
--   course_categories, course_tags, course_tag_map,
--   course_meta, enrollments
-- Phase 2: course_sections, course_lessons,
--   lesson_progress, quizzes, quiz_questions,
--   quiz_attempts, certificates, course_reviews
-- ============================================
