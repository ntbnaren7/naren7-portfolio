import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PortfolioSubpage } from "./components/PortfolioSubpage";
import { VercelTelemetry } from "./components/VercelTelemetry";
import { ProjectsSection } from "./components/sections/ProjectsSection";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PortfolioSubpage label={<h1>Projects</h1>} backHref="/#projects">
      <ProjectsSection archive />
    </PortfolioSubpage>
    <VercelTelemetry />
  </StrictMode>,
);
