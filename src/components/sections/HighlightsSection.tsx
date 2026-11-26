import { highlights } from "../../data/highlights";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";

export function HighlightsSection() {
  return (
    <section id="highlights" className="portfolio-section highlights-section">
      <SectionHeading>Highlights</SectionHeading>
      <div className="highlights-window" aria-label="Highlights gallery">
        <div className="highlights-track">
          {[0, 1].map((copy) => (
            <div
              className="highlights-group"
              key={copy}
              aria-hidden={copy === 1 || undefined}
            >
              {highlights.map((highlight) => (
                <article
                  className="highlight-card"
                  key={highlight.title}
                  style={{ width: highlight.width }}
                >
                  <div className="highlight-image">
                    <img
                      src={highlight.image}
                      alt={highlight.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="highlight-caption">
                    <div className="highlight-caption-row">
                      <span className="highlight-label">{highlight.label}</span>
                      {highlight.url && (
                        <a
                          className="highlight-direct-link"
                          href={highlight.url}
                          target="_blank"
                          rel="noreferrer"
                          tabIndex={copy === 1 ? -1 : undefined}
                          aria-label={`Open ${highlight.label} post on LinkedIn`}
                        >
                          <Icon name="arrow-up-right" size={14} />
                        </a>
                      )}
                    </div>
                    <p>{highlight.title}</p>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
