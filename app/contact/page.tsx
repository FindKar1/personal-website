import type { Metadata } from "next";
import { SectionLabel } from "@/components/ArchivePieces";
import { PageShell } from "@/components/SiteFrame";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Kar Dhillon.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-28">
        <div className="absolute inset-0 paper-grain opacity-45" />
        <div className="relative mx-auto max-w-7xl">
          <SectionLabel>Contact</SectionLabel>
          <h1 className="max-w-5xl font-serif text-[clamp(4.8rem,12vw,12rem)] leading-[0.78] tracking-[-0.085em] text-ink">
            Send a signal.
          </h1>
          <div className="mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
            <a
              href="mailto:kar@bytespace.ai"
              className="group border border-ink/12 bg-paper-light p-7 transition-colors hover:border-rust/50"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-rust">Email</p>
              <p className="mt-8 font-serif text-4xl leading-none tracking-[-0.05em] text-ink group-hover:text-rust">
                kar@bytespace.ai
              </p>
            </a>
            <a
              href="https://www.kardhillon.com"
              className="group border border-ink/12 bg-paper-light p-7 transition-colors hover:border-rust/50"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-rust">Home</p>
              <p className="mt-8 font-serif text-4xl leading-none tracking-[-0.05em] text-ink group-hover:text-rust">
                kardhillon.com
              </p>
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
