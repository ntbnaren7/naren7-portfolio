import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Check, Loader2, MailCheck, X } from "lucide-react";
import { BellIcon } from "./ui/BellIcon";
import {
  isValidEmail,
  subscribeToBlogs,
  type SubscribeResult,
} from "../lib/blog-subscribe";

type Status = "idle" | "submitting" | SubscribeResult;

const errorMessages: Partial<Record<Status, string>> = {
  invalid: "That doesn’t look like a valid email address.",
  unavailable: "Subscriptions aren’t open just yet. Please check back soon.",
  error: "Something went wrong. Please try again in a moment.",
};

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
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const ids = useId();
  const titleId = `${ids}-title`;
  const noteId = `${ids}-note`;
  const messageId = `${ids}-message`;

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
    if (result === "subscribed" || result === "pending") setEmail("");
  }

  const done = status === "subscribed" || status === "pending";
  const errorMessage = errorMessages[status];

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
      <header className="subscribe-header">
        <span className="subscribe-icon" aria-hidden="true">
          <BellIcon size={17} />
        </span>
        <h2 id={titleId}>Get notified about new blogs</h2>
        <button
          type="button"
          className="subscribe-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </header>

      {done ? (
        <div className="subscribe-done" role="status">
          <span className="subscribe-done-icon" aria-hidden="true">
            {status === "pending" ? (
              <MailCheck size={18} />
            ) : (
              <Check size={18} />
            )}
          </span>
          <p>
            {status === "pending"
              ? "Almost there. Check your inbox and confirm your email to start getting notified."
              : "You’re in. You’ll get an email whenever a new blog goes up."}
          </p>
          <button type="button" className="framed-button" onClick={onClose}>
            Done
          </button>
        </div>
      ) : (
        <form className="subscribe-form" onSubmit={onSubmit} noValidate>
          <p id={noteId} className="subscribe-note">
            Drop your email and I’ll send you a note whenever I publish a new
            blog, with a link straight to it. No spam, no newsletters, nothing
            else. Unsubscribe anytime.
          </p>
          <label className="sr-only" htmlFor={`${ids}-email`}>
            Email address
          </label>
          <div className="subscribe-field">
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
              {status === "submitting" ? "Subscribing…" : "Notify me"}
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
        </form>
      )}
    </dialog>
  );
}
