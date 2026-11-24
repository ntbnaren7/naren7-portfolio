export const blogReturnUrl = "/?return=blogs";

export function scrollIntoBlog() {
  const previous = new URL(document.referrer || location.href);
  const navigation = performance.getEntriesByType("navigation")[0] as
    PerformanceNavigationTiming | undefined;

  if (
    previous.origin !== location.origin ||
    !["/", "/index.html", "/blogs", "/blogs/", "/blogs/index.html"].includes(
      previous.pathname,
    ) ||
    navigation?.type !== "navigate" ||
    location.hash ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "instant",
  });
  animateScroll(() => 0);
}

export function scrollBackToBlogs() {
  const section = document.getElementById("blogs");
  if (!section) return;

  const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
  const target = () =>
    section.getBoundingClientRect().top + window.scrollY - margin;

  // Update the URL without triggering the browser's immediate fragment jump.
  history.replaceState(history.state, "", "/#blogs");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    void document.fonts.ready.then(() => {
      window.scrollTo({ top: target(), behavior: "instant" });
    });
    return;
  }
  animateScroll(target);
}

function animateScroll(target: () => number) {
  const origin = window.scrollY;
  const motion = new AbortController();
  const cancel = () => motion.abort();
  for (const event of [
    "wheel",
    "touchstart",
    "pointerdown",
    "keydown",
    "pagehide",
  ]) {
    window.addEventListener(event, cancel, {
      passive: true,
      signal: motion.signal,
    });
  }

  const duration = 1050;
  requestAnimationFrame((start) => {
    const step = (now: number) => {
      if (motion.signal.aborted) return;
      const progress = Math.min((now - start) / duration, 1);
      const eased = (1 - Math.cos(Math.PI * progress)) / 2;
      window.scrollTo({
        top: origin + (target() - origin) * eased,
        behavior: "instant",
      });
      if (progress < 1) requestAnimationFrame(step);
      else cancel();
    };
    requestAnimationFrame(step);
  });
}
