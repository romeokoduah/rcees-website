import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { team, images } from "@/lib/constants";

export const metadata: Metadata = {
  title: "The Team",
  description:
    "Centre management, administrators, industrial and international scientific advisory boards at RCEES.",
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

type Person = {
  name: string;
  role: string;
  credentials?: string;
  bio?: string;
  photo?: string | null;
};

function PersonCard({ person }: { person: Person }) {
  const photo = person.photo ? `${basePath}${person.photo}` : null;
  return (
    <article className="flex h-full flex-col border border-rule bg-paper p-7">
      {photo ? (
        <img
          src={photo}
          alt={person.name}
          className="h-28 w-28 rounded-full border border-rule object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="flex h-28 w-28 items-center justify-center rounded-full border border-rule bg-mist font-mono text-xs uppercase tracking-widest text-muted"
          aria-hidden="true"
        >
          {person.name
            .split(" ")
            .filter((p) => /^[A-Z]/.test(p) && !/^(Dr|Mr|Mrs|Ms|Ing|Prof)\.?$/.test(p))
            .slice(0, 2)
            .map((p) => p[0])
            .join("")}
        </div>
      )}
      <p className="mt-6 eyebrow">{person.role}</p>
      <h3 className="mt-2 font-serif text-xl leading-snug text-ink">
        {person.name}
      </h3>
      {person.credentials && (
        <p className="mt-1 text-sm text-muted">{person.credentials}</p>
      )}
      {person.bio && (
        <p className="mt-4 text-sm leading-relaxed text-ink/75">{person.bio}</p>
      )}
    </article>
  );
}

export default function TeamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our people"
        title="Leadership, administrators and advisory boards."
        lead="The Centre is led by a management team of engineers, economists and policy researchers, supported by administrators and two advisory boards drawn from industry and international academia."
        image={images.directorWelcome}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "The Team" },
        ]}
      />

      {/* Anchor navigation */}
      <section className="border-b border-rule bg-paper">
        <div className="container-rcees py-6">
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-xs uppercase tracking-wider text-muted">
            <a href="#management" className="hover:text-ink">
              Centre Management · {team.management.length}
            </a>
            <a href="#administrators" className="hover:text-ink">
              Administrators · {team.administrators.length}
            </a>
            <a href="#industrial-board" className="hover:text-ink">
              Industrial Advisory Board · {team.industrialBoard.length}
            </a>
            <a href="#international-board" className="hover:text-ink">
              International Scientific Advisory Board ·{" "}
              {team.internationalBoard.length}
            </a>
          </nav>
        </div>
      </section>

      <section id="management" className="container-rcees py-24 scroll-mt-24">
        <SectionHeading
          eyebrow="Centre management"
          title="The leadership team."
        />
        <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-ink/75">
          Day-to-day direction of the Centre, its research agenda, academic
          programmes, partnerships and operations.
        </p>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.management.map((p) => (
            <PersonCard key={p.name} person={p} />
          ))}
        </div>
      </section>

      <section
        id="administrators"
        className="border-t border-rule bg-mist scroll-mt-24"
      >
        <div className="container-rcees py-24">
          <SectionHeading
            eyebrow="Administration"
            title="Centre administrators."
          />
          <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-ink/75">
            The team that runs admissions, student affairs, facilities, finance,
            media and day-to-day operations.
          </p>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.administrators.map((p) => (
              <PersonCard key={p.name} person={p} />
            ))}
          </div>
        </div>
      </section>

      <section id="industrial-board" className="container-rcees py-24 scroll-mt-24">
        <SectionHeading
          eyebrow="Industrial advisory board"
          title="Industry partners guiding our work."
        />
        <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-ink/75">
          Senior executives and practitioners from utilities, regulators,
          development agencies and industry who keep the Centre's work aligned
          with professional practice in the energy and environmental sectors.
        </p>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.industrialBoard.map((p) => (
            <PersonCard key={p.name} person={p} />
          ))}
        </div>
      </section>

      <section
        id="international-board"
        className="border-t border-rule bg-mist scroll-mt-24"
      >
        <div className="container-rcees py-24">
          <SectionHeading
            eyebrow="International scientific advisory board"
            title="Peer review and scientific guidance."
          />
          <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-ink/75">
            Senior academics from partner universities across Europe, North
            America, Oceania and Africa who provide peer review and scientific
            guidance on the Centre's research agenda.
          </p>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.internationalBoard.map((p) => (
              <PersonCard key={p.name} person={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
