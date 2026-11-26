// Announce a published blog post to confirmed subscribers.
//
//   npm run notify -- <slug>                     dry run: shows who'd get it
//   npm run notify -- <slug> --test you@mail.com  sends it only to you
//   npm run notify -- <slug> --send               emails subscribers (asks first)
//
// Reads BLOG_NOTIFY_SECRET from .env.notify (gitignored). Deploy the post before sending:
// the live site refuses posts it doesn't know about.
import { createInterface } from "node:readline/promises";

const args = process.argv.slice(2);
const slug = args.find((arg) => !arg.startsWith("--"));
const testIndex = args.indexOf("--test");
const testEmail = testIndex === -1 ? null : args[testIndex + 1];
const send = args.includes("--send");
const site = (process.env.SITE_URL ?? "https://naren7.me").replace(/\/$/, "");
const secret = process.env.BLOG_NOTIFY_SECRET;

if (!slug || (testIndex !== -1 && !testEmail)) {
  console.error(
    "Usage: npm run notify -- <slug> [--test you@example.com] [--send]",
  );
  process.exit(1);
}
if (!secret) {
  console.error("BLOG_NOTIFY_SECRET is missing from .env.notify.");
  process.exit(1);
}

async function call(mode, extra = {}) {
  const response = await fetch(`${site}/api/blog-notify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug, mode, ...extra }),
    signal: AbortSignal.timeout(290_000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? `Request failed (${response.status})`);
  }
  return data;
}

try {
  const preview = await call("preview");
  console.log(`\nPost:     ${preview.title}`);
  console.log(`Link:     ${preview.postUrl}`);
  console.log(`Subject:  ${preview.subject}`);
  console.log(
    `Waiting:  ${preview.pending} confirmed subscriber(s) haven't had it yet\n`,
  );

  if (testEmail) {
    await call("test", { testEmail });
    console.log(`Test email sent to ${testEmail}.`);
  }

  if (!send) {
    if (!testEmail) {
      console.log("Dry run, nothing sent. Add --test <email> or --send.");
    }
    process.exit(0);
  }
  if (preview.pending === 0) {
    console.log("Everyone already has this one. Nothing to send.");
    process.exit(0);
  }

  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await prompt.question(
    `Email ${preview.pending} subscriber(s) about this post? Type "send" to confirm: `,
  );
  prompt.close();
  if (answer.trim() !== "send") {
    console.log("Cancelled, nothing sent.");
    process.exit(0);
  }

  let total = 0;
  for (;;) {
    const round = await call("send");
    total += round.sent;
    console.log(`Sent ${total} so far, ${round.remaining} remaining.`);
    if (round.failed) {
      console.error(
        `${round.failed} email(s) failed. Run the same command again later to retry them; nobody gets it twice.`,
      );
      process.exit(1);
    }
    if (round.remaining === 0 || round.sent === 0) break;
  }
  console.log("Done.");
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
