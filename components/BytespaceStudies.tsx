"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { RotateCcw } from "lucide-react";
import styles from "./ProductDesign.module.css";

const studies = [
  { id: "spaces", title: "Workspaces", height: 446, layout: "workspaceStudy" },
  { id: "signin", title: "Sign in", height: 422, layout: "signinStudy" },
  { id: "execution", title: "Execution", height: 211, layout: "executionStudy" },
  { id: "triggers", title: "Triggers", height: 183, layout: "triggerStudy" },
  { id: "calendar", title: "Scheduling", height: 327, layout: "calendarStudy" },
  { id: "context", title: "Context", height: 329, layout: "contextStudy" },
] as const;

function LiveStudy({ study }: { study: typeof studies[number] }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState<number>();

  const observeContent = useCallback(() => {
    resizeObserver.current?.disconnect();
    const document = frame.current?.contentDocument;
    const content = document?.querySelector<HTMLElement>(`.study-${study.id}`);
    // Lazy frames can expose an empty or partially loaded document before the demo mounts.
    if (document?.readyState !== "complete" || !content) return;
    const measure = () => {
      const measured = Math.ceil(content.getBoundingClientRect().height);
      if (measured >= 80) setHeight(Math.min(3600, measured));
    };
    resizeObserver.current = new ResizeObserver(measure);
    resizeObserver.current.observe(content);
    measure();
  }, [study.id]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "bytespace:resize" && event.data.view === study.id && Number.isFinite(event.data.height)) {
        observeContent();
      }
      if (event.data?.type === "bytespace:enter" && study.id === "signin") {
        document.getElementById("bytespace-study-spaces")?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
          block: "center",
        });
      }
    }
    window.addEventListener("message", onMessage);
    observeContent();
    frame.current?.contentWindow?.postMessage({ type: "bytespace:measure" }, window.location.origin);
    return () => {
      window.removeEventListener("message", onMessage);
      resizeObserver.current?.disconnect();
    };
  }, [study.id, observeContent]);

  return <section id={`bytespace-study-${study.id}`} className={`${styles.liveStudy} ${styles[study.layout]}`} aria-labelledby={`study-${study.id}-title`}>
    {study.id === "execution" ? <div className={styles.executionHeading}>
      <h4 id={`study-${study.id}-title`}>{study.title}</h4>
      <button type="button" title="Replay execution" aria-label="Replay execution" onClick={() => frame.current?.contentWindow?.postMessage({ type: "bytespace:replay" }, window.location.origin)}><RotateCcw size={15} aria-hidden="true" /></button>
    </div> : <h4 id={`study-${study.id}-title`}>{study.title}</h4>}
    <iframe ref={frame} src={`/showcases/bytespace/index.html?view=${study.id}`} title={`Bytespace ${study.title.toLowerCase()}`}
      loading="lazy" sandbox="allow-scripts allow-same-origin"
      style={{ "--study-height": `${study.height}px`, height } as CSSProperties}
      onLoad={observeContent} />
  </section>;
}

export function BytespaceStudies() {
  const [workspace, signin, execution, triggers, ...otherStudies] = studies;
  return <div className={styles.liveStudies}>
    <LiveStudy study={workspace} />
    <div className={styles.runtimeStudies}>
      <LiveStudy study={execution} />
      <LiveStudy study={triggers} />
      <LiveStudy study={signin} />
    </div>
    {otherStudies.map(study => <LiveStudy key={study.id} study={study} />)}
  </div>;
}
