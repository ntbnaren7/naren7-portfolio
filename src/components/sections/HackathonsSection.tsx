import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowUpRight, X } from "lucide-react";
import { hackathons } from "../../data/hackathons";
import { SectionHeading } from "../ui/SectionHeading";

type Hackathon = (typeof hackathons)[number];

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

function HackathonDetails({ event }: { event: Hackathon }) {
  const links = [
    { label: "GitHub", url: event.githubUrl },
    { label: "Demo", url: event.demoUrl },
    { label: "Photos", url: event.galleryUrl },
    { label: "Event", url: event.eventUrl },
  ];
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
    </div>
  );
}

export function HackathonsSection() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Hackathon | null>(null);

  function openDetails(event: Hackathon) {
    if (!dialog.current || dialog.current.open) return;
    flushSync(() => setSelected(event));
    dialog.current.scrollTop = 0;
    dialog.current.showModal();
  }

  return (
    <section id="hackathons" className="portfolio-section hackathons-section">
      <SectionHeading>Hackathons</SectionHeading>
      <div className="hackathon-list">
        {hackathons.map((event) => (
          <h3 className="hackathon-entry" key={event.name}>
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
          </h3>
        ))}
      </div>
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
                  {selected.name} · {selected.project}
                </h3>
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
            <HackathonDetails event={selected} />
          </>
        )}
      </dialog>
    </section>
  );
}
