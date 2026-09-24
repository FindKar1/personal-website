"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./BytespacePlanIcons.module.css";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const getServerMotion = () => true;

export function BytespacePlanIcons() {
  const container = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const visible = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeToMotion, getReducedMotion, getServerMotion);
  const paused = userPaused ?? reducedMotion;
  const synchronize = useCallback(() => {
    frame.current?.contentWindow?.postMessage({ type: "bytespace-icons:playback", running: visible.current && !paused && !document.hidden }, window.location.origin);
  }, [paused]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (visible.current) setLoaded(true);
      synchronize();
    });
    const ready = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "bytespace-icons:ready") synchronize();
    };
    observer.observe(element);
    window.addEventListener("message", ready);
    document.addEventListener("visibilitychange", synchronize);
    synchronize();
    return () => {
      observer.disconnect();
      window.removeEventListener("message", ready);
      document.removeEventListener("visibilitychange", synchronize);
    };
  }, [synchronize]);

  return <section id="bytespace-plan-icons" ref={container} className={styles.strip} aria-label="Bytespace animated plan icons">
    <div className={styles.toolbar}>
      <button type="button" aria-controls="bytespace-plan-icons-frame" title={paused ? "Play plan icons" : "Pause plan icons"}
        aria-label={paused ? "Play plan icons" : "Pause plan icons"} onClick={() => setUserPaused(!paused)}>
        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>
    </div>
    <div className={styles.stage}>
      {loaded && <iframe id="bytespace-plan-icons-frame" ref={frame} src="/showcases/bytespace-plan-icons/index.html"
        title="Original Bytespace laptop, diamond and crystal tower animations" tabIndex={-1}
        sandbox="allow-scripts allow-same-origin" onLoad={synchronize} />}
    </div>
  </section>;
}
