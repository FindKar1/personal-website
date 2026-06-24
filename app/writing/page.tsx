import type { Metadata } from "next";
import { EssayCard, SectionLabel } from "@/components/ArchivePieces";
import { PageShell } from "@/components/SiteFrame";
import { essays } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays, field notes, and research fragments by Kar Dhillon.",
};

export default function WritingPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-28">
        <div className="absolute inset-0 paper-grain opacity-40" />
        <div className="relative mx-auto max-w-7xl">
          <SectionLabel>Writing index</SectionLabel>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-end">
            <h1 className="font-serif text-[clamp(5rem,13vw,13rem)] leading-[0.78] tracking-[-0.085em] text-ink">
              Field
              <br />
              notes
            </h1>
            <p className="max-w-2xl border-l border-rust/50 pl-5 text-xl leading-9 text-graphite">
              Essays and research fragments on simulations, scientific tools, infrastructure, AI systems, founder work, and the strange boundary between ideas and machines.
            </p>
          </div>
        </div>
      </section>
      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {essays.map((essay) => (
            <EssayCard key={essay.slug} {...essay} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
