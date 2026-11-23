create schema if not exists portfolio_private;

create table if not exists portfolio_private.blog_likes (
  post_slug text not null,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (post_slug, visitor_id)
);

alter table portfolio_private.blog_likes enable row level security;
