#!/usr/bin/env node
/**
 * Fetches RCEES news posts from the legacy WordPress REST API, filters out
 * leftover theme demo content, downloads every inline image into
 * public/images/news/, rewrites image URLs in the article HTML to local
 * paths, and writes public/data/news.json.
 *
 * Each item includes: id, date, slug, title, excerpt, link, image (cover),
 * content (sanitised HTML). The news page reads this JSON at build time
 * and renders full article pages at /news/[slug].
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_JSON = join(__dirname, "..", "public", "data", "news.json");
const IMG_DIR = join(__dirname, "..", "public", "images", "news");

const API = "https://rcees.uenr.edu.gh/wp-json/wp/v2/posts";

// Category IDs on the legacy site that hold leftover theme-demo posts.
// Anything tagged with one of these is NOT real RCEES content.
const DEMO_CATEGORY_IDS = new Set([
  110, 107, 112, 117, 118, 119, 120, 121, 122, 156, 157, 158,
]);

function stripEntities(s) {
  if (!s) return "";
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&hellip;/g, "…")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—");
}

function stripHtml(html) {
  if (!html) return "";
  return stripEntities(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

/** Remove scripts, styles, event handlers and unsafe iframes. */
function sanitiseHtml(html) {
  if (!html) return "";
  let out = html;
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<style[\s\S]*?<\/style>/gi, "");
  out = out.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  out = out.replace(/ on[a-z]+="[^"]*"/gi, "");
  out = out.replace(/ on[a-z]+='[^']*'/gi, "");
  // drop WP class/style noise to keep markup clean
  out = out.replace(/ class="[^"]*"/g, "");
  out = out.replace(/ style="[^"]*"/g, "");
  out = out.replace(/ data-[a-z0-9-]+="[^"]*"/gi, "");
  // WP often wraps images in <figure> with srcset that points to legacy URLs
  out = out.replace(/ srcset="[^"]*"/g, "");
  out = out.replace(/ sizes="[^"]*"/g, "");
  return out;
}

function findImageUrls(html) {
  if (!html) return [];
  const urls = new Set();
  const re = /<img[^>]+src=["'](https?:\/\/[^"']+)["']/g;
  let m;
  while ((m = re.exec(html)) !== null) urls.add(m[1]);
  return [...urls];
}

/** Extract content images (not site chrome) from a rendered WP page. */
function findPageImages(pageHtml) {
  if (!pageHtml) return [];
  const urls = new Set();
  // Match any wp-content/uploads image in src or url() or data-src
  const patterns = [
    /src=["'](https?:\/\/rcees\.uenr\.edu\.gh\/wp-content\/uploads\/[^"']+\.(?:jpg|jpeg|png|webp))["']/gi,
    /url\((['"]?)(https?:\/\/rcees\.uenr\.edu\.gh\/wp-content\/uploads\/[^)'"]+\.(?:jpg|jpeg|png|webp))\1\)/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(pageHtml)) !== null) {
      const url = m[2] || m[1];
      urls.add(url);
    }
  }
  // Strip obvious chrome: favicon, logo, cropped theme assets
  return [...urls].filter(
    (u) =>
      !/favicon|RCEES-LOGO|cropped-|placeholder|sample-fin|team[2-4]\.jpg|breadcrumb/i.test(
        u,
      ),
  );
}

async function fetchPageHtml(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

// Global URL → local path cache so repeated images across posts are
// downloaded once.
const downloadCache = new Map();

async function downloadImage(url) {
  if (downloadCache.has(url)) return downloadCache.get(url);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      downloadCache.set(url, null);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const urlExt = extname(new URL(url).pathname).toLowerCase();
    const ext = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(urlExt)
      ? urlExt
      : ".jpg";
    const hash = createHash("md5").update(url).digest("hex").slice(0, 12);
    const filename = `${hash}${ext}`;
    await writeFile(join(IMG_DIR, filename), buf);
    const local = `/images/news/${filename}`;
    downloadCache.set(url, local);
    return local;
  } catch (e) {
    console.warn(`  ! image failed ${url}: ${e.message}`);
    downloadCache.set(url, null);
    return null;
  }
}

async function main() {
  console.log("Fetching posts from rcees.uenr.edu.gh…");
  const url = new URL(API);
  url.searchParams.set("per_page", "100");
  url.searchParams.set(
    "_fields",
    "id,date,slug,title,excerpt,content,link,categories",
  );

  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API ${res.status}: ${await res.text()}`);
  const posts = await res.json();
  console.log(`  fetched ${posts.length} posts (pre-filter)`);

  const realPosts = posts.filter((p) => {
    const cats = p.categories || [];
    return !cats.some((c) => DEMO_CATEGORY_IDS.has(c));
  });
  console.log(`  ${realPosts.length} real RCEES posts after demo filter`);

  await mkdir(IMG_DIR, { recursive: true });

  const items = [];
  for (const p of realPosts) {
    const title = stripHtml(p.title?.rendered || "");
    const excerpt = stripHtml(p.excerpt?.rendered || "").slice(0, 280);
    let content = p.content?.rendered || "";

    // 1. Images explicitly inside the API content as <img>
    const contentImgs = findImageUrls(content);

    // 2. Also scrape the rendered page for Elementor-wrapped images
    //    (newer posts hide images behind background-url and data-* attrs)
    const pageHtml = await fetchPageHtml(p.link);
    const pageImgs = findPageImages(pageHtml);

    const allImgs = [...new Set([...contentImgs, ...pageImgs])];

    const urlMap = new Map();
    // Cap per-post to 12 unique content images to keep the corpus small
    for (const u of allImgs.slice(0, 12)) {
      const local = await downloadImage(u);
      if (local) urlMap.set(u, local);
    }

    // Rewrite src in content to local paths
    for (const [from, to] of urlMap) {
      const safeFrom = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      content = content.replace(new RegExp(safeFrom, "g"), to);
    }

    content = sanitiseHtml(content);
    content = stripEntities(content);

    // Cover image: prefer the first image inside the article content,
    // fall back to the first page-scraped image.
    let coverImg = null;
    for (const u of contentImgs) {
      if (urlMap.has(u)) {
        coverImg = urlMap.get(u);
        break;
      }
    }
    if (!coverImg) {
      for (const u of pageImgs) {
        if (urlMap.has(u)) {
          coverImg = urlMap.get(u);
          break;
        }
      }
    }

    // If content has no <img> at all but we did find page images, prepend
    // the cover as a figure so the article page shows it inline.
    if (coverImg && !/<img/i.test(content)) {
      content = `<figure><img src="${coverImg}" alt="${title.replace(/"/g, "&quot;")}" /></figure>` + content;
    }

    items.push({
      id: p.id,
      date: p.date,
      slug: p.slug,
      title,
      excerpt,
      link: p.link,
      image: coverImg,
      content,
    });

    console.log(
      `  ${coverImg ? "✓" : "·"} ${p.date.slice(0, 10)}  ${title.slice(0, 60)} (${urlMap.size} imgs)`,
    );
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
