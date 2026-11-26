import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { highlights } from "../../data/highlights";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";

export function HighlightsSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = selected === null ? null : highlights[selected];

  function openHighlight(index: number) {
    if (!dialog.current || dialog.current.open) return;
    flushSync(() => setSelected(index));
    dialog.current.showModal();
  }

  return (
    <section id="highlights" className="portfolio-section highlights-section">
      <SectionHeading>Highlights</SectionHeading>
      <div className="highlights-window" aria-label="Highlights gallery">
        <div className="highlights-track">
          {[0, 1].map((copy) => (
            <div
              className="highlights-group"
              key={copy}
              aria-hidden={copy ? true : undefined}
            >
              {highlights.map((highlight, i) => (
                <button
                  type="button"
                  tabIndex={copy ? -1 : 0}
                  className="highlight-card"
                  key={highlight.title}
                  style={{ width: highlight.width }}
                  onClick={() => openHighlight(i)}
                  aria-label={`View ${highlight.title}`}
                >
                  <div className="highlight-image">
                    <img
                      src={highlight.image}
                      alt={highlight.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="highlight-caption">
                    <span className="highlight-label">{highlight.label}</span>
                    <p>{highlight.title}</p>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        onClose={(event) => {
          if (!event.currentTarget.open) setSelected(null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        aria-label={current?.title || "Highlight"}
      >
        {current && (
          <>
            <button
              className="dialog-close"
              onClick={() => dialog.current?.close()}
              aria-label="Close highlight"
            >
              ×
            </button>
            <img src={current.image} alt={current.title} />
            <p>{current.title}</p>
            <a
              className="highlight-post-link"
              href={current.url}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <Icon name="arrow-up-right" size={12} />
            </a>
          </>
        )}
      </dialog>
    </section>
  );
}
