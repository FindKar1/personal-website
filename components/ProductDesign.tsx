"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import productAssets from "@/app/product-design-assets.json";
import { BytespaceStudies } from "./BytespaceStudies";
import { BytespaceHero } from "./BytespaceHero";
import { BytespaceVideoWall } from "./BytespaceVideoWall";
import { BytespaceMonitor } from "./BytespaceMonitor";
import { BytespaceNodeCatalog } from "./BytespaceNodeCatalog";
import { BytespacePlanIcons } from "./BytespacePlanIcons";
import { BytespaceMarketplace } from "./BytespaceMarketplace";
import { HealthcareAnimations } from "./HealthcareAnimations";
import posterAssets from "@/app/bytespace-design-assets.json";
import systemsAssets from "@/app/systems-assets.json";
import styles from "./ProductDesign.module.css";

const images = { ...productAssets, ...posterAssets, "bytespace-workspace": { preview: systemsAssets["bytespace-interface"], full: systemsAssets["bytespace-interface"] } };
type ImageId = keyof typeof images;
const captions: Partial<Record<ImageId, [string, string?]>> = {
  "bot-octopus": ["The research instrument", "bot0 / The octopus as a visual identity for many tools working together."],
  "bot-models": ["Models", "Scientific models expressed through archival illustration."],
  "bot-data": ["Data & memory", "A visual language for connected knowledge."],
  "bot-compute": ["Compute", "Research infrastructure as an instrument bench."],
  "bot-team": ["Collaboration", "People and agents working together."],
  "labs-cover": ["Accelerate Science", "Bytespace Labs / Brand & website concept"],
  "labs-biology": ["Biology", "Scientific illustration / Bytespace Labs"],
  "labs-anatomy": ["Living systems", "Scientific illustration / Bytespace Labs"],
  "labs-materials": ["Matter", "Scientific illustration / Bytespace Labs"],
  "labs-curiosity": ["A place for curiosity", "Editorial artwork / Bytespace Labs"],
  "labs-healthcare": ["Bytespace Healthcare"],
  "agent-library": ["A library of web agents", "Task-specific agents, organized around the work people want to get done."],
  "bytespace-workspace": ["A workspace for automated teams", "An earlier Bytespace interface study connecting agent activity, departments, and performance."],
  "portal-space": ["Space", "Bytespace / Light-mode environment study"],
  "portal-energy": ["Energy", "Bytespace / Light-mode environment study"],
  "portal-garden": ["An impossible garden", "Bytespace / Light-mode environment study"],
  "portal-gateway": ["The gateway", "Bytespace / Light-mode environment study"],
  "world-landscape": ["A bigger world", "An open landscape connecting the playful and technical sides of Bytespace."],
  "extension-popup": ["Automation, in the browser", "The Chrome extension brings personal and community automations into the browser."],
  "agent-cursor": ["The agent at work", "A character, cursor, and status message make the automation visible."],
  "desktop-shell": ["The Bytespace desktop", "An illustrated desktop from the original Bytespace visual identity."],
  "characters": ["One agent, many identities", "The original yellow agent developed into a family of roles, costumes, and personalities."],
  "browser-modern": ["Across the web", "Browser automation communicated through an isometric product illustration."],
  "browser-legacy": ["Even the older web", "The same visual language applied to a familiar legacy website."],
  "office-network": ["Teams, spaces & browser work", "An earlier product vision connecting a virtual office to work across the web."],
  "office-process": ["From composition to implementation", "A working layout with placement and sizing annotations."],
  "office-landscape": ["The isometric system", "Modular offices, agents, and infrastructure built from a common visual vocabulary."],
  "early-agent": ["The original agent", "An early agent profile: role, capacity, scheduled work, and completed tasks."],
  "office-interface": ["The virtual office", "An early interface concept connecting the agent world to team activity and alerts."],
  "automation-scenes": ["Making automation visible", "The agent follows the work across familiar browser tasks."],
  "product-composition": ["The product, together", "A product communication composition connecting the builder, library, and run view."],
  "business-landscape": ["A world of automated work", "The original isometric identity, extended into a complete brand composition."],
  "brand-instrument": ["The Bytespace instrument", "A modular object built from the same language as the offices and icon system."],
  "founders-composition": ["The people behind Bytespace", "The isometric language applied to a founder introduction."],
  "launch-illustration": ["Earth & rocket", "A launch illustration from the original Bytespace visual identity."],
  "early-access": ["Early access", "Product nodes became a typographic language of their own."],
  "shirt-design": ["Off the screen", "The browser-automation identity translated into a shirt graphic."],
  "character-sales": ["Sales", "The original agent, given a role and a wardrobe."],
  "character-scientist": ["Scientist", "Bytespace / Character studies"],
  "character-doctor": ["Doctor", "Bytespace / Character studies"],
  "character-construction": ["Builder", "Bytespace / Character studies"],
  "character-samurai": ["Samurai", "Bytespace / Character studies"],
  "character-ice": ["Ice knight", "Bytespace / Character studies"],
  "character-space": ["Space crew", "Bytespace / Character studies"],
  "character-code": ["Code warlock", "Bytespace / Character studies"],
  "character-fire": ["Fire knight", "Bytespace / Character studies"],
  "character-armor": ["Robot armor", "Bytespace / Character studies"],
  "character-fairy": ["Space fairy", "Bytespace / Character studies"],
  "character-pirate": ["Pirate", "Bytespace / Character studies"],
  "character-einstein": ["Einstein", "Bytespace / Character studies"],
  "icon-ai": ["Intelligence", "Bytespace / Isometric icon system"],
  "icon-control": ["Control", "Bytespace / Isometric icon system"],
  "icon-identity": ["Identity", "Bytespace / Isometric icon system"],
  "icon-web": ["The web", "Bytespace / Isometric icon system"],
  "icon-security": ["Security", "Bytespace / Isometric icon system"],
  "icon-space": ["Spaces", "Bytespace / Isometric icon system"],
  "company-overview": ["Company Overview", "May 2025 / Original positioning and communication design. Figures and comparisons are historical."],
  "use-cases": ["Use Cases", "April 2025 / Original workflow and communication design."],
  "product-roadmap": ["Product Roadmap", "April 2025 / Historical product plan, not current delivery status."],
  "team-overview": ["Team Overview", "April 2025 / Original brand and team presentation."],
};
const galleryOrder = Object.keys(captions) as ImageId[];
const posters: ImageId[] = ["company-overview", "use-cases", "product-roadmap", "team-overview"];
const icons: ImageId[] = ["icon-ai", "icon-control", "icon-identity", "icon-web", "icon-security", "icon-space"];
const characters: ImageId[] = ["character-code", "character-ice", "character-space", "character-samurai", "character-pirate", "character-fire", "character-armor"];
const portals: ImageId[] = ["portal-energy", "portal-gateway", "portal-garden"];

function ChapterHeader({ number, id, title, category, children, href }: {
  number?: string; id: string; title: ReactNode; category?: string; children: ReactNode; href?: string;
}) {
  return <header className={styles.chapterHeader}>
    <div>{category && <p className={styles.eyebrow}>{number && `${number} / `}{category}</p>}<h2 id={`${id}-title`}>{title}</h2></div>
    <div className={styles.chapterSummary}>{children}{href && <a href={href} target="_blank" rel="noopener noreferrer">Visit {new URL(href).hostname}<ArrowUpRight size={14} aria-hidden="true" /></a>}</div>
  </header>;
}

export function ProductDesign({ children }: { children?: ReactNode }) {
  const [active, setActive] = useState<ImageId | null>(null);
  const [zoom, setZoom] = useState(1);
  const [demoExpanded, setDemoExpanded] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const demoDialog = useRef<HTMLDialogElement>(null);
  const demoButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const isOpen = active !== null;
  const attachDemo = useCallback((frame: HTMLIFrameElement | null) => {
    // A cached iframe can finish loading before React attaches its load handler.
    if (frame?.contentDocument?.readyState === "complete" && frame.contentDocument.URL.endsWith("/showcases/bot0/index.html")) {
      setDemoLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const modal = dialog.current;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal?.showModal();
    return () => { modal?.close(); document.body.style.overflow = oldOverflow; trigger.current?.focus(); };
  }, [isOpen]);

  useEffect(() => {
    if (!demoExpanded) return;
    const modal = demoDialog.current;
    const opener = demoButton.current;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal?.showModal();
    return () => { modal?.close(); document.body.style.overflow = oldOverflow; opener?.focus(); };
  }, [demoExpanded]);

  function open(id: ImageId) {
    trigger.current = document.activeElement as HTMLElement;
    setZoom(1);
    setActive(id);
  }

  function move(direction: number) {
    setActive(current => current ? galleryOrder[(galleryOrder.indexOf(current) + direction + galleryOrder.length) % galleryOrder.length] : null);
    setZoom(1);
    stage.current?.scrollTo(0, 0);
  }

  function artwork(id: ImageId, options: { className?: string; surface?: string; caption?: boolean; fullResolution?: boolean } = {}) {
    const [title] = captions[id]!;
    return <figure className={`${styles.artwork} ${options.className ?? ""}`} data-artwork={id} key={id}>
      <button type="button" onClick={() => open(id)} aria-label={`Enlarge ${title}`} title={`Enlarge ${title}`} className={`${styles.artButton} ${options.surface ?? ""}`}>
        <Image {...images[id][options.fullResolution ? "full" : "preview"]} alt={title} unoptimized loading="lazy" className={styles.artImage} />
        <span className={styles.expandIcon} aria-hidden="true"><Maximize2 size={15} /></span>
      </button>
      {options.caption !== false && <figcaption>{title}</figcaption>}
    </figure>;
  }

  const activeInfo = active ? captions[active]! : null;
  const activeImage = active ? images[active].full : null;

  return <div className={styles.portfolio}>
    <div className={styles.intro}>
      <p>I fucking love product and design. It&apos;s where all the brainstorming and theorizing finally becomes something someone can touch, feel, and use. It&apos;s also an exercise in psychology. You have to understand how people think, not just how your system works.</p>
      <p>A clever idea doesn&apos;t mean much if using it is a pain in the ass.</p>
      <p>I can lose hours to the smallest details. How a button responds. The rhythm of an animation. What a color makes you feel. Even the skeleton loader someone sees while they&apos;re waiting. Those details shape how a product feels long before someone can explain why they like it. That&apos;s the part I obsess over.</p>
      <p>Below are two products from that work. bot0, an agent workspace originally designed for researchers. And cmd0, my favorite, a Chrome extension that brings browser automation and world-building together.</p>
    </div>
    <nav aria-label="Product and design sections" className={styles.sectionNav}>
      <a href="#bot0">bot0</a><a href="#product-design">cmd0 <ArrowDown size={13} aria-hidden="true" /></a>
    </nav>

    <section id="bot0" aria-labelledby="bot0-title" className={styles.chapter}>
      <div className={styles.botIntro}>
        <div className={styles.octopusField}><Image {...images["bot-octopus"].preview} alt="" unoptimized loading="eager" className={styles.octopus} /></div>
        <ChapterHeader number="01" id="bot0" title="bot0" category="Research workspace" href="https://bot0.dev">
          <p className={styles.chapterLead}>bot0 began as a workspace for scientific research. Access to a powerful model was only one piece. Researchers also needed to work with their data, run experiments, and manage the compute underneath it all. We wanted to bring those pieces together so they could spend more time investigating a question and less time assembling the system.</p>
        </ChapterHeader>
      </div>
      <div className={styles.demo}>
        <div className={styles.demoBar}><span className={styles.demoName}><span aria-hidden="true" />bot0 / research workspace</span><button ref={demoButton} type="button" aria-label="Expand bot0 demo" title="Expand bot0 demo" onClick={() => setDemoExpanded(true)}><Maximize2 size={16} /></button></div>
        <div className={styles.demoFrame}>
          {!demoLoaded && <p className={styles.loading} role="status">Loading interface...</p>}
          <iframe ref={attachDemo} src="/showcases/bot0/index.html" title="bot0 interactive product showcase" onLoad={() => setDemoLoaded(true)} loading="lazy" />
        </div>
      </div>
      <div className={styles.botIdentity}>
        {(["bot-models", "bot-data", "bot-compute", "bot-team"] as ImageId[]).map(id => artwork(id, { surface: styles.botIllustration }))}
      </div>
      <div id="labs-healthcare" className={styles.researchNarrative}>
        <p className={styles.contextCopy}>We later explored how the same foundation might serve hospitals and clinics. The workflows were different. Data ownership mattered, and different people needed different levels of control. It pushed us to think beyond a single researcher&apos;s workspace.</p>
        {artwork("labs-healthcare", { caption: false })}
      </div>
      <HealthcareAnimations />
      <div className={styles.labStudies}>
        {(["labs-biology", "labs-anatomy", "labs-materials"] as ImageId[]).map(id => artwork(id, { surface: styles.labIllustration }))}
      </div>
    </section>

    <section id="product-design" aria-labelledby="product-design-title" className={styles.chapter}>
      <ChapterHeader number="02" id="product-design" title="cmd0" category="Bytespace Chrome Extension">
        <p className={styles.chapterLead}>We kept running into the same problem with browser automation. Scripts broke when websites changed. Early AI agents were flexible, but often unreliable and expensive to run. With cmd0, we took a different approach. Workflows followed defined steps, while AI helped people build them and repair broken selectors when a page changed.</p>
      </ChapterHeader>
      <BytespaceHero />
      <div className={styles.productStage}>
        <div className={styles.desktopComposition}>
          <Image {...images["desktop-shell"].preview} alt="Illustrated Bytespace desktop" unoptimized loading="lazy" className={styles.desktopShell} />
          <div className={styles.monitorScreen}>
            <BytespaceMonitor />
          </div>
        </div>
      </div>
      {children}
      <BytespaceVideoWall />
      <section id="bytespace-world" aria-labelledby="bytespace-world-title">
        <div className={styles.subheading}><h3 id="bytespace-world-title">Giving the agents a world</h3></div>
        <p className={styles.contextCopy}>We also wanted agents to feel less abstract. Giving them faces and personalities made them more approachable. Managing them borrowed from the familiar experience of managing a team, while the visual world borrowed from games. We wanted building automations to feel playful, not just technical.</p>
        <div className={styles.portalGrid}>{portals.map(id => artwork(id, { caption: false, className: id === "portal-gateway" ? styles.gatewayPortal : undefined }))}</div>
        <div className={styles.characterLineup} aria-label="Bytespace character designs">
          {characters.map(id => artwork(id, { surface: styles.characterPortrait, caption: false }))}
        </div>
        <div className={styles.collectionLink}><button type="button" onClick={() => open("characters")}>All characters <ArrowUpRight size={14} aria-hidden="true" /></button></div>
      </section>

      <BytespaceMarketplace />
      <BytespaceNodeCatalog />
      {artwork("world-landscape", { className: styles.landscape, caption: false })}

      <section id="bytespace-interfaces" className={styles.productInterfaces} aria-labelledby="bytespace-live-title">
        <div className={styles.subheading}><h3 id="bytespace-live-title">Inside the product</h3></div>
        <div className={styles.extensionComposition}>
          {artwork("extension-popup", { className: styles.extensionPopup, caption: false })}
          <div className={styles.extensionDetails}>
            {artwork("agent-cursor", { className: styles.cursorStudy, caption: false })}
            {artwork("bytespace-workspace", { className: styles.interface, caption: false })}
          </div>
        </div>
        <BytespaceStudies />
        <p className={styles.credit}>Interactive archive / Sample data, no connected accounts or live runs.</p>
      </section>

      <section id="design-evolution" aria-labelledby="evolution-title" className={styles.evolution}>
        <div className={styles.subheading}><h3 id="evolution-title">Early cmd0</h3></div>
        {artwork("product-composition", { className: styles.productOverview, fullResolution: true })}
        {artwork("office-landscape", { caption: false })}
        <div className={styles.browserStudies}>
          <div className={styles.browserPair}>{artwork("browser-modern", { caption: false })}{artwork("browser-legacy", { caption: false })}</div>
          {artwork("shirt-design", { className: styles.browserGraphic, caption: false })}
        </div>
        <div className={styles.iconStrip} aria-label="Bytespace isometric icon system">{icons.map(id => artwork(id, { caption: false, surface: styles.iconStage }))}</div>
        <BytespacePlanIcons />
        <div className={styles.originGrid}>
          <div className={styles.originalAgent}>{artwork("early-agent")}</div>
          <div>{artwork("office-network")}</div>
        </div>
        {artwork("office-interface")}
        <div className={styles.twoUp}>{artwork("business-landscape", { caption: false })}{artwork("automation-scenes", { caption: false })}</div>
        <div className={styles.subheading}><h3>Beyond the interface</h3></div>
        <div className={styles.brandObjects}>
          {artwork("brand-instrument", { surface: styles.brandObject, caption: false })}
          {artwork("founders-composition", { surface: styles.brandObject, caption: false })}
        </div>
        <section id="complete-designs" aria-labelledby="design-archive-title" className={styles.explorations}>
          <div className={styles.subheading}><h3 id="design-archive-title">Presentations & design archive</h3></div>
          <div className={styles.explorationsBody}>
            <div>
              <div className={styles.posters}>{posters.map(id => artwork(id))}</div>
              <p className={styles.credit}>2025 archive / Historical plans and figures</p>
            </div>
            {artwork("office-process")}
            {artwork("early-access")}
          </div>
        </section>
        {artwork("launch-illustration", { className: styles.launchHero, surface: styles.launchArtwork, caption: false, fullResolution: true })}
      </section>
    </section>

    <dialog ref={dialog} className={styles.viewer} aria-labelledby="product-art-title" aria-describedby={activeInfo?.[1] ? "product-art-detail" : undefined} onCancel={() => setActive(null)} onClick={event => { if (event.target === event.currentTarget) setActive(null); }} onKeyDown={event => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    }}>
      {active && activeImage && activeInfo && <div className={styles.viewerBody}>
        <header className={styles.viewerHeader}><div><p className={styles.eyebrow}>Product & design</p><h3 id="product-art-title">{activeInfo[0]}</h3></div><button className={styles.tool} title="Close viewer" aria-label="Close viewer" onClick={() => setActive(null)}><X size={19} /></button></header>
        <div className={styles.viewerTools}>
          <div><button className={styles.tool} title="Previous image" aria-label="Previous image" onClick={() => move(-1)}><ChevronLeft size={18} /></button><span aria-live="polite">{galleryOrder.indexOf(active) + 1} / {galleryOrder.length}</span><button className={styles.tool} title="Next image" aria-label="Next image" onClick={() => move(1)}><ChevronRight size={18} /></button></div>
          <div><button className={styles.tool} title="Zoom out" aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .5))}><ZoomOut size={17} /></button><span aria-live="polite">{zoom * 100}%</span><button className={styles.tool} title="Zoom in" aria-label="Zoom in" disabled={zoom >= 3} onClick={() => setZoom(value => Math.min(3, value + .5))}><ZoomIn size={17} /></button><button className={styles.tool} title="Fit image" aria-label="Fit image" onClick={() => { setZoom(1); stage.current?.scrollTo(0, 0); }}><RotateCcw size={16} /></button><a className={styles.tool} href={activeImage.src} download title="Download image" aria-label="Download image"><Download size={17} /></a></div>
        </div>
        <div ref={stage} className={styles.viewerStage}>
          <Image key={active} {...activeImage} alt={activeInfo[0]} unoptimized className={zoom === 1 && !posters.includes(active) ? styles.fitImage : styles.zoomedImage} style={zoom > 1 || posters.includes(active) ? { width: `${zoom * 100}%` } : undefined} />
        </div>
        {activeInfo[1] && <p id="product-art-detail" className={styles.viewerDetail}>{activeInfo[1]}</p>}
      </div>}
    </dialog>
    <dialog ref={demoDialog} className={styles.demoDialog} aria-labelledby="demo-title" onCancel={() => setDemoExpanded(false)}>
      {demoExpanded && <div className={styles.expandedDemo}><div className={styles.demoBar}><span id="demo-title">bot0 / Preserved interface demo</span><button type="button" aria-label="Close expanded demo" title="Close expanded demo" onClick={() => setDemoExpanded(false)}><Minimize2 size={18} /></button></div><iframe src="/showcases/bot0/index.html" title="Expanded bot0 interactive product showcase" /></div>}
    </dialog>
  </div>;
}
