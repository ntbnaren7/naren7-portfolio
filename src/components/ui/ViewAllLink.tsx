import { Icon } from "./Icon";

export function ViewAllLink({
  href,
  children = "View All",
  external = true,
}: {
  href: string;
  children?: React.ReactNode;
  external?: boolean;
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
        <Icon name={external ? "arrow-up-right" : "arrow-right"} size={13} />
      </a>
    </div>
  );
}
