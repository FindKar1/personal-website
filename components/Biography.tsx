import Image from "next/image";
import type { CSSProperties } from "react";
import photos from "@/app/biography-photo-assets.json";
import styles from "./Biography.module.css";

type PhotoId = keyof typeof photos;
type PhotoGroup = {
  afterParagraph: number;
  layout: "row" | "inset" | "portrait";
  photos: { id: PhotoId; alt: string }[];
};

const photoGroups: Record<string, PhotoGroup> = {
  origin: {
    afterParagraph: 2,
    layout: "row",
    photos: [
      { id: "motorcycle", alt: "A childhood photograph sitting on a motorcycle with a family member." },
      { id: "childhood-portrait", alt: "A close-up childhood portrait." },
      { id: "car", alt: "Standing on the hood of a car as a child, wearing a yellow top and dark skirt." },
    ],
  },
  home: {
    afterParagraph: 3,
    layout: "row",
    photos: [
      { id: "garden", alt: "With my mom among the flowers." },
      { id: "playground", alt: "A childhood afternoon at the playground with my mom and a baby." },
      { id: "park", alt: "A family photograph in the park." },
    ],
  },
  curiosity: {
    afterParagraph: 1,
    layout: "inset",
    photos: [
      { id: "cooking", alt: "Standing on a kitchen chair as a child, stirring a pan on the stove." },
    ],
  },
  school: {
    afterParagraph: 1,
    layout: "portrait",
    photos: [
      { id: "school-portrait", alt: "An elementary-school portrait in a blue T-shirt." },
    ],
  },
};

function PhotoBreak({ group }: { group: PhotoGroup }) {
  const columns = group.photos.map(({ id }) => `${photos[id].width / photos[id].height}fr`).join(" ");

  return (
    <div
      className={`${styles.photos} ${styles[group.layout]}`}
      style={{ "--photo-columns": columns } as CSSProperties}
    >
      {group.photos.map(({ id, alt }) => (
        <Image
          key={id}
          {...photos[id]}
          alt={alt}
          unoptimized
          className={styles.photo}
        />
      ))}
    </div>
  );
}

export function Biography({ sections }: { sections: { label: string; paragraphs: string[] }[] }) {
  return (
    <div className="max-w-4xl space-y-10 text-base leading-7 text-graphite">
      {sections.map((section, sectionIndex) => {
        const group = photoGroups[section.label];
        const splitAt = group?.afterParagraph ?? section.paragraphs.length;

        return (
          <section
            key={section.label}
            id={`bio-${section.label}`}
            aria-labelledby={`bio-${section.label}-heading`}
            className="grid scroll-mt-6 gap-4 border-t border-ink/10 pt-6 first:border-t-0 first:pt-0 sm:grid-cols-[8rem_minmax(0,1fr)]"
          >
            <h3 id={`bio-${section.label}-heading`} className="font-mono text-xs leading-7 uppercase text-graphite/50">
              {String(sectionIndex + 1).padStart(2, "0")} / {section.label}
            </h3>
            <div className={styles.copy}>
              {section.paragraphs.slice(0, splitAt).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {group && (
                <div className={styles.continuation}>
                  <PhotoBreak group={group} />
                  {section.paragraphs.slice(splitAt).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
