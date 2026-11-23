import { skills } from "../../data/skills";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";

export function SkillsSection() {
  return (
    <section id="skills" className="portfolio-section skills-section">
      <SectionHeading>Skills &amp; Technologies</SectionHeading>
      <ul className="skills-grid">
        {skills.map(([name, icon]) => (
          <li key={name} className="skill-tile">
            {icon && <Icon name={icon} />}
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
