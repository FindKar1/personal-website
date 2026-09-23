"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { getWelcomeVisit, welcomePixels, welcomeTiming } from "@/lib/bytespace-welcome";
import { createFlickeringGrid } from "@/lib/bytespace-flickering-grid";
import styles from "./BytespaceMonitor.module.css";

export function BytespaceMonitor() {
  const screen = useRef<HTMLDivElement>(null);
  const welcome = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const background = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = screen.current;
    const intro = welcome.current;
    const video = player.current;
    if (!element || !intro || !video) return;
    const visit = getWelcomeVisit(document);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const grid = background.current && !visit.complete && !preference.matches
      ? createFlickeringGrid(background.current) : undefined;
    let inView = false;
    let active = false;
    let resumeVideo = true;
    const animations = intro.getAnimations({ subtree: true });
    const exit = intro.getAnimations()[0];
    animations.forEach(animation => { animation.currentTime = visit.elapsed; });

    const playDemo = () => {
      if (active && !preference.matches) void video.play().catch(() => undefined);
    };
    const showDemo = () => {
      visit.complete = true;
      grid?.destroy();
      element.dataset.phase = "demo";
      video.inert = false;
      video.removeAttribute("aria-hidden");
      playDemo();
    };
    const syncVisibility = () => {
      const nextActive = inView && !document.hidden;
      if (active && !nextActive) {
        resumeVideo = !video.paused;
        video.pause();
      }
      const entering = nextActive && !active;
      active = nextActive;
      intro.dataset.running = String(active && !visit.complete);
      grid?.setRunning(active && !visit.complete && !preference.matches);
      if (entering && visit.complete && resumeVideo) playDemo();
    };
    const finish = (event: AnimationEvent) => {
      if (event.target === intro) showDemo();
    };
    const respectMotion = () => {
      if (preference.matches) {
        showDemo();
        video.pause();
      }
    };
    if (visit.complete || preference.matches) showDemo();
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.6;
      syncVisibility();
    }, { threshold: [0, 0.6] });
    observer.observe(element);
    intro.addEventListener("animationend", finish);
    document.addEventListener("visibilitychange", syncVisibility);
    preference.addEventListener("change", respectMotion);
    return () => {
      if (!visit.complete) visit.elapsed = Number(exit?.currentTime ?? 0);
      intro.dataset.running = "false";
      video.pause();
      observer.disconnect();
      grid?.destroy();
      intro.removeEventListener("animationend", finish);
      document.removeEventListener("visibilitychange", syncVisibility);
      preference.removeEventListener("change", respectMotion);
    };
  }, []);

  return <div id="bytespace-monitor" ref={screen} className={styles.screen} data-phase="welcome">
    <video ref={player} muted loop playsInline controls preload="metadata" width={1920} height={1080}
      inert aria-hidden="true" poster="/media/videos/bytespace-product-demo.jpg" aria-label="Bytespace logistics workflow demo">
      <source src="/media/videos/bytespace-product-demo.mp4" type="video/mp4" />
      <a href="/media/videos/bytespace-product-demo.mp4">Open the Bytespace product demo</a>
    </video>
    <div ref={welcome} className={styles.welcome} role="img" aria-label="Welcome to Bytespace!"
      style={{ "--exit-delay": `${welcomeTiming.reveal + welcomeTiming.hold}ms`, "--exit-duration": `${welcomeTiming.exit}ms` } as CSSProperties}>
      <canvas ref={background} className={styles.background} aria-hidden="true" />
      {welcomePixels.map((pixel, index) => <span key={`${pixel.row}-${pixel.col}`} aria-hidden="true"
        style={{ gridRow: pixel.row + 1, gridColumn: pixel.col + 1, animationDuration: `${welcomeTiming.pixelFade}ms`,
          animationDelay: `${welcomeTiming.mountDelay + index / welcomePixels.length * welcomeTiming.reveal}ms` }} />)}
    </div>
  </div>;
}
