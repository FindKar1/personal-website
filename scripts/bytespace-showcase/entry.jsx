/* Original interface modules are isolated from the host's Tailwind version. */
import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { Play } from "lucide-react";
import { AgentGroupCard, AgentCard } from "@/components/agents/AgentGroupsGrid";
import { PREVIEW_SPACES } from "showcase-fixtures";
import { AgentExecutionDemo } from "@/components/landing-page/AgentExecutionDemo";
import { ScheduleCalendar } from "@/components/landing-page/ScheduleCalendar";
import { EventTriggersNetwork } from "@/components/landing-page/EventTriggersNetwork";
import { DemoChatInput } from "@/components/landing-page/DemoChatInput";
import SignInForm from "@/components/auth/SignInForm";
import { populateSales } from "./agent-fixtures.mjs";
const WorkflowAnalyticsStudy = lazy(() => import("./AgentDetailStudies.jsx").then(module => ({default:module.WorkflowAnalyticsStudy})));
const ExecutionResultsStudy = lazy(() => import("./AgentDetailStudies.jsx").then(module => ({default:module.ExecutionResultsStudy})));

const requestedView = new URLSearchParams(window.location.search).get("view");
const view = ["spaces", "agents", "analytics", "results", "execution", "calendar", "triggers", "context", "signin"].includes(requestedView) ? requestedView : "spaces";
const sales = populateSales(PREVIEW_SPACES[0]);

function Showcase() {
  const [replay, setReplay] = useState(0);
  const [running, setRunning] = useState(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [notice, setNotice] = useState("");
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
    window.addEventListener("showcase-notice", showNotice);
    window.addEventListener("showcase-enter", enter);
    return () => {
      window.removeEventListener("showcase-notice", showNotice);
      window.removeEventListener("showcase-enter", enter);
    };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  return <MotionConfig reducedMotion="user">
    <main ref={root} className={`study-root study-${view}`}>
      {view === "spaces" && <div className="original-workspace"><AgentGroupCard group={sales} hideAddAgent disableClicks availableSpaces={[]} /></div>}
      {view === "agents" && <div className="expanded-agents">{sales.agents.map(agent => <AgentCard key={agent.id} agent={agent} accent={sales.accent} viewMode="expanded" disableClicks />)}</div>}
      {view === "analytics" && <Suspense fallback={<div className="detail-loading" role="status">Loading interface...</div>}><WorkflowAnalyticsStudy /></Suspense>}
      {view === "results" && <Suspense fallback={<div className="detail-loading" role="status">Loading interface...</div>}><ExecutionResultsStudy /></Suspense>}
      {view === "execution" && <>
        {running ? <div className="execution-study" key={replay}><AgentExecutionDemo /></div> : <button className="motion-start" onClick={() => setRunning(true)}><Play size={24} />Play execution</button>}
      </>}
      {view === "calendar" && <div className="calendar-scroll"><ScheduleCalendar /></div>}
      {view === "triggers" && <div className="triggers-study"><EventTriggersNetwork className="network-study" /></div>}
      {view === "context" && <div className="context-study"><DemoChatInput /></div>}
      {view === "signin" && <SignInForm prefillEmail="preview@example.com" />}
      <div className="showcase-notice" role="status">{notice}</div>
    </main>
  </MotionConfig>;
}

createRoot(document.getElementById("root")).render(<Showcase />);
