import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import MountainScene from "@/components/landing-page/heroComponents/animation/MountainScene";
import OriginalBuilder from "original-builder";

function Scene() {
  const [showWorkflow, setShowWorkflow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowWorkflow(true), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1600);
    return () => clearTimeout(timer);
  }, []);
  return <main className="hero-scene" aria-label="Bytespace mountains, agents and animated workflow builder">
    <OriginalBuilder showWorkflow={showWorkflow} />
    <div className="builder-fade" />
    <div className="mountain-column"><MountainScene containerHeight={300} /></div>
    <div className="right-fade" />
    <div className="bottom-fade" />
  </main>;
}

function Hero() {
  const [started, setStarted] = useState(window.parent === window);
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    const request = event => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === "bytespace-hero:visibility") {
        if (event.data.visible) setStarted(true);
        document.documentElement.dataset.paused = String(!event.data.visible);
      }
      if (event.data?.type === "bytespace-hero:replay") {
        setStarted(true);
        setReplay(value => value + 1);
      }
    };
    window.addEventListener("message", request);
    window.parent.postMessage({ type: "bytespace-hero:ready" }, window.location.origin);
    return () => window.removeEventListener("message", request);
  }, []);
  return started ? <Scene key={replay} /> : null;
}

createRoot(document.getElementById("root")).render(<Hero />);
