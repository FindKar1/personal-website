import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { gsap } from "gsap";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import AgentCardBase from "@/components/agents/AgentCardBase";
import VideoBackground from "@/components/landing-page/demoComponents/VideoBackground";
import { QuickWinAgentCards } from "@/components/agents/QuickWinAgentCards";
import { agents, agentIds } from "./fixtures";
import { usePlayback } from "./adapters";
import { ReplayButton, useArchivePreview } from "./preview";

const PixelBlast = lazy(() => import("@/components/react_bits/PixelBlast"));
const Details = lazy(() => import("./details"));
const BuilderCard = lazy(() => import("./builder-card"));
const requestedId = new URLSearchParams(window.location.search).get("agent");
const detailId = agentIds.includes(requestedId) ? requestedId : null;
document.body.dataset.view = detailId ? "detail" : "marketplace";

function Ensemble() {
  const video = useRef(null);
  useArchivePreview(video, { resetOnLeave: true });
  return <figure className="ensemble" data-motion-preview>
    <div className="ensemble-screen"><video ref={video} src="./assets/landing/marketplace/allAgentsMarketplace.webm" poster="./assets/ensemble-poster.webp" muted playsInline preload="none" aria-label="Original Bytespace marketplace character animation" />
      <ReplayButton label="Replay marketplace animation" />
      <button title="Open marketplace animation" aria-label="Open marketplace animation" onClick={() => window.parent.postMessage({ type: "bytespace-marketplace:film" }, location.origin)}><ArrowUpRight size={18} /></button></div>
    <figcaption>Browse Marketplace</figcaption>
  </figure>;
}

function ArchiveBridge() {
  useEffect(() => {
    const sync = event => {
      if (event.origin !== location.origin || event.source !== window.parent) return;
      if (event.data?.type === "bytespace-marketplace:playback" && typeof event.data.running === "boolean") {
        window.__archiveRunning = event.data.running;
        document.documentElement.dataset.running = String(event.data.running);
        gsap.globalTimeline.paused(!event.data.running);
        document.querySelectorAll("video").forEach(video => { if (!event.data.running) video.pause(); });
        window.dispatchEvent(new Event("archive-playback"));
      }
      if (event.data?.type === "bytespace-marketplace:focus" && (agentIds.includes(event.data.id) || ["film", "builder"].includes(event.data.id))) {
        const target = event.data.id === "builder" ? document.querySelector('.builder-card button') : event.data.id === "film" ? document.querySelector('.ensemble button') : event.data.id === "website-roast" ? document.querySelector('.quickwin button') : document.getElementById(`card-${event.data.id}`)?.querySelector('[role="button"]');
        target?.focus({ preventScroll: true });
      }
    };
    const escape = event => {
      if (detailId && event.key === "Escape" && !document.fullscreenElement) {
        event.preventDefault();
        window.parent.postMessage({ type: "bytespace-marketplace:close" }, location.origin);
      }
    };
    window.addEventListener("message", sync);
    window.addEventListener("keydown", escape, true);
    window.parent.postMessage({ type: "bytespace-marketplace:ready" }, location.origin);
    return () => { window.removeEventListener("message", sync); window.removeEventListener("keydown", escape, true); };
  }, []);
  return null;
}

function Marketplace() {
  const running = usePlayback();
  const root = useRef(null);
  const rail = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [builderLoaded, setBuilderLoaded] = useState(false);
  const hero = useRef(null);
  const builder = useRef(null);
  useEffect(() => {
    const measure = () => window.parent.postMessage({ type: "bytespace-marketplace:resize", height: Math.ceil(root.current.getBoundingClientRect().height) }, location.origin);
    const observer = new ResizeObserver(measure);
    observer.observe(root.current);
    const intersection = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.target === hero.current) setHeroVisible(entry.isIntersecting);
      if (entry.target === builder.current) {
        if (entry.isIntersecting) setBuilderLoaded(true);
      }
    }));
    intersection.observe(hero.current);
    intersection.observe(builder.current);
    measure();
    return () => { observer.disconnect(); intersection.disconnect(); };
  }, []);

  return <main ref={root} className="marketplace-root">
    <header ref={hero} className="marketplace-hero">
      <div className="pixel-background" aria-hidden="true">{running && heroVisible && <Suspense fallback={null}><PixelBlast variant="square" pixelSize={3} color="#f0defc" patternScale={1.5} patternDensity={0.9} speed={0.1} transparent edgeFade={0.2} /></Suspense>}</div>
      <div className="floating-apps" aria-hidden="true"><VideoBackground archiveVisible={heroVisible} /></div>
      <div className="marketplace-title"><h2>Recruit Agents for your Space</h2><p>or build your own</p></div>
    </header>
    <div className="catalog-heading"><h3>Community Agents</h3><div className="rail-controls"><button title="Previous agents" aria-label="Previous agents" onClick={() => rail.current.scrollBy({ left: -rail.current.clientWidth * .85, behavior: running ? "smooth" : "instant" })}><ChevronLeft size={18} /></button><button title="Next agents" aria-label="Next agents" onClick={() => rail.current.scrollBy({ left: rail.current.clientWidth * .85, behavior: running ? "smooth" : "instant" })}><ChevronRight size={18} /></button></div></div>
    <div ref={rail} className="agent-rail">{agents.slice(0, 3).map(agent => <div id={`card-${agent.id}`} className="agent-cell" data-motion-preview key={agent.id}>
      <AgentCardBase id={agent.id} title={agent.title} description={agent.overview} variant="marketplace" agentImage={agent.cardImage} videoUrl={agent.cardVideo} apps={agent.appsUsed} />
    </div>)}</div>
    <div className="marketplace-extras">
      <Ensemble />
      <div className="quickwin" data-motion-preview><QuickWinAgentCards /><ReplayButton label="Replay first-agent animation" /></div>
    </div>
    <div ref={builder} className="builder-card" data-motion-preview>
      {builderLoaded && <Suspense fallback={null}><BuilderCard /><ReplayButton label="Replay Agent Builder animation" /></Suspense>}
    </div>
  </main>;
}

createRoot(document.getElementById("root")).render(<MotionConfig reducedMotion="user"><ArchiveBridge /><Suspense fallback={<div className="detail-loading" role="status">Loading agent...</div>}>{detailId ? <Details id={detailId} /> : <Marketplace />}</Suspense></MotionConfig>);
