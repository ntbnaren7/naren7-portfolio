type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

/**
 * Applies a theme change as one GPU-composited crossfade.
 *
 * The View Transitions API snapshots the page, applies `update` with every
 * CSS transition switched off (so nothing repaints frame by frame), then
 * fades the old snapshot into the new one. Browsers without the API, and
 * visitors who prefer reduced motion, get an instant switch instead.
 */
export function transitionTheme(update: () => void) {
  const root = document.documentElement;
  const doc = document as ViewTransitionDocument;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  root.classList.add("theme-switching");
  const done = () => root.classList.remove("theme-switching");

  if (reducedMotion || !doc.startViewTransition) {
    update();
    // Let the new colours paint before transitions are re-enabled.
    requestAnimationFrame(() => requestAnimationFrame(done));
    return;
  }

  doc.startViewTransition(update).finished.finally(done);
}
