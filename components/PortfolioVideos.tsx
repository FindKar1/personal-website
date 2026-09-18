import { YouTubeVideo } from "@/components/YouTubeVideo";
import styles from "./ProductDesign.module.css";

const productVideos = [
  { title: "The future of work", href: "https://youtu.be/pJ7KURKD3bY?si=ymdT2jLFfNyVu4DM", embed: "https://www.youtube-nocookie.com/embed/pJ7KURKD3bY" },
  { title: "LinkedIn lead generation", href: "https://www.youtube.com/watch?v=cqB8DlUrhcs", embed: "https://www.youtube-nocookie.com/embed/cqB8DlUrhcs" },
  { title: "Introducing Bytespace", href: "https://www.youtube.com/watch?v=QpovlqBSlFU", embed: "https://www.youtube-nocookie.com/embed/QpovlqBSlFU" },
  { title: "Weekly newsletter automation", href: "https://www.youtube.com/watch?v=I98lt9UsOxc&t=111s", embed: "https://www.youtube-nocookie.com/embed/I98lt9UsOxc?start=111" },
];

const eventVideos = [
  { title: "Startup Grind 01", href: "https://youtu.be/ZFfbFVjDqMM?si=BmZQTt2vGcjNzfDX", embed: "https://www.youtube-nocookie.com/embed/ZFfbFVjDqMM" },
  { title: "Startup Grind 02", href: "https://youtu.be/Y1DWrK9R4I4?si=CbwS0M4w-ohHwWB9", embed: "https://www.youtube-nocookie.com/embed/Y1DWrK9R4I4" },
  { title: "Startup Grind 03", href: "https://youtu.be/N8lgfk0Hk24?si=YxY1GAk3e86EkbZI", embed: "https://www.youtube-nocookie.com/embed/N8lgfk0Hk24" },
  { title: "Startup Grind 04", href: "https://youtu.be/UuJfzXmvSjo?si=5l-YUN7T5kC_tIH2", embed: "https://www.youtube-nocookie.com/embed/UuJfzXmvSjo" },
];

export function ProductDemos() {
  return (
    <section id="product-demo" aria-labelledby="product-demo-title" className={styles.videoDemos}>
      <div className={styles.subheading}>
        <h3 id="product-demo-title">In motion</h3>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {productVideos.map((video) => <YouTubeVideo key={video.embed} {...video} compactCaption />)}
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
