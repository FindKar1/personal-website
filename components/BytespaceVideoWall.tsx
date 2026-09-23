"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { bytespaceVideoRows } from "@/lib/bytespace-video-rows.mjs";
import styles from "./BytespaceVideoWall.module.css";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const getServerMotion = () => true;

export function BytespaceVideoWall() {
  const wall = useRef<HTMLElement>(null);
  const reducedMotion = useSyncExternalStore(subscribeToMotion, getReducedMotion, getServerMotion);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const paused = userPaused ?? reducedMotion;

  useEffect(() => {
    const element = wall.current;
    if (!element) return;
    const videos = Array.from(element.querySelectorAll("video"));
    const visibleVideos = new Set<HTMLVideoElement>();
    let inView = false;

    const synchronize = () => {
      const running = inView && !paused && !document.hidden;
      element.dataset.running = String(running);
      for (const video of videos) {
        if (!running || !visibleVideos.has(video)) {
          video.pause();
          continue;
        }
        // Attach sources only when a tile enters the viewport, not for all 80 copies.
        if (!video.dataset.loaded) {
          for (const source of video.querySelectorAll("source[data-src]")) {
            source.setAttribute("src", (source as HTMLSourceElement).dataset.src!);
          }
          video.dataset.loaded = "true";
          video.load();
        }
        if (video.paused) void video.play().catch(() => undefined);
      }
    };

    const sectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      synchronize();
    });
    const videoObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) visibleVideos.add(video);
        else visibleVideos.delete(video);
      }
      synchronize();
    }, { threshold: [0, 0.1] });
    sectionObserver.observe(element);
    videos.forEach(video => videoObserver.observe(video));
    document.addEventListener("visibilitychange", synchronize);
    return () => {
      sectionObserver.disconnect();
      videoObserver.disconnect();
      document.removeEventListener("visibilitychange", synchronize);
      element.dataset.running = "false";
      videos.forEach(video => video.pause());
    };
  }, [paused]);

  return <section id="bytespace-motion" ref={wall} className={styles.wall} aria-label="Bytespace builder demos and animated agents">
    <div className={styles.toolbar}>
      <button type="button" aria-label={paused ? "Play video wall" : "Pause video wall"}
        title={paused ? "Play video wall" : "Pause video wall"} aria-controls="bytespace-motion-rows"
        onClick={() => setUserPaused(!paused)}>
        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>
    </div>
    <div id="bytespace-motion-rows" className={styles.rows}>
      {bytespaceVideoRows.map((row, rowIndex) => <div key={rowIndex} className={styles.viewport}>
        <div className={styles.track} data-direction={rowIndex % 2 === 0 ? "reverse" : "forward"}>
          {[0, 1].map(copy => <div key={copy} className={styles.sequence} aria-hidden={copy === 1 ? true : undefined}>
            {row.map((video, index) => <div key={`${video.basePath}-${index}`} className={styles.tile}>
              <video loop muted playsInline preload="none" width={336} height={189}
                poster={`${video.basePath}.webp`} className={styles.video}
                aria-label={video.type === "agent" ? "Original Bytespace agent animation" : "Bytespace browser automation demo"}>
                <source data-src={`${video.basePath}.webm`} type="video/webm" />
                {video.type === "agent" && <source data-src={`${video.basePath}.mp4`} type="video/mp4" />}
              </video>
            </div>)}
          </div>)}
        </div>
      </div>)}
    </div>
  </section>;
}
