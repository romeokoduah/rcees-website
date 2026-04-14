#!/usr/bin/env node
/**
 * Fetches all posts from rcees.uenr.edu.gh via the WordPress REST API,
 * downloads the first inline image for each into public/images/news/,
 * and writes a trimmed listing to public/data/news.json.
 *
 * We store only: id, date, slug, title, short excerpt, original link,
 * and local image path. Full article bodies are NOT copied — the card
 * links back to the original post on rcees.uenr.edu.gh.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_JSON = join(__dirname, "..", "public", "data", "news.json");
const IMG_DIR = join(__dirname, "..", "public", "images", "news");

const API = "https://rcees.uenr.edu.gh/wp-json/wp/v2/posts";

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&hellip;/g, "…")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\[&hellip;\]/g, "…")
    .replace(/\[\u2026\]/g, "…")
    .replace(/\s+/g, " ")
    .trim();
}

function firstImageUrl(html) {
  if (!html) return null;
  const m = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/);
  return m ? m[1] : null;
}

async function downloadImage(url, slug) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const urlExt = extname(new URL(url).pathname).toLowerCase();
    const ext = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(urlExt)
      ? urlExt
      : ".jpg";
    const hash = createHash("md5").update(url).digest("hex").slice(0, 8);
    const filename = `${slug.slice(0, 60)}-${hash}${ext}`;
    await writeFile(join(IMG_DIR, filename), buf);
    return `/images/news/${filename}`;
  } catch (e) {
    console.warn(`  ! image download failed for ${url}: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log("Fetching posts from rcees.uenr.edu.gh…");
  const url = new URL(API);
  url.searchParams.set("per_page", "100");
  url.searchParams.set(
    "_fields",
    "id,date,slug,title,excerpt,content,link",
  );

  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API ${res.status}: ${await res.text()}`);
  const posts = await res.json();
  console.log(`  fetched ${posts.length} posts`);

  await mkdir(IMG_DIR, { recursive: true });

  const items = [];
  for (const p of posts) {
    const title = stripHtml(p.title?.rendered || "");
    const excerpt = stripHtml(p.excerpt?.rendered || "").slice(0, 240);
    const inlineImg = firstImageUrl(p.content?.rendered || "");
    let localImg = null;
    if (inlineImg) {
      localImg = await downloadImage(inlineImg, p.slug);
      console.log(
        `  ${localImg ? "✓" : "×"} ${p.date.slice(0, 10)}  ${title.slice(0, 60)}`,
      );
    } else {
      console.log(`    ${p.date.slice(0, 10)}  ${title.slice(0, 60)}  (no image)`);
    }
    items.push({
      id: p.id,
      date: p.date,
      slug: p.slug,
      title,
      excerpt,
      link: p.link,
      image: localImg,
    });
  }

  items.sort((a, b) => (a.date < b.date ? 1 : -1));

  const payload = {
    source: "rcees.uenr.edu.gh",
    fetchedAt: new Date().toISOString(),
    count: items.length,
    items,
  };

  await mkdir(dirname(OUT_JSON), { recursive: true });
  await writeFile(OUT_JSON, JSON.stringify(payload, null, 2));
  console.log(`\nWrote ${items.length} news items -> ${OUT_JSON}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
