export type SubscribeResult =
  // Subscribed straight away.
  | "subscribed"
  // A confirmation email was sent; the address is added once it is confirmed.
  | "pending"
  // The subscription endpoint is not live yet.
  | "unavailable"
  | "invalid"
  | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string) {
  return email.length <= 254 && emailPattern.test(email);
}

/**
 * Sends a blog subscription request. The backend (`/api/blog-subscribe`) is
 * added separately; until it exists the request 404s and this resolves to
 * "unavailable" so the dialog can say so instead of failing silently.
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
      signal: AbortSignal.timeout(8000),
    });
    if (response.status === 404 || response.status === 405) {
      return "unavailable";
    }
    if (response.status === 400 || response.status === 422) return "invalid";
    if (!response.ok) return "error";
    const data: { status?: string } = await response.json().catch(() => ({}));
    return data.status === "pending" ? "pending" : "subscribed";
  } catch {
    return "error";
  }
}
