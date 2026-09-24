"use client";

import { useState, type CSSProperties } from "react";
import {
  ArrowLeft, ArrowLeftRight, ArrowRight, ArrowUp, ArrowUpDown, Camera, ChevronDown, ChevronUp,
  CircleStop, Clipboard, ClipboardType, Code2, Component, Cpu, Database, Download,
  Eye, FileUp, GitBranch, Globe, Hash, Image as ImageIcon, Keyboard, Link, Mouse,
  MousePointer, MoveUp, PencilLine, Pickaxe, RefreshCw, Regex, RotateCw, Save,
  Scissors, Share, Smile, Tag, Timer, Trash2, XCircle, type LucideIcon,
} from "lucide-react";
import catalog from "@/app/bytespace-node-catalog.json";
import styles from "./BytespaceNodeCatalog.module.css";

const icons: Record<string, LucideIcon> = {
  ArrowLeft, ArrowLeftRight, ArrowRight, ArrowUp, ArrowUpDown, Camera, CircleStop,
  Clipboard, ClipboardType, Code2, Component, Cpu, Database, Download, Eye,
  FileUp, GitBranch, Globe, Hash, Image: ImageIcon, Keyboard, Link, Mouse,
  MousePointer, MoveUp, PencilLine, Pickaxe, RefreshCw, Regex, RotateCw, Save,
  Scissors, Share, Smile, Tag, Timer, Trash2, XCircle,
};
type Palette = keyof typeof catalog.palette;
// Use artwork colors rather than source menu groups; AI cyan and Data blue stay distinct.
const paletteOrder: Palette[] = ["interaction", "ai", "data", "conditions", "browser", "general"];
// Active tab repeats the New tab globe; keep forty distinct showcase entries.
const allNodes = catalog.groups.flatMap(group => group.nodes)
  .filter(node => node.label !== "active-tab")
  .sort((a, b) => paletteOrder.indexOf(a.category as Palette) - paletteOrder.indexOf(b.category as Palette));
const previewNodes = new Set(catalog.groups.flatMap(group => group.nodes.slice(0, group.name === "AI" ? 3 : 2).map(node => node.label)));
type BuilderNode = typeof allNodes[number];

function NodeArtwork({ node }: { node: BuilderNode }) {
  const Icon = icons[node.icon];
  const palette = catalog.palette[node.category as Palette];
  return <span className={styles.nodeArtwork} aria-hidden="true" style={{
    "--node-edge": palette.edge, "--node-inset": palette.inset, "--node-face": palette.face, "--node-ink": palette.ink,
  } as CSSProperties}><span><Icon strokeWidth={1.8} /></span></span>;
}

export function BytespaceNodeCatalog() {
  const [expanded, setExpanded] = useState(false);

  return <section id="bytespace-nodes" aria-labelledby="bytespace-nodes-title" className={styles.catalog}>
    <h3 id="bytespace-nodes-title" className={styles.heading}>Builder nodes</h3>
    <ul id="bytespace-node-grid" className={styles.grid} data-expanded={expanded} role="list">
      {allNodes.map(node => <li key={node.label} className={styles.node} data-node={node.label} data-preview={previewNodes.has(node.label)}>
        <NodeArtwork node={node} /><span className={styles.label}>{node.label === "javascript-code" ? "JavaScript" : node.title}</span>
      </li>)}
    </ul>
    <button type="button" className={styles.expand} aria-expanded={expanded} aria-controls="bytespace-node-grid" onClick={() => setExpanded(value => !value)}>
      {expanded ? "Fewer nodes" : "All nodes"}{expanded ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
    </button>
  </section>;
}
