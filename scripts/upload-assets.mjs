// Uploads the site's images and resume to the public Vercel Blob store.
// These folders are gitignored, so the repo never contains them; vercel.json
// rewrites /images/* and /resume/* on naren7.me to the store.
//
//   npm run upload-assets            upload new or changed files
//   npm run upload-assets -- --check list what would be uploaded, upload nothing
//
// Reads BLOB_READ_WRITE_TOKEN from .env.local (`vercel env pull` provides it).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { list, put } from "@vercel/blob";

const roots = ["public/images", "public/resume"];
const checkOnly = process.argv.includes("--check");
const token = process.env.BLOB_READ_WRITE_TOKEN;

if (!token) {
  console.error(
    "BLOB_READ_WRITE_TOKEN is missing. Run `vercel env pull` first.",
  );
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.name.startsWith(".")) return [];
    return entry.isDirectory() ? walk(path) : [path];
  });
}

// Blob pathnames mirror the site URL: public/images/x.webp -> images/x.webp
const files = roots.flatMap(walk).map((path) => ({
  path,
  pathname: relative("public", path).split(sep).join("/"),
  size: statSync(path).size,
}));

const existing = new Map();
let cursor;
do {
  const page = await list({ token, cursor, limit: 1000 });
  for (const blob of page.blobs) existing.set(blob.pathname, blob.size);
  cursor = page.hasMore ? page.cursor : undefined;
} while (cursor);

// A file is (re)uploaded when it's new or its size changed. Give a replaced
// image a new filename anyway: browsers cache /images for a week.
const pending = files.filter(
  (file) => existing.get(file.pathname) !== file.size,
);

console.log(`${files.length} local files, ${pending.length} to upload.`);
if (checkOnly) {
  for (const file of pending) console.log(`  ${file.pathname}`);
  process.exit(0);
}

for (const file of pending) {
  await put(file.pathname, readFileSync(file.path), {
    access: "public",
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    // The resume changes in place, so it's cached briefly; images for a week.
    cacheControlMaxAge: file.pathname.startsWith("resume/")
      ? 60
      : 60 * 60 * 24 * 7,
  });
  console.log(`✓ ${file.pathname}`);
}
console.log("Done.");
