-- CyberLearn schema. Run once in Supabase: SQL Editor -> New query -> paste -> Run.

create table public.admins (
  user_id uuid primary key references auth.users on delete cascade
);
alter table public.admins enable row level security;
create policy "admins read self" on public.admins for select using (user_id = auth.uid());

create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  description text not null default '' check (char_length(description) <= 600),
  cat text not null check (cat in ('fund','net','linux','web','pen','blue','dfir','cert')),
  kind text not null check (kind in ('playlist','video')),
  yt text not null check (yt ~ '^[A-Za-z0-9_-]{11,64}$'),
  created_by uuid not null default auth.uid() references auth.users on delete cascade,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.courses enable row level security;

create policy "read approved, own or admin" on public.courses for select
  using (approved or created_by = auth.uid() or public.is_admin());
create policy "signed-in users submit" on public.courses for insert to authenticated
  with check (created_by = auth.uid() and (approved = false or public.is_admin()));
create policy "admins update" on public.courses for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "delete own pending or admin" on public.courses for delete to authenticated
  using (public.is_admin() or (created_by = auth.uid() and not approved));

create table public.progress (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  course_id uuid not null references public.courses on delete cascade,
  status text not null default 'todo' check (status in ('todo','doing','done')),
  notes text not null default '' check (char_length(notes) <= 5000),
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);
alter table public.progress enable row level security;
create policy "own progress" on public.progress for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- After you sign up on the site, make yourself admin (put your email):
-- insert into public.admins select id from auth.users where email = 'you@example.com';

-- v2 (already applied on the cyberlearn project): courses from any platform
-- alter table public.courses add column if not exists lessons jsonb not null default '[]'::jsonb;
-- alter table public.courses alter column yt drop not null;
-- (kind now allows 'lessons'; courses_source_check validates playlist/video/lessons; lessons limited to 300 items / 60KB)

-- v3 (already applied on the cyberlearn project): admin-only video uploads from the device
-- storage bucket "videos" (public read, 50MB per file, mp4/webm/ogg) + insert/update/delete policies for admins.

-- v4: Telegram lessons need no database change (lessons are stored as {t, p:'telegram', s:'channel/123'} in the existing jsonb column).

-- v5 (already applied): the site requires login. Courses are readable only by signed-in users:
-- drop policy "read approved, own or admin" on public.courses;
-- create policy "read approved, own or admin" on public.courses for select to authenticated
--   using (approved or created_by = auth.uid() or public.is_admin());

-- v6 (already applied): general course categories (not cybersecurity only)
-- courses_cat_check now allows: dev, design, security, data, biz, lang, science, self, other
-- (old cybersecurity categories were migrated to 'security')

-- v7 (already applied): only admins can add courses
-- drop policy "signed-in users submit" on public.courses;
-- create policy "admins add courses" on public.courses for insert to authenticated
--   with check (created_by = auth.uid() and public.is_admin());

-- v8 (already applied): learning dashboard
-- progress: + watched text[], total, last_key, last_title, last_pos, last_sec, last_at
-- activity(user_id, day, events) + rpc touch_activity(p_day date)

-- v9 (already applied): learning paths
-- tables: paths, skills, path_skills(optional = remedial), skill_prereqs(kind hard|review), skill_courses, questions, skill_results
-- rpc: get_quiz(skill) -> questions without answers; submit_quiz(skill, answers) -> graded on the server (pass >= 67)
-- seed: 3 paths (web, ai, security), 25 skills, 33 prerequisite edges, 75 questions
