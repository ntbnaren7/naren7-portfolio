/**
 * An AbortSignal that aborts after `ms`, or as soon as `linked` aborts.
 *
 * Same idea as `AbortSignal.timeout()` / `AbortSignal.any()`, but built on a
 * plain AbortController so it also works in older Safari (iOS 15 and earlier
 * lack `timeout`, and `any` only arrived in Safari 17.4).
 */
export function timeoutSignal(ms: number, linked?: AbortSignal): AbortSignal {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  const stop = () => {
    clearTimeout(timer);
    controller.abort();
  };
  if (linked?.aborted) stop();
  else linked?.addEventListener("abort", stop, { once: true });
  return controller.signal;
}
