import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  base: process.env.PUBLIC_URL || "/", // IMPORTANT for GitHub Pages + PR previews "homepage": "https://ereznagar.github.io",
});
