export function createPreviewController(video, { hoverOnly = false, continuous = false, resetOnLeave = false, onChange = () => {} } = {}) {
  let enabled = false;
  let visible = false;
  let hovered = false;
  let focused = false;
  let manual = false;
  let introduced = hoverOnly;
  let active = false;
  let started = false;
  let generation = 0;

  const report = () => onChange({ active, started });
  const sync = () => {
    video.loop = continuous || hovered || focused;
    const next = enabled && visible && (continuous || !introduced || hovered || focused || manual);
    if (next === active) return;
    active = next;
    const request = ++generation;
    report();
    if (!active) { video.pause(); return; }
    video.play().catch(() => {
      if (request !== generation) return;
      active = false;
      report();
    });
  };
  const playing = () => {
    if (!active) { video.pause(); return; }
    started = true;
    report();
  };
  const ended = () => {
    introduced = true;
    manual = false;
    sync();
  };
  const engage = (kind, value) => {
    if (value && (!enabled || !visible)) return;
    const wasEngaged = kind === "hover" ? hovered : focused;
    if (value) {
      introduced = true;
      if (!active) video.currentTime = 0;
    }
    if (kind === "hover") hovered = value;
    else focused = value;
    if (resetOnLeave && wasEngaged && !value && !hovered && !focused && !continuous) {
      manual = false;
      sync();
      video.currentTime = 0;
      started = false;
      report();
      return;
    }
    sync();
  };
  const disengage = () => { hovered = false; focused = false; manual = false; };
  video.addEventListener("playing", playing);
  video.addEventListener("ended", ended);
  return {
    setEnabled(value) { enabled = value; if (!value) disengage(); sync(); },
    setVisible(value) { visible = value; if (!value) disengage(); sync(); },
    hover(value) { engage("hover", value); },
    focus(value) { engage("focus", value); },
    replay() {
      if (!enabled || !visible) return;
      introduced = true;
      manual = true;
      video.currentTime = 0;
      sync();
    },
    destroy() {
      enabled = false;
      disengage();
      sync();
      video.removeEventListener("playing", playing);
      video.removeEventListener("ended", ended);
    },
  };
}
