import type { Metadata } from "next";
import { ArrowUpRight, FileText, Download } from "lucide-react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ACE Impact",
  description:
    "RCEES's role in the World Bank's Africa Centres of Excellence for Development Impact programme — reports, milestones, audits and governance documents.",
};

type AceFile = {
  label: string;
  local: string;
  source: string;
  bytes: number;
  ext: string;
};
type AceSection = {
  slug: string;
  title: string;
  category: "about" | "dli" | "tools" | "reports" | "other";
  sourceUrl: string;
  intro: string;
  files: AceFile[];
};
type AcePayload = {
  source: string;
  fetchedAt: string;
  sectionCount: number;
  fileCount: number;
  sections: AceSection[];
};

async function getData(): Promise<AcePayload | null> {
  try {
    const p = path.join(process.cwd(), "public", "data", "ace-impact.json");
    const raw = await readFile(p, "utf-8");
    return JSON.parse(raw) as AcePayload;
  } catch {
    return null;
  }
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
function withBase(src: string) {
  if (!src) return src;
  if (/^https?:\/\//.test(src)) return src;
  return `${basePath}${src}`;
}

function formatBytes(n: number) {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

const CATEGORIES: {
  id: AceSection["category"];
  eyebrow: string;
  title: string;
  lead: string;
}[] = [
  {
    id: "dli",
    eyebrow: "Disbursement-Linked Indicators",
    title: "Milestones and verification reports.",
    lead: "ACE Impact disbursements are tied to the achievement of programme milestones. Each section below groups the Centre's verification reports, supporting documents and evidence.",
  },
  {
    id: "reports",
    eyebrow: "Accountability",
    title: "Audit, finance and governance.",
    lead: "Published audit findings, financial reports and records of the Centre's governance activities.",
  },
  {
    id: "tools",
    eyebrow: "Systems and frameworks",
    title: "Governance instruments.",
    lead: "Tools and frameworks that support ACE Impact compliance: grievance redress, environmental monitoring and benchmarking.",
  },
  {
    id: "other",
    eyebrow: "Other",
    title: "Additional documents.",
    lead: "Supplementary documents that don't fit the main categories.",
  },
];

function extIcon(ext: string) {
  return ext?.toUpperCase() || "FILE";
}

export default async function AceImpactPage() {
  const data = await getData();
  const sections = data?.sections || [];
  const fileCount = data?.fileCount || 0;

  // About section may have no files — pick up its intro for overview copy
  const about = sections.find((s) => s.category === "about");

  // Build grouping
  const byCategory: Record<string, AceSection[]> = {};
  for (const s of sections) {
    if (s.category === "about") continue;
    (byCategory[s.category] ||= []).push(s);
  }

  return (
    <>
      <PageHeader
        eyebrow="ACE Impact"
        title="Africa Centres of Excellence for Development Impact."
        lead={
          about?.intro ||
          "RCEES is one of 46 Africa Centres of Excellence funded through the World Bank's ACE Impact programme, delivering specialised postgraduate training and applied research across the continent."
        }
        image={images.researchHero}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "ACE Impact" }]}
      />

      <section className="container-rcees py-20">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionHeading eyebrow="Overview" title="What ACE Impact delivers." />
            <div className="mt-8 space-y-5 text-[1.025rem] leading-relaxed text-ink/80">
              <p>
                Through the World Bank's ACE Impact programme, RCEES trains
                postgraduates in energy and environmental sustainability, builds
                an international research profile, and runs professional short
                courses for practitioners across West and Central Africa. The
                Centre's performance is measured against Disbursement-Linked
                Indicators (DLIs) and verified through independent reviews.
              </p>
              <p>
                This page consolidates every public ACE Impact document the
                Centre has published — milestone verification reports, audits,
                financial statements, governance records and supporting
                instruments. {fileCount ? `${fileCount} documents in total.` : ""}
              </p>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="border border-rule bg-mist p-8">
              <p className="eyebrow">Quick references</p>
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <a
                    href="https://ace.aau.org"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-forest"
                  >
                    ACE Impact programme site{" "}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://grm.aau.org"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-forest"
                  >
                    e-GRM (grievance redress) portal{" "}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.worldbank.org/en/programs/africa-higher-education-centers-of-excellence-project"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-forest"
                  >
                    World Bank ACE programme <ArrowUpRight className="h-4 w-4" />
                  </a>
                </li>
              </ul>
              <p className="mt-6 border-t border-rule pt-4 text-xs text-muted">
                Every document below links to a local copy mirrored from the
                original RCEES publication on rcees.uenr.edu.gh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {CATEGORIES.map((cat) => {
        const group = byCategory[cat.id];
        if (!group || group.length === 0) return null;
        const groupFileCount = group.reduce((s, x) => s + x.files.length, 0);
        return (
          <section
            key={cat.id}
            className="border-t border-rule"
          >
            <div className="container-rcees py-20">
              <div className="flex items-end justify-between gap-6">
                <SectionHeading eyebrow={cat.eyebrow} title={cat.title} />
                <p className="hidden font-mono text-xs text-muted md:block">
                  {groupFileCount} documents
                </p>
              </div>
              <p className="mt-6 max-w-3xl text-[1rem] leading-relaxed text-ink/75">
                {cat.lead}
              </p>

              <div className="mt-14 grid gap-8 md:grid-cols-2">
                {group.map((section) => (
                  <article
                    key={section.slug}
                    className="flex h-full flex-col border border-rule bg-paper"
                  >
                    <header className="border-b border-rule p-7">
                      <h3 className="font-serif text-xl leading-snug text-ink">
                        {section.title}
                      </h3>
                      {section.intro && (
                        <p className="mt-3 text-sm leading-relaxed text-ink/70">
                          {section.intro}
                        </p>
                      )}
                      <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted">
                        {section.files.length}{" "}
                        {section.files.length === 1 ? "document" : "documents"}
                      </p>
                    </header>
                    {section.files.length > 0 ? (
                      <ul className="divide-y divide-rule">
                        {section.files.map((f) => (
                          <li key={f.local}>
                            <a
                              href={withBase(f.local)}
                              target="_blank"
                              rel="noreferrer"
                              className="group flex items-start gap-4 p-5 no-underline hover:bg-mist"
                              download
                            >
                              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-rule font-mono text-[10px] text-muted">
                                {extIcon(f.ext)}
                              </span>
                              <span className="flex-1 text-sm leading-snug text-ink/85 group-hover:text-ink">
                                {f.label}
                              </span>
                              <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
                                {formatBytes(f.bytes)}
                                <Download className="h-3.5 w-3.5" />
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex flex-1 items-center justify-center p-8">
                        <p className="text-sm italic text-muted">
                          No published files yet.
                        </p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {sections.length === 0 && (
        <section className="container-rcees py-24">
          <div className="border border-rule bg-paper p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 text-sm text-muted">
              ACE Impact document index is being refreshed. Please check back
              shortly.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
