import {
  confirmWindowDays,
  confirmationEmail,
  database,
  hashToken,
  json,
  newToken,
  normalizeEmail,
  sendEmail,
} from "./_lib/subscriptions.js";

// Caps on confirmation emails, so the form can't be used to flood an inbox
// or burn through the sending quota.
const perAddressInterval = "1 day";
const maxConfirmationsPerHour = 30;

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, { Allow: "POST" });
    }
    const url = new URL(request.url);
    if (request.headers.get("origin") !== url.origin) {
      return json({ error: "Invalid request origin" }, 403);
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return json({ error: "Invalid request" }, 400);
    }
    // Honeypot: real visitors never see this field. Bots get a normal-looking
    // reply and nothing is stored or sent.
    if (typeof body.website === "string" && body.website.trim()) {
      return json({ status: "pending" });
    }
    const email = normalizeEmail(body.email);
    if (!email) return json({ error: "Invalid email address" }, 400);

    const sql = database();
    if (!sql || !process.env.RESEND_API_KEY) {
      return json({ error: "Subscriptions unavailable" }, 503);
    }

    try {
      // Unconfirmed sign-ups are forgotten once their link has expired.
      await sql`
        delete from portfolio_private.blog_subscribers
        where status = 'pending'
          and coalesce(confirmation_sent_at, created_at)
              < now() - make_interval(days => ${confirmWindowDays})
      `;

      const [{ recent }] = await sql`
        select count(*)::int as recent
        from portfolio_private.blog_subscribers
        where confirmation_sent_at > now() - interval '1 hour'
      `;
      if (recent >= maxConfirmationsPerHour) {
        return json({ error: "Too many sign-ups right now" }, 429);
      }

      // Only (re)send when the address isn't already confirmed and hasn't had
      // a confirmation email recently. The reply is the same either way, so
      // the form never reveals whether an address is subscribed.
      const token = newToken();
      const claimed = await sql`
        insert into portfolio_private.blog_subscribers
          (email, status, confirm_token_hash, confirmation_sent_at)
        values (${email}, 'pending', ${hashToken(token)}, now())
        on conflict (email) do update set
          status = 'pending',
          confirm_token_hash = excluded.confirm_token_hash,
          confirmation_sent_at = excluded.confirmation_sent_at,
          unsubscribed_at = null
        where blog_subscribers.status <> 'confirmed'
          and (
            blog_subscribers.confirmation_sent_at is null
            or blog_subscribers.confirmation_sent_at
               < now() - ${perAddressInterval}::interval
          )
        returning id
      `;

      if (claimed.length) {
        const message = confirmationEmail({
          confirmUrl: `${url.origin}/api/blog-confirm?token=${token}`,
          siteUrl: url.origin,
        });
        try {
          await sendEmail({ to: email, ...message });
        } catch (error) {
          // Let the visitor retry straight away instead of waiting a day.
          await sql`
            update portfolio_private.blog_subscribers
            set confirmation_sent_at = null, confirm_token_hash = null
            where id = ${claimed[0].id}
          `;
          throw error;
        }
      }

      return json({ status: "pending" });
    } catch (error) {
      console.error("Blog subscribe failed", error?.code ?? error?.message);
      return json({ error: "Subscription failed" }, 502);
    }
  },
};
