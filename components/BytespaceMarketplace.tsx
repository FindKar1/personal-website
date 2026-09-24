"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play, X } from "lucide-react";
import styles from "./BytespaceMarketplace.module.css";

const agentIds = new Set(["lead-generator", "content-writer", "research-assistant", "website-roast"]);
const films = {
  film: { title: "Browse Marketplace", video: "allAgentsMarketplace.webm", poster: "ensemble-poster.webp" },
  builder: { title: "Agent Builder", video: "builderVideo.webm", poster: "landing/marketplace/buildYourOwn.png" },
};
const query = "(prefers-reduced-motion: reduce)";
function subscribe(callback: () => void) {
  const media = matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const reduced = () => matchMedia(query).matches;
const serverReduced = () => true;

export function BytespaceMarketplace() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const detailFrame = useRef<HTMLIFrameElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const visible = useRef(false);
  const lastAgent = useRef<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [height, setHeight] = useState<number>();
  const [detail, setDetail] = useState<string | null>(null);
  const [websiteInput, setWebsiteInput] = useState("");
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const reducedMotion = useSyncExternalStore(subscribe, reduced, serverReduced);
  const paused = userPaused ?? reducedMotion;
  const activeFilm = detail === "film" || detail === "builder" ? films[detail] : null;
  const synchronize = useCallback(() => {
    const running = !paused && !document.hidden;
    frame.current?.contentWindow?.postMessage({ type: "bytespace-marketplace:playback", running: visible.current && running && !detail }, location.origin);
    detailFrame.current?.contentWindow?.postMessage({ type: "bytespace-marketplace:playback", running: running && Boolean(detail) }, location.origin);
    if (film.current && !running) film.current.pause();
  }, [paused, detail]);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (visible.current) setLoaded(true);
      synchronize();
    });
    observer.observe(element);
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin) return;
      const fromMain = event.source === frame.current?.contentWindow;
      const fromDetails = event.source === detailFrame.current?.contentWindow;
      if (!fromMain && !fromDetails) return;
      if (event.data?.type === "bytespace-marketplace:ready") synchronize();
      if (fromDetails && event.data?.type === "bytespace-marketplace:close") setDetail(null);
      if (fromMain && event.data?.type === "bytespace-marketplace:resize" && Number.isFinite(event.data.height) && event.data.height >= 100 && event.data.height <= 3000) setHeight(Math.ceil(event.data.height));
      if (fromMain && event.data?.type === "bytespace-marketplace:open" && agentIds.has(event.data.id)) {
        lastAgent.current = event.data.id;
        setWebsiteInput(typeof event.data.input === "string" ? event.data.input.slice(0, 2048) : "");
        setDetail(event.data.id);
      }
      if (fromMain && event.data?.type === "bytespace-marketplace:film" && (event.data.id === undefined || event.data.id === "builder")) {
        lastAgent.current = event.data.id ?? null;
        setDetail(event.data.id === "builder" ? "builder" : "film");
      }
    };
    window.addEventListener("message", receive);
    document.addEventListener("visibilitychange", synchronize);
    synchronize();
    return () => { observer.disconnect(); window.removeEventListener("message", receive); document.removeEventListener("visibilitychange", synchronize); };
  }, [synchronize]);

  useEffect(() => {
    if (!detail) return;
    const modal = dialog.current!;
    const mainWindow = frame.current?.contentWindow;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.showModal();
    synchronize();
    return () => {
      modal.close();
      document.body.style.overflow = overflow;
      mainWindow?.postMessage({ type: "bytespace-marketplace:focus", id: lastAgent.current ?? "film" }, location.origin);
    };
  }, [detail, synchronize]);

  return <section id="bytespace-marketplace" ref={section} className={styles.section} aria-labelledby="marketplace-heading">
    <header className={styles.heading}><h3 id="marketplace-heading">The marketplace</h3>
      <button type="button" title={paused ? "Play marketplace animations" : "Pause marketplace animations"} aria-label={paused ? "Play marketplace animations" : "Pause marketplace animations"} onClick={() => setUserPaused(!paused)}>
        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>
    </header>
    <div className={styles.stage} style={height ? { height } : undefined}>
      {loaded && <iframe ref={frame} src="/showcases/bytespace-marketplace/index.html" title="Bytespace marketplace" sandbox="allow-scripts allow-same-origin" onLoad={synchronize} />}
    </div>
    <p className={styles.credit}>Original interface & artwork / Illustrative listings, sample workflow & outputs / No live runs</p>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="marketplace-dialog-heading" onCancel={event => { event.preventDefault(); setDetail(null); }} onClick={event => { if (event.target === event.currentTarget) setDetail(null); }}>
      <div className={styles.dialogSurface}>
        <header className={styles.dialogHeading}><div><h3 id="marketplace-dialog-heading">{activeFilm?.title ?? "Agent details"}</h3><p>{activeFilm ? "Original marketplace animation" : "Interface archive / Sample data"}</p></div><button type="button" autoFocus title="Close marketplace preview" aria-label="Close marketplace preview" onClick={() => setDetail(null)}><X size={20} aria-hidden="true" /></button></header>
        {activeFilm ? <video key={detail} ref={film} className={styles.film} controls muted playsInline autoPlay={!paused} loop poster={`/showcases/bytespace-marketplace/assets/${activeFilm.poster}`} src={`/showcases/bytespace-marketplace/assets/landing/marketplace/${activeFilm.video}`} /> : detail && <iframe ref={detailFrame} src={`/showcases/bytespace-marketplace/index.html?${new URLSearchParams({ agent: detail, ...(websiteInput ? { input: websiteInput } : {}) })}`} title="Archived agent details and input configuration" sandbox="allow-scripts allow-same-origin" onLoad={synchronize} />}
      </div>
    </dialog>
  </section>;
}
