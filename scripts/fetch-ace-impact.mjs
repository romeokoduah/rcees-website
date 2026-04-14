#!/usr/bin/env node
/**
 * Scrapes the ACE Impact section from rcees.uenr.edu.gh, downloads all
 * linked documents into public/files/ace-impact/, and writes a structured
 * inventory to public/data/ace-impact.json.
 *
 * The new ACE Impact page reads this JSON at build time and renders a
 * cleanly organised section per category.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_JSON = join(__dirname, "..", "public", "data", "ace-impact.json");
const FILES_DIR = join(__dirname, "..", "public", "files", "ace-impact");

const PAGES = [
  { slug: "ace-impact-project", title: "ACE Impact Project", category: "about" },
  { slug: "dli", title: "DLI 4.3 — Milestone 2", category: "dli" },
  { slug: "dli5-3", title: "DLI 5.3", category: "dli" },
  { slug: "dlr-5-3-milestone-2", title: "DLR 5.3 — Milestone 2", category: "dli" },
  { slug: "milestone-1", title: "Milestone 1", category: "dli" },
  { slug: "milestone-2", title: "Milestone 2", category: "dli" },
  { slug: "paset-benchmarking-phase-ii", title: "PASET Benchmarking — Phase II", category: "tools" },
  { slug: "e-grm", title: "Electronic Grievance Redress Mechanism (e-GRM)", category: "tools" },
  { slug: "eema", title: "Environment, Ethics, Monitoring and Audit (EEMA)", category: "tools" },
  { slug: "audit-reports", title: "Audit Reports", category: "reports" },
  { slug: "financial-reports", title: "Financial Reports", category: "reports" },
  { slug: "board-meetings", title: "Board Meeting Minutes", category: "reports" },
  { slug: "other-documents", title: "Other Documents", category: "other" },
];

const FILE_EXT = /\.(pdf|docx?|xlsx?|pptx?|zip|rar)$/i;

function decodeHtmlEntities(s) {
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
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&");
}

function stripHtml(html) {
  return decodeHtmlEntities((html || "").replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchHtml(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.text();
}

/** Normalise malformed URLs found on the legacy site (typos etc). */
function normaliseUrl(url) {
  // The legacy site has a typo pattern "http://du.gh/..." that should
  // be "https://rcees.uenr.edu.gh/..."
  if (/^https?:\/\/du\.gh\//.test(url)) {
    return url.replace(/^https?:\/\/du\.gh\//, "https://rcees.uenr.edu.gh/");
  }
  if (url.startsWith("/")) {
    return `https://rcees.uenr.edu.gh${url}`;
  }
  return url;
}

/** Find every link on a page that points at a downloadable document. */
function extractFileLinks(html) {
  const out = [];
  const seen = new Set();
  // <a href="...file.pdf">label</a> — keep label so we can render it
  const re = /<a[^>]*href=["']([^"']+\.(?:pdf|docx?|xlsx?|pptx?|zip|rar))["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const url = normaliseUrl(m[1]);
    if (seen.has(url)) continue;
    seen.add(url);
    const label = stripHtml(m[2]) || basename(url);
    out.push({ url, label });
  }
  return out;
}

/** Pull the first paragraph of meaningful text from the page main area. */
function extractIntro(html) {
  // Look for an Elementor text-editor widget first
  const widgets = [
    /elementor-widget-text-editor[\s\S]*?<div class="elementor-widget-container">([\s\S]*?)<\/div>/g,
    /elementor-widget-heading[\s\S]*?elementor-heading-title[^>]*>([\s\S]*?)</g,
    /<p[^>]*>([\s\S]*?)<\/p>/g,
  ];
  for (const re of widgets) {
    let m;
    while ((m = re.exec(html)) !== null) {
      const txt = stripHtml(m[1]);
      if (txt.length >= 60 && !/cookie|consent|privacy|copyright/i.test(txt)) {
        return txt.length > 600 ? txt.slice(0, 600) + "…" : txt;
      }
    }
  }
  return "";
}

async function downloadFile(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = extname(new URL(url).pathname).toLowerCase();
    const safeExt = FILE_EXT.test(ext) ? ext : ".bin";
    const hash = createHash("md5").update(url).digest("hex").slice(0, 12);
    const origName = basename(new URL(url).pathname).replace(/[^a-z0-9._-]+/gi, "-");
    const stem = origName.replace(/\.[^.]+$/, "").slice(0, 80);
    const filename = `${stem}-${hash}${safeExt}`;
    await writeFile(join(FILES_DIR, filename), buf);
    return {
      local: `/files/ace-impact/${filename}`,
      bytes: buf.length,
    };
  } catch (e) {
    console.warn(`  ! file failed ${url}: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log("Scraping ACE Impact pages from rcees.uenr.edu.gh…");
  await mkdir(FILES_DIR, { recursive: true });

  const sections = [];
  for (const page of PAGES) {
    const url = `https://rcees.uenr.edu.gh/${page.slug}/`;
    let html = "";
    try {
      html = await fetchHtml(url);
    } catch (e) {
      console.warn(`  × ${page.slug}: ${e.message}`);
      continue;
    }

    const intro = extractIntro(html);
    const fileLinks = extractFileLinks(html);

    const files = [];
    for (const link of fileLinks) {
      const dl = await downloadFile(link.url);
      if (dl) {
        files.push({
          label: link.label,
          local: dl.local,
          source: link.url,
          bytes: dl.bytes,
          ext: extname(link.url).toLowerCase().replace(".", ""),
        });
      }
    }

    sections.push({
      slug: page.slug,
      title: page.title,
      category: page.category,
      sourceUrl: url,
      intro,
      files,
    });

    console.log(
      `  ${files.length.toString().padStart(2, " ")} files | ${page.slug}`,
    );
  }

  const payload = {
    source: "rcees.uenr.edu.gh",
    fetchedAt: new Date().toISOString(),
    sectionCount: sections.length,
    fileCount: sections.reduce((s, x) => s + x.files.length, 0),
    sections,
  };

  await mkdir(dirname(OUT_JSON), { recursive: true });
  await writeFile(OUT_JSON, JSON.stringify(payload, null, 2));
  console.log(
    `\nWrote ${payload.sectionCount} sections, ${payload.fileCount} files -> ${OUT_JSON}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
