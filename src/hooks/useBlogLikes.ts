import { useEffect, useState } from "react";

type BlogLikes = Record<string, { count: number; liked: boolean }>;

let pendingRead: Promise<BlogLikes> | undefined;

async function requestLikes(options?: RequestInit): Promise<BlogLikes> {
  const response = await fetch("/api/blog-likes", {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
    ...options,
  });
  if (!response.ok) throw new Error("Blog likes unavailable");
  return response.json();
}

export function useBlogLikes(enabled = true) {
  const [likes, setLikes] = useState<BlogLikes>({});
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    function load() {
      pendingRead ??= requestLikes().finally(() => {
        pendingRead = undefined;
      });
      void pendingRead.then(
        (result) => {
          if (active) {
            setLikes(result);
            setFailed(false);
          }
        },
        () => {
          if (active) setFailed(true);
        },
      );
    }

    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) load();
    }

    load();
    window.addEventListener("pageshow", onPageShow);
    return () => {
      active = false;
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [enabled]);

  async function setLiked(slug: string, liked: boolean) {
    const result = await requestLikes({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, liked }),
    });
    setLikes(result);
  }

  return { likes, failed, setLiked };
}
