import { useEffect, useState } from "react";
import { profile, socials } from "../../data/portfolio";
import { Icon } from "../ui/Icon";
import { LiveClock } from "../ui/LiveClock";
import { SocialHoverCard } from "../ui/SocialHoverCard";
import { ResumeButton } from "../ui/ResumeButton";
import { BookingLink } from "../ui/BookingLink";
import { BannerAtmosphere } from "../ui/BannerAtmosphere";

export function ProfileHeader({
  onOpenCommands,
  light,
  onToggleTheme,
  onOpenResume,
}: {
  onOpenCommands: () => void;
  light: boolean;
  onToggleTheme: () => void;
  onOpenResume: () => void;
}) {
  // Only the active theme's banner is needed for first paint. The other one
  // loads after the page has finished so the theme crossfade still works.
  const [bothBanners, setBothBanners] = useState(false);
  useEffect(() => {
    const load = () => setBothBanners(true);
    if (document.readyState === "complete") {
      load();
      return;
    }
    window.addEventListener("load", load, { once: true });
    return () => window.removeEventListener("load", load);
  }, []);

  return (
    <>
      <div className="hero-banner">
        {(!light || bothBanners) && (
          <img
            src="/images/hero/knight-banner-dark.webp"
            alt="A pixel-art knight resting in a flower meadow"
            width={1376}
            height={768}
            fetchPriority={light ? "low" : "high"}
          />
        )}
        {(light || bothBanners) && (
          <img
            className="hero-banner-day"
            src="/images/hero/knight-banner-light.webp"
            alt=""
            aria-hidden="true"
            width={1376}
            height={768}
            fetchPriority={light ? "high" : "low"}
          />
        )}
        <BannerAtmosphere light={light} />
        <LiveClock />
      </div>
      <header className="profile-header full-divider">
        <div className="profile-identity">
          <div className="avatar-frame">
            <img
              src={profile.avatar}
              alt={`${profile.name}'s profile`}
              width={80}
              height={80}
            />
          </div>
          <div className="profile-name">
            <h1>{profile.name}</h1>
            <p>{profile.age}</p>
          </div>
        </div>
        <div className="profile-controls">
          <button
            className="command-trigger framed-button"
            onClick={onOpenCommands}
            aria-label="Open command menu"
          >
            <span>⌘</span> K
          </button>
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${light ? "dark" : "light"} theme`}
          >
            <Icon name={light ? "moon" : "sun"} size={18} />
          </button>
        </div>
      </header>
      <section className="introduction" aria-label="About me">
        <p>
          <strong>{profile.introductionTitle}</strong> {profile.introduction}
        </p>
        <ul>
          <li>{profile.interests}</li>
          <li>{profile.philosophy}</li>
          <li>
            Building <strong>{profile.currentProjects[0]}</strong>,{" "}
            <strong>{profile.currentProjects[1]}</strong>, and whatever
            curiosity leads me to next.
          </li>
        </ul>
        <div className="contact-actions">
          <BookingLink href={profile.bookingUrl} />
          <a className="small-button tactile-button" href={profile.contactUrl}>
            <Icon name="mail" />
            Send an email
          </a>
        </div>
        <div className="socials">
          <h2>
            Here are my <span>socials</span>
          </h2>
          <div className="social-links">
            {socials.map((social) => (
              <SocialHoverCard key={social.name} social={social} />
            ))}
            <ResumeButton onClick={onOpenResume} />
          </div>
        </div>
      </section>
    </>
  );
}
