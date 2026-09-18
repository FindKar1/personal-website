import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, copyFile, access, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

if (process.argv.length < 4) throw new Error("Pass elnugget/bytespace and portfolio-sites checkouts.");
const [sourceRepo, archiveRepo] = process.argv.slice(2).map(value => path.resolve(value));
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const support = path.join(root, "scripts/bytespace-showcase");
const output = path.join(root, "public/showcases/bytespace");
const sourceRoot = path.join(sourceRepo, "src");
const archiveApp = path.join(archiveRepo, "apps/cmd0");
const archiveRequire = createRequire(path.join(archiveApp, "package.json"));
const botRequire = createRequire(path.join(archiveRepo, "apps/bot0/package.json"));
const toolRequire = createRequire(botRequire.resolve("tsx/package.json"));
const extraRequire = createRequire(path.join(support, "package.json"));
const { build } = toolRequire("esbuild");
const ts = archiveRequire("typescript");
const postcss = archiveRequire("postcss");
const tailwind = archiveRequire("tailwindcss");
const inputs = new Map();
const originalStyles = [];
const excludedImports = new Set(["@/lib/supabase/browser", "./ActionCardsGrid", "./QuickWinAgentCards", "./SpacesInstructionCard", "./FloatingSelectionPanel"]);
const adapters = new Set(["next/image", "next/link", "next/navigation", "@/components/sidebar/SidebarProvider", "@/contexts/AgentSelectionContext", "@/components/ui/favicon-image", "sonner"]);

function statements(source, filename) { return ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX); }
function variableName(node) { return ts.isVariableStatement(node) ? node.declarationList.declarations[0].name.getText() : ""; }
function adaptSource(source, filename) {
  const ast = statements(source, filename);
  if (filename.endsWith("AgentGroupsGrid.tsx")) {
    // Preserve the original rendering and animated graphs, excluding the service-backed page.
    const end = ast.statements.findIndex(node => variableName(node) === "CreateSpaceCard");
    const renderer = ast.statements.slice(0, end).filter(node => !(ts.isImportDeclaration(node) && excludedImports.has(node.moduleSpecifier.text)) && !["AGENT_GROUPS", "UNGROUPED_AGENTS"].includes(variableName(node))).map(node => node.getFullText(ast)).join("\n");
    const renderedAst = statements(renderer, filename);
    const transformed = ts.transform(renderedAst, [context => {
      const visit = node => {
        const empty = () => ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent)
          ? ts.factory.createJsxExpression(undefined, ts.factory.createNull())
          : ts.factory.createNull();
        // These controls mutate real accounts; omit them in the archive.
        if (ts.isJsxElement(node) && node.openingElement.tagName.getText(renderedAst) === "button" && ((/<Plus\b/.test(node.getText(renderedAst)) && /Add Agent/.test(node.getText(renderedAst))) || /aria-label="Edit space name"/.test(node.getText(renderedAst)))) return empty();
        if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(renderedAst) === "SpaceOptionsMenu") return empty();
        const isButton = ts.isJsxElement(node) && node.openingElement.tagName.getText(renderedAst) === "button";
        if (isButton && node.children.some(child => ts.isJsxText(child) && child.text.trim() === "Open")) return empty();
        if (variableName(node) === "DataTypeIndicators" || (isButton && node.getText(renderedAst).includes("onOpenSpace?.(group.name)"))) {
          const allowPreview = child => ts.isIfStatement(child) && child.expression.getText(renderedAst) === "disableClicks" ? undefined : ts.visitEachChild(child, allowPreview, context);
          return ts.visitEachChild(node, allowPreview, context);
        }
        return ts.visitEachChild(node, visit, context);
      };
      return node => ts.visitNode(node, visit);
    }]);
    const result = ts.createPrinter().printFile(transformed.transformed[0])
      .replaceAll("repeat(auto-fill, minmax(315px, 1fr))", "repeat(auto-fill, minmax(min(315px, 100%), 1fr))")
      .replaceAll("computedColumns = 3;", "computedColumns = 2;")
      .replaceAll("alert('Table data clicked');", 'window.dispatchEvent(new CustomEvent("showcase-output", { detail: "table" }));')
      .replaceAll("alert('Variable data clicked');", 'window.dispatchEvent(new CustomEvent("showcase-output", { detail: "summary" }));')
      .replaceAll("alert('Fork to Builder clicked');", 'window.dispatchEvent(new CustomEvent("showcase-notice", { detail: "Workflow editing is disconnected in this interface archive." }));');
    transformed.dispose();
    return result;
  }
  if (filename.endsWith("AgentExecutionDemo.tsx")) {
    return source
      .replace(/https:\/\/hebbkx1anhila5yf[^"']+/, "/agent_profiles/Premium/samurai/samurai.png")
      .replace("<style jsx>", "<style>")
      .replace("setVisibleActions(prev => [...prev, DEMO_ACTIONS[actionIndex]]);", "const nextAction = DEMO_ACTIONS[actionIndex]; setVisibleActions(prev => [...prev, nextAction]);")
      .replaceAll("setTimeout(", "schedule(")
      .replace("let timeElapsed = 0;", "const timers = new Set<ReturnType<typeof setTimeout>>(); const schedule = (callback: () => void, delay: number) => { const timer = setTimeout(callback, delay); timers.add(timer); return timer; }; let timeElapsed = 0;")
      .replace("clearTimeout(initialTimeout);", "clearTimeout(initialTimeout); timers.forEach(clearTimeout);");
  }
  if (filename.endsWith("PremiumDashboardLayout.tsx")) {
    return source.replace('className="h-full flex flex-col gap-1 relative min-w-[200px]', 'className="showcase-dashboard h-full flex flex-col gap-1 relative min-w-[200px]');
  }
  if (filename.endsWith("SignInForm.tsx")) {
    const printer = ts.createPrinter();
    const transformed = ts.transform(ast, [context => {
      const visit = node => {
        if (ts.isImportDeclaration(node) && node.moduleSpecifier.text.includes("login/actions")) return undefined;
        if (ts.isJsxElement(node)) {
          const headerClass = node.openingElement.attributes.properties.find(attribute => ts.isJsxAttribute(attribute) && attribute.name.getText(ast) === "className" && ts.isStringLiteral(attribute.initializer) && attribute.initializer.text === "flex items-center border-b bg-muted/50 px-4 py-2");
          if (headerClass) {
            const f = ts.factory;
            const attributes = f.createJsxAttributes(node.openingElement.attributes.properties.map(attribute => attribute === headerClass ? f.createJsxAttribute(f.createIdentifier("className"), f.createStringLiteral(`showcase-signin-header ${headerClass.initializer.text}`)) : attribute));
            const portrait = f.createJsxSelfClosingElement(f.createIdentifier("img"), undefined, f.createJsxAttributes([
              f.createJsxAttribute(f.createIdentifier("src"), f.createStringLiteral("/showcases/bytespace/assets/agent_profiles/Premium/einstein/einstein-fb.png")),
              f.createJsxAttribute(f.createIdentifier("alt"), f.createStringLiteral("Einstein agent")),
            ]));
            return f.updateJsxElement(node, f.updateJsxOpeningElement(node.openingElement, node.openingElement.tagName, node.openingElement.typeArguments, attributes), [...node.children, portrait], node.closingElement);
          }
        }
        if (ts.isFunctionDeclaration(node) && node.name?.text === "onSubmit") {
          const f = ts.factory;
          return f.updateFunctionDeclaration(node, node.modifiers, node.asteriskToken, node.name, undefined, [], undefined,
            f.createBlock([f.createExpressionStatement(f.createCallExpression(f.createPropertyAccessExpression(f.createIdentifier("window"), "dispatchEvent"), undefined, [f.createNewExpression(f.createIdentifier("CustomEvent"), undefined, [f.createStringLiteral("showcase-enter")])]))], true));
        }
        return ts.visitEachChild(node, visit, context);
      };
      return node => ts.visitNode(node, visit);
    }]);
    const result = printer.printFile(transformed.transformed[0])
      .replace('password: ""', 'password: "preview-only"')
      .replace('type="password"', 'type="password" readOnly autoComplete="off"')
      .replace('type="submit"', 'type="button" onClick={() => onSubmit()}')
      .replace("'Execute'", "'Enter preview'");
    transformed.dispose();
    return result;
  }
  return source;
}

await mkdir(output, { recursive: true });
const entry = await readFile(path.join(support, "entry.jsx"), "utf8");
const result = await build({
  stdin: { contents: entry, resolveDir: support, loader: "jsx" },
  outfile: path.join(output, "demo.js"), bundle: true, minify: true, metafile: true,
  platform: "browser", format: "iife", jsx: "automatic", target: ["es2020"],
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{ name: "archived-interface", setup(build) {
    build.onResolve({ filter: /.*/ }, ({ path: name, importer }) => {
      if (adapters.has(name)) return { path: name, namespace: "adapter" };
      if (name === "showcase-fixtures") return { path: name, namespace: "fixture" };
      if (name.startsWith("@/")) return { path: path.join(sourceRoot, name.slice(2)), namespace: "source-resolution" };
      if (importer.includes("node_modules") && !/^react(?:-dom)?(?:\/|$)/.test(name)) return;
      if (!name.startsWith(".") && !path.isAbsolute(name)) {
        try { return { path: archiveRequire.resolve(name) }; }
        catch { return { path: extraRequire.resolve(name) }; }
      }
      // Let esbuild resolve relative modules normally.
      if (importer?.startsWith(sourceRoot) && name.endsWith(".css")) return { path: path.resolve(path.dirname(importer), name) };
    });
    build.onLoad({ filter: /.*/, namespace: "source-resolution" }, async ({ path: base }) => {
      for (const extension of ["", ".tsx", ".ts", "/index.tsx", "/index.ts"]) {
        const filename = base + extension;
        try {
          const original = await readFile(filename, "utf8");
          if (filename.endsWith(".css")) { originalStyles.push(original); return { contents: "", loader: "js" }; }
          const contents = adaptSource(original, filename); inputs.set(filename, contents);
          return { contents, loader: "tsx", resolveDir: path.dirname(filename) };
        } catch (error) { if (!["ENOENT", "EISDIR"].includes(error.code)) throw error; }
      }
      throw new Error(`Missing original module ${base}`);
    });
    build.onLoad({ filter: /\.[jt]sx?$/ }, async ({ path: filename }) => {
      if (!filename.startsWith(sourceRoot)) return;
      const contents = adaptSource(await readFile(filename, "utf8"), filename);
      inputs.set(filename, contents);
      return { contents, loader: "tsx", resolveDir: path.dirname(filename) };
    });
    build.onLoad({ filter: /\.css$/ }, async ({ path: filename }) => {
      originalStyles.push(await readFile(filename, "utf8")); return { contents: "", loader: "js" };
    });
    build.onLoad({ filter: /.*/, namespace: "adapter" }, ({ path: name }) => ({
      contents: name === "next/link" ? `export { Link as default } from ${JSON.stringify(path.join(support, "adapters.jsx"))};` : `export { default } from ${JSON.stringify(path.join(support, "adapters.jsx"))}; export * from ${JSON.stringify(path.join(support, "adapters.jsx"))};`,
      loader: "jsx", resolveDir: support,
    }));
    build.onLoad({ filter: /.*/, namespace: "fixture" }, async () => {
      const filename = path.join(sourceRoot, "components/agents/SpacesInstructionCard.tsx");
      const source = await readFile(filename, "utf8");
      const ast = statements(source, filename);
      const contents = "export " + ast.statements.find(node => variableName(node) === "PREVIEW_SPACES").getText(ast);
      inputs.set(filename, contents); return { contents, loader: "tsx", resolveDir: sourceRoot };
    });
  } }],
});

const colorNames = ["background", "foreground", "border", "input", "ring"];
const colors = Object.fromEntries(colorNames.map(name => [name, `hsl(var(--${name}))`]));
for (const name of ["card", "popover", "primary", "secondary", "muted", "accent", "destructive"]) colors[name] = { DEFAULT: `hsl(var(--${name}))`, foreground: `hsl(var(--${name}-foreground))` };
const css = await postcss([tailwind({
  content: [...inputs.values(), entry, await readFile(path.join(support, "adapters.jsx"), "utf8")].map(raw => ({ raw, extension: "tsx" })),
  darkMode: "class", theme: { extend: { colors } }, plugins: [],
})]).process(originalStyles.join("\n") + "\n" + await readFile(path.join(support, "frame.css"), "utf8"), { from: undefined });
await writeFile(path.join(output, "demo.css"), css.css);
await copyFile(path.join(support, "index.html"), path.join(output, "index.html"));

// Collect local artwork from the original modules. Agent cards also resolve full-body variants at runtime.
const assets = new Set(["/agent_profiles/Premium/einstein/einstein-fb.png", "/fonts/GeneralSans-Variable.woff2"]);
for (const content of [...inputs.values(), entry]) {
  for (const match of content.matchAll(/["'](\/(?:agent_profiles|landing|icons|images)\/[^"']+\.(?:png|webp|svg|jpg))["']/g)) assets.add(match[1]);
}
for (const asset of [...assets]) if (asset.startsWith("/agent_profiles/")) {
  const directory = path.posix.dirname(asset);
  try { for (const filename of await readdir(path.join(archiveApp, "public", directory))) if (/\.(png|webp)$/.test(filename)) assets.add(`${directory}/${filename}`); } catch { /* Report absent files below. */ }
}
const copied = [];
for (const asset of assets) {
  const from = path.join(archiveApp, "public", asset);
  try { await access(from); } catch { console.warn(`Unused/missing archived asset: ${asset}`); continue; }
  const to = path.join(output, "assets", asset);
  await mkdir(path.dirname(to), { recursive: true });
  if (/\.(svg|woff2)$/.test(asset)) await copyFile(from, to);
  else await sharp(from).resize({ width: 440, height: 520, fit: "inside", withoutEnlargement: true }).toFile(to);
  copied.push(asset);
}
await writeFile(path.join(output, "provenance.json"), JSON.stringify({
  repository: "https://github.com/elnugget/bytespace",
  revision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: sourceRepo, encoding: "utf8" }).trim(),
  assetsRepository: "https://github.com/FindKar1/portfolio-sites",
  assetsRevision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: archiveRepo, encoding: "utf8" }).trim(),
  sourceFiles: [...inputs.keys()].map(filename => path.relative(sourceRepo, filename)), assets: copied,
  adaptations: ["Original AgentGroupCard, activity graphs, counters and output previews", "Original preview workspace fixtures only", "Original sign-in form with read-only fixture credentials and local preview action", "Original calendar, execution, context and trigger animations", "Compact execution and trigger layouts, repaired chart height constraints, and sign-in header portrait", "Origin-validated execution replay control in the host heading", "Local image and navigation adapters", "Service-backed page excluded", "External favicons replaced locally", "Network and forms disabled by CSP", "Light theme with six auto-sized studies in the host page's responsive grid"],
}, null, 2) + "\n");
console.log(`Built Bytespace showcase: ${inputs.size} original source files, ${copied.length} local assets, ${Object.keys(result.metafile.inputs).length} modules.`);
