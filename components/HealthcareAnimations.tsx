"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ProductDesign.module.css";

function HealthcareScene({ scene, title }: { scene: "pixels" | "morph"; title: string }) {
  const container = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const visible = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const notifyVisibility = useCallback(() => {
    frame.current?.contentWindow?.postMessage({ type: "healthcare:visibility", visible: visible.current && !document.hidden }, window.location.origin);
  }, []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (visible.current) setLoaded(true);
      notifyVisibility();
    }, { threshold: 0 });
    observer.observe(element);
    const ready = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "healthcare:ready") notifyVisibility();
    };
    window.addEventListener("message", ready);
    document.addEventListener("visibilitychange", notifyVisibility);
    return () => {
      observer.disconnect();
      window.removeEventListener("message", ready);
      document.removeEventListener("visibilitychange", notifyVisibility);
    };
  }, [notifyVisibility]);

  return <div ref={container} className={styles.healthcareScene} data-scene={scene}>
    {loaded && <iframe ref={frame} src={`/showcases/healthcare-motion/index.html?scene=${scene}`}
      title={title} sandbox="allow-scripts allow-same-origin" tabIndex={-1} onLoad={notifyVisibility} />}
  </div>;
}

export function HealthcareAnimations() {
  return <div id="labs-animations" className={styles.healthcareAnimations}>
    <HealthcareScene scene="pixels" title="Bytespace Healthcare interactive pixel field" />
    <HealthcareScene scene="morph" title="Bytespace Healthcare animated DNA helix" />
  </div>;
}
