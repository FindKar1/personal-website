// Row composition from Cmd0's VirtualBrowsersSection.tsx.
const AGENT_VIDEO_BASES = Array.from({ length: 20 }, (_, index) => `/showcases/bytespace-motion/agent_videos/agent-${index + 1}`);
const DEMO_VIDEO_BASES = Array.from({ length: 9 }, (_, index) => `/showcases/bytespace-motion/browser_demos/demo${index + 1}`);

/** @param {number} rowIndex @param {number} totalAgents @param {number} totalRows */
export function createVideosForRow(rowIndex, totalAgents = 20, totalRows = 3) {
  const baseAgentsPerRow = Math.floor(totalAgents / totalRows);
  const extraAgents = totalAgents % totalRows;
  const agentsInThisRow = rowIndex < extraAgents ? baseAgentsPerRow + 1 : baseAgentsPerRow;
  let startIndex = 0;
  for (let r = 0; r < rowIndex; r++) {
    startIndex += r < extraAgents ? baseAgentsPerRow + 1 : baseAgentsPerRow;
  }
  const globalDemoIndex = rowIndex * Math.ceil(agentsInThisRow / 2);
  return Array.from({ length: agentsInThisRow * 2 }, (_, i) => {
    if (i % 2 === 0) {
      const agentIndex = startIndex + Math.floor(i / 2);
      return { type: "agent", basePath: AGENT_VIDEO_BASES[agentIndex] };
    }
    const demoIndex = (globalDemoIndex + Math.floor(i / 2)) % DEMO_VIDEO_BASES.length;
    return { type: "demo", basePath: DEMO_VIDEO_BASES[demoIndex] };
  });
}

export const bytespaceVideoRows = [0, 1, 2].map(row => createVideosForRow(row));
