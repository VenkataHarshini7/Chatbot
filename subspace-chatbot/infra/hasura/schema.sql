create extension if not exists pgcrypto;
create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text,
  created_at timestamptz default now()
);
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  user_id uuid,
  role text not null,
  content text not null,
  created_at timestamptz default now()
);
create index if not exists idx_messages_chat_created_at on public.messages (chat_id, created_at);
