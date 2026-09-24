import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Laptop from "original-shape:LaptopShape";
import Diamond from "original-shape:DiamondShape";
import Towers from "original-shape:CrystalTower";
import StillLaptop from "still-shape:LaptopShape";
import StillDiamond from "still-shape:DiamondShape";
import StillTowers from "still-shape:CrystalTower";

function Icons() {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const request = event => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === "bytespace-icons:playback") setRunning(event.data.running === true);
    };
    window.addEventListener("message", request);
    window.parent.postMessage({ type: "bytespace-icons:ready" }, window.location.origin);
    return () => window.removeEventListener("message", request);
  }, []);
  const shapes = running ? [Laptop, Diamond, Towers] : [StillLaptop, StillDiamond, StillTowers];
  return <main className="plan-icons" data-running={running}>
    {shapes.map((Shape, index) => <div className={`shape shape-${index}`} key={`${running}-${index}`} role="img"
      aria-label={["Hobbyist laptop", "Professional diamond", "Team crystal towers"][index]}>
      <Shape size={320} isDarkMode={false} />
    </div>)}
  </main>;
}

createRoot(document.getElementById("root")).render(<Icons />);
