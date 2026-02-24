-- ============================================
-- LongTalkDoo: Profiles Table Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'user' check (role in ('admin', 'user')),
  display_name text,
  created_at timestamptz default now()
);

-- 2. Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, display_name)
  values (new.id, new.email, 'user', split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Enable Row Level Security
alter table public.profiles enable row level security;

-- 4. RLS Policies
-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles
create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Admins can update any profile's role
create policy "Admins can update roles"
  on public.profiles for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- After running this SQL:
-- 1. Go to Authentication → Users → Add User
--    - admin@mail.com / 1111
--    - user@mail.com / 2222
-- 2. Then run:
--    UPDATE profiles SET role = 'admin' WHERE email = 'admin@mail.com';
-- ============================================
