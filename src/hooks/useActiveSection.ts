import { useEffect, useState } from "react";
import { sections } from "../data/portfolio";

// Sections scroll to 96px below the top (`.portfolio-section` scroll-margin),
// so a section counts as current once its top passes just below that line.
const activeLine = 120;

// A section picked from the index or command menu stays highlighted while the
// page scrolls to it, even if a short section shares the screen with the next
// one. It is released as soon as the visitor scrolls on their own.
let pinned: string | null = null;
const pinListeners = new Set<() => void>();

export function pinActiveSection(id: string) {
  pinned = id;
  pinListeners.forEach((listener) => listener());
}

const scrollKeys = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

function currentSection() {
  const atBottom =
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 2;
  const limit = atBottom ? window.innerHeight : activeLine;
  let current = "";
  for (const { id } of sections) {
    const top = document.getElementById(id)?.getBoundingClientRect().top;
    if (top !== undefined && top <= limit) current = id;
  }
  return current;
}

export function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    let scheduled = false;
    const update = () => {
      setActive(pinned ?? currentSection());
      scheduled = false;
    };
    const onScroll = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(update);
      }
    };
    const release = () => {
      if (pinned === null) return;
      pinned = null;
      onScroll();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (scrollKeys.has(event.key)) release();
    };

    update();
    pinListeners.add(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchmove", release, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      pinListeners.delete(update);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchmove", release);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  return active;
}
