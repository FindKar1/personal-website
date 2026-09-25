import React from "react";
import { GpuChipScene } from "original-morph";

export default function MorphScene({ active, reducedMotion }) {
  return <div className="scene" role="img" aria-label="Animated DNA helix">
    <GpuChipScene active={active} reducedMotion={reducedMotion} />
  </div>;
}
