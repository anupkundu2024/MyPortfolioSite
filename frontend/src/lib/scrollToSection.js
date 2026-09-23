const NAV_OFFSET = 70;
const MAX_WAIT_FRAMES = 120; // ~2s at 60fps

/**
 * Smooth-scrolls to the first element found for `ids`, offset for the fixed
 * navbar. Below-the-fold sections mount a moment after the hero, so if the
 * target is not in the DOM yet (a very early click), wait for it briefly
 * instead of silently ignoring the click.
 */
export function scrollToSection(...ids) {
  let frames = 0;

  const attempt = () => {
    const element = ids.map((id) => document.getElementById(id)).find(Boolean);

    if (element) {
      const offsetPosition =
        element.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      return;
    }

    if (frames++ < MAX_WAIT_FRAMES) requestAnimationFrame(attempt);
  };

  attempt();
}
