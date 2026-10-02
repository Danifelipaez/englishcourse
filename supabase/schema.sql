-- Inglés para mi amor — schema. Idempotent: safe to re-run with `npm run db`.

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null default 'Meri',
  role text not null default 'student' check (role in ('student','admin')),
  theory_target int not null default 15 check (theory_target between 10 and 20),
  bonus_freezes int not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

-- New auth user -> profile
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Meri'))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Only admins may change role / bonus_freezes
create or replace function public.guard_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (new.role is distinct from old.role or new.bonus_freezes is distinct from old.bonus_freezes)
     and auth.uid() is not null and not public.is_admin() then  -- direct DB/service access is trusted
    raise exception 'only admin can change role or freezes';
  end if;
  return new;
end $$;
drop trigger if exists guard_profile on public.profiles;
create trigger guard_profile before update on public.profiles
  for each row execute function public.guard_profile();

create table if not exists public.study_days (
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  day date not null,
  theory_sec int not null default 0,
  free_sec int not null default 0,
  theory_target int not null default 15,
  free_log jsonb not null default '[]',
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists public.answers (
  id bigserial primary key,
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  day date not null,
  local_hour smallint,
  context text not null,          -- lesson | review | exam | practice
  lesson_id text,
  item_id text not null,
  skill text,                     -- grammar | vocab | listening | speaking | reading
  topic text,
  correct boolean not null,
  given text,
  combo int not null default 0,
  points int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists answers_user_day on public.answers (user_id, day);

create table if not exists public.lesson_progress (
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  lesson_id text not null,
  best_score int not null default 0,
  attempts int not null default 0,
  completed_at timestamptz,
  primary key (user_id, lesson_id)
);

create table if not exists public.exam_results (
  id bigserial primary key,
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  module_id text not null,
  score int not null,
  passed boolean not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.cards (
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  card_id text not null,
  box int not null default 1,
  due date not null default current_date,
  reps int not null default 0,
  lapses int not null default 0,
  last_day date,
  primary key (user_id, card_id)
);

create table if not exists public.rewards (
  id bigserial primary key,
  user_id uuid not null references public.profiles on delete cascade,
  title text not null,
  note text,
  kind text not null check (kind in ('streak','xp','lessons','exams','days')),
  target int not null,
  created_at timestamptz not null default now(),
  opened_at timestamptz
);

create table if not exists public.notes (
  id bigserial primary key,
  user_id uuid not null references public.profiles on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table if not exists public.day_overrides (
  user_id uuid not null references public.profiles on delete cascade,
  day date not null,
  reason text,
  created_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists public.writings (
  id bigserial primary key,
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  kind text not null,             -- correct | chat
  prompt text,
  body text not null,
  feedback jsonb,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.study_days enable row level security;
alter table public.answers enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.exam_results enable row level security;
alter table public.cards enable row level security;
alter table public.rewards enable row level security;
alter table public.notes enable row level security;
alter table public.day_overrides enable row level security;
alter table public.writings enable row level security;

drop policy if exists p_profiles_sel on public.profiles;
create policy p_profiles_sel on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists p_profiles_upd on public.profiles;
create policy p_profiles_upd on public.profiles for update using (id = auth.uid() or public.is_admin());

-- Student owns these; admin can read/manage all
do $$
declare t text;
begin
  foreach t in array array['study_days','answers','lesson_progress','exam_results','cards','writings'] loop
    execute format('drop policy if exists p_own on public.%I', t);
    execute format('create policy p_own on public.%I for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin())', t);
  end loop;
  -- Admin writes these; student reads + marks opened/read
  foreach t in array array['rewards','notes','day_overrides'] loop
    execute format('drop policy if exists p_sel on public.%I', t);
    execute format('create policy p_sel on public.%I for select using (user_id = auth.uid() or public.is_admin())', t);
    execute format('drop policy if exists p_admin on public.%I', t);
    execute format('create policy p_admin on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

drop policy if exists p_student_upd on public.rewards;
create policy p_student_upd on public.rewards for update using (user_id = auth.uid());
drop policy if exists p_student_upd on public.notes;
create policy p_student_upd on public.notes for update using (user_id = auth.uid());

-- Aggregates (security_invoker => RLS applies)
create or replace view public.v_answer_daily with (security_invoker = true) as
  select user_id, day, context, skill, topic,
         count(*)::int as n, sum(correct::int)::int as ok,
         sum(points)::int as pts, max(combo)::int as best_combo
  from public.answers group by 1,2,3,4,5;

create or replace view public.v_item_misses with (security_invoker = true) as
  select user_id, item_id, max(lesson_id) as lesson_id, max(topic) as topic,
         count(*)::int as attempts, sum((not correct)::int)::int as misses,
         (array_agg(given order by created_at desc) filter (where not correct))[1] as last_wrong,
         max(created_at) as last_seen
  from public.answers group by 1,2;

create or replace view public.v_hours with (security_invoker = true) as
  select user_id, local_hour, count(*)::int as n from public.answers group by 1,2;

grant select on public.v_answer_daily, public.v_item_misses, public.v_hours to authenticated;

-- Timer saves deltas, so iPhone + Mac on the same day add up instead of overwriting
create or replace function public.add_study_time(p_day date, p_theory int, p_free int, p_target int, p_log jsonb default '[]')
returns public.study_days language sql security invoker set search_path = public as $$
  insert into public.study_days (user_id, day, theory_sec, free_sec, theory_target, free_log)
  values (auth.uid(), p_day, p_theory, p_free, p_target, p_log)
  on conflict (user_id, day) do update set
    theory_sec = study_days.theory_sec + excluded.theory_sec,
    free_sec = study_days.free_sec + excluded.free_sec,
    theory_target = excluded.theory_target,
    free_log = study_days.free_log || excluded.free_log,
    updated_at = now()
  returning *;
$$;
grant execute on function public.add_study_time to authenticated;
