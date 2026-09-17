"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Download, FileText, Maximize2, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import assets from "@/app/systems-assets.json";
import designAssets from "@/app/bytespace-design-assets.json";

type Artifact = {
  id: keyof typeof assets | keyof typeof designAssets;
  title: string;
  detail: string;
  status: string;
  document?: string;
  page?: number;
  poster?: boolean;
  layout?: "wide" | "supporting";
};

const artifacts: Artifact[] = [
  { id: "business-process", title: "Process Overview", detail: "Map the organization, identify problems and design solutions, then deploy, assess, and adapt. The sequence behind the rest of the framework.", status: "Methodology", document: "building-agile-organizations.pdf", page: 2, layout: "wide" },
  { id: "systems-processes-procedures", title: "Systems, Processes & Procedures", detail: "Move from core business functions to the processes that connect them, then document the procedures that make each task repeatable.", status: "Methodology", document: "building-agile-organizations.pdf", page: 5 },
  { id: "agile-execution", title: "Agile Execution", detail: "Prioritize and assign work, monitor execution, then use retrospectives and performance measures to refine the next cycle.", status: "Methodology", document: "building-agile-organizations.pdf", page: 9 },
  { id: "organization-overview", title: "Organizational Structure", detail: "A high-level model of reporting, oversight, and functional ownership across the organization.", status: "Methodology", document: "building-agile-organizations.pdf", page: 11 },
  { id: "role-fundamentals", title: "Role Fundamentals", detail: "An adapted entrepreneur, manager, and technician framework distinguishing strategic direction, system design, and day-to-day execution.", status: "Methodology", document: "building-agile-organizations.pdf", page: 12 },
  { id: "revenue-machine", title: "Revenue Machine", detail: "Marketing, sales, and customer success as one connected system. The next three diagrams unpack each part and its handoffs.", status: "Methodology", document: "building-agile-organizations.pdf", page: 24, layout: "wide" },
  { id: "marketing-system", title: "Marketing", detail: "How creative, content, community, events, and PR contribute to lead generation.", status: "Methodology", document: "building-agile-organizations.pdf", page: 19 },
  { id: "sales-system", title: "Sales", detail: "From nurturing and qualification to solution design, commercial review, and handoff.", status: "Methodology", document: "building-agile-organizations.pdf", page: 20 },
  { id: "lead-to-customer", title: "Lead to Customer Transition", detail: "Connecting account management, implementation, and ongoing support so a closed deal becomes a supported customer.", status: "Methodology", document: "building-agile-organizations.pdf", page: 21 },
  { id: "tech-stack", title: "Optimizing Tech Stack", detail: "Mapping departmental tools and shared infrastructure before deciding what to connect, replace, or automate.", status: "Methodology", document: "building-agile-organizations.pdf", page: 18 },
  { id: "implementation", title: "Implementation", detail: "A delivery sequence with account ownership, handoffs, setup, activation, and the outputs needed at each stage.", status: "Methodology", document: "building-agile-organizations.pdf", page: 29 },
  { id: "reporting", title: "Reporting", detail: "Connect departmental measures to strategic targets and a regular reporting cadence, so results inform the next decision.", status: "Methodology", document: "building-agile-organizations.pdf", page: 15, layout: "wide" },
  { id: "bytespace-org-chart", title: "Putting accountability into practice", detail: "A Bytespace org-design snapshot connecting functional owners, team handoffs, and customer feedback. Dashed roles show planned hires, not filled positions.", status: "Organization design / Roles and handoffs", layout: "supporting" },
  { id: "healthcare-system", title: "The full patient lifecycle", detail: "Connecting acquisition, care delivery, billing, and follow-up in one system. The four flows below unpack how each part could operate.", status: "Proposed workflow", document: "healthcare-workflow-design.pdf", page: 1, layout: "wide" },
  { id: "patient-journey", title: "The patient journey", detail: "Mapping the gaps between a first inquiry and the next visit, then considering where automation could support staff and patients.", status: "Proposed workflow", document: "healthcare-workflow-design.pdf", page: 2 },
  { id: "doctor-journey", title: "The doctor's journey", detail: "A proposed visit workflow, including documentation assistance, clinician approval, eligibility checks, and follow-up.", status: "Proposed workflow", document: "healthcare-workflow-design.pdf", page: 3 },
  { id: "revenue-cycle", title: "The revenue cycle", detail: "A proposed flow from encounter to claim and collection, with exception review and operational visibility.", status: "Proposed workflow", document: "healthcare-workflow-design.pdf", page: 4 },
  { id: "marketing-acquisition", title: "Marketing and acquisition", detail: "Connecting new-patient acquisition and returning-patient outreach to one scheduling and care-delivery flow.", status: "Proposed workflow", document: "healthcare-workflow-design.pdf", page: 5 },
  { id: "agent-operating-model", title: "An operating model for an agentic organization", detail: "Growth, operations, and revenue engines coordinating through shared knowledge, permissions, and organizational analytics.", status: "Conceptual architecture", document: "ai-operating-architecture.pdf", page: 6 },
  { id: "human-agent-architecture", title: "People, agents, and oversight", detail: "How human direction connects to agent orchestration, tool access, and review. Responsibility stays visible alongside automation.", status: "Conceptual architecture", document: "ai-operating-architecture.pdf", page: 3 },
  { id: "research-workflow", title: "From signal to a decision", detail: "Gather evidence, compare it with prior context, then decide whether to log, report, or escalate. Each path feeds back into shared memory.", status: "Conceptual architecture", document: "ai-operating-architecture.pdf", page: 7 },
  { id: "shared-memory", title: "Shared memory across the organization", detail: "Connecting source material, ingestion, entity linking, and retrieval so agents and people can draw on the same accumulated context.", status: "Conceptual architecture", document: "ai-operating-architecture.pdf", page: 8 },
  { id: "bytespace-interface", title: "A workspace for automated teams", detail: "A Bytespace interface design bringing agent activity into departmental views, with the work and its performance visible together.", status: "Product design artifact", layout: "wide" },
  { id: "company-overview", title: "Company Overview", detail: "The product, its positioning, and the commercial story. Metrics and comparisons are reproduced from the May 2025 overview, not presented as current figures.", status: "May 2025 / Positioning & communication design", poster: true },
  { id: "use-cases", title: "Use Cases", detail: "Workflow examples, business applications, and customer feedback, brought together in one visual narrative. Historical material from April 2025.", status: "April 2025 / Workflow & communication design", poster: true },
  { id: "product-roadmap", title: "Product Roadmap", detail: "The progression from recording tasks to orchestrating teams of agents. Milestones reflect the plan in April 2025, not current delivery status.", status: "April 2025 / Product strategy & design", poster: true },
  { id: "team-overview", title: "Team Overview", detail: "Team stories, responsibilities, and experience expressed through a shared visual system. The original Bytespace team presentation from April 2025.", status: "April 2025 / Brand & communication design", poster: true },
];

type ArtifactGroup = {
  id: string;
  title: string;
  description: string;
  items: Artifact["id"][];
  columns?: 3;
};

const businessGroups: ArtifactGroup[] = [
  { id: "the-method", title: "The method", description: "Map the organization, decide what needs to change, then execute and adapt.", items: ["business-process", "systems-processes-procedures", "agile-execution"] },
  { id: "structure-responsibility", title: "Structure & responsibility", description: "Define ownership and how information moves before designing the workflows.", items: ["organization-overview", "role-fundamentals"] },
  { id: "the-revenue-system", title: "The revenue system", description: "One connected system, from creating demand to converting leads and delivering for customers.", items: ["revenue-machine", "marketing-system", "sales-system", "lead-to-customer"], columns: 3 },
  { id: "execution-feedback", title: "Execution & feedback", description: "Match the tools to the process, make delivery repeatable, and measure what changes.", items: ["tech-stack", "implementation", "reporting"] },
];

const sections: ArtifactGroup[] = [
  { id: "business-systems", title: "Business systems", description: "I design systems first, then the processes that connect them, then the procedures that make execution repeatable. Building Agile Organizations brings together frameworks I developed and adapted before Bytespace. The same approach informs how I design human teams and agentic systems.", items: businessGroups.flatMap((group) => group.items) },
  { id: "workflow-planning", title: "Workflows & delivery", description: "A healthcare system, from the overall patient lifecycle down to individual decisions and handoffs. These anonymized proposals explore where automation could support care teams, not what was ultimately deployed.", items: ["healthcare-system", "patient-journey", "doctor-journey", "revenue-cycle", "marketing-acquisition"] },
  { id: "ai-architecture", title: "AI systems", description: "Exploring how an agentic organization could operate, with people setting direction, agents coordinating work, and shared memory connecting the two. These are architecture studies, not a deployment report.", items: ["agent-operating-model", "human-agent-architecture", "research-workflow", "shared-memory"] },
  { id: "product-design", title: "Product design", description: "Eventually, someone has to use all of this. I like working through how a complicated system becomes something a person can understand and act on.", items: ["bytespace-interface"] },
];

const completeDesigns = artifacts.filter((artifact) => artifact.poster);
const productArtifactIds = new Set<Artifact["id"]>(["bytespace-interface", ...completeDesigns.map((artifact) => artifact.id)]);

function artifactImage(id: Artifact["id"], full = false) {
  if (id in designAssets) {
    const versions = designAssets[id as keyof typeof designAssets];
    return full ? versions.full : versions.preview;
  }
  return assets[id as keyof typeof assets];
}

const documents = [
  { file: "building-agile-organizations.pdf", title: "Building Agile Organizations", description: "Frameworks and implementation examples. Curated public edition.", pages: 31 },
  { file: "healthcare-workflow-design.pdf", title: "Healthcare Workflow Design", description: "Five anonymized diagrams. Proposed workflows, not deployment results.", pages: 5 },
  { file: "planning-a-phased-rollout.pdf", title: "Planning a Phased Rollout", description: "Anonymized planning study. Not presented or implemented.", pages: 3 },
  { file: "ai-operating-architecture.pdf", title: "AI Operating Architecture", description: "Governance, integrations, shared memory, and observability. Conceptual design.", pages: 9 },
  { file: "bytespace-overview.pdf", title: "Bytespace Labs Overview", description: "AI infrastructure and the data foundation. Partner slide omitted.", pages: 25 },
];

const iconButton = "inline-flex h-10 w-10 shrink-0 items-center justify-center border border-ink/15 bg-white text-ink transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2";

export function PortfolioCollection({ collection, children }: { collection: "systems" | "product"; children?: ReactNode }) {
  const isProduct = collection === "product";
  const collectionArtifacts = artifacts.filter((artifact) => productArtifactIds.has(artifact.id) === isProduct);
  const collectionSections = sections.filter((section) => (section.id === "product-design") === isProduct);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const isOpen = activeIndex !== null;
  const active = activeIndex === null ? null : collectionArtifacts[activeIndex];
  const activeImage = active ? artifactImage(active.id, true) : null;

  useEffect(() => {
    if (!isOpen) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal?.showModal();
    return () => {
      modal?.close();
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus();
    };
  }, [isOpen]);

  function open(index: number) {
    trigger.current = document.activeElement as HTMLElement;
    setZoom(1);
    setActiveIndex(index);
  }

  function move(direction: number) {
    setActiveIndex((index) => index === null ? null : (index + direction + collectionArtifacts.length) % collectionArtifacts.length);
    setZoom(1);
    stage.current?.scrollTo(0, 0);
  }

  function renderArtifact(id: Artifact["id"], compact = false) {
    const index = collectionArtifacts.findIndex((artifact) => artifact.id === id);
    if (index === -1) throw new Error(`Missing portfolio artifact: ${id}`);
    const artifact = collectionArtifacts[index];
    const isSupporting = artifact.layout === "supporting";
    const isWide = Boolean(artifact.layout);

    return (
      <figure key={id} className={isWide ? "col-span-full min-w-0" : "min-w-0"}>
        <div className={isSupporting ? "grid items-start gap-4 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:gap-6" : ""}>
          <button type="button" onClick={() => open(index)} aria-label={`Enlarge ${artifact.title}`} title={`Enlarge ${artifact.title}`} className={`group relative block w-full cursor-zoom-in overflow-hidden border border-ink/15 bg-white focus-visible:outline-2 focus-visible:outline-offset-4 ${isSupporting ? "max-w-[17rem]" : ""}`}>
            <Image {...artifactImage(id)} alt={artifact.title} unoptimized loading={index === 0 ? "eager" : "lazy"} sizes={isSupporting ? "272px" : isWide ? "896px" : "(min-width: 640px) 438px, 100vw"} className="h-auto w-full" />
            <span aria-hidden="true" className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center border border-ink/10 bg-white/95 text-ink opacity-90 transition-opacity group-hover:opacity-100"><Maximize2 size={15} /></span>
          </button>
          <figcaption className={isSupporting ? "sm:pt-2" : "mt-3"}>
            <p className="text-sm font-medium text-ink">{artifact.title}</p>
            {!compact && (
              <>
                <p className="mt-1 text-sm leading-6 text-graphite/80">{artifact.detail}</p>
                <p className="mt-2 font-mono text-[11px] leading-5 text-graphite/65">{artifact.status}</p>
                {artifact.document && <a href={`/documents/${artifact.document}#page=${artifact.page}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-8 items-center gap-1.5 text-xs text-graphite underline decoration-ink/20 underline-offset-4 hover:text-ink">Source document <ArrowRight size={13} aria-hidden="true" /></a>}
              </>
            )}
          </figcaption>
        </div>
      </figure>
    );
  }

  return (
    <div className="w-full">
      <p className="max-w-4xl text-base leading-7 text-graphite">
        {isProduct ? (
          <>I like making complex ideas tangible. Interfaces, working demos, and visual stories from building Bytespace, from how the product works to how we explain it.</>
        ) : (
          <>I tend to see businesses as systems. How decisions get made, how work
          moves between people, and where things get stuck. These are some of the
          frameworks, workflow maps, and AI architectures I&apos;ve made while
          figuring out what to improve and where automation can actually help.</>
        )}
      </p>

      <nav aria-label={isProduct ? "Product and design sections" : "Systems sections"} className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-6 text-graphite/75 sm:text-sm">
        {collectionSections.map((section) => <a key={section.id} href={`#${section.id}`} className="underline decoration-ink/20 underline-offset-4 hover:text-ink">{section.title}</a>)}
        {isProduct ? (
          <>
            <a href="#complete-designs" className="underline decoration-ink/20 underline-offset-4 hover:text-ink">Complete designs</a>
            <a href="#product-demo" className="underline decoration-ink/20 underline-offset-4 hover:text-ink">Demos</a>
          </>
        ) : (
          <a href="#full-documents" className="inline-flex items-center gap-1 underline decoration-ink/20 underline-offset-4 hover:text-ink">Full documents <ArrowDown size={13} aria-hidden="true" /></a>
        )}
      </nav>

      {collectionSections.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="mt-12 scroll-mt-6 border-t border-ink/15 pt-8 sm:pt-10">
          <div className="mb-8 grid gap-3 sm:mb-10 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <h3 id={`${section.id}-title`} className="font-mono text-sm font-medium text-ink">{section.title}</h3>
            <p className="text-sm leading-6 text-graphite">{section.description}</p>
          </div>
          {section.id === "business-systems" ? (
            <>
              <div className="space-y-12 sm:space-y-16">
                {businessGroups.map((group, index) => (
                  <section key={group.id} aria-labelledby={`${group.id}-title`}>
                    <div className="mb-5">
                      <h4 id={`${group.id}-title`} className="flex items-baseline gap-3 text-sm font-medium text-ink"><span aria-hidden="true" className="font-mono text-xs text-graphite/50">{String(index + 1).padStart(2, "0")}</span>{group.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-graphite/80">{group.description}</p>
                    </div>
                    <div className={`grid items-start gap-x-5 gap-y-6 sm:grid-cols-2 ${group.columns === 3 ? "md:grid-cols-3" : ""}`}>
                      {group.items.map((id) => renderArtifact(id, true))}
                    </div>
                  </section>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <a href="/documents/building-agile-organizations.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 text-sm text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"><FileText size={16} aria-hidden="true" />Read Building Agile Organizations<ArrowRight size={14} aria-hidden="true" /></a>
                <p className="font-mono text-xs text-graphite/65">Public edition / 31 pages</p>
              </div>
              <div className="mt-10 sm:mt-12">{renderArtifact("bytespace-org-chart")}</div>
            </>
          ) : (
            <div className="grid items-start gap-x-5 gap-y-8 sm:grid-cols-2">
              {section.items.map((id) => renderArtifact(id))}
            </div>
          )}
        </section>
      ))}

      {isProduct && (
        <>
      <section id="complete-designs" aria-labelledby="complete-designs-title" className="mt-12 scroll-mt-6 border-t border-ink/15 pt-8 sm:pt-10">
        <div className="mb-8 grid gap-3 sm:mb-10 sm:grid-cols-[11rem_1fr] sm:gap-6">
          <h3 id="complete-designs-title" className="font-mono text-sm font-medium text-ink">Complete designs</h3>
          <p className="text-sm leading-6 text-graphite">Strategy, product, and storytelling brought together for Bytespace. These original pieces capture the company&apos;s direction and voice in spring 2025.</p>
        </div>
        <div className="grid grid-cols-2 items-start gap-x-2 gap-y-24 pb-20 md:grid-cols-4">
          {completeDesigns.map((artifact) => (
            <figure key={artifact.id} className="relative min-w-0">
              <button type="button" aria-label={`View complete ${artifact.title}`} title={`View complete ${artifact.title}`} onClick={() => open(collectionArtifacts.indexOf(artifact))} className="block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4">
                <Image {...artifactImage(artifact.id)} alt={`${artifact.title}, complete original composition`} unoptimized loading="lazy" className="block h-auto w-full" />
              </button>
              <figcaption className="absolute inset-x-0 top-full mt-3">
                <p className="flex items-start justify-between gap-2 text-sm font-medium text-ink"><span>{artifact.title}</span><Maximize2 size={13} aria-hidden="true" className="mt-1 shrink-0 text-graphite/50" /></p>
                <p className="mt-1 text-xs leading-5 text-graphite/70">{artifact.status.split(" / ")[0]}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
          {children}
        </>
      )}

      {!isProduct && (
      <section id="full-documents" aria-labelledby="full-documents-title" className="mt-12 scroll-mt-6 border-t border-ink/15 pt-8 sm:pt-10">
        <h3 id="full-documents-title" className="font-mono text-sm font-medium text-ink">Full documents</h3>
        <div className="mt-8 divide-y divide-ink/10 border-b border-ink/10 sm:mt-10">
          {documents.map((doc) => (
            <div key={doc.file} className="flex items-start gap-3 py-4">
              <FileText size={18} className="mt-1 shrink-0 text-graphite/50" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <a href={`/documents/${doc.file}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink">{doc.title}</a>
                <p className="mt-1 text-xs leading-5 text-graphite/75">{doc.description}</p>
                <p className="mt-1 font-mono text-[11px] leading-5 text-graphite/60">PDF / {doc.pages} pages</p>
              </div>
              <a href={`/documents/${doc.file}`} download title={`Download ${doc.title}`} aria-label={`Download ${doc.title}`} className={iconButton}><Download size={16} aria-hidden="true" /></a>
            </div>
          ))}
        </div>
      </section>
      )}

      <dialog ref={dialog} aria-labelledby="artifact-title" aria-describedby="artifact-detail" className="systems-dialog" onCancel={() => setActiveIndex(null)} onClick={(event) => { if (event.target === event.currentTarget) setActiveIndex(null); }} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }}>
        {active && activeImage && (
          <div className="flex max-h-[94dvh] flex-col bg-white">
            <div className="flex items-start justify-between gap-3 border-b border-ink/15 p-3 sm:p-4">
              <div className="min-w-0">
                <p id="artifact-title" className="text-sm font-semibold leading-6 text-ink">{active.title}</p>
                <p className="font-mono text-[11px] leading-5 text-graphite/65">{active.status}</p>
              </div>
              <button type="button" title="Close" aria-label="Close viewer" onClick={() => setActiveIndex(null)} className={iconButton}><X size={18} /></button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 px-3 py-2">
              <div className="flex items-center gap-2">
                <button type="button" title="Previous image" aria-label="Previous image" onClick={() => move(-1)} className={iconButton}><ChevronLeft size={18} /></button>
                <span className="w-16 shrink-0 whitespace-nowrap text-center font-mono text-xs text-graphite" aria-live="polite">{activeIndex! + 1} / {collectionArtifacts.length}</span>
                <button type="button" title="Next image" aria-label="Next image" onClick={() => move(1)} className={iconButton}><ChevronRight size={18} /></button>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" title="Zoom out" aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom((value) => Math.max(1, value - 0.5))} className={iconButton}><ZoomOut size={17} /></button>
                <span className="w-10 text-center font-mono text-[11px] text-graphite" aria-live="polite">{Math.round(zoom * 100)}%</span>
                <button type="button" title="Zoom in" aria-label="Zoom in" disabled={zoom >= 3} onClick={() => setZoom((value) => Math.min(3, value + 0.5))} className={iconButton}><ZoomIn size={17} /></button>
                <button type="button" title="Fit to viewer" aria-label="Fit to viewer" onClick={() => { setZoom(1); stage.current?.scrollTo(0, 0); }} className={iconButton}><RotateCcw size={16} /></button>
              </div>
            </div>
            <div ref={stage} className="systems-viewer-stage min-h-0 flex-1 overflow-auto bg-[#f4f4f4] p-2 sm:p-4">
              <Image key={active.id} {...activeImage} alt={active.title} unoptimized loading="eager" className={zoom === 1 && !active.poster ? "h-full w-full object-contain" : "block h-auto max-w-none"} style={zoom > 1 || active.poster ? { width: `${zoom * 100}%` } : undefined} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/15 p-3 sm:px-4">
              <p id="artifact-detail" className="max-w-3xl text-xs leading-5 text-graphite">{active.detail}</p>
              {active.document && <a href={`/documents/${active.document}#page=${active.page}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 shrink-0 items-center gap-1.5 text-xs underline underline-offset-4"><FileText size={14} aria-hidden="true" /> Source PDF</a>}
              {active.poster && <a href={activeImage.src} download title={`Download ${active.title}`} aria-label={`Download ${active.title}`} className={iconButton}><Download size={16} aria-hidden="true" /></a>}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
