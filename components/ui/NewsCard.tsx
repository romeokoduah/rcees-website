import Image from "next/image";
import Link from "next/link";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function NewsCard({
  date,
  title,
  excerpt,
  image,
  href = "/news",
}: {
  date: string;
  title: string;
  excerpt: string;
  image: string | null;
  href?: string;
}) {
  const isExternal = /^https?:\/\//.test(href);
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    isExternal ? (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group block no-underline"
      >
        {children}
      </a>
    ) : (
      <Link href={href} className="group block no-underline">
        {children}
      </Link>
    );

  return (
    <Wrapper>
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-forest-900">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-mist">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                RCEES
              </span>
            </div>
          )}
        </div>
        <div className="mt-5 flex-1 border-t border-rule pt-5">
          <p className="eyebrow">{formatDate(date)}</p>
          <h3 className="mt-2 font-serif text-xl leading-snug text-ink group-hover:text-forest">
            {title}
          </h3>
          {excerpt && (
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{excerpt}</p>
          )}
          <p className="mt-4 text-sm font-medium text-forest">
            {isExternal ? "Read on rcees.uenr.edu.gh →" : "Read more →"}
          </p>
        </div>
      </article>
    </Wrapper>
  );
}
