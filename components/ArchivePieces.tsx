import Link from "next/link";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-rust">
      <span className="h-px w-10 bg-rust/45" />
      {children}
    </div>
  );
}

export function EssayCard({
  eyebrow,
  date,
  title,
  description,
  tags,
}: {
  eyebrow: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
}) {
  return (
    <article className="group relative flex min-h-[310px] flex-col justify-between overflow-hidden border border-ink/14 bg-paper-light p-6 shadow-[0_20px_70px_rgba(32,26,16,0.08)] transition-transform duration-500 hover:-translate-y-1">
      <div className="absolute inset-0 paper-grain opacity-55" />
      <div className="relative z-10">
        <div className="mb-10 flex items-center justify-between gap-5 border-b border-ink/10 pb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-graphite/70">
          <span>{eyebrow}</span>
          <span>{date}</span>
        </div>
        <h3 className="font-serif text-4xl leading-[0.92] tracking-[-0.055em] text-ink">
          {title}
        </h3>
      </div>
      <div className="relative z-10 mt-8">
        <p className="max-w-md text-sm leading-6 text-graphite">{description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="border border-blueprint/25 bg-blueprint/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-blueprint"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ProjectCard({
  name,
  type,
  status,
  description,
}: {
  name: string;
  type: string;
  status: string;
  description: string;
}) {
  return (
    <article className="grid gap-5 border-t border-ink/14 py-7 md:grid-cols-[0.75fr_1fr_0.45fr] md:items-start">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-rust">{type}</p>
        <h3 className="mt-2 font-serif text-4xl leading-none tracking-[-0.05em] text-ink">
          {name}
        </h3>
      </div>
      <p className="max-w-2xl text-base leading-7 text-graphite">{description}</p>
      <div className="justify-self-start border border-ink/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-graphite md:justify-self-end">
        {status}
      </div>
    </article>
  );
}

export function PlateDiagram() {
  return (
    <div className="relative min-h-[520px] overflow-hidden border border-ink/14 bg-[#eee5d2] shadow-[0_30px_100px_rgba(25,20,12,0.12)]">
      <div className="absolute inset-0 paper-grain opacity-70" />
      <div className="absolute inset-6 border border-ink/10" />
      <svg
        viewBox="0 0 640 760"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#5e7c86" strokeOpacity="0.16" strokeWidth="1" />
          </pattern>
          <radialGradient id="wash" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#f4ead3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d9c9ad" stopOpacity="0.16" />
          </radialGradient>
        </defs>
        <rect width="640" height="760" fill="url(#grid)" />
        <rect width="640" height="760" fill="url(#wash)" />
        <path d="M320 108 C445 124 532 224 520 360 C506 520 384 596 268 554 C154 512 104 360 170 242 C202 184 250 126 320 108Z" fill="none" stroke="#171511" strokeOpacity="0.48" strokeWidth="1.4" />
        <path d="M320 160 C396 170 454 230 450 318 C444 424 365 478 286 452 C207 426 178 328 218 252 C240 212 274 172 320 160Z" fill="none" stroke="#a84d37" strokeOpacity="0.62" strokeWidth="1.2" />
        <path d="M318 224 C362 234 390 270 384 318 C376 382 326 408 282 386 C238 364 234 302 260 264 C274 244 294 226 318 224Z" fill="none" stroke="#5e7c86" strokeOpacity="0.82" strokeWidth="1.5" />
        {Array.from({ length: 15 }).map((_, index) => {
          const y = 118 + index * 34;
          const width = 80 + (index % 5) * 22;
          return (
            <path
              key={index}
              d={`M${84 + index * 3} ${y} C ${180 + width} ${y - 24}, ${390 - width / 2} ${y + 40}, ${548 - index * 4} ${y + 6}`}
              fill="none"
              stroke={index % 3 === 0 ? "#a84d37" : "#171511"}
              strokeOpacity={index % 3 === 0 ? "0.26" : "0.13"}
              strokeWidth="1"
            />
          );
        })}
        <circle cx="320" cy="318" r="7" fill="#a84d37" />
        <circle cx="218" cy="252" r="4" fill="#171511" fillOpacity="0.65" />
        <circle cx="450" cy="318" r="4" fill="#171511" fillOpacity="0.65" />
        <circle cx="286" cy="452" r="4" fill="#171511" fillOpacity="0.65" />
        <path d="M320 318 L522 210" stroke="#171511" strokeOpacity="0.34" strokeWidth="1" strokeDasharray="4 8" />
        <path d="M320 318 L118 456" stroke="#171511" strokeOpacity="0.34" strokeWidth="1" strokeDasharray="4 8" />
        <path d="M320 318 L486 572" stroke="#171511" strokeOpacity="0.34" strokeWidth="1" strokeDasharray="4 8" />
      </svg>
      <div className="absolute left-8 top-8 border border-ink/12 bg-paper/75 p-3 font-mono text-[10px] uppercase leading-5 tracking-[0.18em] text-graphite backdrop-blur-sm">
        Archive plate<br />KD-001<br />systems / simulation
      </div>
      <div className="absolute bottom-8 right-8 max-w-[220px] border border-rust/25 bg-rust/8 p-4 text-sm leading-6 text-graphite backdrop-blur-sm">
        A site for essays, experiments, diagrams, projects, and half-finished maps of the future.
      </div>
    </div>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-rust transition-colors hover:text-ink"
    >
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}
