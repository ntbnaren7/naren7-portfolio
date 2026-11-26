import type { SVGProps } from "react";

/**
 * Hand-tuned notification bell drawn on a 24px grid: smooth body curves,
 * round joins, and a faint duotone fill so it stays crisp at small sizes.
 */
export function BellIcon({
  size = 16,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      shapeRendering="geometricPrecision"
      aria-hidden="true"
      focusable="false"
      className={className ? `bell-icon ${className}` : "bell-icon"}
      {...props}
    >
      <g className="bell-icon-body">
        <path
          d="M12 3.4c-3.32 0-5.8 2.6-5.8 6v2.35c0 1.08-.34 2.13-.97 3l-.78 1.08c-.66.92-.01 2.2 1.12 2.2h12.86c1.13 0 1.78-1.28 1.12-2.2l-.78-1.08a5.14 5.14 0 0 1-.97-3V9.4c0-3.4-2.48-6-5.8-6Z"
          fill="currentColor"
          fillOpacity={0.12}
        />
        <path d="M12 3.4V2.25" />
      </g>
      <path
        className="bell-icon-clapper"
        d="M9.85 20.3a2.35 2.35 0 0 0 4.3 0"
      />
    </svg>
  );
}
