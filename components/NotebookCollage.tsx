"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Maximize2, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { notesArtifactSections, type MediaArtifact } from "@/app/media-artifacts";
import styles from "./NotebookCollage.module.css";

const notes = new Map(notesArtifactSections.flatMap(section => section.items).map(item => [item.src.split("/").pop(), item]));

// Sequence by visual relationships, not by the old notebook categories.
export const notebookRows = [
  { layout: "feature", files: ["notes-whiteboard-systems.webp", "notes-network-diagram.webp", "notes-life-systems-board.webp"] },
  { layout: "row", files: ["notes-belonging-diagram.webp", "notes-models-four-elements.webp", "notes-quotes-sticky-notes-wall.webp"] },
  { layout: "triptych", files: ["notes-models-startup-org-chart.webp", "notes-models-paladin-model.webp", "notes-planning-uloop-strategy.webp"] },
  { layout: "feature", files: ["notes-models-rp-oversight-flow.webp", "archive-operating-model-board.webp", "archive-development-board.webp"] },
  { layout: "row", files: ["notes-models-website-flow-board.webp", "notes-models-scorecard-board.webp"] },
  { layout: "pairs", files: ["notes-planning-sg-berkeley-team-plan.webp", "notes-planning-paladin-partners-map.webp", "notes-planning-operations-timeline.webp", "notes-planning-uloop-plan.webp"] },
  { layout: "triptych", files: ["archive-studio-wall.webp", "archive-workspace-startup-grind-mirror-board.webp", "archive-workspace-early-room-wall.webp"] },
].map(({ layout, files }) => ({
  layout,
  items: files.map(file => {
    const item = notes.get(file);
    if (!item) throw new Error(`Missing notebook image: ${file}`);
    return item;
  }),
}));

const collection = notebookRows.flatMap(row => row.items);
const aspect = (item: MediaArtifact) => item.rotation ? item.height / item.width : item.width / item.height;
const columns = (items: MediaArtifact[]) => items.map(item => `minmax(0, ${aspect(item)}fr)`).join(" ");

function NoteImage({ item, eager = false }: { item: MediaArtifact; eager?: boolean }) {
  return (
    <div className={styles.image} style={{ aspectRatio: aspect(item) }}>
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        unoptimized
        loading={eager ? "eager" : "lazy"}
        sizes="(min-width: 1104px) 700px, (min-width: 640px) 65vw, 100vw"
        className={item.rotation ? styles.rotated : styles.upright}
        style={item.rotation ? {
          width: `${item.width / item.height * 100}%`,
          height: `${item.height / item.width * 100}%`,
          transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
        } : undefined}
      />
    </div>
  );
}

export function NotebookCollage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const active = activeIndex === null ? null : collection[activeIndex];
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal?.showModal();
    return () => {
      modal?.close();
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  function resetView() {
    setZoom(1);
    stage.current?.scrollTo(0, 0);
  }

  function move(direction: number) {
    setActiveIndex(index => index === null ? null : (index + direction + collection.length) % collection.length);
    resetView();
  }

  function renderNote(item: MediaArtifact) {
    const index = collection.indexOf(item);
    return (
      <button key={item.src} type="button" className={styles.note} aria-label={`Enlarge ${item.alt}`} title="Enlarge image"
        onClick={() => {
          trigger.current = document.activeElement as HTMLElement;
          resetView();
          setActiveIndex(index);
        }}>
        <NoteImage item={item} eager={index === 0} />
        <span className={styles.enlarge} aria-hidden="true"><Maximize2 size={16} /></span>
      </button>
    );
  }

  return (
    <>
      <div className={styles.collage} role="group" aria-label="Notebook images">
        {notebookRows.map(({ layout, items }) => {
          if (layout === "pairs") return (
            <div key={items[0].src} className={styles.pairs}>
              {[items.slice(0, 2), items.slice(2)].map(pair => (
                <div key={pair[0].src} className={styles.row} style={{ "--columns": columns(pair) } as CSSProperties}>
                  {pair.map(renderNote)}
                </div>
              ))}
            </div>
          );
          let tracks = columns(items);
          if (layout === "feature") {
            const stackAspect = 1 / (1 / aspect(items[1]) + 1 / aspect(items[2]));
            const share = aspect(items[0]) / (aspect(items[0]) + stackAspect);
            // Include the stack's gutter so all three uncropped images align at both edges.
            tracks = `minmax(0, calc(${share * 100}% - ${(1 - stackAspect) * share} * var(--gutter))) minmax(0, 1fr)`;
          }
          return (
            <div key={items[0].src} className={`${styles.row} ${styles[layout]}`} style={{ "--columns": tracks, "--mobile-columns": columns(items.slice(1)) } as CSSProperties}>
              {items.map(renderNote)}
            </div>
          );
        })}
      </div>

      <dialog ref={dialog} className={`systems-dialog ${styles.dialog}`} aria-label="Notebook image viewer" aria-describedby={active ? "notebook-image-description" : undefined}
        onCancel={() => setActiveIndex(null)}
        onClick={event => { if (event.target === event.currentTarget) setActiveIndex(null); }}
        onKeyDown={event => {
          if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
        }}>
        {active && (
          <div className={styles.viewer}>
            <div className={styles.toolbar}>
              <div className={styles.controls}>
                <button type="button" aria-label="Previous image" title="Previous image" onClick={() => move(-1)} className={styles.control}><ChevronLeft size={18} /></button>
                <span className={styles.counter} aria-live="polite">{activeIndex! + 1} / {collection.length}</span>
                <button type="button" aria-label="Next image" title="Next image" onClick={() => move(1)} className={styles.control}><ChevronRight size={18} /></button>
              </div>
              <div className={`${styles.controls} ${styles.zoomControls}`}>
                <button type="button" aria-label="Zoom out" title="Zoom out" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - 0.5))} className={styles.control}><ZoomOut size={18} /></button>
                <button type="button" aria-label="Zoom in" title="Zoom in" disabled={zoom >= 3} onClick={() => setZoom(value => Math.min(3, value + 0.5))} className={styles.control}><ZoomIn size={18} /></button>
                <button type="button" aria-label="Fit to viewer" title="Fit to viewer" onClick={resetView} className={styles.control}><RotateCcw size={17} /></button>
              </div>
              <button type="button" aria-label="Close viewer" title="Close viewer" onClick={() => setActiveIndex(null)} className={`${styles.control} ${styles.close}`}><X size={18} /></button>
            </div>
            <div ref={stage} className={styles.stage}>
              <div className={styles.canvas}>
                <div className={styles.fullImage} style={{ "--aspect": aspect(active), "--zoom": zoom } as CSSProperties}>
                  <NoteImage key={active.src} item={active} eager />
                </div>
              </div>
            </div>
            <p id="notebook-image-description" className="sr-only">{active.alt}</p>
            <span className="sr-only" role="status">Zoom {Math.round(zoom * 100)}%</span>
          </div>
        )}
      </dialog>
    </>
  );
}
