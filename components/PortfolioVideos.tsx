import { YouTubeVideo } from "@/components/YouTubeVideo";

const productVideos = [
  { title: "Bytespace 01", href: "https://youtu.be/pJ7KURKD3bY?si=ymdT2jLFfNyVu4DM", embed: "https://www.youtube-nocookie.com/embed/pJ7KURKD3bY" },
  { title: "Bytespace 02", href: "https://www.youtube.com/watch?v=cqB8DlUrhcs", embed: "https://www.youtube-nocookie.com/embed/cqB8DlUrhcs" },
  { title: "Bytespace 03", href: "https://www.youtube.com/watch?v=QpovlqBSlFU", embed: "https://www.youtube-nocookie.com/embed/QpovlqBSlFU" },
  { title: "Bytespace 04", href: "https://www.youtube.com/watch?v=I98lt9UsOxc&t=111s", embed: "https://www.youtube-nocookie.com/embed/I98lt9UsOxc?start=111" },
];

const eventVideos = [
  { title: "Startup Grind 01", href: "https://youtu.be/ZFfbFVjDqMM?si=BmZQTt2vGcjNzfDX", embed: "https://www.youtube-nocookie.com/embed/ZFfbFVjDqMM" },
  { title: "Startup Grind 02", href: "https://youtu.be/Y1DWrK9R4I4?si=CbwS0M4w-ohHwWB9", embed: "https://www.youtube-nocookie.com/embed/Y1DWrK9R4I4" },
  { title: "Startup Grind 03", href: "https://youtu.be/N8lgfk0Hk24?si=YxY1GAk3e86EkbZI", embed: "https://www.youtube-nocookie.com/embed/N8lgfk0Hk24" },
  { title: "Startup Grind 04", href: "https://youtu.be/UuJfzXmvSjo?si=5l-YUN7T5kC_tIH2", embed: "https://www.youtube-nocookie.com/embed/UuJfzXmvSjo" },
];

export function ProductDemos() {
  return (
    <section id="product-demo" aria-labelledby="product-demo-title" className="mt-12 scroll-mt-6 border-t border-ink/15 pt-8 sm:pt-10">
      <div className="mb-8 grid gap-3 sm:mb-10 sm:grid-cols-[11rem_1fr] sm:gap-6">
        <h3 id="product-demo-title" className="font-mono text-sm font-medium text-ink">Demos</h3>
        <p className="text-sm leading-6 text-graphite">Earlier versions of Bytespace, from individual automations to connected workflows.</p>
      </div>
      <figure className="mb-8">
        <video controls playsInline preload="none" width={1920} height={1080}
          poster="/media/videos/bytespace-product-demo.jpg"
          aria-label="Bytespace product demo showing a logistics workflow"
          className="aspect-video w-full border border-ink/10 bg-black">
          <source src="/media/videos/bytespace-product-demo.mp4" type="video/mp4" />
          <a href="/media/videos/bytespace-product-demo.mp4">Open the Bytespace product demo</a>
        </video>
        <figcaption className="mt-2 text-sm leading-6 text-graphite/70">An earlier Bytespace product, shown through a logistics workflow.</figcaption>
      </figure>
      <div className="grid gap-5 sm:grid-cols-2">
        {productVideos.map((video) => <YouTubeVideo key={video.embed} {...video} />)}
      </div>
    </section>
  );
}

export function ArchiveTalks() {
  return (
    <section aria-labelledby="archive-talks-title" className="mt-5 grid gap-4 border-t border-ink/10 py-5 sm:grid-cols-[8rem_1fr]">
      <div className="space-y-2">
        <h3 id="archive-talks-title" className="font-mono text-xs leading-6 uppercase text-graphite/50">Talks & events</h3>
        <p className="text-sm leading-6 text-graphite/55">Conversations from Startup Grind.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {eventVideos.map((video) => <YouTubeVideo key={video.embed} {...video} />)}
      </div>
    </section>
  );
}
