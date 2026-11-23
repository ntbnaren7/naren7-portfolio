import { randomUUID } from "node:crypto";
import postgres from "postgres";
import posts from "../src/data/blog-posts.json" with { type: "json" };

const slugs = posts.map(({ slug }) => slug);
const cookieName = "portfolio_blog_visitor";
const uuid = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i;
let sql;

function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store", ...headers },
  });
}

function visitorFrom(request) {
  const cookie = request.headers.get("cookie")?.split(/;\s*/);
  const value = cookie?.find((part) => part.startsWith(cookieName + "="));
  const visitor = value?.slice(cookieName.length + 1);
  return visitor && uuid.test(visitor) ? visitor : null;
}

async function readCounts(visitor) {
  const rows = await sql`
    select post_slug, count(*)::int as count,
           bool_or(visitor_id = ${visitor}::uuid) as liked
    from portfolio_private.blog_likes
    where post_slug in ${sql(slugs)}
    group by post_slug
  `;
  const result = Object.fromEntries(
    slugs.map((slug) => [slug, { count: 0, liked: false }]),
  );
  for (const { post_slug, count, liked } of rows) {
    result[post_slug] = { count, liked };
  }
  return result;
}

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "PUT") {
      return json({ error: "Method not allowed" }, 405, { Allow: "GET, PUT" });
    }

    const url = new URL(request.url);
    const existingVisitor = visitorFrom(request);
    const visitor = existingVisitor ?? randomUUID();

    let update;
    if (request.method === "PUT") {
      if (request.headers.get("origin") !== url.origin) {
        return json({ error: "Invalid request origin" }, 403);
      }
      if (!existingVisitor)
        return json({ error: "Missing visitor cookie" }, 400);
      update = await request.json().catch(() => null);
      if (!slugs.includes(update?.slug) || typeof update?.liked !== "boolean") {
        return json({ error: "Invalid like request" }, 400);
      }
    }

    const databaseUrl = process.env.BLOG_LIKES_DATABASE_URL;
    if (!databaseUrl) return json({ error: "Blog likes unavailable" }, 503);

    try {
      sql ??= postgres(databaseUrl, {
        prepare: false,
        ssl: "require",
        max: 2,
        connect_timeout: 5,
        idle_timeout: 20,
      });
      if (update?.liked === true) {
        await sql`
          insert into portfolio_private.blog_likes (post_slug, visitor_id)
          values (${update.slug}, ${visitor})
          on conflict (post_slug, visitor_id) do nothing
        `;
      } else if (update) {
        await sql`
          delete from portfolio_private.blog_likes
          where post_slug = ${update.slug} and visitor_id = ${visitor}
        `;
      }

      const counts = await readCounts(visitor);
      const secure = url.protocol === "https:" ? "; Secure" : "";
      const headers = existingVisitor
        ? {}
        : {
            "Set-Cookie": `${cookieName}=${visitor}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Strict${secure}`,
          };
      return json(counts, 200, headers);
    } catch (error) {
      console.error(
        "Blog likes database request failed",
        error?.code ?? error?.name,
      );
      return json({ error: "Blog likes unavailable" }, 503);
    }
  },
};
