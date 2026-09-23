"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import styles from "./ProductDesign.module.css";

const SCENE_WIDTH = 1280;
const SCENE_HEIGHT = 882;

export function BytespaceHero() {
  const container = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const visible = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(0);
  const notifyVisibility = useCallback(() => {
    frame.current?.contentWindow?.postMessage({ type: "bytespace-hero:visibility", visible: visible.current && !document.hidden }, window.location.origin);
  }, []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const measure = () => setScale(element.clientWidth / SCENE_WIDTH);
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    measure();
    const intersection = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      if (visible.current) setLoaded(true);
      notifyVisibility();
    }, { threshold: 0.15 });
    intersection.observe(element);
    const ready = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "bytespace-hero:ready") notifyVisibility();
    };
    window.addEventListener("message", ready);
    document.addEventListener("visibilitychange", notifyVisibility);
    return () => {
      resize.disconnect();
      intersection.disconnect();
      window.removeEventListener("message", ready);
      document.removeEventListener("visibilitychange", notifyVisibility);
    };
  }, [notifyVisibility]);

  return <div ref={container} className={styles.bytespaceHero}>
    {loaded && <iframe ref={frame} src="/showcases/bytespace-hero/index.html"
      title="Bytespace original homepage animation: layered mountains, agents and workflow builder"
      sandbox="allow-scripts allow-same-origin" tabIndex={-1}
      width={SCENE_WIDTH} height={SCENE_HEIGHT}
      style={{ transform: `scale(${scale})` }} onLoad={notifyVisibility} />}
    <button type="button" className={styles.heroReplay} title="Replay homepage animation" aria-label="Replay homepage animation"
      onClick={() => frame.current?.contentWindow?.postMessage({ type: "bytespace-hero:replay" }, window.location.origin)}>
      <RotateCcw size={16} aria-hidden="true" />
    </button>
  </div>;
}
