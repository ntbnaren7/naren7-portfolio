// Renders the 1200x630 link-preview cards (Open Graph / Twitter) for the home
// page, each archive page and every blog post, using the site's own fonts and
// art. Needs `npm run dev` running and Google Chrome installed (macOS).
//
//   npm run og-cards            all cards
//   npm run og-cards -- <slug>  one blog post
//
// Cards are written as JPEGs next to the other public images; the HTML entries
// reference them with og:image / twitter:image.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = (process.env.OG_BASE ?? "http://127.0.0.1:5173").replace(
  /\/$/,
  "",
);
const chrome =
  process.env.CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const posts = JSON.parse(readFileSync("src/data/blog-posts.json", "utf8"));
const only = process.argv[2];

const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// Fonts are inlined: Chrome won't load cross-origin fonts into a file:// page.
const font = (file) =>
  `url(data:font/woff2;base64,${readFileSync(`public/fonts/${file}`).toString("base64")}) format("woff2")`;

const styles = `
@font-face { font-family: "Instrument Serif"; src: ${font("instrument-serif.woff2")}; }
@font-face { font-family: "Instrument Sans"; src: ${font("instrument-sans.woff2")}; font-weight: 400 700; }
@font-face { font-family: "Geist Mono"; src: ${font("geist-mono.woff2")}; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; background: #000; }
body { color: #fafafa; font-family: "Instrument Sans", sans-serif; -webkit-font-smoothing: antialiased; }
.card { position: relative; width: 1200px; height: 630px; overflow: hidden; }
.rail { position: absolute; z-index: 3; top: 0; bottom: 0; width: 26px;
  border-inline: 1px solid rgb(255 255 255 / 12%);
  background: repeating-linear-gradient(315deg, rgb(255 255 255 / 11%) 0 1px, transparent 0 50%) 0 0 / 10px 10px; }
.rail.left { left: 0; } .rail.right { right: 0; }
.byline { display: flex; align-items: center; gap: 14px; }
.byline img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; filter: grayscale(1);
  border: 1px solid rgb(255 255 255 / 18%); }
.byline .name { font-family: "Instrument Serif", serif; font-size: 32px; line-height: 1; }
.byline .site { font-family: "Geist Mono", monospace; font-size: 17px; color: #a1a1aa; letter-spacing: 0.02em; }
.byline .dot { width: 4px; height: 4px; border-radius: 50%; background: #52525c; }
.mono { font-family: "Geist Mono", monospace; color: #a1a1aa; font-size: 18px; letter-spacing: 0.02em; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tags span { padding: 5px 12px; border: 1px dashed rgb(255 255 255 / 22%); border-radius: 999px;
  color: #d4d4d8; font-size: 17px; background: rgb(255 255 255 / 3%); }
.clamp { display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
`;

const page = (body) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${styles}</style></head><body>${body}</body></html>`;

const byline = `<div class="byline">
  <img src="${base}/images/profiles/naren-avatar.webp" alt="">
  <span class="name">naren7</span><span class="dot"></span><span class="site">naren7.me</span>
</div>`;

// Home and archive pages: the knight banner with the title over a dark fade.
function bannerCard({ title, lines, eyebrow }) {
  return page(`<div class="card">
  <img src="${base}/images/hero/knight-banner-dark.webp" alt=""
    style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 62%">
  <div style="position:absolute;inset:0;background:linear-gradient(90deg,#000 0%,rgb(0 0 0/88%) 38%,rgb(0 0 0/35%) 68%,rgb(0 0 0/5%) 100%)"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(0deg,rgb(0 0 0/55%),transparent 40%)"></div>
  <div class="rail left"></div><div class="rail right"></div>
  <div style="position:absolute;z-index:2;inset:0;padding:60px 70px;display:flex;flex-direction:column;justify-content:space-between">
    ${byline}
    <div style="max-width:640px">
      ${eyebrow ? `<p class="mono" style="margin-bottom:14px">${escape(eyebrow)}</p>` : ""}
      <h1 style="font-family:'Instrument Serif',serif;font-weight:400;font-size:${title.length > 12 ? 92 : 120}px;line-height:0.95;letter-spacing:-0.01em">${escape(title)}</h1>
      <div style="margin-top:22px;display:grid;gap:4px;max-width:600px;font-size:26px;line-height:1.35;color:#d4d4d8">
        ${lines.map((line) => `<p>${line}</p>`).join("")}
      </div>
    </div>
  </div>
</div>`);
}

// Blog posts: title and details on the left, the post's cover on the right.
function postCard(post) {
  const cover = `${base}/images/blogs/${post.slug}/cover.webp`;
  const size = post.title.length > 52 ? 58 : post.title.length > 34 ? 66 : 76;
  return page(`<div class="card">
  <img src="${cover}" alt=""
    style="position:absolute;top:0;right:0;width:560px;height:100%;object-fit:cover">
  <div style="position:absolute;top:0;right:0;width:560px;height:100%;background:linear-gradient(90deg,#000 0%,rgb(0 0 0/55%) 22%,rgb(0 0 0/0%) 60%)"></div>
  <div class="rail left"></div><div class="rail right"></div>
  <div style="position:absolute;z-index:2;top:0;left:0;bottom:0;width:740px;padding:58px 0 56px 70px;display:flex;flex-direction:column;justify-content:space-between">
    ${byline}
    <div>
      <p class="mono" style="margin-bottom:16px">New on the blog</p>
      <h1 class="clamp" style="-webkit-line-clamp:3;font-family:'Instrument Serif',serif;font-weight:400;font-size:${size}px;line-height:1.02;letter-spacing:-0.01em;text-wrap:balance">${escape(post.title)}</h1>
      <p class="clamp" style="-webkit-line-clamp:2;margin-top:18px;font-size:24px;line-height:1.4;color:#a1a1aa;max-width:600px">${escape(post.description)}</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <p class="mono">${escape([post.date, post.readingTime].filter(Boolean).join(" · "))}</p>
      <div class="tags">${(post.tags ?? [])
        .slice(0, 4)
        .map((tag) => `<span>${escape(tag)}</span>`)
        .join("")}</div>
    </div>
  </div>
</div>`);
}

const cards = [
  {
    out: "public/images/og/home-card-v2.jpg",
    html: bannerCard({
      title: "naren7",
      lines: [
        "<strong style='color:#fafafa'>Engineer / Dreamer.</strong> Just someone who loves creating things.",
        "Building <strong style='color:#fafafa'>ECHO</strong>, <strong style='color:#fafafa'>Scribe</strong>, and whatever comes next.",
      ],
    }),
  },
  {
    out: "public/images/og/projects-card.jpg",
    html: bannerCard({
      title: "Projects",
      eyebrow: "naren7 / projects",
      lines: [
        "Things I've built end to end, from the first idea to production.",
      ],
    }),
  },
  {
    out: "public/images/og/hackathons-card.jpg",
    html: bannerCard({
      title: "Hackathons",
      eyebrow: "naren7 / hackathons",
      lines: [
        "Weekends spent building fast, breaking things, and learning a ton.",
      ],
    }),
  },
  {
    out: "public/images/og/highlights-card.jpg",
    html: bannerCard({
      title: "Highlights",
      eyebrow: "naren7 / highlights",
      lines: ["A few moments I'm proud of along the way."],
    }),
  },
  {
    out: "public/images/og/blogs-card.jpg",
    html: bannerCard({
      title: "Blogs",
      eyebrow: "naren7 / blogs",
      lines: ["Thoughts on building, AI, and figuring things out as I go."],
    }),
  },
  ...posts.map((post) => ({
    slug: post.slug,
    out: `public/images/blogs/${post.slug}/og-card.jpg`,
    html: postCard(post),
  })),
].filter((card) => !only || card.slug === only);

if (only && cards.length === 0) {
  console.error(`No blog post with slug "${only}".`);
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), "og-cards-"));
try {
  for (const [index, card] of cards.entries()) {
    const html = join(work, `card-${index}.html`);
    const png = join(work, `card-${index}.png`);
    writeFileSync(html, card.html);
    execFileSync(
      chrome,
      [
        "--headless=new",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=1200,630",
        "--virtual-time-budget=4000",
        `--user-data-dir=${join(work, `profile-${index}`)}`,
        `--screenshot=${png}`,
        `file://${html}`,
      ],
      { stdio: "ignore" },
    );
    // macOS sips converts the screenshot to a compact JPEG.
    execFileSync(
      "sips",
      [
        "-s",
        "format",
        "jpeg",
        "-s",
        "formatOptions",
        "86",
        png,
        "--out",
        card.out,
      ],
      {
        stdio: "ignore",
      },
    );
    console.log(`✓ ${card.out}`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
