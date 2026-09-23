import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../lib/bytespace-flickering-grid.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

function setup() {
  const frames = new Map();
  let id = 0;
  let seed = 17;
  let disconnected = false;
  let resize;
  let rect = { width: 200, height: 100 };
  const pixels = [];
  const context = {
    clearRect() { pixels.length = 0; },
    fillRect(...bounds) { pixels.push({ color: this.fillStyle, bounds }); },
  };
  const canvas = { getContext: () => context, getBoundingClientRect: () => rect };
  const exported = {};
  new Function("exports", "ResizeObserver", "requestAnimationFrame", "cancelAnimationFrame", "window", "Math", compiled)(
    exported,
    class { constructor(callback) { resize = callback; } observe() {} disconnect() { disconnected = true; } },
    callback => { frames.set(++id, callback); return id; },
    key => frames.delete(key),
    { devicePixelRatio: 2 },
    { ...Object.fromEntries(["ceil", "round", "min"].map(name => [name, Math[name]])), random: () => ((seed = (seed * 16807) % 2147483647) / 2147483647) },
  );
  const grid = exported.createFlickeringGrid(canvas);
  return {
    ...exported, grid, canvas, pixels, frames,
    disconnected: () => disconnected,
    resize: dimensions => { rect = dimensions; resize(); },
    tick: time => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(time)); },
  };
}

test("grid preserves original signup settings and fits the monitor at device pixel resolution", () => {
  const state = setup();
  assert.deepEqual(state.flickeringGridSettings, { squareSize: 4, gridGap: 1, flickerChance: 0.3, maxOpacity: 0.2 });
  assert.equal(state.canvas.width, 400);
  assert.equal(state.canvas.height, 200);
  assert.equal(state.pixels.length, 800);
  assert.deepEqual(state.pixels[0].bounds, [0, 0, 8, 8]);
  assert.ok(state.pixels.every(pixel => /^rgba\(255, 255, 255, 0\./.test(pixel.color)));
  assert.equal(state.frames.size, 0, "Grid starts paused");
  state.resize({ width: 150, height: 75 });
  assert.equal(state.canvas.width, 300);
  assert.equal(state.canvas.height, 150);
  assert.equal(state.pixels.length, 450);
  state.grid.destroy();
});

test("grid flickers only while active, resumes without a time jump, and releases observers and frames", () => {
  const state = setup();
  const initial = structuredClone(state.pixels);
  state.grid.setRunning(true);
  state.grid.setRunning(true);
  assert.equal(state.frames.size, 1, "Repeated starts cannot create multiple frame loops");
  state.tick(100);
  assert.deepEqual(state.pixels, initial, "First frame cannot jump from a zero timestamp");
  state.tick(200);
  assert.notDeepEqual(state.pixels, initial);
  state.grid.setRunning(false);
  assert.equal(state.frames.size, 0);
  const paused = structuredClone(state.pixels);
  state.tick(10000);
  assert.deepEqual(state.pixels, paused);
  state.grid.setRunning(true);
  state.tick(20000);
  assert.deepEqual(state.pixels, paused, "Resuming must not accumulate offscreen time");
  state.grid.destroy();
  assert.equal(state.disconnected(), true);
  assert.equal(state.frames.size, 0);
  state.grid.setRunning(true);
  state.resize({ width: 50, height: 25 });
  assert.equal(state.frames.size, 0);
  assert.equal(state.canvas.width, 400);
});

test("missing canvas support does not prevent the welcome from completing", () => {
  const { createFlickeringGrid } = setup();
  assert.equal(createFlickeringGrid({ getContext: () => null }), undefined);
});
