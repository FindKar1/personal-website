import { EssayCard, PlateDiagram, ProjectCard, SectionLabel, TextLink } from "@/components/ArchivePieces";
import { PageShell } from "@/components/SiteFrame";
import { currentFocus, essays, labFragments, projects } from "@/lib/site-data";

export default function Home() {
  return (
    <PageShell>
      <section className="relative overflow-hidden px-5 py-14 sm:px-8 lg:py-20">
        <div className="absolute inset-0 paper-grain opacity-45" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_0.72fr] lg:items-end">
          <div>
            <div className="mb-8 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.26em] text-graphite/70">
              <span className="border border-ink/12 px-3 py-2">Personal archive</span>
              <span className="border border-ink/12 px-3 py-2">Systems</span>
              <span className="border border-ink/12 px-3 py-2">Simulation</span>
              <span className="border border-ink/12 px-3 py-2">Research</span>
            </div>
            <h1 className="max-w-5xl font-serif text-[clamp(5rem,15vw,14rem)] leading-[0.76] tracking-[-0.085em] text-ink">
              Kar
              <br />
              Dhillon
            </h1>
            <div className="mt-8 max-w-3xl border-l border-rust/50 pl-5">
              <p className="font-serif text-3xl leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl">
                Notes from the edge of software, science, infrastructure, and simulation.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-graphite sm:text-lg">
                A public field journal for the things I am building, studying, sketching, and trying to understand — from AI systems and research tools to strange worlds, workflows, and machines.
              </p>
            </div>
          </div>
          <PlateDiagram />
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper-light/60 px-5 py-8 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[0.42fr_1fr] md:items-start">
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-rust">
            Current focus
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {currentFocus.map((item, index) => (
              <p key={item} className="border-l border-ink/12 pl-4 text-sm leading-6 text-graphite">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-blueprint">
                  0{index + 1}
                </span>
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel>Selected writing</SectionLabel>
              <h2 className="max-w-3xl font-serif text-6xl leading-[0.9] tracking-[-0.065em] text-ink sm:text-8xl">
                Essays as research instruments.
              </h2>
            </div>
            <TextLink href="/writing">Enter writing index</TextLink>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {essays.map((essay) => (
              <EssayCard key={essay.slug} {...essay} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e6dac4] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.42fr_1fr]">
          <div>
            <SectionLabel>Systems in public</SectionLabel>
            <h2 className="font-serif text-6xl leading-[0.9] tracking-[-0.065em] text-ink sm:text-8xl">
              Projects, tools, and machines.
            </h2>
            <p className="mt-6 text-base leading-7 text-graphite">
              The project page is intentionally not a résumé. It is a catalog of systems in motion: companies, products, experiments, diagrams, and operational ideas.
            </p>
          </div>
          <div>
            {projects.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
            <div className="mt-6">
              <TextLink href="/projects">View project archive</TextLink>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-28">
        <div className="absolute inset-0 paper-grain opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1fr] lg:items-center">
          <div>
            <SectionLabel>The lab</SectionLabel>
            <h2 className="font-serif text-6xl leading-[0.9] tracking-[-0.065em] text-ink sm:text-8xl">
              Fragments before they become essays.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-graphite">
              A place for visual studies, research trails, unfinished arguments, diagrams, and speculative notes that are too useful to leave buried in chats.
            </p>
            <div className="mt-8">
              <TextLink href="/lab">Open the lab</TextLink>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {labFragments.map((fragment, index) => (
              <div
                key={fragment}
                className="relative min-h-32 overflow-hidden border border-ink/12 bg-paper-light p-4"
              >
                <div className="absolute inset-0 paper-grain opacity-55" />
                <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-blueprint">
                  specimen {String(index + 1).padStart(2, "0")}
                </span>
                <p className="relative z-10 mt-8 font-serif text-2xl leading-none tracking-[-0.04em] text-ink">
                  {fragment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
