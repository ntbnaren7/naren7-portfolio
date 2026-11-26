import { useEffect, useState } from "react";
import { profile } from "../data/portfolio";
import { Icon } from "./ui/Icon";

const links = [
  { label: "Projects", href: "/projects/" },
  { label: "Blogs", href: "/blogs/" },
  { label: "Contact", href: profile.contactUrl },
];

/**
 * Phone-only top bar (hidden from 768px up by mobile.css). It sits flush at
 * the top, then floats as a rounded pill once the page scrolls.
 */
export function MobileNav({
  light,
  onToggleTheme,
}: {
  light: boolean;
  onToggleTheme: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <nav
      className="mobile-nav"
      data-scrolled={scrolled || undefined}
      aria-label="Main"
    >
      <a className="mobile-nav-avatar" href="/" aria-label="Home">
        <img src={profile.avatar} alt="" width={36} height={36} />
      </a>
      <div className="mobile-nav-links">
        {links.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
        <span className="mobile-nav-divider" aria-hidden="true" />
        <button
          type="button"
          className="mobile-nav-theme"
          onClick={onToggleTheme}
          aria-label={`Switch to ${light ? "dark" : "light"} theme`}
        >
          <Icon name={light ? "moon" : "sun"} size={18} />
        </button>
      </div>
    </nav>
  );
}
