// One consistent, synthetic week shared by the workspace, cards, charts and runs.
// Recognizable company names are illustrative, not customer or outreach claims.
export const leadRows = [
  {Company:"Cursor", Industry:"Developer tools", Score:94, Status:"Qualified"},
  {Company:"Linear", Industry:"Software", Score:91, Status:"Qualified"},
  {Company:"Vercel", Industry:"Cloud platform", Score:89, Status:"Qualified"},
  {Company:"Retool", Industry:"Developer tools", Score:87, Status:"Qualified"},
  {Company:"Ramp", Industry:"Finance", Score:82, Status:"Qualified"},
  {Company:"Mercury", Industry:"Finance", Score:78, Status:"Review"},
];

export const agentExamples = {
  s1: {
    description: "Finds prospective companies, qualifies their profiles, and adds them to the sales pipeline.",
    columns: ["Company", "Score", "Status"], rows: leadRows.map(({Company, Score, Status}) => [Company, Score, Status]),
    totalRows: 248,
    summary: ["192 qualified", "248 companies", "77% match rate"],
    runs: 78, success: 66, graceful: 8, errors: 4, hours: 32,
    daily: [8, 10, 12, 9, 11, 14, 14],
  },
  s2: {
    description: "Prepares personalized outreach and keeps every conversation connected to its prospect.",
    columns: ["Company", "Campaign", "Status"], rows: [
      ["Stripe", "Dev tools", "Delivered"],
      ["Notion", "Team workflows", "Replied"],
      ["Figma", "Design ops", "Opened"],
      ["Airtable", "Data ops", "Delivered"],
      ["Replit", "Engineering", "Queued"],
      ["Brex", "Finance ops", "Queued"],
    ],
    totalRows: 228,
    summary: ["186 delivered", "42 replies", "8 meetings"],
    runs: 64, success: 56, graceful: 5, errors: 3, hours: 28,
    daily: [8, 10, 9, 8, 7, 11, 11],
  },
  s3: {
    description: "Tracks open conversations and follows up when the next touchpoint is due.",
    columns: ["Company", "Next step", "Status"], rows: [
      ["OpenAI", "Share brief", "Complete"],
      ["Anthropic", "Send recap", "Complete"],
      ["Perplexity", "Book demo", "Scheduled"],
      ["Glean", "Share pricing", "Complete"],
      ["Harvey", "Send reminder", "Scheduled"],
      ["Rippling", "Share trial", "Scheduled"],
    ],
    totalRows: 58,
    summary: ["58 follow-ups", "21 responses", "6 demos"],
    runs: 92, success: 83, graceful: 6, errors: 3, hours: 35,
    daily: [12, 14, 16, 13, 11, 14, 12],
  },
  s4: {
    description: "Enriches company records and keeps account details in sync across the CRM.",
    columns: ["Company", "Updated", "Status"], rows: [
      ["Salesforce", "Account owner", "Synced"],
      ["Adobe", "Deal stage", "Synced"],
      ["Slack", "Team size", "Enriched"],
      ["Dropbox", "Domain", "Verified"],
      ["Airbnb", "Contact role", "Enriched"],
      ["Uber", "Region", "Synced"],
    ],
    totalRows: 214,
    summary: ["214 updated", "34 enriched", "0 duplicates"],
    runs: 78, success: 68, graceful: 6, errors: 4, hours: 29,
    daily: [12, 12, 13, 12, 11, 9, 9],
  },
};

export function populateSales(group) {
  const agents = group.agents.map(agent => {
    const example = agentExamples[agent.id];
    return { ...agent, description: example.description, runs: example.runs,
      workedHours: example.hours, successfulRuns: example.success,
      successRate: example.success / example.runs, gracefulFailureRate: example.graceful / example.runs,
      errorRate: example.errors / example.runs, dailyRuns: example.daily,
      hasTableData: true, hasVariableData: true, tableRowCount: example.totalRows,
      tableColumns: example.columns, variableNames: example.summary,
    };
  });
  const totalGroupRuns = agents.reduce((sum, agent) => sum + agent.runs, 0);
  const rate = key => agents.reduce((sum, agent) => sum + agentExamples[agent.id][key], 0) / totalGroupRuns;
  return { ...group, agents, totalGroupHours: agents.reduce((sum, agent) => sum + agent.workedHours, 0),
    totalGroupRuns, successRate: rate("success"), gracefulFailureRate: rate("graceful"), errorRate: rate("errors"),
    dailyRuns: agents[0].dailyRuns.map((_, index) => agents.reduce((sum, agent) => sum + agent.dailyRuns[index], 0)),
  };
}

export const executionResults = {
  metrics: { totalRuns: 78, successfulRuns: 66, avgDurationSeconds: 1477 },
  lineGraphData: [
    {date:"Mon", Runs:8, Success:7, Failed:1}, {date:"Tue", Runs:10, Success:8, Failed:2},
    {date:"Wed", Runs:12, Success:10, Failed:2}, {date:"Thu", Runs:9, Success:8, Failed:1},
    {date:"Fri", Runs:11, Success:9, Failed:2}, {date:"Sat", Runs:14, Success:12, Failed:2},
    {date:"Sun", Runs:14, Success:12, Failed:2},
  ],
  pieChartData: [{name:"Success", value:66, color:"emerald"}, {name:"Graceful stop", value:8, color:"yellow"}, {name:"Error", value:4, color:"red"}],
};

export const runs = [
  {id:"run-078", title:"Company discovery", time:"14:32", status:"success", rows:248, totalVariables:3},
  {id:"run-077", title:"Company discovery", time:"14:06", status:"success", rows:231, totalVariables:3},
  {id:"run-076", title:"Company discovery", time:"13:41", status:"stopped", rows:186, totalVariables:3},
  {id:"run-075", title:"Company discovery", time:"13:14", status:"error", rows:0, totalVariables:0},
];

export function makeWorkflow(original) {
  const steps = [
    ["trigger", "Scheduled prospecting", 0, 200],
    ["new-tab", "Open company search", 650, 200],
    ["event-click", "Apply prospect filters", 1000, 200],
    ["structured-data-extract", "Extract company profiles", 1350, 200],
    ["insert-data", "Save qualified companies", 1350, 650],
    ["close-tab", "Close browser session", 1000, 650],
  ];
  const nodes = steps.map(([label, description, x, y], index) => {
    const originalNode = original.nodes.find(node => node.label === label);
    return { ...originalNode, id:`lead-${index}`, position:{x,y},
      data:{...originalNode.data, description, ...(label === "trigger" ? {type:"interval", interval:60, inputs:[{title:"Industry",type:"Technology & finance"},{title:"Region",type:"North America"},{title:"Company size",type:"Any size"}]} : {})},
    };
  });
  const edges = nodes.slice(1).map((node, index) => ({
    id:`lead-edge-${index}`, source:nodes[index].id, target:node.id,
    sourceHandle:`${nodes[index].id}-output-1`, targetHandle:`${node.id}-input-1`, type:"smoothstep",
  }));
  return { ...original, name:"Lead Generator", agentImageUrl:"/agent_profiles/Premium/investor-bro/investor-bro.png", nodes, edges, table:[] };
}

export function makeAnalytics(workflowData) {
  return { workflowData, nodeErrorStates:{"lead-2":{hasGraceful:true,hasCritical:false},"lead-3":{hasGraceful:false,hasCritical:true}},
    workflowIssues:[
      {nodeId:"lead-2", nodeLabel:"Apply prospect filters", nodeDescription:"Search results changed before the next step.", hasGraceful:true,
        gracefulErrors:[{error:"Stopped at the configured result limit",count:8}], criticalErrors:[]},
      {nodeId:"lead-3", nodeLabel:"Extract company profiles", nodeDescription:"A required field was unavailable on the source page.", hasCritical:true,
        gracefulErrors:[], criticalErrors:[{error:"Company profile did not finish loading",count:4}]},
    ],
  };
}
