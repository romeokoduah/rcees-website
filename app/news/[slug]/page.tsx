import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";

type NewsItem = {
  id: number;
  date: string;
  slug: string;
  title: string;
  excerpt: string;
  link: string;
  image: string | null;
  content: string;
};

async function getAll(): Promise<NewsItem[]> {
  try {
    const p = path.join(process.cwd(), "public", "data", "news.json");
    const raw = await readFile(p, "utf-8");
    const data = JSON.parse(raw);
    return (data.items || []) as NewsItem[];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const items = await getAll();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const items = await getAll();
  const item = items.find((i) => i.slug === params.slug);
  if (!item) return { title: "Not found" };
  return {
    title: item.title,
    description: item.excerpt,
  };
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function rewriteAssetPaths(html: string): string {
  if (!basePath) return html;
  return html.replace(/src="\/images\//g, `src="${basePath}/images/`);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const items = await getAll();
  const index = items.findIndex((i) => i.slug === params.slug);
  const item = items[index];
  if (!item) notFound();

  const prev = items[index + 1] || null;
  const next = items[index - 1] || null;

  const content = rewriteAssetPaths(item.content);

  return (
    <article className="bg-paper">
      <div className="border-b border-rule bg-mist">
        <div className="container-rcees py-14">
          <nav className="flex flex-wrap gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span>/</span>
            <Link href="/news" className="hover:text-ink">
              News &amp; Events
            </Link>
            <span>/</span>
            <span className="text-ink/70">Article</span>
          </nav>
          <p className="mt-6 eyebrow">{formatDate(item.date)}</p>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-5xl">
            {item.title}
          </h1>
          {item.excerpt && (
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/75">
              {item.excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="container-rcees py-16">
        <div
          className="news-article prose max-w-3xl text-ink"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      <div className="border-t border-rule bg-mist">
        <div className="container-rcees py-12">
          <div className="grid gap-6 md:grid-cols-2">
            {prev ? (
              <Link
                href={`/news/${prev.slug}`}
                className="group block border border-rule bg-paper p-6 no-underline"
              >
                <p className="eyebrow">← Older</p>
                <p className="mt-2 font-serif text-lg text-ink group-hover:text-forest">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/news/${next.slug}`}
                className="group block border border-rule bg-paper p-6 text-right no-underline"
              >
                <p className="eyebrow">Newer →</p>
                <p className="mt-2 font-serif text-lg text-ink group-hover:text-forest">
                  {next.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
          </div>
          <p className="mt-8 text-center">
            <Link
              href="/news"
              className="text-sm font-medium text-forest hover:underline"
            >
              ← Back to all news
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
