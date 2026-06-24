import type { Metadata } from "next";
import { ProjectCard, SectionLabel } from "@/components/ArchivePieces";
import { PageShell } from "@/components/SiteFrame";
import { projects } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Projects",
  description: "Systems, products, companies, and research projects from Kar Dhillon.",
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <section className="bg-[#e6dac4] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Project archive</SectionLabel>
          <h1 className="max-w-5xl font-serif text-[clamp(4.8rem,12vw,12rem)] leading-[0.78] tracking-[-0.085em] text-ink">
            Systems in motion.
          </h1>
          <p className="mt-8 max-w-3xl text-xl leading-9 text-graphite">
            A compact index of the companies, tools, research workflows, and visual systems I am building or studying. Each one is treated like a living machine, not a finished credential.
          </p>
        </div>
      </section>
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {projects.map((project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
