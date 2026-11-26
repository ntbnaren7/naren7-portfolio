import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { ArrowLeft } from "lucide-react";
import { CommandMenu } from "./CommandMenu";
import { MobileNav } from "./MobileNav";
import { Icon } from "./ui/Icon";
import { LiveClock } from "./ui/LiveClock";
import { transitionTheme } from "../lib/theme-transition";
import "../styles/shadcn.css";
import "../styles/global.css";
import "../styles/blog.css";
import "../styles/mobile.css";

const ResumeDialog = lazy(() =>
  import("./ResumeDialog").then(({ ResumeDialog }) => ({
    default: ResumeDialog,
  })),
);

export function PortfolioSubpage({
  label,
  backHref,
  backLabel = "Back to portfolio",
  accent,
  layout,
  children,
}: {
  label: ReactNode;
  backHref: string;
  backLabel?: string;
  accent?: string;
  layout?: string;
  children: ReactNode;
}) {
  const [commandsOpen, setCommandsOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [light, setLight] = useState(() => {
    try {
      return localStorage.getItem("portfolio-theme") === "light";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const theme = light ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      /* Theme still works without storage. */
    }
  }, [light]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandsOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextLight = !light;
    transitionTheme(() => {
      document.documentElement.dataset.theme = nextLight ? "light" : "dark";
      flushSync(() => setLight(nextLight));
    });
  };

  return (
    <div
      className="portfolio-shell blog-shell"
      data-accent={accent}
      data-layout={layout}
    >
      <MobileNav light={light} onToggleTheme={toggleTheme} />
      <main className="portfolio-column blog-column">
        <div className="blog-dot-banner full-divider">
          <LiveClock />
        </div>
        <header className="blog-page-header full-divider">
          <a className="framed-button" href={backHref} aria-label={backLabel}>
            <ArrowLeft size={16} aria-hidden="true" />
          </a>
          <div className="blog-page-label">{label}</div>
          <div className="profile-controls">
            <button
              className="command-trigger framed-button"
              type="button"
              onClick={() => setCommandsOpen(true)}
              aria-label="Open command menu"
              aria-keyshortcuts="Meta+K Control+K"
            >
              <span aria-hidden="true">⌘</span> K
            </button>
            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${light ? "dark" : "light"} theme`}
            >
              <Icon name={light ? "moon" : "sun"} size={18} />
            </button>
          </div>
        </header>

        {children}
      </main>
      <CommandMenu
        open={commandsOpen}
        onClose={() => setCommandsOpen(false)}
        onToggleTheme={toggleTheme}
        onOpenResume={() => setResumeOpen(true)}
        sectionBase="/"
      />
      {resumeOpen && (
        <Suspense fallback={null}>
          <ResumeDialog open onClose={() => setResumeOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
