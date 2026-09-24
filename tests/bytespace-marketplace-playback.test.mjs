import assert from "node:assert/strict";
import test from "node:test";
import { createPreviewController } from "../scripts/bytespace-marketplace/preview-controller.mjs";

function fixture(options) {
  const video = Object.assign(new EventTarget(), {
    paused: true, loop: false, currentTime: 0, plays: 0,
    play() { this.paused = false; this.plays++; this.dispatchEvent(new Event("playing")); return Promise.resolve(); },
    pause() { this.paused = true; },
  });
  const controller = createPreviewController(video, options);
  return { video, controller, enter() { controller.setEnabled(true); controller.setVisible(true); }, end() { video.paused = true; video.dispatchEvent(new Event("ended")); } };
}

test("featured previews play once in view, not again on re-entry", () => {
  const { video, controller, enter, end } = fixture();
  controller.setEnabled(true);
  assert.equal(video.plays, 0);
  enter();
  assert.equal(video.paused, false);
  assert.equal(video.loop, false);
  end();
  assert.equal(video.paused, true);
  controller.setVisible(false);
  controller.setVisible(true);
  assert.equal(video.plays, 1);
});

test("hover and keyboard focus replay and loop, then settle", () => {
  const { video, controller, enter, end } = fixture();
  enter(); end();
  video.currentTime = 8;
  controller.hover(true);
  assert.equal(video.currentTime, 0);
  assert.equal(video.loop, true);
  assert.equal(video.paused, false);
  controller.focus(true);
  controller.hover(false);
  assert.equal(video.paused, false);
  controller.focus(false);
  assert.equal(video.paused, true);
  assert.equal(video.loop, false);
});

test("tap replay plays exactly one pass without sticky hover or focus", () => {
  const { video, controller, enter, end } = fixture();
  enter(); end();
  controller.replay();
  assert.equal(video.plays, 2);
  assert.equal(video.loop, false);
  end();
  assert.equal(video.paused, true);
  controller.replay();
  assert.equal(video.plays, 3);
});

test("opted-in previews reset to the opening image on hover leave without reintroducing autoplay", () => {
  let state;
  const { video, controller, enter } = fixture({ resetOnLeave: true, onChange: value => { state = value; } });
  enter();
  controller.hover(true);
  video.currentTime = 3;
  assert.equal(state.started, true);
  controller.hover(false);
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 0);
  assert.equal(video.loop, false);
  assert.equal(state.started, false);
  controller.setVisible(false); controller.setVisible(true);
  assert.equal(video.plays, 1);
  controller.hover(true);
  assert.equal(video.paused, false);
  assert.equal(video.currentTime, 0);
  assert.equal(state.started, true);
});

test("reset waits for both hover and keyboard focus to leave", () => {
  const { video, controller, enter } = fixture({ resetOnLeave: true });
  enter();
  controller.hover(true); controller.focus(true);
  video.currentTime = 3;
  controller.hover(false);
  assert.equal(video.paused, false);
  assert.equal(video.currentTime, 3);
  controller.focus(false);
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 0);
});

test("touch pointer exits do not cancel explicit replay on resettable previews", () => {
  const { video, controller, enter, end } = fixture({ resetOnLeave: true });
  enter(); end();
  controller.replay();
  video.currentTime = 2;
  controller.hover(false); controller.focus(false);
  assert.equal(video.paused, false);
  assert.equal(video.currentTime, 2);
  assert.equal(video.loop, false);
  end();
  assert.equal(video.paused, true);
});

test("continuous previews keep playing after hover and focus leave and resume on re-entry", () => {
  const { video, controller, enter } = fixture({ continuous: true });
  enter();
  assert.equal(video.loop, true);
  assert.equal(video.paused, false);
  controller.hover(true); controller.hover(false);
  controller.focus(true); controller.focus(false);
  assert.equal(video.paused, false);
  assert.equal(video.loop, true);
  assert.equal(video.plays, 1);
  controller.setVisible(false);
  assert.equal(video.paused, true);
  controller.setVisible(true);
  assert.equal(video.paused, false);
  assert.equal(video.plays, 2);
  controller.destroy();
});

test("continuous previews respect manual pause and reduced-motion defaults", () => {
  const { video, controller } = fixture({ continuous: true });
  controller.setVisible(true);
  controller.hover(true); controller.replay();
  assert.equal(video.plays, 0);
  controller.setEnabled(true);
  assert.equal(video.paused, false);
  controller.setEnabled(false);
  controller.hover(true); controller.focus(true); controller.replay();
  assert.equal(video.paused, true);
  assert.equal(video.plays, 1);
  controller.setEnabled(true);
  assert.equal(video.paused, false);
  controller.destroy();
});

test("listing cards never autoplay and stop when offscreen", () => {
  const { video, controller, enter } = fixture({ hoverOnly: true });
  enter();
  assert.equal(video.plays, 0);
  controller.focus(true);
  assert.equal(video.loop, true);
  controller.setVisible(false);
  assert.equal(video.paused, true);
  controller.setVisible(true);
  assert.equal(video.plays, 1);
  assert.equal(video.paused, true);
});

test("an interrupted first pass resumes, while pause blocks all interactions", () => {
  const { video, controller, enter } = fixture();
  enter(); video.currentTime = 2;
  controller.setEnabled(false);
  controller.hover(true); controller.focus(true); controller.replay();
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 2);
  assert.equal(video.loop, false);
  controller.setEnabled(true);
  assert.equal(video.paused, false);
  assert.equal(video.currentTime, 2);
  controller.destroy();
  assert.equal(video.paused, true);
});

test("reduced-motion defaults block automatic and hover playback", () => {
  const { video, controller } = fixture();
  controller.setVisible(true);
  controller.hover(true); controller.focus(true); controller.replay();
  assert.equal(video.plays, 0);
  controller.setEnabled(true);
  assert.equal(video.plays, 1);
});

test("a rejected play request can be retried without an unhandled rejection", async () => {
  const { video, controller, enter } = fixture();
  const play = video.play;
  video.play = () => Promise.reject(new Error("Autoplay blocked"));
  enter();
  await Promise.resolve();
  video.play = play;
  controller.replay();
  assert.equal(video.paused, false);
  controller.destroy();
  video.dispatchEvent(new Event("playing"));
  assert.equal(video.paused, true);
});
