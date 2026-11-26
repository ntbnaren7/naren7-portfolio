-- The API functions connect as the restricted portfolio_likes_app role.
-- Grant only what the subscription endpoints use.
grant select, insert, update, delete
  on portfolio_private.blog_subscribers to portfolio_likes_app;
grant select, insert, delete
  on portfolio_private.blog_notifications to portfolio_likes_app;

-- RLS stays on; only the app role gets through, matching blog_likes.
create policy blog_subscribers_app_access on portfolio_private.blog_subscribers
  for all to portfolio_likes_app using (true) with check (true);
create policy blog_notifications_app_access on portfolio_private.blog_notifications
  for all to portfolio_likes_app using (true) with check (true);
