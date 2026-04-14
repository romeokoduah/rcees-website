import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsCard } from "@/components/ui/NewsCard";
import { images } from "@/lib/constants";

type NewsItem = {
  id: number;
  date: string;
  slug: string;
  title: string;
  excerpt: string;
  link: string;
  image: string | null;
};

async function getNews(): Promise<NewsItem[]> {
  try {
    const p = path.join(process.cwd(), "public", "data", "news.json");
    const raw = await readFile(p, "utf-8");
    const data = JSON.parse(raw);
    return data.items || [];
  } catch {
    return [];
  }
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
function withBase(src: string | null): string | null {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return src;
  return `${basePath}${src}`;
}

export const metadata: Metadata = {
  title: "News & Events",
  description: "News, events, success stories and gallery from RCEES.",
};

const events = [
  { date: "2026-05-14", title: "Public lecture: The economics of Ghana's power sector", location: "RCEES Auditorium, UENR" },
  { date: "2026-06-04", title: "Workshop on cookstove performance testing", location: "Biomass Research Laboratory" },
  { date: "2026-07-22", title: "ACE Impact annual regional workshop", location: "Sunyani" },
];

const stories = [
  { name: "Afia Mensah", programme: "PhD Sustainable Energy Engineering and Management", body: "Now leading a national rural electrification programme at the Ministry of Energy after completing her doctoral work on mini-grid economics." },
  { name: "Tunde Adewale", programme: "MSc Energy Economics", body: "Research analyst at a regional development bank, advising on climate finance for renewable portfolios across West Africa." },
  { name: "Marianne Rakotondrazaka", programme: "PhD Environmental Engineering and Management", body: "Postdoctoral researcher at an EU partner university, continuing her work on water quality in reservoir systems." },
];

export default async function NewsPage() {
  const news = await getNews();
  return (
    <>
      <PageHeader
        eyebrow="News & events"
        title="What's happening at RCEES."
        lead="News from the Centre, upcoming events, stories from alumni and students, and a visual record of the Centre's work."
        image={images.news1}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News & Events" }]}
      />

      <section className="container-rcees py-24">
        <div className="flex items-end justify-between gap-8">
          <SectionHeading eyebrow="News" title="Latest from the Centre." />
          <p className="hidden font-mono text-xs text-muted md:block">
            {news.length} articles archived
          </p>
        </div>
        {news.length === 0 ? (
          <p className="mt-10 text-sm text-muted">No news items available.</p>
        ) : (
          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <NewsCard
                key={n.id}
                date={n.date}
                title={n.title}
                excerpt={n.excerpt}
                image={withBase(n.image)}
                href={n.link}
              />
            ))}
          </div>
        )}
      </section>

      <section id="events" className="border-y border-rule bg-mist">
        <div className="container-rcees py-24">
          <SectionHeading eyebrow="Events" title="Upcoming at RCEES." />
          <ul className="mt-12 divide-y divide-rule border-y border-rule bg-paper">
            {events.map((e) => {
              const d = new Date(e.date);
              return (
                <li key={e.title} className="grid grid-cols-[auto_1fr] items-center gap-6 px-6 py-6 md:grid-cols-[120px_1fr_auto] md:gap-8 md:px-8">
                  <div className="font-mono text-sm text-forest">
                    <p className="text-2xl">{d.getDate()}</p>
                    <p>{d.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</p>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-ink">{e.title}</h3>
                    <p className="mt-1 text-xs uppercase tracking-wider text-muted">{e.location}</p>
                  </div>
                  <span className="hidden text-sm font-medium text-forest md:block">Details →</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="stories" className="container-rcees py-24">
        <SectionHeading eyebrow="Success stories" title="Where our graduates work." />
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {stories.map((s) => (
            <article key={s.name} className="flex h-full flex-col border border-rule bg-paper p-8">
              <p className="eyebrow">{s.programme}</p>
              <h3 className="mt-4 font-serif text-xl text-ink">{s.name}</h3>
              <p className="mt-4 flex-1 text-[0.975rem] leading-relaxed text-ink/75">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="gallery" className="border-t border-rule bg-mist">
        <div className="container-rcees py-24">
          <SectionHeading eyebrow="Gallery" title="The Centre in images." />
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[images.aboutTeaser, images.facilityA, images.facilityB, images.facilityC, images.facilityD, images.history, images.news2, images.news3].map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden bg-forest-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
