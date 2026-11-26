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
// Emails. Dark, like the site. Table layout and inline styles, since email
// clients ignore most CSS; images are absolute URLs on the live site.

const font =
  "Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const mono = "'Geist Mono',ui-monospace,SFMono-Regular,Menlo,monospace";
const links = {
  x: "https://x.com/ntbnaren7",
  github: "https://github.com/ntbnaren7",
};

function emailLayout({
  siteUrl,
  preheader,
  heroUrl,
  heroAlt,
  content,
  footer,
}) {
  const site = escapeHtml(siteUrl);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${escapeHtml(siteName)}</title>
<style>
@font-face{font-family:Geist;src:url(${site}/fonts/geist-sans.woff2) format("woff2");font-weight:100 900}
@font-face{font-family:"Geist Mono";src:url(${site}/fonts/geist-mono.woff2) format("woff2")}
a{color:inherit}
@media (max-width:600px){.px{padding-left:22px!important;padding-right:22px!important}.title{font-size:23px!important}}
</style>
</head>
<body style="margin:0;padding:0;background:#000000;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#000000;">${escapeHtml(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#000000" style="background:#000000;">
<tr><td align="center" style="padding:32px 12px 24px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#09090b" style="max-width:560px;background:#09090b;border:1px solid #27272a;border-radius:16px;border-collapse:separate;">
<tr><td style="padding:0;">
<a href="${site}" style="text-decoration:none;"><img src="${escapeHtml(heroUrl)}" width="560" alt="${escapeHtml(heroAlt)}" style="display:block;width:100%;max-width:560px;height:auto;border:0;border-radius:15px 15px 0 0;"></a>
</td></tr>
<tr><td class="px" style="padding:24px 32px 0;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="padding-right:12px;"><img src="${site}/images/email/avatar.png" width="40" height="40" alt="naren7" style="display:block;border:0;border-radius:50%;"></td>
<td style="font-family:${font};">
<div style="font-size:14px;font-weight:600;color:#fafafa;line-height:1.3;">naren7</div>
<div style="font-size:12px;color:#71717b;line-height:1.4;">via the raven &middot; <a href="${site}" style="color:#71717b;text-decoration:none;">naren7.me</a></div>
</td>
</tr></table>
</td></tr>
<tr><td class="px" style="padding:20px 32px 0;"><div style="height:1px;border-top:1px dashed #27272a;font-size:0;line-height:0;">&nbsp;</div></td></tr>
<tr><td class="px" style="padding:22px 32px 32px;font-family:${font};font-size:15px;line-height:1.65;color:#a1a1aa;">
${content}
</td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td align="center" style="padding:28px 24px 0;">
<a href="${site}" style="text-decoration:none;"><img src="${site}/images/raven/raven-emblem.png" width="72" height="72" alt="naren7's raven" style="display:block;width:72px;height:72px;border:0;image-rendering:pixelated;"></a>
</td></tr>
<tr><td style="padding:6px 24px 0;font-family:${font};font-size:12px;color:#71717b;text-align:center;">Delivered by naren7's raven</td></tr>
<tr><td style="padding:10px 24px 0;font-family:${font};font-size:12px;line-height:1.7;color:#52525c;text-align:center;">
<a href="${site}" style="color:#a1a1aa;text-decoration:none;">naren7.me</a>
&nbsp;&middot;&nbsp;
<a href="${links.x}" style="color:#a1a1aa;text-decoration:none;">X</a>
&nbsp;&middot;&nbsp;
<a href="${links.github}" style="color:#a1a1aa;text-decoration:none;">GitHub</a>
<br>${footer}
</td></tr>
</table>

</td></tr>
</table>
</body>
</html>`;
}

function eyebrow(label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 14px;"><tr>
<td style="padding:4px 10px;border:1px solid #3f3f46;border-radius:999px;font-family:${mono};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#d4d4d8;"><span style="color:#22c55e;">&#9679;</span>&nbsp; ${escapeHtml(label)}</td>
</tr></table>`;
}

function emailButton(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 0;"><tr>
<td bgcolor="#fafafa" style="border-radius:10px;background:#fafafa;">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 22px;font-family:${font};font-size:14px;font-weight:600;line-height:1;color:#09090b;text-decoration:none;border-radius:10px;">${escapeHtml(label)} &rarr;</a>
</td></tr></table>`;
}

function fallbackLink(href) {
  return `<p style="margin:14px 0 0;font-size:12px;line-height:1.6;color:#52525c;">Button not working? Paste this into your browser:<br><a href="${escapeHtml(href)}" style="color:#71717b;word-break:break-all;">${escapeHtml(href)}</a></p>`;
}

export function confirmationEmail({ confirmUrl, siteUrl }) {
  const subject = "Confirm your subscription to naren7's blogs";
  const perks = [
    "One email whenever a new blog goes up",
    "No newsletters, no spam, nothing else",
    "Unsubscribe in one click, anytime",
  ]
    .map(
      (perk) =>
        `<tr><td style="padding:3px 10px 3px 0;color:#22c55e;font-size:13px;vertical-align:top;">&#10003;</td><td style="padding:3px 0;font-size:14px;color:#d4d4d8;">${perk}</td></tr>`,
    )
    .join("");
  const html = emailLayout({
    siteUrl,
    preheader: "One tap and the raven will find you whenever a new blog lands.",
    heroUrl: `${siteUrl}/images/og/home.jpg`,
    heroAlt: "A knight resting in a moonlit meadow",
    content: `${eyebrow("One last step")}
<h1 class="title" style="margin:0 0 10px;font-family:${font};font-size:26px;line-height:1.25;font-weight:700;letter-spacing:-0.02em;color:#fafafa;">Confirm your subscription</h1>
<p style="margin:0;">Someone (hopefully you) asked to hear from me whenever I publish a new blog on <a href="${escapeHtml(siteUrl)}" style="color:#fafafa;">naren7.me</a>. Tap the button and you're in.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 0;">${perks}</table>
${emailButton(confirmUrl, "Yes, notify me")}
${fallbackLink(confirmUrl)}
<p style="margin:22px 0 0;padding:12px 14px;background:#18181b;border-radius:10px;font-size:13px;line-height:1.6;color:#a1a1aa;">Wasn't you? Just ignore this email and you'll never hear from me. The link expires in ${confirmWindowDays} days.</p>`,
    footer:
      "You're getting this because this address was entered on naren7.me.",
  });
  const text = `Confirm your subscription

Someone (hopefully you) asked to hear from me whenever I publish a new blog on naren7.me. Open this link to confirm:

${confirmUrl}

- One email whenever a new blog goes up
- No newsletters, no spam, nothing else
- Unsubscribe in one click, anytime

Wasn't you? Just ignore this email and you'll never hear from me. The link expires in ${confirmWindowDays} days.

-- naren7's raven, naren7.me`;
  return { subject, html, text };
}

export function newPostEmail({
  post,
  postUrl,
  unsubscribeUrl,
  siteUrl,
  imageUrl,
}) {
  const subject = `New blog: ${post.title}`;
  const meta = [post.date, post.readingTime]
    .filter(Boolean)
    .map(escapeHtml)
    .join(" &middot; ");
  const tags = (post.tags ?? [])
    .slice(0, 4)
    .map(
      (tag) =>
        `<span style="display:inline-block;margin:0 6px 6px 0;padding:3px 9px;border:1px dashed #3f3f46;border-radius:999px;font-size:12px;line-height:1.5;color:#a1a1aa;">${escapeHtml(tag)}</span>`,
    )
    .join("");
  const html = emailLayout({
    siteUrl,
    preheader: post.description,
    heroUrl: imageUrl ?? `${siteUrl}/images/og/home.jpg`,
    heroAlt: post.title,
    content: `${eyebrow("New blog")}
<h1 class="title" style="margin:0 0 10px;font-family:${font};font-size:26px;line-height:1.25;font-weight:700;letter-spacing:-0.02em;"><a href="${escapeHtml(postUrl)}" style="color:#fafafa;text-decoration:none;">${escapeHtml(post.title)}</a></h1>
<p style="margin:0;font-size:16px;color:#d4d4d8;">${escapeHtml(post.description)}</p>
<p style="margin:12px 0 0;font-family:${mono};font-size:12px;color:#71717b;">${meta}</p>
${tags ? `<div style="margin:14px 0 0;">${tags}</div>` : ""}
${emailButton(postUrl, "Read the blog")}
${fallbackLink(postUrl)}`,
    footer: `You're getting this because you subscribed on naren7.me.<br>One email per new blog, nothing else. <a href="${escapeHtml(unsubscribeUrl)}" style="color:#a1a1aa;">Unsubscribe</a>`,
  });
  const text = `New blog: ${post.title}

${post.description}
${[post.date, post.readingTime].filter(Boolean).join(" · ")}

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
@font-face{font-family:"Geist Mono";src:url("/fonts/geist-mono.woff2") format("woff2");font-display:swap}
:root{--bg:#000;--fg:#f4f4f5;--muted:#9f9fa9;--card:#09090b;--border:rgb(255 255 255/15%);--btn-bg:#fafafa;--btn-fg:#09090b}
:root[data-theme="light"]{--bg:#fff;--fg:#09090b;--muted:#52525c;--card:#fafafa;--border:rgb(0 0 0/12%);--btn-bg:#18181b;--btn-fg:#fafafa}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px 16px;background:var(--bg);color:var(--fg);font-family:"Geist",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{width:100%;max-width:420px;padding:28px;border:1px solid var(--border);border-radius:12px;background:var(--card)}
.raven{display:block;width:88px;height:88px;margin:-8px 0 6px -6px;image-rendering:pixelated}
.eyebrow{margin:0 0 10px;font-family:"Geist Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
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
<img class="raven" src="/images/raven/raven-emblem.png" width="88" height="88" alt="">
<p class="eyebrow">naren7's raven</p>
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
