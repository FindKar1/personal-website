"use client";

import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { loadYouTubePlayer, type YouTubePlayer } from "./youtube-player";

type YouTubeVideoProps = {
  title: string;
  href: string;
  embed: string;
  compactCaption?: boolean;
};

export function YouTubeVideo({
  title,
  href,
  embed,
  compactCaption = false,
}: YouTubeVideoProps) {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const container = useRef<HTMLDivElement>(null);
  const videoId = new URL(embed).pathname.split("/").pop();
  useEffect(() => {
    if (!attempt || !container.current || !videoId) return;
    let disposed = false;
    let player: YouTubePlayer | undefined;
    const host = container.current;
    const fail = () => {
      if (disposed) return;
      disposed = true;
      window.clearTimeout(timeout);
      player?.destroy();
      setStatus("error");
    };
    const timeout = window.setTimeout(fail, 18000);
    loadYouTubePlayer().then((api) => {
      if (disposed) return;
      const mount = document.createElement("div");
      host.replaceChildren(mount);
      player = new api.Player(mount, {
        host: "https://www.youtube-nocookie.com",
        videoId,
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          origin: window.location.origin,
          start: Number(new URL(embed).searchParams.get("start") || 0),
        },
        events: {
          onReady: (event) => {
            if (disposed) return;
            window.clearTimeout(timeout);
            setStatus("ready");
            event.target.playVideo();
          },
          onError: fail,
        },
      });
      const frame = host.querySelector("iframe");
      if (frame) {
        frame.title = title;
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      }
    }).catch(fail);
    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      player?.destroy();
      host.replaceChildren();
    };
  }, [attempt, embed, title, videoId]);
  const previewClassName =
    "group absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white";
  const preview = (
    <>
      <Image
        src={`/media/youtube/${videoId}.jpg`}
        alt=""
        fill
        sizes="(min-width: 1024px) 376px, (min-width: 640px) 42vw, 100vw"
        className="object-cover"
      />
      <span className="relative flex h-12 w-16 items-center justify-center rounded-lg bg-black/80 text-white transition-colors group-hover:bg-red-600 group-focus-visible:bg-red-600">
        <Play aria-hidden="true" className="h-6 w-6" fill="currentColor" />
      </span>
    </>
  );

  function play() {
    setStatus("loading");
    setAttempt((value) => value + 1);
  }

  return (
    <figure>
      <div className="relative aspect-video w-full overflow-hidden border border-ink/10 bg-black">
        <div ref={container} className="absolute inset-0 h-full w-full [&_iframe]:h-full [&_iframe]:w-full" />
        {status !== "ready" && (
          <button
            type="button"
            onClick={play}
            disabled={status === "loading"}
            aria-label={`Play ${title}`}
            title={`Play ${title}`}
            className={previewClassName}
          >
            {preview}
            {status === "loading" && <span role="status" className="absolute bottom-2 rounded bg-black/85 px-3 py-1 text-xs text-white">Loading video...</span>}
          </button>
        )}
      </div>
      {status === "error" && (
        <p role="status" className="mt-2 text-sm text-graphite">
          YouTube couldn&apos;t load this player. Try again or use the YouTube link.
        </p>
      )}
      <figcaption className={`mt-2 flex items-center justify-between gap-3 leading-6 ${compactCaption ? "text-[13px] text-graphite" : "text-sm text-graphite/60"}`}>
        <button
          type="button"
          onClick={play}
          aria-label={`Play ${title} inline`}
          className="cursor-pointer text-left transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          {title}
        </button>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch ${title} on YouTube (opens a new tab)`}
          title="Watch on YouTube (opens a new tab)"
          className={compactCaption ? "flex h-9 w-9 shrink-0 items-center justify-center transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2" : "shrink-0 text-xs underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"}
        >
          {compactCaption ? <ArrowUpRight size={17} aria-hidden="true" /> : "Watch on YouTube"}
        </a>
      </figcaption>
    </figure>
  );
}
