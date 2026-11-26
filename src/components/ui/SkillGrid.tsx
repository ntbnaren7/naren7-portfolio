import type { Skill } from "../../data/skills";
import { Icon } from "./Icon";

type SkillGridProps = {
  skills: Skill[];
  className?: string;
  label?: string;
};

export function SkillGrid({ skills, className, label }: SkillGridProps) {
  return (
    <ul
      className={className ? `skills-grid ${className}` : "skills-grid"}
      aria-label={label}
    >
      {skills.map(([name, icon]) => (
        <li key={name} className="skill-tile">
          {icon && <Icon name={icon} />}
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
}
