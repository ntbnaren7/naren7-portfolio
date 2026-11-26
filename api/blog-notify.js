// Emails confirmed subscribers about a published post. Called only by
// `npm run notify` (scripts/notify-subscribers.mjs) with BLOG_NOTIFY_SECRET.
//   mode "preview": counts who would get it; sends nothing.
//   mode "test":    sends the email to testEmail only.
//   mode "send":    sends to confirmed subscribers who haven't had this post
//                   yet, in time-boxed rounds; the script repeats until done.
import { createHash, timingSafeEqual } from "node:crypto";
import posts from "../src/data/blog-posts.json" with { type: "json" };
import {
  database,
  json,
  newPostEmail,
  normalizeEmail,
  sendEmail,
} from "./_lib/subscriptions.js";

const roundBudgetMs = 200_000;
const sendGapMs = 600; // Stays under Resend's default 2 requests per second.
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function authorized(request) {
  const secret = process.env.BLOG_NOTIFY_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret || secret.length < 32 || !header.startsWith("Bearer ")) {
    return false;
  }
  const digest = (value) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(header.slice(7)), digest(secret));
}

async function pendingCount(sql, slug) {
  const [{ count }] = await sql`
    select count(*)::int as count
    from portfolio_private.blog_subscribers s
    where s.status = 'confirmed'
      and not exists (
        select 1 from portfolio_private.blog_notifications n
        where n.subscriber_id = s.id and n.post_slug = ${slug}
      )
  `;
  return count;
}

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, { Allow: "POST" });
    }
    if (!authorized(request)) return json({ error: "Unauthorized" }, 401);

    const body = await request.json().catch(() => null);
    // Only posts in the deployed build can be announced, so an email can't
    // go out before its page is live.
    const post = posts.find(({ slug }) => slug === body?.slug);
    if (!post) {
      return json({ error: "Unknown post, or it isn't deployed yet" }, 404);
    }

    const sql = database();
    if (!sql || !process.env.RESEND_API_KEY) {
      return json({ error: "Database or Resend is not configured" }, 503);
    }

    const origin = new URL(request.url).origin;
    const postUrl = new URL(post.url, origin).href;
    const unsubscribeBase = `${origin}/api/blog-unsubscribe?token=`;
    const preview = newPostEmail({
      post,
      postUrl,
      unsubscribeUrl: `${unsubscribeBase}preview`,
    });

    try {
      if (body.mode === "preview") {
        return json({
          title: post.title,
          subject: preview.subject,
          postUrl,
          pending: await pendingCount(sql, post.slug),
        });
      }

      if (body.mode === "test") {
        const to = normalizeEmail(body.testEmail);
        if (!to) return json({ error: "Invalid test email" }, 400);
        await sendEmail({
          to,
          subject: `[Test] ${preview.subject}`,
          html: preview.html,
          text: preview.text,
        });
        return json({ sent: 1 });
      }

      if (body.mode !== "send") return json({ error: "Unknown mode" }, 400);

      const started = Date.now();
      let sent = 0;
      let failed = 0;
      while (Date.now() - started < roundBudgetMs) {
        const batch = await sql`
          select s.id, s.email, s.unsubscribe_token
          from portfolio_private.blog_subscribers s
          where s.status = 'confirmed'
            and not exists (
              select 1 from portfolio_private.blog_notifications n
              where n.subscriber_id = s.id and n.post_slug = ${post.slug}
            )
          order by s.confirmed_at
          limit 25
        `;
        if (!batch.length) break;

        for (const subscriber of batch) {
          if (Date.now() - started >= roundBudgetMs) break;
          // Record first: if anything crashes after this, the worst case is
          // one person missing an email, never anyone getting it twice.
          const claimed = await sql`
            insert into portfolio_private.blog_notifications
              (post_slug, subscriber_id)
            values (${post.slug}, ${subscriber.id})
            on conflict do nothing
            returning subscriber_id
          `;
          if (!claimed.length) continue;

          const unsubscribeUrl = unsubscribeBase + subscriber.unsubscribe_token;
          const message = newPostEmail({ post, postUrl, unsubscribeUrl });
          try {
            await sendEmail({
              to: subscriber.email,
              ...message,
              headers: {
                "List-Unsubscribe": `<${unsubscribeUrl}>`,
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
              },
              idempotencyKey: `blog-${post.slug}-${subscriber.id}`,
            });
            sent += 1;
          } catch (error) {
            failed += 1;
            console.error("Blog notify send failed", error?.message);
            // Not sent, so a later run may retry this subscriber.
            await sql`
              delete from portfolio_private.blog_notifications
              where post_slug = ${post.slug}
                and subscriber_id = ${subscriber.id}
            `;
          }
          await sleep(sendGapMs);
        }
        // Stop the round instead of retrying failures in a tight loop.
        if (failed) break;
      }

      return json({
        sent,
        failed,
        remaining: await pendingCount(sql, post.slug),
      });
    } catch (error) {
      console.error("Blog notify failed", error?.code ?? error?.message);
      return json({ error: "Notify failed" }, 502);
    }
  },
};
