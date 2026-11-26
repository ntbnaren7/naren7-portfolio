import { skills } from "../../data/skills";
import { SkillGrid } from "../ui/SkillGrid";
import { SectionHeading } from "../ui/SectionHeading";

export function SkillsSection() {
  return (
    <section id="skills" className="portfolio-section skills-section">
      <SectionHeading>Skills &amp; Technologies</SectionHeading>
      <SkillGrid skills={skills} />
    </section>
  );
}
