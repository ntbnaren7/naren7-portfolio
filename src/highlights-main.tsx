import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PortfolioSubpage } from "./components/PortfolioSubpage";
import { VercelTelemetry } from "./components/VercelTelemetry";
import { HighlightsSection } from "./components/sections/HighlightsSection";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PortfolioSubpage
      label={<h1>Highlights</h1>}
      backHref="/#highlights"
      backLabel="Back to highlights"
    >
      <HighlightsSection archive />
    </PortfolioSubpage>
    <VercelTelemetry />
  </StrictMode>,
);
