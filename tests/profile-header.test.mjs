import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { updateHeaderScroll } from "../components/profile-header-scroll.ts";

const initial = { y: 500, direction: 0, distance: 0, hidden: false };
const scroll = (state, y, interacting = false) => updateHeaderScroll(state, y, 2000, 120, interacting);

test("header hides after deliberate downward travel and reveals after 32px upward", () => {
  let state = scroll(initial, 512);
  assert.equal(state.hidden, false);
  state = scroll(state, 524);
  assert.equal(state.hidden, true);
  state = scroll(state, 504);
  assert.equal(state.hidden, true);
  state = scroll(state, 492);
  assert.equal(state.hidden, false);
});

test("small reversals reset accumulated travel instead of flickering", () => {
  let state = { ...initial, hidden: true };
  for (const y of [496, 501, 490, 495, 480, 486]) state = scroll(state, y);
  assert.equal(state.hidden, true);
  state = scroll(state, 454);
  assert.equal(state.hidden, false);
});

test("the top of the page and interaction keep the header visible", () => {
  const hidden = { ...initial, hidden: true };
  assert.equal(scroll(hidden, 110).hidden, false);
  assert.equal(scroll(hidden, 900, true).hidden, false);
  assert.equal(scroll(scroll(hidden, 900, true), 910).hidden, false);
});

test("elastic scrolling at either end does not create a false direction change", () => {
  let state = { y: 2000, direction: 1, distance: 200, hidden: true };
  state = scroll(state, 2140);
  assert.equal(state.y, 2000);
  state = scroll(state, 2000);
  assert.equal(state.hidden, true);
  assert.equal(scroll(initial, -100).y, 0);
  assert.equal(updateHeaderScroll(initial, 50, -100, 120).y, 0);
});

test("header stays in flow, honors reduced motion, and cleans up scroll observers", async () => {
  const component = await readFile(new URL("../components/ProfileHeader.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../components/ProfileHeader.module.css", import.meta.url), "utf8");
  assert.match(css, /position: sticky/);
  assert.doesNotMatch(css, /position: fixed/);
  assert.match(css, /:focus-within[^}]+transform: translateY\(0\)/);
  assert.match(css, /prefers-reduced-motion: reduce[^]+transition: none/);
  assert.match(component, /addEventListener\("scroll", schedule, \{ passive: true \}\)/);
  assert.match(component, /removeEventListener\("scroll", schedule\)/);
  assert.match(component, /cancelAnimationFrame\(frame\)/);
  assert.match(component, /observer\.disconnect\(\)/);
});

test("shared navigation appears once and the next-page link follows all content", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.equal(page.match(/aria-label="Main navigation"/g)?.length, 1);
  assert.equal(page.match(/aria-label="Continue exploring"/g)?.length, 1);
  assert.match(page, /<ProfileHeader key=\{activeTab\}>/);
  assert.ok(page.indexOf('aria-label="Continue exploring"') > page.indexOf('<ProductDesign>'));
  assert.match(page, /href=\{`\/\?tab=\$\{nextTab\}`\}/);
  assert.match(page, /"Back to About"/);
});
