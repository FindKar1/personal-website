const media = "/showcases/bytespace-motion";
export const agentIds = ["lead-generator", "content-writer", "research-assistant", "website-roast"];

const input = (id, title, type, value, required = true) => ({ id, title, type, default_value: value, required, function_name: title.toLowerCase().replaceAll(" ", "_"), description: "", options: [] });
const app = (name, logo) => ({ name, title: name, logo, logoUrl: logo });
const base = { username: "Example creator", publicAutomationsCount: 3, forks: 0, runs: 0, price: { paid: false }, requirements: { authRequired: { required: false, apps: [] }, inAppSubscriptions: { required: false, subs: [] } }, hasVideo: true };

// Archive fixtures, not a reconstruction of real creators, listings, or usage figures.
export const agents = [
  { id: agentIds[0], title: "Lead Generator", overview: "Find companies, collect contact details, and organize a prospect list.", appsUsed: [app("LinkedIn", "linkedin"), app("Notion", "notion"), app("Google Drive", "drive")], clip: 9, character: 1,
    inputs: [input(1, "Company search", "text_input", "Climate technology"), input(2, "Maximum results", "integer_input", 20), input(3, "Include company website", "toggle_true_false", true, false)], columns: ["Company", "Contact", "Website"] },
  { id: agentIds[1], title: "Content Writer", overview: "Collect source material and turn research into a structured first draft.", appsUsed: [app("Reddit", "reddit"), app("Notion", "notion"), app("Gmail", "gmail")], clip: 5, character: 7,
    inputs: [input(1, "Topic", "text_input", "Tools for independent makers"), input(2, "Word count", "integer_input", 500), input(3, "Include references", "toggle_true_false", true, false)], columns: ["Source", "Topic", "Reference"] },
  { id: agentIds[2], title: "Research Assistant", overview: "Gather information across websites and bring the findings into one table.", appsUsed: [app("Google Drive", "drive"), app("Airtable", "airtable"), app("Google Calendar", "calendar")], clip: 1, character: 14,
    inputs: [input(1, "Research question", "text_input", "Which teams build browser automation tools?"), input(2, "Maximum sources", "integer_input", 10), input(3, "Save source links", "toggle_true_false", true, false)], columns: ["Source", "Finding", "Link"] },
  { id: agentIds[3], title: "Run your first agent", overview: "Turn any company website into a meeting-ready brief.", appsUsed: [app("Notion", "notion"), app("Google Drive", "drive")], clip: 1,
    inputs: [input(1, "Website URL", "text_input", "https://example.com")], columns: ["Page", "Observation", "Suggestion"] },
].map(agent => ({ ...base, ...agent, description: "", cardImage: `${media}/agent_videos/agent-${agent.character}.webp`, cardVideo: `${media}/agent_videos/agent-${agent.character}.webm`, thumbnailUrl: `${media}/browser_demos/demo${agent.clip}.webp`, videoUrl: `${media}/browser_demos/demo${agent.clip}.webm`, outputs: [{ id: 1, type: "custom_table_schema", title: "Results", function_name: "results", table_schema: agent.columns.map(header => ({ header, name: header })) }] }));

export const exampleRows = [["Example source A", "Finding one", "Saved reference"], ["Example source B", "Finding two", "Saved reference"], ["Example source C", "Finding three", "Saved reference"]];
