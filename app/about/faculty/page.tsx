import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faculty, images } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Faculty",
  description: "Teaching and research staff at RCEES across engineering, environmental science, economics and policy.",
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function FacultyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our people"
        title="Faculty."
        lead="Teaching and research staff across the Centre's MSc, MPhil and PhD programmes — drawn from engineering, environmental science, economics and policy."
        image={images.directorWelcome}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Faculty" },
        ]}
      />

      <section className="container-rcees py-24">
        <SectionHeading eyebrow="Teaching and research staff" title="Faculty members." />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.map((m) => (
            <article
              key={m.name}
              className="flex h-full flex-col border border-rule bg-paper p-7"
            >
              {m.photo ? (
                <img
                  src={`${basePath}${m.photo}`}
                  alt={m.name}
                  className="h-28 w-28 rounded-full border border-rule object-cover"
                  loading="lazy"
                />
              ) : (
                <div
                  className="h-28 w-28 rounded-full border border-rule bg-mist"
                  aria-hidden="true"
                />
              )}
              <p className="mt-6 eyebrow">{m.role}</p>
              <h3 className="mt-2 font-serif text-xl leading-snug text-ink">
                {m.name}
              </h3>
              <p className="mt-1 text-sm text-muted">{m.credentials}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
