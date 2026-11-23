import {
  StrictMode,
  Suspense,
  lazy,
  type MouseEvent,
  useEffect,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { ArrowLeft, ArrowUpRight, Calendar, Clock } from "lucide-react";
import { CommandMenu } from "./components/CommandMenu";
import { BlogSection } from "./components/sections/BlogSection";
import { Icon } from "./components/ui/Icon";
import { LiveClock } from "./components/ui/LiveClock";
import { blogEditorial } from "./data/blog-editorial";
import { blogs, profile } from "./data/portfolio";
import { scrollIntoBlog } from "./lib/blog-scroll";
import "./styles/shadcn.css";
import "./styles/global.css";
import "./styles/blog.css";

const ResumeDialog = lazy(() =>
  import("./components/ResumeDialog").then(({ ResumeDialog }) => ({
    default: ResumeDialog,
  })),
);

const bodies = import.meta.glob<string>("./data/blogs/*.html", {
  eager: true,
  query: "?raw",
  import: "default",
});
const path = window.location.pathname.replace(/\/(?:index\.html)?$/, "");
const post = blogs.find((blog) => blog.url === `${path}/`);
const slug = path.split("/").at(-1);
const body = bodies[`./data/blogs/${slug}.html`];
const editorial = slug ? blogEditorial[slug] : undefined;
const headings = body
  ? Array.from(
      new DOMParser()
        .parseFromString(body, "text/html")
        .querySelectorAll("h2[id]"),
    )
  : [];

const referrer = document.referrer ? new URL(document.referrer) : undefined;
const localReferrer =
  referrer?.origin === location.origin ? referrer.pathname : "";
const fromPortfolio = post && ["/", "/index.html"].includes(localReferrer);
const fromBlogList =
  post && ["/blogs", "/blogs/", "/blogs/index.html"].includes(localReferrer);
const backToPortfolio = !post || fromPortfolio;
const backHref = backToPortfolio ? "/#blogs" : profile.blogUrl;
const backLabel = backToPortfolio ? "Back to portfolio" : "Back to all blogs";

function isRegularClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

function returnToSource(event: MouseEvent<HTMLAnchorElement>) {
  if (
    (fromPortfolio || fromBlogList) &&
    history.length > 1 &&
    isRegularClick(event)
  ) {
    event.preventDefault();
    history.back();
  }
}

function jumpToHeading(event: MouseEvent<HTMLAnchorElement>, id: string) {
  const heading = document.getElementById(id);
  if (!heading || !isRegularClick(event)) return;
  event.preventDefault();
  history.replaceState(history.state, "", event.currentTarget.hash);
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  heading.scrollIntoView();
}

function BlogPage() {
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

  const toggleTheme = () => setLight((value) => !value);

  return (
    <div className="portfolio-shell blog-shell" data-accent={editorial?.accent}>
      <main className="portfolio-column blog-column">
        <div className="blog-dot-banner full-divider">
          <LiveClock />
        </div>
        <header className="blog-page-header full-divider">
          <a
            className="framed-button"
            href={backHref}
            aria-label={backLabel}
            onClick={returnToSource}
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </a>
          <div className="blog-page-label">
            {post ? <strong>Blog</strong> : <h1>Blog</h1>}
            {post && <p>Blogs/{slug}</p>}
          </div>
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

        {post ? (
          <article>
            <header className="blog-post-header full-divider">
              <div className="blog-post-tags">
                {post.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <h1>{post.title}</h1>
              <p>{post.description}</p>
              <div className="blog-post-meta">
                <span>Naren</span>
                <span>
                  <Calendar size={14} aria-hidden="true" />
                  {post.date}
                </span>
                <span>
                  <Clock size={14} aria-hidden="true" />
                  {post.readingTime}
                </span>
              </div>
            </header>
            {editorial && (
              <img
                className="blog-cover"
                src={editorial.cover}
                alt={editorial.coverAlt}
                width={1280}
                height={720}
                fetchPriority="high"
              />
            )}
            {headings.length > 0 && (
              <details className="blog-outline">
                <summary>On this page</summary>
                <ul>
                  {headings.map(({ id, textContent }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        onClick={(event) => jumpToHeading(event, id)}
                      >
                        {textContent}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}
            {/* Article fragments are checked-in markup from Naren's published posts. */}
            <div
              className="blog-post-body full-divider"
              dangerouslySetInnerHTML={{ __html: body }}
            />
            {editorial && (
              <section
                className="blog-resources full-divider"
                aria-labelledby="blog-resources-heading"
              >
                <h2 id="blog-resources-heading">Further reading</h2>
                <ul>
                  {editorial.resources.map((resource) => (
                    <li key={resource.url}>
                      <a href={resource.url} target="_blank" rel="noreferrer">
                        <div>
                          <span>{resource.source}</span>
                          <h3>{resource.title}</h3>
                          <p>{resource.description}</p>
                        </div>
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <div className="blog-post-footer">
              <a
                className="framed-button"
                href={backHref}
                onClick={returnToSource}
              >
                <ArrowLeft size={14} aria-hidden="true" />
                {backToPortfolio ? backLabel : "All blogs"}
              </a>
            </div>
          </article>
        ) : (
          <BlogSection showViewAll={false} />
        )}
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

const root = createRoot(document.getElementById("root")!);
flushSync(() => {
  root.render(
    <StrictMode>
      <BlogPage />
    </StrictMode>,
  );
});
if (post) scrollIntoBlog();
