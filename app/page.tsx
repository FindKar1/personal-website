import { HeroImagePanel, LiteraturePostCard, ProjectCard, SectionLabel, TextLink } from "@/components/ArchivePieces";
import { PageShell } from "@/components/SiteFrame";
import { essays, labFragments, projects } from "@/lib/site-data";

export default function Home() {
  return (
    <PageShell>
      <section className="relative min-h-[calc(100vh-65px)] overflow-hidden bg-[#dedbcc] px-5 pb-16 pt-12 sm:px-8 lg:pb-20 lg:pt-16">
        <div className="absolute inset-0 paper-grain opacity-28" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-graphite/70">
            <span>Personal journal</span>
            <span className="hidden sm:inline">Writing / Systems / Lab</span>
          </div>

          <div className="relative mx-auto flex min-h-[610px] max-w-6xl items-center justify-center">
            <div className="absolute left-0 right-0 top-[42%] z-20 hidden -translate-y-1/2 items-center justify-between lg:flex">
              <span className="font-serif text-[clamp(8rem,14vw,13.5rem)] leading-none tracking-[-0.085em] text-ink">
                KAR
              </span>
              <span className="font-serif text-[clamp(8rem,14vw,13.5rem)] leading-none tracking-[-0.085em] text-ink">
                DHILLON
              </span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 text-center lg:hidden">
                <h1 className="font-serif text-[clamp(5.6rem,18vw,9rem)] leading-[0.75] tracking-[-0.085em] text-ink">
                  Kar
                  <br />
                  Dhillon
                </h1>
              </div>
              <HeroImagePanel />
              <div className="mt-8 flex h-9 w-9 items-center justify-center rounded-full border border-ink/30 font-serif text-2xl text-ink/70">
                ↓
              </div>
            </div>

            <div className="absolute bottom-4 left-0 z-30 hidden max-w-[260px] -rotate-3 border border-ink/10 bg-paper-light/75 p-4 shadow-[0_20px_60px_rgba(32,26,16,0.12)] backdrop-blur-sm md:block">
              <p className="font-serif text-2xl leading-[0.95] tracking-[-0.05em] text-ink">
                Notes from software, science, infrastructure, and simulation.
              </p>
            </div>

            <div className="absolute bottom-0 right-0 z-30 hidden w-[270px] border border-ink/10 bg-paper-light/85 p-5 shadow-[0_20px_60px_rgba(32,26,16,0.12)] backdrop-blur-sm md:block">
              <p className="font-serif text-2xl leading-[0.95] tracking-[-0.04em] text-ink">
                Subscribe to the archive
              </p>
              <p className="mt-3 text-xs leading-5 text-graphite">
                Essays, diagrams, and public notes from the workbench. Newsletter layer coming soon.
              </p>
              <div className="mt-5 flex items-center border-b border-ink/25 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-graphite/60">
                Your email <span className="ml-auto text-ink">↗</span>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center font-serif text-3xl leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl">
            A literary-scientific home for essays, experiments, systems, and half-finished maps of the future.
          </p>
        </div>
      </section>

      <section className="bg-[#f3f0e8] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-serif text-sm italic text-rust/80">New field notes</p>
          <h2 className="mt-2 font-serif text-5xl leading-[0.95] tracking-[-0.055em] text-ink sm:text-7xl">
            Latest writing
          </h2>
          <div className="mx-auto mt-5 h-px w-24 bg-ink/20" />
        </div>
        <div className="mx-auto mt-10 grid max-w-6xl gap-x-6 gap-y-12 md:grid-cols-3">
          {essays.map((essay, index) => (
            <LiteraturePostCard key={essay.slug} {...essay} index={index} />
          ))}
        </div>
      </section>

      <section className="bg-[#dedbcc] px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.7fr_1fr_0.55fr] md:items-center">
          <h2 className="font-serif text-4xl leading-[0.95] tracking-[-0.045em] text-ink sm:text-5xl">
            Systems, projects, and strange little machines.
          </h2>
          <p className="text-sm leading-7 text-graphite">
            This is the personal layer: not a corporate landing page, not a résumé, but a reading room for the work around Bytespace, bot0, scientific replication, frontier companies, and the design of useful AI systems.
          </p>
          <div className="flex justify-start md:justify-end">
            <TextLink href="/projects">Read more</TextLink>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f0e8] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.38fr_1fr]">
          <div>
            <SectionLabel>Project index</SectionLabel>
            <h2 className="font-serif text-5xl leading-[0.95] tracking-[-0.055em] text-ink sm:text-7xl">
              What I am building.
            </h2>
          </div>
          <div>
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#dedbcc] px-5 py-20 sm:px-8 lg:py-24">
        <div className="absolute inset-0 paper-grain opacity-28" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-[0.7fr_1fr] md:items-end">
            <div>
              <SectionLabel>Lab fragments</SectionLabel>
              <h2 className="font-serif text-5xl leading-[0.95] tracking-[-0.055em] text-ink sm:text-7xl">
                Before it becomes polished.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-graphite">
              Loose research trails, diagrams, visual studies, and speculative notes. This section should eventually feel like a drawer full of annotated plates.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {labFragments.slice(0, 8).map((fragment, index) => (
              <div key={fragment} className="min-h-28 border border-ink/12 bg-paper-light/65 p-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-rust">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-6 font-serif text-2xl leading-none tracking-[-0.04em] text-ink">
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
