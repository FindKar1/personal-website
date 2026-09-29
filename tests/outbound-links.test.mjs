import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function anchors() {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const file = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const links = [];
  function visit(node) {
    if (ts.isJsxOpeningElement(node) && ["a", "Link"].includes(node.tagName.getText(file))) {
      const attrs = Object.fromEntries(node.attributes.properties.filter(ts.isJsxAttribute).map(attr => [
        attr.name.getText(file),
        attr.initializer && ts.isStringLiteral(attr.initializer) ? attr.initializer.text : null,
      ]));
      links.push(attrs);
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  return links;
}

test("project, writing, and social links preserve the portfolio in its original tab", async () => {
  const external = (await anchors()).filter(link => link.href?.startsWith("https://"));
  assert.equal(external.length, 7);
  for (const link of external) {
    assert.equal(link.target, "_blank", link.href);
    assert.equal(link.rel, "noopener noreferrer", link.href);
    assert.equal(link.title, "Opens in a new tab", link.href);
  }
});

test("internal navigation, section jumps, and email retain their native behavior", async () => {
  const internal = (await anchors()).filter(link => !link.href?.startsWith("https://"));
  assert.ok(internal.some(link => link.href === "#contact"));
  assert.ok(internal.some(link => link.href === "/?tab=systems"));
  for (const link of internal) assert.equal(link.target, undefined, link.href);
});
