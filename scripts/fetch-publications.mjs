#!/usr/bin/env node
/**
 * Fetches RCEES / UENR publications from OpenAlex and writes
 * public/data/publications.json. Runs on every deploy (push + daily cron).
 *
 * Strategy (union + dedupe by work ID):
 *   1. All works where any author is affiliated with UENR
 *      (institution lineage I291863076).
 *   2. Works where raw affiliation string mentions "RCEES" or the full
 *      centre name — catches entries with RCEES tagged but not UENR.
 *   3. For each named RCEES faculty member, resolve all OpenAlex author
 *      IDs that have UENR in their institution history, then pull every
 *      work by those author IDs. Catches publications listed under a
 *      visiting or prior affiliation.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "public", "data", "publications.json");

const UENR_INSTITUTION = "I291863076";
const MAILTO = "rcees@uenr.edu.gh";
const PER_PAGE = 200;
const PAGE_CEILING = 60; // safety: up to 12,000 works per filter

const FACULTY_NAMES = [
  "Eric Antwi Ofosu",
  "Samuel Gyamfi",
  "Amos Kabo-Bah",
  "Francis Attiogbe",
  "Nana Sarfo Derkyi",
  "Daniel Adu",
  "Samuel Fosu Gyasi",
  "Ebenezer Kumi",
  "Ismaila Emahi",
  "Emmanuel Amankwah",
  "Martin Domfeh",
  "Mary Antwi",
  "Mark Amo-Boateng",
  "Eric Donyina",
  "Kamila Kabo-Bah",
  "Felix Amankwah Diawuo",
  "Prince Antwi-Agyei",
  "David Anaafo",
  "Francis Kuranchie",
  "E. Kwesi Nyantakyi",
  "Edward Awafo",
  "Kenneth Bentum",
  "Benjamin Batinge",
];

const SELECT = [
  "id",
  "doi",
  "title",
  "display_name",
  "publication_year",
  "publication_date",
  "type",
  "cited_by_count",
  "authorships",
  "primary_location",
  "open_access",
  "language",
  "concepts",
].join(",");

async function openalex(path, params) {
  const url = new URL(`https://api.openalex.org/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("mailto", MAILTO);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenAlex ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchAllWorks(filter, label) {
  const works = [];
  let cursor = "*";
  let pages = 0;
  while (cursor && pages < PAGE_CEILING) {
    const data = await openalex("works", {
      filter,
      "per-page": String(PER_PAGE),
      cursor,
      select: SELECT,
    });
    works.push(...data.results);
    cursor = data.meta.next_cursor;
    pages++;
  }
  console.log(`  ${label}: ${works.length} works (${pages} pages)`);
  return works;
}

async function resolveFacultyAuthorIds(names) {
  const ids = new Set();
  for (const name of names) {
    try {
      const data = await openalex("authors", {
        search: name,
        "per-page": "10",
      });
      for (const a of data.results) {
        const insts = [
          ...(a.last_known_institutions || []),
          ...(a.affiliations || []).flatMap((af) => [af.institution]),
        ].filter(Boolean);
        const linked = insts.some(
          (i) =>
            (i.lineage || []).some((l) => l.endsWith(UENR_INSTITUTION)) ||
            (i.id || "").endsWith(UENR_INSTITUTION),
        );
        if (linked) {
          ids.add(a.id);
        }
      }
    } catch (e) {
      console.warn(`  ! failed author lookup for "${name}": ${e.message}`);
    }
  }
  return [...ids];
}

function normalise(w) {
  const authors = (w.authorships || []).map((a) => ({
    name: a.author?.display_name || "Unknown",
    isRcees: (a.raw_affiliation_strings || []).some((s) =>
      /RCEES|Regional Centre for Energy and Environmental Sustainability/i.test(
        s,
      ),
    ),
    isUenr: (a.institutions || []).some(
      (i) =>
        (i.lineage || []).some((l) => l.endsWith(UENR_INSTITUTION)) ||
        (i.id || "").endsWith(UENR_INSTITUTION),
    ),
  }));

  const isRcees = authors.some((a) => a.isRcees);
  const isUenr = authors.some((a) => a.isUenr);

  const venue = w.primary_location?.source?.display_name || null;
  const venueType = w.primary_location?.source?.type || null;
  const isOa = w.open_access?.is_oa || false;
  const oaUrl = w.open_access?.oa_url || null;
  const landingUrl = w.primary_location?.landing_page_url || null;

  const topics = (w.concepts || [])
    .filter((c) => c.level <= 1)
    .slice(0, 4)
    .map((c) => c.display_name);

  return {
    id: w.id,
    doi: w.doi,
    title: w.title || w.display_name || "Untitled",
    year: w.publication_year,
    date: w.publication_date,
    type: w.type,
    citations: w.cited_by_count || 0,
    authors: authors.slice(0, 15),
    authorCount: authors.length,
    venue,
    venueType,
    isOpenAccess: isOa,
    isRcees,
    isUenr,
    url: oaUrl || landingUrl || w.doi || w.id,
    topics,
  };
}

async function main() {
  console.log("Fetching UENR / RCEES publications from OpenAlex…");
  const byId = new Map();

  const filters = [
    {
      filter: `authorships.institutions.lineage:${UENR_INSTITUTION}`,
      label: "UENR institution lineage",
    },
    {
      filter: `raw_affiliation_strings.search:RCEES`,
      label: "raw affiliation: RCEES",
    },
    {
      filter: `raw_affiliation_strings.search:"Regional Centre for Energy and Environmental Sustainability"`,
      label: "raw affiliation: full centre name",
    },
  ];

  for (const { filter, label } of filters) {
    const ws = await fetchAllWorks(filter, label);
    for (const w of ws) byId.set(w.id, w);
  }

  console.log("Resolving RCEES faculty author IDs…");
  const authorIds = await resolveFacultyAuthorIds(FACULTY_NAMES);
  console.log(`  resolved ${authorIds.length} author IDs`);

  if (authorIds.length) {
    const chunks = [];
    for (let i = 0; i < authorIds.length; i += 25) {
      chunks.push(authorIds.slice(i, i + 25));
    }
    for (const chunk of chunks) {
      const filter = `author.id:${chunk.map((id) => id.split("/").pop()).join("|")}`;
      const ws = await fetchAllWorks(filter, `faculty author IDs (${chunk.length})`);
      for (const w of ws) byId.set(w.id, w);
    }
  }

  const deduped = [...byId.values()].map(normalise);

  deduped.sort((a, b) => {
    if (b.year !== a.year) return (b.year || 0) - (a.year || 0);
    return b.citations - a.citations;
  });

  const payload = {
    source: "openalex",
    fetchedAt: new Date().toISOString(),
    count: deduped.length,
    publications: deduped,
  };

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(payload, null, 2));
  console.log(`\nWrote ${deduped.length} unique publications -> ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
