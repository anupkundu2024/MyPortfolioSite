/**
 * Runs `callback` once the browser has painted and is idle, so non-critical work
 * (Three.js, below-the-fold sections, the CV modal) never competes with the
 * first render. Falls back to a short timeout where requestIdleCallback is
 * missing (Safari). Returns a cancel function, usable as a useEffect cleanup.
 */
export function whenIdle(callback, { timeout = 1500 } = {}) {
  if (typeof window === "undefined") return () => {};

  let idleId;
  let timerId;

  // Wait for the next frame first so the current render is actually painted.
  const frameId = requestAnimationFrame(() => {
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(callback, { timeout });
    } else {
      timerId = window.setTimeout(callback, 200);
    }
  });

  return () => {
    cancelAnimationFrame(frameId);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timerId !== undefined) window.clearTimeout(timerId);
  };
}
