import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { agentExamples, executionResults, leadRows, populateSales, makeWorkflow, makeAnalytics, runs } from "../scripts/bytespace-showcase/agent-fixtures.mjs";

test("example metrics agree across agents, workspace and analytics", () => {
  const group = populateSales({agents:Object.keys(agentExamples).map(id=>({id}))});
  assert.equal(group.totalGroupRuns,312);
  assert.equal(group.totalGroupHours,124);
  assert.equal(group.dailyRuns.reduce((a,b)=>a+b,0),312);
  for (const example of Object.values(agentExamples)) {
    assert.equal(example.success + example.graceful + example.errors,example.runs);
    assert.equal(example.daily.reduce((a,b)=>a+b,0),example.runs);
    assert.equal(example.rows.length,6);
    assert.ok(example.rows.every(row=>row.length === example.columns.length && row.every(cell=>cell !== "")));
  }
  assert.equal(executionResults.lineGraphData.reduce((sum,day)=>sum+day.Runs,0),78);
  assert.equal(executionResults.lineGraphData.reduce((sum,day)=>sum+day.Success,0),66);
  assert.equal(executionResults.pieChartData.reduce((sum,item)=>sum+item.value,0),78);
  assert.equal(leadRows.length,6);
  assert.equal(runs[0].rows,248);
});

test("the example workflow retains original nodes and uses valid connections and issue references", () => {
  const labels=["trigger","new-tab","event-click","structured-data-extract","insert-data","close-tab"];
  const original={nodes:labels.map(label=>({label,type:"BlockBasic",data:{original:true}})),edges:[]};
  const workflow=makeWorkflow(original);
  const ids=new Set(workflow.nodes.map(node=>node.id));
  assert.equal(ids.size,6);
  assert.equal(workflow.edges.length,5);
  assert.ok(workflow.nodes.every(node=>node.data.original));
  assert.ok(workflow.edges.every(edge=>ids.has(edge.source)&&ids.has(edge.target)));
  assert.ok(makeAnalytics(workflow).workflowIssues.every(issue=>ids.has(issue.nodeId)));
});

test("agents have distinct company records, task-specific details and their own totals", () => {
  const examples=Object.values(agentExamples);
  const names=examples.flatMap(example=>example.rows.map(row=>row[0]));
  assert.equal(new Set(names).size,24);
  for (const example of examples) {
    assert.ok(example.totalRows>=example.rows.length);
    assert.ok(new Set(example.rows.map(row=>row[1])).size>1);
    assert.ok(new Set(example.rows.map(row=>row[2])).size>1);
  }
  assert.deepEqual(agentExamples.s1.rows,leadRows.map(({Company,Score,Status})=>[Company,Score,Status]));
  const group=populateSales({agents:Object.keys(agentExamples).map(id=>({id}))});
  assert.deepEqual(group.agents.map(agent=>agent.tableRowCount),[248,228,58,214]);
});

test("the new screens are visible without navigation or reveal controls", async () => {
  const entry=await readFile(new URL("../scripts/bytespace-showcase/entry.jsx",import.meta.url),"utf8");
  const host=await readFile(new URL("../components/BytespaceStudies.tsx",import.meta.url),"utf8");
  const product=await readFile(new URL("../components/ProductDesign.tsx",import.meta.url),"utf8");
  for (const name of ["workspace","agents","analytics","results"]) assert.ok(host.includes(`<LiveStudy study={${name}} />`));
  assert.doesNotMatch(entry,/setExpanded|outputDialog|onOpenSpace|<select/);
  assert.match(product,/>Early cmd0<\/h3>/);
  assert.doesNotMatch(product,/<a href="#design-evolution"/);
});

test("source adapters keep the card row visible and remove disconnected controls", async () => {
  const build=await readFile(new URL("../scripts/build-bytespace-showcase.mjs",import.meta.url),"utf8");
  const css=await readFile(new URL("../scripts/bytespace-showcase/frame.css",import.meta.url),"utf8");
  assert.match(build,/animate=\{\{ opacity: 1 \}\}/);
  assert.match(build,/totalPages: ts\.factory\.createNumericLiteral\(1\)/);
  assert.match(build,/pageItems: ts\.factory\.createIdentifier\("allItems"\)/);
  assert.match(build,/\["SpaceOptionsMenu", "button"\]/);
  assert.match(css,/\.original-workspace \.cursor-grab[^}]*opacity: 1 !important/);
  assert.match(build,/extractAnalytics\(ts, source, filename\)/);
});

test("the detail libraries are isolated in local chunks with the original components", async () => {
  const folder=new URL("../public/showcases/bytespace/",import.meta.url);
  const provenance=JSON.parse(await readFile(new URL("provenance.json",folder),"utf8"));
  assert.match(await readFile(new URL("index.html",folder),"utf8"),/type="module"/);
  assert.ok(provenance.bundles.some(file=>file.startsWith("chunks/AgentDetailStudies-")));
  for (const file of provenance.bundles) {
    assert.match(file,/^(demo\.js|chunks\/[\w-]+\.js)$/);
    assert.ok((await stat(new URL(file,folder))).size>0);
  }
  for (const component of ["OwnerAgentView.tsx","WorkflowPreview.tsx","RunOutputDisplay.tsx","LatestRunItem.tsx"]) {
    assert.ok(provenance.sourceFiles.some(file=>file.endsWith(component)));
  }
});
