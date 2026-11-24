import { Heart } from "lucide-react";
import { blogs, profile } from "../../data/portfolio";
import { useBlogLikes } from "../../hooks/useBlogLikes";
import { BlogLikeCount } from "../ui/BlogLikeButton";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";
import { ViewAllLink } from "../ui/ViewAllLink";

export function BlogSection({ showViewAll = true }: { showViewAll?: boolean }) {
  const { likes } = useBlogLikes();

  return (
    <section id="blogs" className="portfolio-section blog-section">
      <SectionHeading>Blogs</SectionHeading>
      {blogs.map((blog, i) => (
        <a
          className={`blog-row ${i === blogs.length - 1 ? "full-divider" : "local-divider"}`}
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
      {showViewAll && <ViewAllLink href={profile.blogUrl} external={false} />}
    </section>
  );
}
