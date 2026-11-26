import { useState } from "react";
import { Heart } from "lucide-react";
import { blogs, profile } from "../../data/portfolio";
import { useBlogLikes } from "../../hooks/useBlogLikes";
import { BlogLikeCount } from "../ui/BlogLikeButton";
import { BellIcon } from "../ui/BellIcon";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";
import { BlogSubscribeDialog } from "../BlogSubscribeDialog";

export function BlogSection({ showViewAll = true }: { showViewAll?: boolean }) {
  const { likes } = useBlogLikes();
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const visibleBlogs = showViewAll ? blogs.slice(0, 2) : blogs;

  return (
    <section id="blogs" className="portfolio-section blog-section">
      <SectionHeading>Blogs</SectionHeading>
      {visibleBlogs.map((blog, i) => (
        <a
          className={`blog-row ${i === visibleBlogs.length - 1 ? "full-divider" : "local-divider"}`}
          href={blog.url}
          key={blog.title}
        >
          <div>
            <h3>{blog.title}</h3>
            <div className="blog-meta">
              <span>
                <Icon name="calendar" />
                {blog.date}
              </span>
              <span className="blog-likes">
                <Heart size={13} aria-hidden="true" />
                {likes[blog.slug] && (
                  <span className="sr-only">
                    {likes[blog.slug].count} likes
                  </span>
                )}
                <BlogLikeCount count={likes[blog.slug]?.count} />
              </span>
              <i />
              {blog.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Icon name="arrow-right" size={16} />
        </a>
      ))}
      <div className="view-all-row full-divider blog-actions">
        {showViewAll && (
          <a className="framed-button" href={profile.blogUrl}>
            View All
            <Icon name="arrow-right" size={13} />
          </a>
        )}
        <button
          type="button"
          className="framed-button shine-button"
          onClick={() => setSubscribeOpen(true)}
          aria-haspopup="dialog"
        >
          <span className="shine-button-label">
            <BellIcon size={14} />
            Get notified
          </span>
          <span className="shine-button-border" aria-hidden="true" />
        </button>
      </div>
      <BlogSubscribeDialog
        open={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
      />
    </section>
  );
}
