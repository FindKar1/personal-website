import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (!process.argv[2]) throw new Error("Pass the portfolio-sites checkout.");
const archive = path.resolve(process.argv[2]);
const app = path.join(archive, "apps/cmd0");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const support = path.join(root, "scripts/bytespace-plan-icons");
const output = path.join(root, "public/showcases/bytespace-plan-icons");
const require = createRequire(path.join(app, "package.json"));
const botRequire = createRequire(path.join(archive, "apps/bot0/package.json"));
const { build } = createRequire(botRequire.resolve("tsx/package.json"))("esbuild");
const ts = require("typescript");
const inputs = new Map();
const hash = source => createHash("sha256").update(source).digest("hex");
const parse = (source, filename) => ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

async function original(relative) {
  const filename = path.join(app, "src", relative);
  const source = await readFile(filename, "utf8");
  inputs.set(filename, source);
  return { source, ast: parse(source, filename) };
}

function declaration(ast, name) {
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const match = statement.declarationList.declarations.find(item => item.name.getText(ast) === name);
    if (match) return match.initializer;
  }
  throw new Error(`Missing original declaration: ${name}`);
}

// Read literal source data with the TypeScript parser, without executing the marketing page.
function literal(node) {
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isIdentifier(node)) return node.text;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => {
    if (!ts.isPropertyAssignment(property)) throw new Error("Expected a literal property.");
    return [property.name.text, literal(property.initializer)];
  }));
  throw new Error(`Unsupported catalogue syntax: ${node.getText()}`);
}

const carousel = await original("components/landing-page/NodeCarousel.tsx");
const workflow = await original("components/marketplace/workflow-preview/WorkflowNode.tsx");
const iconImports = new Map();
for (const statement of carousel.ast.statements) {
  if (!ts.isImportDeclaration(statement) || statement.moduleSpecifier.text !== "lucide-react") continue;
  for (const item of statement.importClause.namedBindings.elements) iconImports.set(item.name.text, (item.propertyName || item.name).text);
}
const groups = [
  ["Web", "webActionNodes"], ["AI", "aiNodes"], ["Navigation", "navigationNodes"],
  ["Logic", "logicNodes"], ["Data", "dataNodes"], ["Custom", "customNodes"],
].map(([name, variable]) => ({ name, nodes: literal(declaration(carousel.ast, variable)).map(node => ({ ...node, icon: iconImports.get(node.icon) })) }));
if (groups.flatMap(group => group.nodes).some(node => !node.icon)) throw new Error("Unresolved original icon.");
const originalStyles = literal(declaration(workflow.ast, "categories"));
const color = value => {
  const match = value.split(" ").find(token => /^(?:bg|border|text)-\[#[a-f\d]+\]$/i.test(token));
  if (!match) throw new Error(`Missing light-mode color: ${value}`);
  return match.slice(match.indexOf("[") + 1, -1);
};
const categories = [...new Set(groups.flatMap(group => group.nodes.map(node => node.category)))];
const palette = Object.fromEntries(categories.map(category => {
  const style = originalStyles[category];
  return [category, { edge: color(style.actualBorder), inset: color(style.border), face: color(style.color), ink: color(style.iconColor) }];
}));
await writeFile(path.join(root, "app/bytespace-node-catalog.json"), JSON.stringify({ groups, palette }, null, 2) + "\n");

function stillVersion(source, filename) {
  const ast = parse(source, filename);
  const animationProps = new Set(["animate", "initial", "variants", "transition", "whileHover", "whileTap"]);
  const transformed = ts.transform(ast, [context => {
    const visit = node => {
      if (ts.isExpressionStatement(node) && ts.isCallExpression(node.expression) && node.expression.expression.getText(ast) === "useEffect" && node.getText(ast).includes("setInterval")) return undefined;
      if (ts.isJsxAttribute(node) && animationProps.has(node.name.text)) return undefined;
      if (ts.isPropertyAccessExpression(node) && node.expression.getText(ast) === "motion") return ts.factory.createIdentifier(node.name.text);
      if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(ast) === "animate") return ts.factory.createJsxFragment(ts.factory.createJsxOpeningFragment(), [], ts.factory.createJsxJsxClosingFragment());
      return ts.visitEachChild(node, visit, context);
    };
    return node => ts.visitNode(node, visit);
  }]);
  const result = ts.createPrinter().printFile(transformed.transformed[0]);
  transformed.dispose();
  return result;
}

await mkdir(output, { recursive: true });
await build({
  entryPoints: [path.join(support, "entry.jsx")],
  outfile: path.join(output, "icons.js"), bundle: true, minify: true,
  platform: "browser", format: "iife", jsx: "automatic", target: ["es2020"],
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{ name: "original-cmd0-plan-icons", setup(build) {
    build.onResolve({ filter: /^(original|still)-shape:/ }, ({ path: name }) => ({ path: name, namespace: "shape" }));
    build.onResolve({ filter: /^next-themes$/ }, () => ({ path: "light-theme", namespace: "adapter" }));
    build.onResolve({ filter: /.*/ }, ({ path: name, importer }) => {
      if (importer.includes("node_modules") && !/^react(?:-dom)?(?:\/|$)/.test(name)) return;
      if (!name.startsWith(".") && !path.isAbsolute(name)) return { path: require.resolve(name) };
    });
    build.onLoad({ filter: /.*/, namespace: "adapter" }, () => ({ contents: "export const useTheme = () => ({theme:'light',resolvedTheme:'light'});", loader: "js" }));
    build.onLoad({ filter: /.*/, namespace: "shape" }, async ({ path: name }) => {
      const [variant, shape] = name.split(":");
      if (!["LaptopShape", "DiamondShape", "CrystalTower"].includes(shape)) throw new Error(`Unknown shape: ${shape}`);
      const filename = `components/payments/${shape}.tsx`;
      const { source } = await original(filename);
      return { contents: variant === "still-shape" ? stillVersion(source, filename) : source, loader: "tsx", resolveDir: app };
    });
  } }],
});
for (const file of ["index.html", "icons.css"]) await copyFile(path.join(support, file), path.join(output, file));
await writeFile(path.join(output, "provenance.json"), JSON.stringify({
  repository: "https://github.com/FindKar1/portfolio-sites",
  revision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: archive, encoding: "utf8" }).trim(),
  sourceFiles: [...inputs].sort(([a], [b]) => a.localeCompare(b)).map(([filename, source]) => ({ path: path.relative(archive, filename), sha256: hash(source) })),
  adaptations: [
    "Original LaptopShape, DiamondShape and CrystalTower animation code, forced to light mode, without payment cards or services",
    "Unframed responsive row of three; host visibility and pause controls mount still SVG variants to stop all animation work",
    "Still variants preserve original paths and gradients, removing motion props, SMIL animation and tower beam intervals",
    "All 41 action entries and Lucide icon identities extracted from NodeCarousel without marketing overview slides",
    "Original WorkflowNode light palette, including its pale-blue Data category; compact named contact sheet with a twelve-node mobile preview",
  ],
}, null, 2) + "\n");
console.log(`Built original plan icons and ${groups.reduce((total, group) => total + group.nodes.length, 0)} builder nodes.`);
