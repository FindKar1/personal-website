import assert from "node:assert/strict";
import test from "node:test";
import { getProfileLocation, legacyProfileDestination, profileTabs } from "../app/profile-navigation.ts";

test("five canonical pages, with Notes as the Notebook default", () => {
  assert.deepEqual(profileTabs, ["about", "systems", "product", "archive", "notebook"]);
  for (const tab of profileTabs) assert.deepEqual(getProfileLocation(tab), { tab, view: "notes" });
  assert.deepEqual(getProfileLocation("notebook", "reading"), { tab: "notebook", view: "reading" });
  assert.deepEqual(getProfileLocation("notebook", "invalid"), { tab: "notebook", view: "notes" });
});

test("legacy pages select the right content before hydration", () => {
  assert.deepEqual(getProfileLocation("documents"), { tab: "systems", view: "notes" });
  assert.deepEqual(getProfileLocation("reading"), { tab: "notebook", view: "reading" });
  assert.deepEqual(getProfileLocation("notes", "reading"), { tab: "notebook", view: "notes" });
});

test("missing, unknown, and repeated query values are safe", () => {
  assert.equal(getProfileLocation().tab, "about");
  assert.equal(getProfileLocation("unknown").tab, "about");
  assert.deepEqual(getProfileLocation(["notebook", "systems"], ["reading", "notes"]), { tab: "notebook", view: "reading" });
});

test("old document anchors follow their content to the correct collection", () => {
  for (const hash of ["", "#business-systems", "#workflow-planning", "#ai-architecture", "#full-documents"]) {
    assert.equal(legacyProfileDestination("documents", hash), `/?tab=systems${hash}`);
  }
  for (const hash of ["#complete-designs", "#product-design", "#product-demo"]) {
    assert.equal(legacyProfileDestination("documents", hash), `/?tab=product${hash}`);
  }
  assert.equal(legacyProfileDestination("archive", "#product-demo"), "/?tab=product#product-demo");
});

test("Notebook aliases are bookmarkable and canonical pages do not redirect", () => {
  assert.equal(legacyProfileDestination("notes", ""), "/?tab=notebook&view=notes");
  assert.equal(legacyProfileDestination("reading", "#profile"), "/?tab=notebook&view=reading#profile");
  for (const tab of profileTabs) assert.equal(legacyProfileDestination(tab, "#profile"), null);
});
