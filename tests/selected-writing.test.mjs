import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Selected Writing leads with The Earth Assumption and preserves the simulations article", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const heading = source.indexOf("Selected Writing");
  assert.ok(heading >= 0);
  const section = source.slice(heading, source.indexOf("</section>", heading));
  const links = [...section.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(links, [
    "https://bytespace.ai/blog/the-earth-assumption",
    "https://www.bytespace.ai/blog/simulations-are-theories-of-what-matters",
  ]);
  assert.match(section, /The Earth Assumption/);
  assert.match(section, /Simulations Are Theories of What Matters/);
});
