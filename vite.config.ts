import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: [
        "index.html",
        "blogs/index.html",
        "blogs/why-gemini-never-feels-as-good-as-claude-to-me/index.html",
        "blogs/is-entrepreneurship-gen-z-main-character-moment/index.html",
      ].map((page) => fileURLToPath(new URL(page, import.meta.url))),
    },
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
