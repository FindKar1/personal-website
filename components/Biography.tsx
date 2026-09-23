import { Fragment } from "react";
import childhoodPhotos from "@/app/biography-photo-assets.json";
import { archiveArtifactSections } from "@/app/media-artifacts";
import { PhotoGallery } from "./PhotoGallery";
import styles from "./Biography.module.css";

function archivedPhoto(filename: string) {
  const photo = archiveArtifactSections[0].items.find(item => item.src.endsWith(filename));
  if (!photo) throw new Error(`Missing biography photo: ${filename}`);
  return photo;
}

const photos = {
  ...childhoodPhotos,
  runescape: {
    src: "/media/runescape-marketplace.avif",
    width: 1350,
    height: 698,
  },
  eia: archivedPhoto("archive-early-ventures-program-break.webp"),
  bedroom: archivedPhoto("archive-personal-startup-bedroom.webp"),
};

type PhotoId = keyof typeof photos;
type PhotoGroup = {
  afterParagraph: number;
  layout: "row" | "inset";
  photos: { id: PhotoId; alt: string }[];
};

export const biographyPhotoGroups: Record<string, PhotoGroup[]> = {
  origin: [{
    afterParagraph: 2,
    layout: "row",
    photos: [
      { id: "motorcycle", alt: "A childhood photograph sitting on a motorcycle with a family member." },
      { id: "childhood-portrait", alt: "A close-up childhood portrait." },
      { id: "car", alt: "Standing on the hood of a car as a child, wearing a yellow top and dark skirt." },
    ],
  }],
  home: [{
    afterParagraph: 3,
    layout: "row",
    photos: [
      { id: "garden", alt: "With my mom among the flowers." },
      { id: "playground", alt: "At the playground as a child with my mom and a baby." },
      { id: "park", alt: "A family photograph in the park." },
    ],
  }],
  curiosity: [{
    afterParagraph: 1,
    layout: "inset",
    photos: [
      { id: "cooking", alt: "Standing on a kitchen chair as a child, stirring a pan on the stove." },
    ],
  }],
  systems: [{
    afterParagraph: 2,
    layout: "row",
    photos: [
      { id: "runescape", alt: "RuneScape gameplay screenshot showing players buying and selling items, with the minimap and game interface visible." },
    ],
  }],
  usefulness: [
    {
      afterParagraph: 6,
      layout: "row",
      photos: [
        { id: "eia", alt: "Five people seated together outdoors at European Innovation Academy." },
        { id: "bedroom", alt: "A selfie in a small bedroom." },
      ],
    },
  ],
};

function PhotoBreak({ group }: { group: PhotoGroup }) {
  return (
    <div className={`${styles.photos} ${group.layout === "row" ? "" : styles[group.layout]}`}>
      <PhotoGallery photos={group.photos.map(({ id, alt }) => ({ ...photos[id], alt }))}
        label={group.photos.map(({ id }) => id).join(" and ") + " photos"} keepRow={group.layout === "row"} />
    </div>
  );
}

export function Biography({ sections }: { sections: { label: string; paragraphs: string[] }[] }) {
  return (
    <div className="max-w-4xl space-y-10 text-base leading-7 text-graphite">
      {sections.map((section, sectionIndex) => {
        const groups = biographyPhotoGroups[section.label] ?? [];
        const lastBreak = groups.at(-1)?.afterParagraph ?? 0;

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
              {groups.map((group, index) => (
                <Fragment key={group.afterParagraph}>
                  {section.paragraphs.slice(groups[index - 1]?.afterParagraph ?? 0, group.afterParagraph).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                  <PhotoBreak group={group} />
                </Fragment>
              ))}
              {section.paragraphs.slice(lastBreak).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
