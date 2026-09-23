import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const sourceRoot = process.argv[2];
if (!sourceRoot) throw new Error("Usage: node scripts/import-bytespace-welcome.mjs /path/to/bytespace");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filename = "src/components/auth/earlyAccess/WelcomeMessage.tsx";
const source = await readFile(path.join(sourceRoot, filename), "utf8");
const backgroundSources = [];
for (const sourcePath of ["src/components/magicui/flickering-grid.tsx", "src/components/auth/earlyAccess/AccessCodeCard.tsx"]) {
  const content = await readFile(path.join(sourceRoot, sourcePath), "utf8");
  backgroundSources.push({ path: sourcePath, sha256: createHash("sha256").update(content).digest("hex") });
}
const parsed = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let patterns;
for (const statement of parsed.statements) {
  if (!ts.isVariableStatement(statement)) continue;
  for (const declaration of statement.declarationList.declarations) {
    if (declaration.name.getText(parsed) === "letterPatterns") patterns = declaration.initializer;
  }
}
if (!patterns || !ts.isObjectLiteralExpression(patterns)) throw new Error("Original letter patterns not found");
const letters = Object.fromEntries(patterns.properties.map(property => {
  if (!ts.isPropertyAssignment(property) || !ts.isArrayLiteralExpression(property.initializer)) throw new Error("Unexpected letter pattern");
  return [property.name.text, property.initializer.elements.map(row => {
    if (!ts.isArrayLiteralExpression(row)) throw new Error("Unexpected pixel row");
    return row.elements.map(pixel => {
      if (!ts.isNumericLiteral(pixel) || !["0", "1"].includes(pixel.text)) throw new Error("Unexpected pixel value");
      return Number(pixel.text);
    });
  })];
}));
await writeFile(path.join(root, "lib/bytespace-welcome-patterns.json"), JSON.stringify({
  source: {
    repository: "https://github.com/elnugget/bytespace",
    revision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: sourceRoot, encoding: "utf8" }).trim(),
    path: filename,
    sha256: createHash("sha256").update(source).digest("hex"),
    backgroundSources,
  },
  letters,
}, null, 2) + "\n");
console.log(`Imported ${Object.keys(letters).length} original pixel-letter patterns.`);
