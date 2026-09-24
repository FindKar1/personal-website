import { useEffect } from "react";
import { useNodesInitialized, useReactFlow } from "reactflow";

export function ArchiveWorkflowFit() {
  const { fitView } = useReactFlow();
  const ready = useNodesInitialized();
  useEffect(() => {
    const canvas = document.querySelector(".builder-card .react-flow");
    if (!ready || !canvas) return;
    const observer = new ResizeObserver(() => fitView({ padding: 0.15, duration: 0 }));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [ready, fitView]);
  return null;
}
