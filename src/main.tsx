import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { VercelTelemetry } from "./components/VercelTelemetry";
import "./styles/shadcn.css";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <VercelTelemetry />
  </StrictMode>,
);
