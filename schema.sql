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
