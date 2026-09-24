import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import CardDetails from "@/components/marketplace/CardDetails";
import { landingWorkflowData } from "@/components/marketplace/workflow-preview/landingWorkflowData";
import { SidebarContext } from "./adapters";
import { agents, exampleRows } from "./fixtures";

export default function Details({ id }) {
  const agent = agents.find(agent => agent.id === id);
  const [subView, setSubView] = useState("");
  if (!agent) return null;
  const website = new URLSearchParams(location.search).get("input");
  const inputs = id === "website-roast" && website ? agent.inputs.map(input => ({ ...input, default_value: website })) : agent.inputs;
  return <SidebarContext.Provider value={{ state: { subView }, setSubView }}>
    <main className="detail-root">
      {subView && <button className="detail-back" onClick={() => setSubView("")}><ArrowLeft size={16} />Agent details</button>}
      {subView === "runtime-execution" ? <section className="example-output">
        <h2>Example output</h2><p>Illustrative data / No live run</p>
        <div className="output-scroll"><table><thead><tr>{agent.columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody>{exampleRows.map(row => <tr key={row[0]}>{row.map(value => <td key={value}>{value}</td>)}</tr>)}</tbody></table></div>
      </section> : <CardDetails {...agent} avatarUrl={agent.character ? agent.cardImage : "/showcases/bytespace-marketplace/assets/quickwin-poster.webp"} inputs={inputs} workflowData={{ ...landingWorkflowData, name: "Example workflow", table: agent.columns.map(name => ({ name, visible: true })) }} />}
    </main>
  </SidebarContext.Provider>;
}
