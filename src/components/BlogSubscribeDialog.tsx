import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Feather,
  Loader2,
  Mail,
  MousePointerClick,
  ShieldCheck,
  X,
} from "lucide-react";
import { BellIcon } from "./ui/BellIcon";
import { blogs, profile } from "../data/portfolio";
import {
  isValidEmail,
  subscribeToBlogs,
  type SubscribeResult,
} from "../lib/blog-subscribe";

type Status = "idle" | "submitting" | SubscribeResult;

const errorMessages: Partial<Record<Status, string>> = {
  invalid: "That doesn’t look like a valid email address.",
  unavailable: "Subscriptions aren’t open just yet. Please check back soon.",
  busy: "Lots of sign-ups right now. Please try again in a bit.",
  error: "Something went wrong. Please try again in a moment.",
};

const perks = [
  { icon: Feather, label: "Only new blogs" },
  { icon: ShieldCheck, label: "Zero spam" },
  { icon: MousePointerClick, label: "1-click unsubscribe" },
];

// A shortcut to the visitor's inbox, filtered to the raven where possible.
function inboxFor(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (domain === "gmail.com" || domain === "googlemail.com") {
    return {
      label: "Open Gmail",
      href: "https://mail.google.com/mail/u/0/#search/from%3Araven%40naren7.me+in%3Aanywhere",
    };
  }
  if (/^(outlook|hotmail|live|msn)\./.test(domain)) {
    return { label: "Open Outlook", href: "https://outlook.live.com/mail/" };
  }
  if (/^(yahoo|ymail)\./.test(domain)) {
    return { label: "Open Yahoo Mail", href: "https://mail.yahoo.com/" };
  }
  if (/^(icloud|me|mac)\.com$/.test(domain)) {
    return { label: "Open iCloud Mail", href: "https://www.icloud.com/mail/" };
  }
  if (domain === "proton.me" || domain === "protonmail.com") {
    return { label: "Open Proton Mail", href: "https://mail.proton.me/" };
  }
  return null;
}

export function BlogSubscribeDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const ids = useId();
  const titleId = `${ids}-title`;
  const noteId = `${ids}-note`;
  const messageId = `${ids}-message`;
  const latest = blogs[0];

  useEffect(() => {
    if (open && !dialog.current?.open) {
      dialog.current?.showModal();
      // showModal focuses the first control (the close button) by default.
      input.current?.focus();
    }
    if (!open) dialog.current?.close();
  }, [open]);

  // Start fresh each time the dialog is reopened after a finished attempt.
  useEffect(() => {
    if (open) {
      setStatus((current) =>
        current === "subscribed" || current === "pending" ? "idle" : current,
      );
    }
  }, [open]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim();
    if (!isValidEmail(address)) {
      setStatus("invalid");
      return;
    }
    setStatus("submitting");
    const result = await subscribeToBlogs(address, website);
    setStatus(result);
    if (result === "subscribed" || result === "pending") {
      setSentTo(address);
      setEmail("");
    }
  }

  const done = status === "subscribed" || status === "pending";
  const errorMessage = errorMessages[status];
  const inbox = done ? inboxFor(sentTo) : null;

  return (
    <dialog
      ref={dialog}
      className="subscribe-dialog"
      aria-labelledby={titleId}
      aria-describedby={noteId}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="subscribe-banner" aria-hidden="true">
        <span className="subscribe-avatar">
          <img src={profile.avatar} alt="" width={56} height={56} />
          <span
            className="subscribe-avatar-badge"
            data-done={done || undefined}
            key={done ? "done" : "idle"}
          >
            {done ? <Mail size={11} /> : <BellIcon size={12} />}
          </span>
        </span>
      </div>
      <button
        type="button"
        className="subscribe-close"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={16} aria-hidden="true" />
      </button>

      <div className="subscribe-body">
        {done ? (
          <div className="subscribe-done" role="status">
            <p className="subscribe-eyebrow">One last step</p>
            <h2 id={titleId}>Check your inbox</h2>
            <p id={noteId} className="subscribe-note">
              The raven just flew a confirmation link to{" "}
              <strong>{sentTo}</strong>. Tap it and you’re in.
            </p>
            <p className="subscribe-hint">
              Not there? Peek in your <strong>Spam</strong> or{" "}
              <strong>Promotions</strong> folder.
            </p>
            <div className="subscribe-done-actions">
              {inbox && (
                <a
                  className="small-button tactile-button tactile-button-primary"
                  href={inbox.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {inbox.label}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
              <button type="button" className="framed-button" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form className="subscribe-form" onSubmit={onSubmit} noValidate>
            <p className="subscribe-eyebrow">
              <span className="subscribe-live-dot" aria-hidden="true" />
              naren7’s raven
            </p>
            <h2 id={titleId}>Never miss a new blog</h2>
            <p id={noteId} className="subscribe-note">
              Every time I publish, a raven lands in your inbox with a link
              straight to it. That’s it. No newsletters, nothing else.
            </p>

            <ul className="subscribe-perks">
              {perks.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Icon size={13} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>

            {latest && (
              <a className="subscribe-latest" href={latest.url}>
                <span className="subscribe-latest-label">Latest drop</span>
                <span className="subscribe-latest-title">{latest.title}</span>
                <span className="subscribe-latest-meta">
                  {latest.date} · {latest.readingTime}
                </span>
                <ArrowUpRight
                  size={14}
                  className="subscribe-latest-arrow"
                  aria-hidden="true"
                />
              </a>
            )}

            <label className="sr-only" htmlFor={`${ids}-email`}>
              Email address
            </label>
            <div
              className="subscribe-field"
              data-invalid={status === "invalid" || undefined}
            >
              <Mail
                size={15}
                className="subscribe-field-icon"
                aria-hidden="true"
              />
              <input
                id={`${ids}-email`}
                type="email"
                name="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                ref={input}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errorMessage) setStatus("idle");
                }}
                aria-invalid={status === "invalid" || undefined}
                aria-describedby={errorMessage ? messageId : undefined}
                disabled={status === "submitting"}
              />
              <button
                type="submit"
                className="small-button tactile-button tactile-button-primary subscribe-submit"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <Loader2
                    size={14}
                    className="subscribe-spinner"
                    aria-hidden="true"
                  />
                ) : (
                  <BellIcon size={14} />
                )}
                {status === "submitting" ? "Sending…" : "Notify me"}
              </button>
            </div>
            {/* Honeypot: hidden from people, often filled in by bots. */}
            <input
              className="subscribe-honeypot"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
            <p
              id={messageId}
              className="subscribe-message"
              role="alert"
              aria-live="polite"
            >
              {errorMessage}
            </p>
            <p className="subscribe-fineprint">
              Your email is only used for this and never shared.
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
