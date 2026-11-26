import { buttonForm, database, isUuid, page } from "./_lib/subscriptions.js";

function invalidLink() {
  return page({
    title: "Invalid link",
    heading: "This unsubscribe link doesn't look right",
    message: "Try the unsubscribe link from your most recent email again.",
    status: 400,
  });
}

// GET shows a button; POST unsubscribes. Mail clients' one-click unsubscribe
// (RFC 8058) POSTs straight to the List-Unsubscribe URL, token in the query.
export default {
  async fetch(request) {
    const url = new URL(request.url);
    let token = url.searchParams.get("token");

    if (request.method === "GET") {
      if (!isUuid(token)) return invalidLink();
      return page({
        title: "Unsubscribe",
        heading: "Unsubscribe from new blog emails?",
        message: "You won't get any more emails from naren7's raven.",
        form: buttonForm("Unsubscribe", { token }),
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, POST" },
      });
    }

    if (!isUuid(token)) {
      const form = await request.formData().catch(() => null);
      token = form?.get("token");
    }
    if (!isUuid(token)) return invalidLink();

    const sql = database();
    if (!sql) {
      return page({
        title: "Unavailable",
        heading: "Something's off on my end",
        message: "Please try again in a little while.",
        status: 503,
      });
    }

    try {
      await sql`
        update portfolio_private.blog_subscribers
        set status = 'unsubscribed', unsubscribed_at = now(),
            confirm_token_hash = null
        where unsubscribe_token = ${token} and status <> 'unsubscribed'
      `;
      return page({
        title: "Unsubscribed",
        heading: "You're unsubscribed",
        message:
          "No more emails from me. If you change your mind, you can subscribe again from the blogs page.",
      });
    } catch (error) {
      console.error("Blog unsubscribe failed", error?.code ?? error?.name);
      return page({
        title: "Unavailable",
        heading: "Something's off on my end",
        message: "Please try again in a little while.",
        status: 503,
      });
    }
  },
};
