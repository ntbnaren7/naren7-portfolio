import { StrictMode, type MouseEvent, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  Clock,
} from "lucide-react";
import { PortfolioSubpage } from "./components/PortfolioSubpage";
import { VercelTelemetry } from "./components/VercelTelemetry";
import { BlogSection } from "./components/sections/BlogSection";
import { BlogLikeButton } from "./components/ui/BlogLikeButton";
import { blogEditorial } from "./data/blog-editorial";
import { blogs, profile } from "./data/portfolio";
import { useBlogLikes } from "./hooks/useBlogLikes";
import { blogReturnUrl, scrollIntoBlog } from "./lib/blog-scroll";

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
const backToPortfolio = !post || fromPortfolio;
const backHref = backToPortfolio ? blogReturnUrl : profile.blogUrl;
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
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [savingLike, setSavingLike] = useState(false);
  const [likeSaveFailed, setLikeSaveFailed] = useState(false);
  const { likes, failed: likesFailed, setLiked } = useBlogLikes(Boolean(post));
  const postLikes = post && likes[post.slug];
  const likeStatus = likesFailed
    ? "Likes unavailable"
    : likeSaveFailed
      ? "Could not save. Try again."
      : "";
  async function toggleLike() {
    if (!post || !postLikes || savingLike) return;
    setSavingLike(true);
    setLikeSaveFailed(false);
    try {
      await setLiked(post.slug, !postLikes.liked);
    } catch {
      setLikeSaveFailed(true);
    } finally {
      setSavingLike(false);
    }
  }

  const likeButton = (
    <BlogLikeButton
      post={postLikes}
      disabled={!postLikes || savingLike}
      onToggle={toggleLike}
    />
  );

  return (
    <PortfolioSubpage
      label={
        post ? (
          <>
            <strong>Blog</strong>
            <p>Blogs/{slug}</p>
          </>
        ) : (
          <h1>Blog</h1>
        )
      }
      backHref={backHref}
      backLabel={backLabel}
      accent={editorial?.accent}
      layout={editorial?.layout}
    >
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
              <div className="blog-like-action">
                {likeButton}
                <span className="blog-like-status" role="status">
                  {likeStatus}
                </span>
              </div>
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
              tabIndex={0}
            />
          )}
          {headings.length > 0 && (
            <nav className="blog-outline" aria-label="On this page">
              <button
                type="button"
                className="blog-outline-toggle"
                aria-controls="blog-outline-links"
                aria-expanded={outlineOpen}
                onClick={() => setOutlineOpen((open) => !open)}
              >
                <ChevronDown size={14} aria-hidden="true" />
                On this page
              </button>
              <div
                id="blog-outline-links"
                className="blog-outline-panel"
                inert={!outlineOpen}
              >
                <div>
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
                </div>
              </div>
            </nav>
          )}
          {/* Article fragments are checked-in markup from Naren's published posts. */}
          <div
            className="blog-post-body full-divider"
            dangerouslySetInnerHTML={{ __html: body }}
          />
          {editorial && editorial.resources.length > 0 && (
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
            <a className="framed-button" href={backHref}>
              <ArrowLeft size={14} aria-hidden="true" />
              {backToPortfolio ? backLabel : "All blogs"}
            </a>
            <div className="blog-like-action">
              {likeButton}
              {likeStatus && (
                <span className="blog-like-status" aria-hidden="true">
                  {likeStatus}
                </span>
              )}
            </div>
          </div>
        </article>
      ) : (
        <BlogSection showViewAll={false} />
      )}
    </PortfolioSubpage>
  );
}

const root = createRoot(document.getElementById("root")!);
flushSync(() => {
  root.render(
    <StrictMode>
      <BlogPage />
      <VercelTelemetry />
    </StrictMode>,
  );
});
if (post) scrollIntoBlog();
