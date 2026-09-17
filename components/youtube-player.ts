export type YouTubePlayer = {
  destroy(): void;
  playVideo(): void;
};

type YouTubeAPI = {
  Player: new (
    element: HTMLElement,
    options: {
      host: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady(event: { target: YouTubePlayer }): void;
        onError(): void;
      };
    },
  ) => YouTubePlayer;
};

let pending: Promise<YouTubeAPI> | undefined;

export function loadYouTubePlayer(): Promise<YouTubeAPI> {
  const scope = window as Window & {
    YT?: YouTubeAPI;
    onYouTubeIframeAPIReady?: () => void;
  };
  if (scope.YT?.Player) return Promise.resolve(scope.YT);
  if (pending) return pending;

  pending = new Promise<YouTubeAPI>((resolve, reject) => {
    const script = document.createElement("script");
    const previous = scope.onYouTubeIframeAPIReady;
    const timeout = window.setTimeout(fail, 12000);
    function fail() {
      window.clearTimeout(timeout);
      scope.onYouTubeIframeAPIReady = previous;
      script.remove();
      pending = undefined;
      reject(new Error("YouTube player could not load"));
    }
    scope.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timeout);
      scope.onYouTubeIframeAPIReady = previous;
      previous?.();
      if (scope.YT?.Player) resolve(scope.YT);
      else fail();
    };
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = fail;
    document.head.append(script);
  });
  return pending;
}
