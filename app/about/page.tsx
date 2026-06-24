import type { Metadata } from "next";
import { SectionLabel } from "@/components/ArchivePieces";
import { PageShell } from "@/components/SiteFrame";

export const metadata: Metadata = {
  title: "About",
  description: "About Kar Dhillon and the purpose of this personal archive.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1fr]">
          <div>
            <SectionLabel>About</SectionLabel>
            <h1 className="font-serif text-[clamp(5rem,12vw,12rem)] leading-[0.78] tracking-[-0.085em] text-ink">
              Kar
            </h1>
          </div>
          <div className="max-w-3xl space-y-8 text-xl leading-9 text-graphite">
            <p>
              I build software systems, AI tools, and infrastructure for turning messy real-world work into usable machines. This site is my public archive for the ideas, projects, diagrams, research notes, and experiments that orbit that work.
            </p>
            <p>
              The goal is not to be a polished résumé. It is to keep a durable record of what I am learning and building: frontier science, simulation, agent systems, operational software, datacenter infrastructure, visual design, and the philosophical constraints that appear when machines begin to act in the world.
            </p>
            <div className="grid gap-4 border-y border-ink/12 py-8 sm:grid-cols-3">
              {[
                ["Building", "Bytespace, bot0, research tools"],
                ["Studying", "science, simulations, infrastructure"],
                ["Writing", "field notes from the workbench"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-rust">{label}</p>
                  <p className="mt-2 text-base leading-7 text-graphite">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
