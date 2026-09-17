import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Bot0TerminalShell } from "bot0-showcase-source";

// Keep the original model panel's desktop API calls inside this demo only.
let previewConfig = {};
window.bot0 = {
  models: {
    getCatalogDetails: async () => ({ success: false, error: "Live catalog unavailable in the preserved demo." }),
  },
  config: {
    getConfig: async () => structuredClone(previewConfig),
    setConfig: async (patch) => { previewConfig = { ...previewConfig, ...structuredClone(patch) }; },
  },
};

function Showcase() {
  const [view, setView] = useState("session");
  return <main className={`showcase-frame view-${view}`}>
    <div className="mobile-views" role="group" aria-label="Workspace view">
      <button type="button" aria-pressed={view === "session"} onClick={() => setView("session")}>Session</button>
      <button type="button" aria-pressed={view === "notebook"} onClick={() => setView("notebook")}>Notebook</button>
    </div>
    <div className="showcase-shell"><Bot0TerminalShell theme="light" /></div>
  </main>;
}

createRoot(document.getElementById("root")).render(<Showcase />);
