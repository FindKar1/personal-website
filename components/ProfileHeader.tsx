"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { updateHeaderScroll, type HeaderScrollState } from "./profile-header-scroll";
import styles from "./ProfileHeader.module.css";

export function ProfileHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    const container = header.parentElement;
    if (!container) return;
    const root = document.documentElement;
    const previousHeight = root.style.getPropertyValue("--profile-header-height");
    let height = header.offsetHeight;
    let origin = 0;
    let hovering = false;
    let frame = 0;
    let state: HeaderScrollState = { y: window.scrollY, direction: 0, distance: 0, hidden: false };

    function paint() {
      header!.dataset.hidden = String(state.hidden);
      header!.dataset.docked = String(state.y > origin);
    }

    function measure() {
      if (!header!.isConnected) return;
      height = header!.offsetHeight;
      origin = parseFloat(getComputedStyle(container!).paddingTop) - 12;
      root.style.setProperty("--profile-header-height", `${height + 12}px`);
    }

    function update() {
      frame = 0;
      state = updateHeaderScroll(state, window.scrollY, root.scrollHeight - window.innerHeight,
        origin + height, hovering || header!.contains(document.activeElement));
      paint();
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function enter(event: PointerEvent) {
      hovering = event.pointerType === "mouse" && !state.hidden;
    }

    function leave() {
      hovering = false;
      state = { ...state, y: window.scrollY, distance: 0, direction: 0 };
    }

    function focus() {
      state = { y: window.scrollY, distance: 0, direction: 0, hidden: false };
      paint();
    }

    measure();
    state.hidden = window.scrollY > origin + height;
    paint();
    const observer = new ResizeObserver(() => { measure(); schedule(); });
    observer.observe(header);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    header.addEventListener("pointerenter", enter);
    header.addEventListener("pointerleave", leave);
    header.addEventListener("focusin", focus);
    header.addEventListener("focusout", leave);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      header.removeEventListener("pointerenter", enter);
      header.removeEventListener("pointerleave", leave);
      header.removeEventListener("focusin", focus);
      header.removeEventListener("focusout", leave);
      if (previousHeight) root.style.setProperty("--profile-header-height", previousHeight);
      else root.style.removeProperty("--profile-header-height");
    };
  }, []);

  return <header ref={ref} className={styles.header} data-profile-header>
    <div className={styles.inner}>{children}</div>
  </header>;
}
