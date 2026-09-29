export type HeaderScrollState = {
  y: number;
  direction: -1 | 0 | 1;
  distance: number;
  hidden: boolean;
};

export function updateHeaderScroll(
  state: HeaderScrollState,
  scrollY: number,
  maxScroll: number,
  topBoundary: number,
  interacting = false,
): HeaderScrollState {
  // Clamp elastic overscroll so bouncing at either end cannot reveal the header.
  const y = Math.max(0, Math.min(scrollY, Math.max(0, maxScroll)));
  if (y <= topBoundary || interacting) {
    return { y, direction: 0, distance: 0, hidden: false };
  }
  const delta = y - state.y;
  if (delta === 0) return state;
  const direction = delta > 0 ? 1 : -1;
  const distance = direction === state.direction ? state.distance + Math.abs(delta) : Math.abs(delta);
  const hidden = direction === 1 && distance >= 24 ? true
    : direction === -1 && distance >= 32 ? false : state.hidden;
  return { y, direction, distance, hidden };
}
