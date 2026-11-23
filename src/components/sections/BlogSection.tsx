import { Heart } from "lucide-react";
import { blogs, profile } from "../../data/portfolio";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";
import { ViewAllLink } from "../ui/ViewAllLink";

export function BlogSection({ showViewAll = true }: { showViewAll?: boolean }) {
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
                <span aria-label="0 likes">0</span>
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
