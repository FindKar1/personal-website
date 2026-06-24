import Link from "next/link";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-rust md:justify-start">
      <span className="h-px w-10 bg-rust/45" />
      {children}
      <span className="h-px w-10 bg-rust/45 md:hidden" />
    </div>
  );
}

export function HeroImagePanel() {
  return (
    <div className="relative mx-auto aspect-[0.92/1] w-[min(74vw,470px)] overflow-hidden bg-[#f6f1e7] shadow-[0_28px_90px_rgba(36,31,22,0.18)] ring-1 ring-ink/8">
      <div className="absolute inset-0 paper-grain opacity-35" />
      <svg viewBox="0 0 520 565" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="portraitGlow" cx="50%" cy="34%" r="66%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
            <stop offset="58%" stopColor="#e8e1d4" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#cfc5b4" stopOpacity="0.22" />
          </radialGradient>
          <filter id="softInk" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="5" />
          </filter>
        </defs>
        <rect width="520" height="565" fill="url(#portraitGlow)" />
        <path d="M166 398 C182 320 226 280 278 265 C330 250 384 278 404 334 C426 398 398 482 336 510 C276 538 184 500 166 398Z" fill="#171511" fillOpacity="0.86" />
        <path d="M278 111 C238 108 204 132 188 164 C151 171 128 210 139 252 C113 283 122 330 154 349 C165 391 208 416 256 405 C296 427 350 411 372 371 C420 352 434 296 407 259 C419 214 392 172 352 160 C336 130 310 113 278 111Z" fill="#171511" fillOpacity="0.92" filter="url(#softInk)" />
        <path d="M246 181 C211 204 198 250 210 292 C220 330 250 359 286 363 C332 368 374 333 382 285 C391 236 362 190 319 177 C292 169 266 170 246 181Z" fill="#efe8dc" />
        <path d="M213 282 C177 286 158 271 147 244 C158 236 184 235 209 249" fill="#171511" fillOpacity="0.83" />
        <path d="M238 226 C266 217 300 215 334 229" fill="none" stroke="#171511" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" />
        <path d="M242 274 C268 286 300 284 327 270" fill="none" stroke="#171511" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
        <path d="M327 249 C342 260 347 282 337 301" fill="none" stroke="#171511" strokeOpacity="0.38" strokeWidth="3" strokeLinecap="round" />
        {Array.from({ length: 24 }).map((_, index) => {
          const x = 105 + ((index * 37) % 325);
          const y = 82 + ((index * 53) % 312);
          const r = 16 + (index % 5) * 7;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={r}
              fill="none"
              stroke="#171511"
              strokeOpacity={0.08 + (index % 4) * 0.035}
              strokeWidth="2"
            />
          );
        })}
        <path d="M94 472 C152 436 196 432 250 456 C306 480 354 474 425 426" fill="none" stroke="#a84d37" strokeOpacity="0.62" strokeWidth="2" />
        <path d="M118 500 C206 466 280 504 410 462" fill="none" stroke="#171511" strokeOpacity="0.18" strokeWidth="2" />
      </svg>
      <div className="absolute bottom-5 left-5 rotate-[-7deg] font-serif text-5xl italic tracking-[-0.08em] text-ink/75">
        Kar
      </div>
      <div className="absolute bottom-5 right-5 border border-ink/10 bg-paper/65 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-graphite backdrop-blur-sm">
        field image / draft
      </div>
    </div>
  );
}

export function LiteraturePostCard({
  eyebrow,
  date,
  title,
  description,
  tags,
  index,
}: {
  eyebrow: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
  index: number;
}) {
  return (
    <article className="group">
      <div className="relative aspect-[1.48/1] overflow-hidden bg-[#d8d2c4] ring-1 ring-ink/10">
        <div className="absolute inset-0 paper-grain opacity-45" />
        <svg viewBox="0 0 480 324" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <rect width="480" height="324" fill={index % 2 === 0 ? "#cfd5d3" : "#d5c7b4"} opacity="0.58" />
          <path d="M0 240 C90 198 152 246 226 206 C314 158 378 188 480 126 L480 324 L0 324Z" fill={index % 2 === 0 ? "#6f7c75" : "#7a5d4c"} opacity="0.42" />
          <path d="M70 238 C122 174 184 188 232 130 C286 68 370 74 424 112" fill="none" stroke="#171511" strokeOpacity="0.23" strokeWidth="2" />
          <path d="M58 84 C170 124 282 64 424 104" fill="none" stroke="#171511" strokeOpacity="0.15" strokeWidth="2" strokeDasharray="5 9" />
          <circle cx={index % 2 === 0 ? 348 : 120} cy={index % 2 === 0 ? 96 : 110} r="44" fill="#f4eddf" opacity="0.45" />
          <path d="M96 272 L420 272" stroke="#171511" strokeOpacity="0.18" />
        </svg>
      </div>
      <div className="mt-4 border-b border-ink/12 pb-5">
        <p className="font-serif text-sm italic text-rust/80">{date}</p>
        <h3 className="mt-1 font-serif text-3xl leading-[0.92] tracking-[-0.05em] text-ink transition-colors group-hover:text-rust">
          {title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-graphite">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-graphite/75">
          <span>{eyebrow}</span>
          <span>|</span>
          <span>{tags[0]}</span>
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
