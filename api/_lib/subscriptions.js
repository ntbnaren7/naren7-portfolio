// Shared pieces of the blog subscription functions. Files under api/_lib are
// not deployed as functions of their own.
import { createHash, randomBytes } from "node:crypto";
import postgres from "postgres";

export const siteName = "naren7";
export const sender = "naren7's raven <raven@naren7.me>";
export const confirmWindowDays = 7;

let sql;

/** Postgres client, or null when the database isn't configured. */
export function database() {
  const url = process.env.BLOG_LIKES_DATABASE_URL;
  if (!url) return null;
  sql ??= postgres(url, {
    prepare: false,
    ssl: "require",
    max: 2,
    connect_timeout: 5,
    idle_timeout: 20,
  });
  return sql;
}

export const newToken = () => randomBytes(32).toString("base64url");
export const hashToken = (token) =>
  createHash("sha256").update(token).digest("hex");

const uuidPattern = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i;
export const isUuid = (value) =>
  typeof value === "string" && uuidPattern.test(value);

const emailPattern =
  /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[^\s@<>()[\],;:"]+$/;
export function normalizeEmail(value) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && emailPattern.test(email) ? email : null;
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store", ...headers },
  });
}

/** Sends one email through Resend's REST API. Throws on failure. */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  headers,
  idempotencyKey,
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from: sender,
      to: [to],
      subject,
      html,
      text,
      headers,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Resend responded ${response.status}: ${detail.slice(0, 200)}`,
    );
  }
  return response.json();
}

// ---------------------------------------------------------------------------
// Emails. Table layout and inline styles, since email clients ignore most CSS.

function emailLayout({ preheader, content, footer }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(siteName)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;">
<tr><td style="padding:32px 32px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;letter-spacing:0.04em;color:#71717b;">
&#x1F426;&#x200D;&#x2B1B; naren7's raven
</td></tr>
<tr><td style="padding:8px 32px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#27272a;">
${content}
</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
<tr><td style="padding:16px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#a1a1aa;text-align:center;">
${footer}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function emailButton(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr>
<td style="border-radius:8px;background:#18181b;">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:11px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#fafafa;text-decoration:none;border-radius:8px;">${escapeHtml(label)}</a>
</td></tr></table>`;
}

export function confirmationEmail({ confirmUrl, siteUrl }) {
  const subject = "Confirm your subscription to naren7's blogs";
  const html = emailLayout({
    preheader: "One tap and the raven will find you whenever a new blog lands.",
    content: `<p style="margin:0 0 12px;font-size:20px;font-weight:600;color:#09090b;">Confirm your subscription</p>
<p style="margin:0;">Someone (hopefully you) asked to get an email whenever I publish a new blog on <a href="${escapeHtml(siteUrl)}" style="color:#2563eb;">naren7.me</a>. Tap below to confirm.</p>
${emailButton(confirmUrl, "Confirm subscription")}
<p style="margin:0;color:#71717b;font-size:13px;">One email per new blog, nothing else. If this wasn't you, just ignore this email and you won't hear from me again. The link expires in ${confirmWindowDays} days.</p>`,
    footer:
      "You're getting this because this address was entered on naren7.me.",
  });
  const text = `Confirm your subscription

Someone (hopefully you) asked to get an email whenever I publish a new blog on naren7.me. Open this link to confirm:

${confirmUrl}

One email per new blog, nothing else. If this wasn't you, just ignore this email and you won't hear from me again. The link expires in ${confirmWindowDays} days.`;
  return { subject, html, text };
}

export function newPostEmail({ post, postUrl, unsubscribeUrl }) {
  const subject = `New blog: ${post.title}`;
  const html = emailLayout({
    preheader: post.description,
    content: `<p style="margin:0 0 4px;font-size:13px;color:#71717b;">A new blog just landed</p>
<p style="margin:0 0 12px;font-size:20px;line-height:1.35;font-weight:600;color:#09090b;">${escapeHtml(post.title)}</p>
<p style="margin:0;">${escapeHtml(post.description)}</p>
${emailButton(postUrl, "Read it")}
<p style="margin:0;color:#71717b;font-size:13px;">${escapeHtml(post.readingTime ?? "")}</p>`,
    footer: `You're getting this because you subscribed on naren7.me.<br><a href="${escapeHtml(unsubscribeUrl)}" style="color:#a1a1aa;">Unsubscribe</a>`,
  });
  const text = `A new blog just landed: ${post.title}

${post.description}

Read it: ${postUrl}

--
You're getting this because you subscribed on naren7.me.
Unsubscribe: ${unsubscribeUrl}`;
  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// Small server-rendered pages for the confirm and unsubscribe links, styled
// like the site and following the visitor's saved theme.

export function page({ title, heading, message, form, status = 200 }) {
  const body = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<script>try{if(localStorage.getItem("portfolio-theme")==="light")document.documentElement.dataset.theme="light"}catch{}</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)} | naren7</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=circle">
<style>
@font-face{font-family:"Geist";src:url("/fonts/geist-sans.woff2") format("woff2");font-weight:100 900;font-display:swap}
:root{--bg:#000;--fg:#f4f4f5;--muted:#9f9fa9;--card:#09090b;--border:rgb(255 255 255/15%);--btn-bg:#fafafa;--btn-fg:#09090b}
:root[data-theme="light"]{--bg:#fff;--fg:#09090b;--muted:#52525c;--card:#fafafa;--border:rgb(0 0 0/12%);--btn-bg:#18181b;--btn-fg:#fafafa}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px 16px;background:var(--bg);color:var(--fg);font-family:"Geist",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{width:100%;max-width:420px;padding:28px;border:1px solid var(--border);border-radius:12px;background:var(--card)}
.eyebrow{margin:0 0 14px;font-size:13px;color:var(--muted)}
h1{margin:0 0 8px;font-size:20px;font-weight:600;letter-spacing:-0.01em}
p{margin:0;font-size:15px;line-height:1.6;color:var(--muted)}
form{margin-top:20px}
button,.link{display:inline-flex;align-items:center;justify-content:center;height:38px;padding:0 16px;border:0;border-radius:8px;background:var(--btn-bg);color:var(--btn-fg);font-family:inherit;font-size:14px;font-weight:600;text-decoration:none;cursor:pointer}
.link{margin-top:20px}
button:focus-visible,.link:focus-visible{outline:2px solid var(--muted);outline-offset:2px}
</style>
</head>
<body>
<main>
<p class="eyebrow">&#x1F426;&#x200D;&#x2B1B; naren7's raven</p>
<h1>${escapeHtml(heading)}</h1>
<p>${escapeHtml(message)}</p>
${form ?? `<a class="link" href="/blogs/">Read the blogs</a>`}
</main>
</body>
</html>`;
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex",
    },
  });
}

export function buttonForm(label, hiddenFields) {
  const inputs = Object.entries(hiddenFields)
    .map(
      ([name, value]) =>
        `<input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}">`,
    )
    .join("");
  return `<form method="post">${inputs}<button type="submit">${escapeHtml(label)}</button></form>`;
}
