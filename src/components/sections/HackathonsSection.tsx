import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowUpRight, X } from "lucide-react";
import { hackathons } from "../../data/hackathons";
import { skills } from "../../data/skills";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";
import { SkillGrid } from "../ui/SkillGrid";
import { ViewAllLink } from "../ui/ViewAllLink";

type Hackathon = (typeof hackathons)[number];

const featuredHackathons = hackathons.slice(0, 3);
const showcaseTechIcons: Partial<Record<string, string>> = {
  ...Object.fromEntries(skills),
  "Gemini Live API": "gemini",
  Gemini: "gemini",
  SQLite: "sqlite",
  Pandas: "pandas",
  NumPy: "numpy",
  TensorFlow: "tensorflow",
  ESP32: "espressif",
  YOLOv8s: "ultralytics",
  "ONNX Runtime": "onnx",
  OpenCV: "opencv",
  Dart: "dart",
};

function HackathonLogos({ logos }: { logos: Hackathon["logos"] }) {
  if (!logos?.length) return null;

  return (
    <span className="hackathon-logos">
      {logos.map(({ image, name }) => (
        <span key={image}>
          <img src={`/images/hackathons/${image}`} alt={name} />
        </span>
      ))}
    </span>
  );
}

function HackathonLinks({ event }: { event: Hackathon }) {
  const links = [
    { label: "GitHub", url: event.githubUrl },
    { label: "Demo", url: event.demoUrl },
    {
      label: "LinkedIn",
      url: event.showcase.linkedinPreview ? undefined : event.linkedinUrl,
    },
  ];
  return (
    <div className="hackathon-links">
      {links.map(
        ({ label, url }) =>
          url && (
            <a href={url} key={label} target="_blank" rel="noreferrer">
              {label} <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          ),
      )}
    </div>
  );
}

function HackathonShowcase({ event }: { event: Hackathon }) {
  const { images, linkedinPreview, rationale } = event.showcase;

  const gallery = (
    <div
      className="hackathon-showcase-media"
      data-single={images.length === 1 || undefined}
    >
      {images.map(({ file, alt, width, height, annotation }) => (
        <figure
          className="hackathon-showcase-photo"
          key={file}
          data-annotation={annotation?.placement}
          data-portrait={height > width || undefined}
        >
          <img
            src={`/images/hackathons/${file}`}
            alt={alt}
            width={width}
            height={height}
            tabIndex={0}
          />
          {annotation && (
            <figcaption className="hackathon-photo-annotation">
              <span>{annotation.text}</span>
              {annotation.placement === "inside" ? (
                <svg
                  viewBox="0 0 1100 773"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M832 57C783 70 747 43 695 95m-1-25 1 25 25-6"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 76 28" fill="none" aria-hidden="true">
                  <path d="M73 6C53 1 28 1 15 20m-3-9 3 9 11-3" />
                </svg>
              )}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );

  return (
    <div className="hackathon-showcase-details">
      {linkedinPreview && event.linkedinUrl ? (
        <article
          className="hackathon-linkedin-preview"
          aria-label="LinkedIn preview"
        >
          <header>
            <strong>{linkedinPreview.author}</strong>
            <a href={event.linkedinUrl} target="_blank" rel="noreferrer">
              <Icon name="linkedin" size={12} />
              LinkedIn
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </header>
          <p>{linkedinPreview.summary}</p>
          {gallery}
        </article>
      ) : (
        gallery
      )}
      <div className="hackathon-showcase-overview">
        <div>
          <h4>What we built · {event.project}</h4>
          <p>{event.solution}</p>
        </div>
        <div>
          <h4>Why {event.project}</h4>
          <p>{rationale}</p>
        </div>
      </div>
      <div className="hackathon-showcase-work">
        <h4>What I built</h4>
        <p className="hackathon-showcase-role">My role · {event.role}</p>
        <ul>
          {event.whatIBuilt.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <SkillGrid
        skills={event.tech.map((name) => [name, showcaseTechIcons[name]])}
        className="hackathon-showcase-stack"
        label="Technologies"
      />
      <HackathonLinks event={event} />
    </div>
  );
}

export function HackathonsSection({ archive = false }: { archive?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Hackathon | null>(null);
  const EntryHeading = archive ? "h2" : "h3";

  function openDetails(event: Hackathon) {
    if (!dialog.current || dialog.current.open) return;
    flushSync(() => setSelected(event));
    dialog.current.scrollTop = 0;
    dialog.current.showModal();
  }

  return (
    <section id="hackathons" className="portfolio-section hackathons-section">
      {!archive && <SectionHeading>Hackathons</SectionHeading>}
      <div className="hackathon-list">
        {(archive ? hackathons : featuredHackathons).map((event) => (
          <EntryHeading className="hackathon-entry" key={event.name}>
            <button
              type="button"
              className="hackathon-open"
              aria-haspopup="dialog"
              onClick={() => openDetails(event)}
            >
              <span className="hackathon-identity">
                <span className="hackathon-name">{event.name}</span>
                <HackathonLogos logos={event.logos} />
              </span>
              {event.badge && (
                <span
                  className="tag hackathon-badge"
                  data-placement={event.badge}
                >
                  {event.badge}
                </span>
              )}
            </button>
          </EntryHeading>
        ))}
      </div>
      {!archive && <ViewAllLink href="/hackathons/" external={false} />}
      <dialog
        ref={dialog}
        className="hackathon-dialog"
        aria-labelledby="hackathon-dialog-title"
      >
        {selected && (
          <>
            <header>
              <div>
                <HackathonLogos logos={selected.logos} />
                <h3 id="hackathon-dialog-title">
                  {selected.showcase.title ?? selected.name}
                </h3>
                <p className="hackathon-showcase-location">
                  {selected.location}
                  {(selected.placement ?? selected.badge) && (
                    <span> · {selected.placement ?? selected.badge}</span>
                  )}
                </p>
              </div>
              <form method="dialog">
                <button
                  type="submit"
                  aria-label="Close hackathon details"
                  autoFocus
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </form>
            </header>
            <HackathonShowcase event={selected} />
          </>
        )}
      </dialog>
    </section>
  );
}
