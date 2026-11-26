-- Blog email subscriptions (double opt-in). Only the API functions touch these
-- tables, through the server-only connection string; RLS stays on with no
-- policies so the public Supabase APIs can't read them.
create table if not exists portfolio_private.blog_subscribers (
  id uuid primary key default gen_random_uuid(),
  -- Stored trimmed and lowercased.
  email text not null unique check (char_length(email) <= 254),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'unsubscribed')),
  -- SHA-256 of the emailed confirmation token; cleared once used.
  confirm_token_hash text unique,
  -- Stable per-subscriber token for the unsubscribe link in every email.
  unsubscribe_token uuid not null unique default gen_random_uuid(),
  confirmation_sent_at timestamptz,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists blog_subscribers_confirmed_idx
  on portfolio_private.blog_subscribers (status)
  where status = 'confirmed';

-- One row per post per subscriber, written before each email is sent, so a
-- rerun of the notify command never emails anyone twice about the same post.
create table if not exists portfolio_private.blog_notifications (
  post_slug text not null,
  subscriber_id uuid not null
    references portfolio_private.blog_subscribers (id) on delete cascade,
  sent_at timestamptz not null default now(),
  primary key (post_slug, subscriber_id)
);

alter table portfolio_private.blog_subscribers enable row level security;
alter table portfolio_private.blog_notifications enable row level security;
