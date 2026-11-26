import { highlights } from "../../data/highlights";
import { sectionIntros } from "../../data/portfolio";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";
import { ViewAllLink } from "../ui/ViewAllLink";

function HighlightCard({
  highlight,
  width,
  duplicate = false,
}: {
  highlight: (typeof highlights)[number];
  width?: number;
  duplicate?: boolean;
}) {
  return (
    <article className="highlight-card" style={{ width }}>
      <div className="highlight-image">
        <img
          src={highlight.image}
          alt={highlight.title}
          loading="lazy"
          decoding="async"
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
              tabIndex={duplicate ? -1 : undefined}
              aria-label={`Open ${highlight.label} post on LinkedIn`}
            >
              <Icon name="arrow-up-right" size={14} />
            </a>
          )}
        </div>
        <p>{highlight.title}</p>
      </div>
    </article>
  );
}

export function HighlightsSection({ archive = false }: { archive?: boolean }) {
  if (archive) {
    return (
      <section className="highlights-archive" aria-label="All highlights">
        {highlights.map((highlight) => (
          <HighlightCard highlight={highlight} key={highlight.title} />
        ))}
      </section>
    );
  }

  return (
    <section id="highlights" className="portfolio-section highlights-section">
      <SectionHeading intro={sectionIntros.highlights}>
        Highlights
      </SectionHeading>
      <div className="highlights-window" aria-label="Highlights gallery">
        <div className="highlights-track">
          {[0, 1].map((copy) => (
            <div
              className="highlights-group"
              key={copy}
              aria-hidden={copy === 1 || undefined}
            >
              {highlights.map((highlight) => (
                <HighlightCard
                  duplicate={copy === 1}
                  highlight={highlight}
                  key={highlight.title}
                  width={highlight.width}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <ViewAllLink
        href="/highlights/"
        external={false}
        arrow="arrow-up-right"
      />
    </section>
  );
}
