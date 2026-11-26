import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PortfolioSubpage } from "./components/PortfolioSubpage";
import { VercelTelemetry } from "./components/VercelTelemetry";
import { HackathonsSection } from "./components/sections/HackathonsSection";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PortfolioSubpage label={<h1>Hackathons</h1>} backHref="/#hackathons">
      <HackathonsSection archive />
    </PortfolioSubpage>
    <VercelTelemetry />
  </StrictMode>,
);
