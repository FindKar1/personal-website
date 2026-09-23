import photos from "@/app/personal-photo-assets.json";
import { PhotoGallery } from "./PhotoGallery";

export function ArchiveTravel() {
  return (
    <section id="archive-travel" aria-labelledby="travel-heading" className="mt-5 grid scroll-mt-6 gap-4 border-t border-ink/10 py-5 sm:grid-cols-[8rem_minmax(0,1fr)]">
      <div className="space-y-2">
        <h3 id="travel-heading" className="font-mono text-xs leading-6 uppercase text-graphite/50">Elsewhere</h3>
        <p className="text-sm leading-6 text-graphite/55">A few detours along the way.</p>
      </div>
      <div className="min-w-0 space-y-1.5">
        <PhotoGallery label="Travel photos" photos={[
          { ...photos.skydiving, alt: "Tandem skydiving against an open blue sky and a diagonal bank of clouds.", fullWidth: true },
          { ...photos["learning-to-fly"], alt: "Standing beside a yellow, brown, and white airplane on the airfield." },
          { ...photos.climbing, alt: "Bouldering on an indoor climbing wall with colorful holds." },
          { ...photos["hang-gliding"], alt: "Tandem hang-gliding above a town, river, and mountains.", fullWidth: true },
          { ...photos["surf-lesson"], alt: "Practicing a surfing stance on a pink board on the beach with an instructor.", rowGroup: "surfing" },
          { ...photos["surf-shore"], alt: "Carrying a white and yellow surfboard through shallow water.", rowGroup: "surfing" },
          { ...photos.surfing, alt: "Riding a small wave in a black wetsuit, with another surfer in the water behind.", rowGroup: "surfing", cropAspectRatio: 4 / 3, objectPosition: "25% center" },
          { ...photos.snowboarding, alt: "Snowboarding down a slope with snow-covered mountains in the background.", cropAspectRatio: 4 / 5 },
          { ...photos.wakesurfing, alt: "Wakesurfing barefoot behind a boat, holding a tow rope, with mountains across the lake.", cropAspectRatio: 4 / 5, objectPosition: "center 55%" },
          { ...photos.boat, alt: "Steering a motorboat with a waterfront and the boat's wake behind me." },
          { ...photos.tank, alt: "Two of us on top of a tank on display.", cropAspectRatio: 16 / 9, objectPosition: "center 55%" },
        ]} />
        <div className="grid items-start gap-1.5 sm:grid-cols-[minmax(0,1.77fr)_minmax(0,1fr)]">
          <figure className="min-w-0">
            <video controls playsInline muted preload="none" width="720" height="406"
              poster="/media/personal/underwater-poster.jpg" aria-label="Underwater snorkeling footage, silent"
              aria-describedby="underwater-description" className="aspect-[720/406] w-full bg-black object-contain">
              <source src="/media/personal/underwater.mp4" type="video/mp4" />
              <a href="/media/personal/underwater.mp4">Open the underwater video</a>
            </video>
            <figcaption id="underwater-description" className="sr-only">A silent ten-second clip of snorkelers swimming near the surface and an underwater view of marine life.</figcaption>
          </figure>
          <figure className="min-w-0">
            <video controls playsInline muted preload="none" width="720" height="720"
              poster="/media/personal/berkeley-protest-poster.jpg" aria-label="Berkeley protest footage, silent"
              aria-describedby="protest-description protest-caption" className="aspect-square w-full bg-black object-contain">
              <source src="/media/personal/berkeley-protest.mp4" type="video/mp4" />
              <a href="/media/personal/berkeley-protest.mp4">Open the Berkeley protest video</a>
            </video>
            <span id="protest-description" className="sr-only">A silent ten-second clip of a crowd outside an illuminated building at night, with a large fire and smoke.</span>
            <figcaption id="protest-caption" className="mt-1.5 text-xs leading-5 text-graphite/60">Berkeley protest.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
