import { timeoutSignal } from "./timeout-signal";

export type SubscribeResult =
  // Subscribed straight away.
  | "subscribed"
  // A confirmation email was sent; the address is added once it is confirmed.
  | "pending"
  // The subscription endpoint is not live yet.
  | "unavailable"
  | "invalid"
  // Too many sign-ups in a short time; try again later.
  | "busy"
  | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string) {
  return email.length <= 254 && emailPattern.test(email);
}

/**
 * Sends a blog subscription request to `/api/blog-subscribe`, which emails a
 * confirmation link. "unavailable" covers the endpoint being missing or not
 * configured (for example under `npm run dev`, which doesn't serve `/api`).
 *
 * `website` is a honeypot field that real visitors never see or fill in.
 */
export async function subscribeToBlogs(
  email: string,
  website = "",
): Promise<SubscribeResult> {
  if (!isValidEmail(email)) return "invalid";
  try {
    const response = await fetch("/api/blog-subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, website }),
      signal: timeoutSignal(8000),
    });
    if ([404, 405, 503].includes(response.status)) {
      return "unavailable";
    }
    if (response.status === 400 || response.status === 422) return "invalid";
    if (response.status === 429) return "busy";
    if (!response.ok) return "error";
    const data: { status?: string } = await response.json().catch(() => ({}));
    return data.status === "pending" ? "pending" : "subscribed";
  } catch {
    return "error";
  }
}
