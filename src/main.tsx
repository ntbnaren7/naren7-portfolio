import { StrictMode } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { VercelTelemetry } from "./components/VercelTelemetry";
import { blogReturnUrl, scrollBackToBlogs } from "./lib/blog-scroll";
import "./styles/shadcn.css";
import "./styles/global.css";

const root = createRoot(document.getElementById("root")!);
const render = () =>
  root.render(
    <StrictMode>
      <App />
      <VercelTelemetry />
    </StrictMode>,
  );

if (location.pathname + location.search === blogReturnUrl) {
  document.documentElement.classList.add("blog-return");
  flushSync(render);
  scrollBackToBlogs();
} else {
  render();
}
