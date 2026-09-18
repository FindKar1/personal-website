/* Original interface modules are isolated from the host's Tailwind version. */
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { ArrowLeft, Play, X } from "lucide-react";
import { AgentGroupCard } from "@/components/agents/AgentGroupsGrid";
import { PREVIEW_SPACES } from "showcase-fixtures";
import { AgentExecutionDemo } from "@/components/landing-page/AgentExecutionDemo";
import { ScheduleCalendar } from "@/components/landing-page/ScheduleCalendar";
import { EventTriggersNetwork } from "@/components/landing-page/EventTriggersNetwork";
import { DemoChatInput } from "@/components/landing-page/DemoChatInput";
import SignInForm from "@/components/auth/SignInForm";

const requestedView = new URLSearchParams(window.location.search).get("view");
const view = ["spaces", "execution", "calendar", "triggers", "context", "signin"].includes(requestedView) ? requestedView : "spaces";
const spaces = PREVIEW_SPACES.map(group => ({ ...group, agents: group.agents.map(agent => ({
  ...agent, successfulRuns: Math.round(agent.runs * .87), tableRowCount: 248,
  tableColumns: ["Company", "Status", "Score"], variableNames: ["recordsFound", "qualified", "duration"],
})) }));

function Showcase() {
  const [space, setSpace] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [replay, setReplay] = useState(0);
  const [running, setRunning] = useState(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [notice, setNotice] = useState("");
  const [output, setOutput] = useState(null);
  const outputDialog = useRef(null);
  const root = useRef(null);

  useEffect(() => {
    const measure = () => window.parent.postMessage({ type: "bytespace:resize", view, height: Math.ceil(root.current.getBoundingClientRect().height) }, window.location.origin);
    const observer = new ResizeObserver(measure);
    observer.observe(root.current);
    const request = event => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === "bytespace:measure") measure();
      if (event.data?.type === "bytespace:replay" && view === "execution") {
        setRunning(true);
        setReplay(value => value + 1);
      }
    };
    window.addEventListener("message", request);
    return () => { observer.disconnect(); window.removeEventListener("message", request); };
  }, []);

  useEffect(() => {
    const showNotice = event => setNotice(event.detail);
    const enter = () => {
      setNotice("Example workspace opened. No account was accessed.");
      window.parent.postMessage({ type: "bytespace:enter" }, window.location.origin);
    };
    const openOutput = event => setOutput(event.detail);
    window.addEventListener("showcase-notice", showNotice);
    window.addEventListener("showcase-enter", enter);
    window.addEventListener("showcase-output", openOutput);
    return () => {
      window.removeEventListener("showcase-notice", showNotice);
      window.removeEventListener("showcase-enter", enter);
      window.removeEventListener("showcase-output", openOutput);
    };
  }, []);
  useEffect(() => {
    if (!output) return;
    const dialog = outputDialog.current;
    const opener = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); opener?.focus(); };
  }, [output]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  return <MotionConfig reducedMotion="user">
    <main ref={root} className={`study-root study-${view}`}>
      {view === "spaces" && <>
        <div className="workspace-toolbar">
          {expanded && <button className="workspace-back" onClick={() => setExpanded(false)}><ArrowLeft size={14} />All agents</button>}
          <select aria-label="Select workspace" value={space} onChange={event => setSpace(Number(event.target.value))}>{PREVIEW_SPACES.map((group, index) => <option key={group.id} value={index}>{group.name}</option>)}</select>
        </div>
        <div className="original-workspace" key={`${space}-${expanded}`}><AgentGroupCard group={spaces[space]} hideAddAgent disableClicks availableSpaces={[]} isFullScreen={expanded} onOpenSpace={() => setExpanded(true)} onViewChange={() => setExpanded(false)} /></div>
      </>}
      {view === "execution" && <>
        {running ? <div className="execution-study" key={replay}><AgentExecutionDemo /></div> : <button className="motion-start" onClick={() => setRunning(true)}><Play size={24} />Play execution</button>}
      </>}
      {view === "calendar" && <div className="calendar-scroll"><ScheduleCalendar /></div>}
      {view === "triggers" && <div className="triggers-study"><EventTriggersNetwork className="network-study" /></div>}
      {view === "context" && <div className="context-study"><DemoChatInput /></div>}
      {view === "signin" && <SignInForm prefillEmail="preview@example.com" />}
      <div className="showcase-notice" role="status">{notice}</div>
      <dialog ref={outputDialog} className="output-dialog" aria-labelledby="output-title" onCancel={() => setOutput(null)}>
        {output && <><header><div><h2 id="output-title">{output === "table" ? "Table output" : "Run summary"}</h2><p>Illustrative data / Local preview</p></div><button aria-label="Close output" title="Close output" onClick={() => setOutput(null)}><X size={18} /></button></header>
          {output === "table" ? <table><thead><tr><th>Company</th><th>Status</th><th>Score</th></tr></thead><tbody>{[["Northwind", "Qualified", "94"], ["Contoso", "Qualified", "91"], ["Fabrikam", "In review", "78"], ["Adventure Works", "Qualified", "89"]].map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table> : <dl><div><dt>Records found</dt><dd>248</dd></div><div><dt>Qualified</dt><dd>192</dd></div><div><dt>Duration</dt><dd>2m 14s</dd></div></dl>}
        </>}
      </dialog>
    </main>
  </MotionConfig>;
}

createRoot(document.getElementById("root")).render(<Showcase />);
