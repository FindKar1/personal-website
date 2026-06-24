import type { Metadata } from "next";
import { SectionLabel } from "@/components/ArchivePieces";
import { PageShell } from "@/components/SiteFrame";
import { labFragments } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Lab",
  description: "Experiments, diagrams, visual studies, and unfinished research fragments.",
};

export default function LabPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-28">
        <div className="absolute inset-0 paper-grain opacity-50" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <SectionLabel>Laboratory</SectionLabel>
            <h1 className="font-serif text-[clamp(5rem,12vw,12rem)] leading-[0.78] tracking-[-0.085em] text-ink">
              Workbench
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-9 text-graphite">
              This page is for the material that does not yet know what it wants to be: sketches, diagrams, research trails, visual studies, models, prompts, and speculative fragments.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {labFragments.map((fragment, index) => (
              <article
                key={fragment}
                className="relative min-h-48 overflow-hidden border border-ink/12 bg-paper-light p-5 shadow-[0_20px_70px_rgba(32,26,16,0.07)]"
              >
                <div className="absolute inset-0 paper-grain opacity-60" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-rust">
                    fragment {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-serif text-3xl leading-none tracking-[-0.05em] text-ink">
                    {fragment}
                  </h2>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
