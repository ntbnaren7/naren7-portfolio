export function scrollIntoBlog() {
  const previous = new URL(document.referrer || location.href);
  const navigation = performance.getEntriesByType("navigation")[0] as
    PerformanceNavigationTiming | undefined;

  if (
    previous.origin !== location.origin ||
    !["/", "/blogs", "/blogs/"].includes(previous.pathname) ||
    navigation?.type !== "navigate" ||
    location.hash ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "instant",
  });
  const bottom = window.scrollY;
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
      const remaining = (1 + Math.cos(Math.PI * progress)) / 2;
      window.scrollTo({ top: bottom * remaining, behavior: "instant" });
      if (progress < 1) requestAnimationFrame(step);
      else cancel();
    };
    requestAnimationFrame(step);
  });
}
