import React, { Component, Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const PixelScene = lazy(() => import("./pixels.jsx"));
const MorphScene = lazy(() => import("./morph.jsx"));

class AnimationBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <p className="fallback">Animation unavailable</p> : this.props.children;
  }
}

function Showcase() {
  const [visible, setVisible] = useState(window.parent === window);
  const [started, setStarted] = useState(window.parent === window);
  const [reducedMotion, setReducedMotion] = useState(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [hidden, setHidden] = useState(document.hidden);
  const scene = new URLSearchParams(window.location.search).get("scene") === "pixels" ? "pixels" : "morph";
  const active = visible && !hidden;

  useEffect(() => {
    const request = event => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type !== "healthcare:visibility" || typeof event.data.visible !== "boolean") return;
      setVisible(event.data.visible);
      if (event.data.visible) setStarted(true);
    };
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateHidden = () => setHidden(document.hidden);
    window.addEventListener("message", request);
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateHidden);
    window.parent.postMessage({ type: "healthcare:ready" }, window.location.origin);
    return () => {
      window.removeEventListener("message", request);
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateHidden);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.playback = !active ? "paused" : reducedMotion ? "reduced" : "playing";
  }, [active, reducedMotion]);

  const Scene = scene === "pixels" ? PixelScene : MorphScene;
  return <AnimationBoundary><Suspense fallback={null}>
    {started && <Scene active={active} reducedMotion={reducedMotion} />}
  </Suspense></AnimationBoundary>;
}

createRoot(document.getElementById("root")).render(<Showcase />);
