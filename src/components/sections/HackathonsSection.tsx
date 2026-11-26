import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowUpRight, X } from "lucide-react";
import { hackathons } from "../../data/hackathons";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";
import { ViewAllLink } from "../ui/ViewAllLink";

type Hackathon = (typeof hackathons)[number];

const featuredHackathons = hackathons.slice(0, 3);
const showcaseTechIcons: Partial<Record<string, string>> = {
  "Gemini Live API": "gemini",
  TypeScript: "typescript",
  "Node.js": "node",
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
    { label: "Photos", url: event.galleryUrl },
    { label: "Event", url: event.eventUrl },
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

function HackathonDetails({ event }: { event: Hackathon }) {
  return (
    <div className="hackathon-details">
      <p className="hackathon-note">{event.note}</p>
      <dl className="hackathon-facts">
        <div>
          <dt>Location</dt>
          <dd>{event.location}</dd>
        </div>
        {event.hours && (
          <div>
            <dt>Duration</dt>
            <dd>{event.hours} hours</dd>
          </div>
        )}
        {event.role && (
          <div>
            <dt>My role</dt>
            <dd>{event.role}</dd>
          </div>
        )}
        {event.placement && (
          <div>
            <dt>Placement</dt>
            <dd>{event.placement}</dd>
          </div>
        )}
      </dl>
      <div>
        <h4>{event.solution ? "The problem" : "Event brief"}</h4>
        <p>{event.problem}</p>
      </div>
      {event.solution && (
        <div>
          <h4>Our solution</h4>
          <p>{event.solution}</p>
        </div>
      )}
      {event.whatIBuilt && (
        <div>
          <h4>What I built</h4>
          <ul>
            {event.whatIBuilt.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {event.tech && (
        <div className="experience-tags" aria-label="Technologies">
          {event.tech.map((tech) => (
            <span className="tag" key={tech}>
              {tech}
            </span>
          ))}
        </div>
      )}
      <HackathonLinks event={event} />
    </div>
  );
}

function HackathonShowcase({ event }: { event: Hackathon }) {
  if (!event.showcase) return null;

  return (
    <div className="hackathon-showcase-details">
      <div className="hackathon-showcase-media">
        {event.showcase.images.map(({ file, alt }) => (
          <img
            key={file}
            src={`/images/hackathons/${file}`}
            alt={alt}
            width={960}
            height={960}
            tabIndex={0}
          />
        ))}
      </div>
      <div className="hackathon-showcase-overview">
        <h4>What we built · {event.project}</h4>
        <p>{event.solution}</p>
      </div>
      <div className="hackathon-showcase-work">
        <h4>What I built</h4>
        <p className="hackathon-showcase-role">My role · {event.role}</p>
        <ul>
          {event.whatIBuilt?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <ul className="hackathon-showcase-stack" aria-label="Technologies">
        {event.tech?.map((tech) => {
          const icon = showcaseTechIcons[tech];
          return (
            <li className="skill-tile" key={tech}>
              {icon && <Icon name={icon} size={11} />}
              <span>{tech}</span>
            </li>
          );
        })}
      </ul>
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
        data-showcase={selected?.showcase ? "true" : undefined}
        aria-labelledby="hackathon-dialog-title"
      >
        {selected && (
          <>
            <header>
              <div>
                <HackathonLogos logos={selected.logos} />
                <h3 id="hackathon-dialog-title">
                  {selected.showcase?.title ??
                    `${selected.name} · ${selected.project}`}
                </h3>
                {selected.showcase && (
                  <p className="hackathon-showcase-location">
                    {selected.location}
                  </p>
                )}
                {!selected.showcase && (
                  <div className="hackathon-meta">
                    <span>{selected.date}</span>
                    {selected.badge && (
                      <span
                        className="tag hackathon-badge"
                        data-placement={selected.badge}
                      >
                        {selected.badge}
                      </span>
                    )}
                  </div>
                )}
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
            {selected.showcase ? (
              <HackathonShowcase event={selected} />
            ) : (
              <HackathonDetails event={selected} />
            )}
          </>
        )}
      </dialog>
    </section>
  );
}
