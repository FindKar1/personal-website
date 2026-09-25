import React, { useEffect, useRef, useState } from "react";
import { PixelatedCanvas } from "original-pixels";

export default function PixelScene({ active, reducedMotion }) {
  const container = useRef(null);
  const [height, setHeight] = useState(440);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setHeight(Math.round(1100 * height / width));
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={container} className="scene">
    <PixelatedCanvas src="./assets/hero-pixel-background.webp" width={1100} height={height}
      cellSize={7} dotScale={0.76} shape="square" backgroundColor=""
      dropoutStrength={0.22} interactive={active && !reducedMotion}
      distortionStrength={3} distortionRadius={112} distortionMode="swirl"
      followSpeed={0.16} jitterStrength={2} jitterSpeed={2.6} sampleAverage
      tintColor="#D82DEB" tintStrength={0.05} objectFit="cover" maxFps={30}
      className="pixel-field" />
  </div>;
}
