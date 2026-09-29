import React from "react";
import Image from "next/image";
import { OriginalWorkflowAnalytics } from "@/components/agents/OwnerAgentView";
import { RunOutputDisplay } from "@/components/agents/RunOutputDisplay";
import { LatestRunItem } from "@/components/agents/LatestRunItem";
import { landingWorkflowData } from "@/components/marketplace/workflow-preview/landingWorkflowData";
import { executionResults, leadRows, makeAnalytics, makeWorkflow, runs } from "./agent-fixtures.mjs";

const workflow = makeWorkflow(landingWorkflowData);
const analytics = makeAnalytics(workflow);
const outputSchema = [
  {id:1, type:"custom_table_schema", title:"Qualified companies", function_name:"companies", description:""},
  {id:2, type:"text", title:"Companies reviewed", function_name:"reviewed", description:""},
  {id:3, type:"text", title:"Qualified for outreach", function_name:"qualified", description:""},
  {id:4, type:"text", title:"Added to the pipeline", function_name:"added", description:""},
];

function AgentHeading({children}) {
  return <header className="agent-detail-heading">
    <Image src="/agent_profiles/Premium/investor-bro/investor-bro.png" alt="" width={40} height={40} />
    <div><h2>Lead Generator</h2><p>{children}</p></div>
    <span className="detail-period">Last 7 days</span>
  </header>;
}

export function WorkflowAnalyticsStudy() {
  return <>
    <AgentHeading>Company discovery and qualification</AgentHeading>
    <OriginalWorkflowAnalytics workflowAnalyticsData={analytics} executionResults={executionResults} />
  </>;
}

export function ExecutionResultsStudy() {
  return <>
    <AgentHeading>Execution results</AgentHeading>
    <div className="execution-results-layout">
      <section className="results-output">
        <div className="run-heading"><div><h3>Company discovery</h3><p>Run 078 / 14:32 / 24m 37s</p></div><span>Success</span></div>
        <RunOutputDisplay output={{table:leadRows,variables:{reviewed:248,qualified:192,added:186}}} outputSchema={outputSchema} />
      </section>
      <aside className="results-history" aria-label="Run history">
        <h3>Latest runs</h3>
        {runs.map((run,index) => <LatestRunItem key={run.id} {...run} started_at="2025-07-20T14:32:00Z" isSelected={index === 0} />)}
      </aside>
    </div>
  </>;
}
