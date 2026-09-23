"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./PhotoGallery.module.css";

export type GalleryPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  fullWidth?: boolean;
  rowGroup?: string;
  cropAspectRatio?: number;
  objectPosition?: string;
};

export function PhotoGallery({ photos, label, keepRow = false, compactFirstRow = false }: {
  photos: GalleryPhoto[];
  label: string;
  keepRow?: boolean;
  compactFirstRow?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const active = activeIndex === null ? null : photos[activeIndex];
  const isOpen = active !== null;
  const rows: GalleryPhoto[][] = keepRow ? [photos] : [];
  if (!keepRow) {
    for (const photo of photos) {
      const previousRow = rows.at(-1);
      // Explicit groups stay together; ungrouped photos form pairs.
      if (photo.fullWidth || !previousRow || previousRow[0].fullWidth ||
          photo.rowGroup !== previousRow[0].rowGroup || (!photo.rowGroup && previousRow.length === 2)) {
        rows.push([photo]);
      } else {
        previousRow.push(photo);
      }
    }
  }

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

  function move(direction: number) {
    setActiveIndex(index => index === null ? null : (index + direction + photos.length) % photos.length);
  }

  return (
    <>
      <div className={styles.gallery} role="group" aria-label={label}>
        {rows.map((row, rowIndex) => (
          <div key={row[0].src} className={`${styles.row} ${keepRow || row[0].rowGroup || (compactFirstRow && rowIndex === 0) ? styles.keepRow : ""}`}
            style={{ "--columns": row.length === 1 ? "minmax(0, 1fr)" : row.map(photo => `minmax(0, ${photo.cropAspectRatio ?? photo.width / photo.height}fr)`).join(" ") } as CSSProperties}>
            {row.map(photo => (
              <button key={photo.src} type="button" className={styles.photo} title="Enlarge photo" aria-label={`Enlarge ${photo.alt}`}
                style={{ aspectRatio: photo.cropAspectRatio ?? photo.width / photo.height }}
                onClick={event => { trigger.current = event.currentTarget; setActiveIndex(photos.indexOf(photo)); }}>
                <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} unoptimized
                  loading="lazy" sizes="(min-width: 640px) 500px, 100vw" className={styles.image}
                  style={{ objectPosition: photo.objectPosition ?? "center" }} />
                <span className={styles.enlarge} aria-hidden="true"><Maximize2 size={16} /></span>
              </button>
            ))}
          </div>
        ))}
      </div>
      <dialog ref={dialog} className={`systems-dialog ${styles.dialog}`} aria-label={`${label} viewer`}
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
                <button type="button" className={styles.control} disabled={photos.length < 2} aria-label="Previous photo" title="Previous photo" onClick={() => move(-1)}><ChevronLeft size={20} /></button>
                <span className={styles.counter} aria-live="polite">{activeIndex! + 1} / {photos.length}</span>
                <button type="button" className={styles.control} disabled={photos.length < 2} aria-label="Next photo" title="Next photo" onClick={() => move(1)}><ChevronRight size={20} /></button>
              </div>
              <button type="button" className={styles.control} aria-label="Close viewer" title="Close viewer" onClick={() => setActiveIndex(null)}><X size={20} /></button>
            </div>
            <div className={styles.stage}>
              <Image key={active.src} src={active.src} alt={active.alt} width={active.width} height={active.height} unoptimized loading="eager" className={styles.fullImage} />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
