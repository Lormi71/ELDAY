-- Вставь это целиком в Supabase → SQL Editor → Run

create table if not exists public.votes (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  nick text,
  discord_id text,
  picks jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.votes enable row level security;

-- голосовать может только вошедший, и только за себя (user_id совпадает с аккаунтом)
create policy "insert own vote" on public.votes
  for insert to authenticated
  with check (user_id = auth.uid());

-- человек видит только свою запись (чтобы сайт мог понять, что он уже голосовал)
create policy "read own vote" on public.votes
  for select to authenticated
  using (user_id = auth.uid());

-- изменять и удалять голоса нельзя никому (политик на update/delete нет)
