// Keep the original analytics composition without importing its account/VM lifecycle.
export function extractAnalytics(ts, source, filename) {
  const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let panel;
  function find(node) {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(ast) === "TabsContent" &&
      node.openingElement.attributes.properties.some(attribute => attribute.name?.getText(ast) === "value" && attribute.initializer?.text === "analytics")) panel = node;
    ts.forEachChild(node, find);
  }
  find(ast);
  if (!panel) throw new Error("Original workflow analytics panel was not found.");
  const body = panel.children.map(child => child.getFullText(ast)).join("");
  const helpers = ast.statements.filter(node => ts.isFunctionDeclaration(node) &&
    ["getWorkflowIssues", "getNodeErrorStates"].includes(node.name?.text)).map(node => node.getText(ast)).join("\n");
  const extractedSource = `
    import React from 'react';
    import { Activity, Clock, CheckCircle2 } from 'lucide-react';
    import { DonutChart } from '@tremor/react';
    import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Badge } from '@/components/ui/badge';
    import WorkflowPreview from '@/components/marketplace/workflow-preview/WorkflowPreview';
    ${helpers}
    export function OriginalWorkflowAnalytics({ workflowAnalyticsData, executionResults }) {
      const isLoadingWorkflowAnalytics = false;
      const isLoadingExecutionResults = false;
      const workflowAnalyticsError = null;
      const focusedNodeId = null;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const successPercentage = executionResults.metrics.successfulRuns / executionResults.metrics.totalRuns * 100;
      const avgDurationSeconds = executionResults.metrics.avgDurationSeconds;
      return <div className="original-analytics">${body}</div>;
    }
  `;
  const parsed = ts.createSourceFile(filename, extractedSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const transformed = ts.transform(parsed, [context => {
    const visit = node => {
      if (ts.isJsxElement(node) && node.openingElement.tagName.getText(parsed) === "button") return ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent) ? ts.factory.createJsxExpression(undefined, ts.factory.createNull()) : ts.factory.createNull();
      if (ts.isJsxAttribute(node) && ["onMouseEnter", "onMouseLeave"].includes(node.name.getText(parsed))) return undefined;
      if (ts.isExpressionStatement(node) && node.expression.getText(parsed).startsWith("console.")) return undefined;
      return ts.visitEachChild(node, visit, context);
    };
    return node => ts.visitNode(node, visit);
  }]);
  const result = ts.createPrinter().printFile(transformed.transformed[0])
    .replace("<WorkflowPreview", "<WorkflowPreview showControls={false} showMinimap={false} disableInteraction")
    .replaceAll("<Area ", "<Area isAnimationActive={!reducedMotion} ")
    .replace("showAnimation={true}", "showAnimation={!reducedMotion}")
    .replaceAll("text-yellow-400", "text-yellow-700")
    .replaceAll("text-red-400", "text-red-600")
    .replaceAll("cursor-pointer", "cursor-default");
  transformed.dispose();
  return result;
}
