import React, { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { usePlayback } from "./adapters";
import { createPreviewController } from "./preview-controller.mjs";

export function useArchivePreview(videoRef, { hoverOnly = false, continuous = false, resetOnLeave = false } = {}) {
  const running = usePlayback();
  const controller = useRef(null);
  const [state, setState] = useState({ active: false, started: false });
  useEffect(() => {
    const video = videoRef.current;
    const surface = video?.closest("[data-motion-preview]");
    if (!video || !surface) return;
    const playback = createPreviewController(video, { hoverOnly, continuous, resetOnLeave, onChange: setState });
    controller.current = playback;
    playback.setEnabled(Boolean(window.__archiveRunning));
    const observer = new IntersectionObserver(([entry]) => playback.setVisible(entry.isIntersecting && entry.intersectionRatio >= .15), { threshold: [0, .15] });
    observer.observe(surface);
    const enter = event => { if (event.pointerType === "mouse" && matchMedia("(hover: hover)").matches) playback.hover(true); };
    const leave = () => playback.hover(false);
    const focus = event => playback.focus(event.target.matches(':focus-visible:not(input):not(textarea)'));
    const blur = event => { if (!surface.contains(event.relatedTarget)) playback.focus(false); };
    const pointer = () => playback.focus(false);
    const replay = event => { if (event.target.closest("[data-replay]")) playback.replay(); };
    surface.addEventListener("pointerenter", enter);
    surface.addEventListener("pointerleave", leave);
    surface.addEventListener("focusin", focus);
    surface.addEventListener("focusout", blur);
    surface.addEventListener("pointerdown", pointer);
    surface.addEventListener("click", replay);
    return () => {
      observer.disconnect();
      surface.removeEventListener("pointerenter", enter);
      surface.removeEventListener("pointerleave", leave);
      surface.removeEventListener("focusin", focus);
      surface.removeEventListener("focusout", blur);
      surface.removeEventListener("pointerdown", pointer);
      surface.removeEventListener("click", replay);
      playback.destroy();
      controller.current = null;
    };
  }, [videoRef, hoverOnly, continuous, resetOnLeave]);
  useEffect(() => { controller.current?.setEnabled(running); }, [running]);
  return state;
}

export function ReplayButton({ label }) {
  const running = usePlayback();
  return <button type="button" className="preview-replay" data-replay disabled={!running} title={label} aria-label={label}><RotateCcw size={16} aria-hidden="true" /></button>;
}
