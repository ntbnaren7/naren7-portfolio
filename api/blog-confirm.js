import {
  buttonForm,
  confirmWindowDays,
  database,
  hashToken,
  page,
} from "./_lib/subscriptions.js";

const tokenPattern = /^[\w-]{43}$/;

function invalidLink() {
  return page({
    title: "Link expired",
    heading: "This link doesn't work anymore",
    message:
      "It may have expired or already been used. If you already confirmed, you're all set. Otherwise, subscribe again from the blogs page.",
    status: 400,
  });
}

// GET shows a confirm button; only the POST from that button changes
// anything. Mail scanners that pre-open links therefore can't confirm on
// someone's behalf.
export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "GET") {
      const token = url.searchParams.get("token") ?? "";
      if (!tokenPattern.test(token)) return invalidLink();
      return page({
        title: "Confirm subscription",
        heading: "One last step",
        message:
          "Confirm below and you'll get an email whenever a new blog goes up. Nothing else, ever.",
        form: buttonForm("Confirm subscription", { token }),
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, POST" },
      });
    }
    // No Origin check: the page sends no referrer (to keep the token out of
    // it), so browsers post with "Origin: null". The single-use 256-bit token
    // is what proves the click came from the inbox.

    const form = await request.formData().catch(() => null);
    const token = form?.get("token");
    if (typeof token !== "string" || !tokenPattern.test(token)) {
      return invalidLink();
    }

    const sql = database();
    if (!sql) {
      return page({
        title: "Unavailable",
        heading: "Something's off on my end",
        message: "Please try the link again in a little while.",
        status: 503,
      });
    }

    try {
      const confirmed = await sql`
        update portfolio_private.blog_subscribers
        set status = 'confirmed', confirmed_at = now(), confirm_token_hash = null
        where confirm_token_hash = ${hashToken(token)}
          and status = 'pending'
          and confirmation_sent_at
              > now() - make_interval(days => ${confirmWindowDays})
        returning id
      `;
      if (!confirmed.length) return invalidLink();
      return page({
        title: "Subscribed",
        heading: "You're in",
        message:
          "The raven will find you whenever a new blog goes up. Every email has a one-click unsubscribe link.",
      });
    } catch (error) {
      console.error("Blog confirm failed", error?.code ?? error?.name);
      return page({
        title: "Unavailable",
        heading: "Something's off on my end",
        message: "Please try the link again in a little while.",
        status: 503,
      });
    }
  },
};
