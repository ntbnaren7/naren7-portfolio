import { Icon } from "./Icon";

export function ViewAllLink({
  href,
  children = "View All",
  external = true,
  arrow = external ? "arrow-up-right" : "arrow-right",
}: {
  href: string;
  children?: React.ReactNode;
  external?: boolean;
  arrow?: "arrow-up-right" | "arrow-right";
}) {
  return (
    <div className="view-all-row full-divider">
      <a
        className="framed-button"
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {children}
        <Icon name={arrow} size={13} />
      </a>
    </div>
  );
}
