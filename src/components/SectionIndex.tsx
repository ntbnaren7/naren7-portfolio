import { sections } from "../data/portfolio";
import { pinActiveSection, useActiveSection } from "../hooks/useActiveSection";

export function SectionIndex() {
  const active = useActiveSection();
  return (
    <nav className="section-index" aria-label="Page sections">
      <h2>Index</h2>
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={() => pinActiveSection(id)}
          className={active === id ? "active" : ""}
          aria-current={active === id ? "location" : undefined}
        >
          <span className="section-index-line" />
          <span className="section-index-label">{label}</span>
        </a>
      ))}
    </nav>
  );
}
