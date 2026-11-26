import type { ReactNode } from "react";

export function SectionHeading({
  children,
  trailing,
  intro,
}: {
  children: ReactNode;
  trailing?: ReactNode;
  /** One-line intro, shown in a dashed callout on phones only. */
  intro?: string;
}) {
  return (
    <>
      <div className="section-heading full-divider">
        <h2>{children}</h2>
        {trailing}
      </div>
      {intro && <p className="section-callout">{intro}</p>}
    </>
  );
}
