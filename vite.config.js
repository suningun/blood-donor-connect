import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
    plugins: [tailwindcss()],
    envPrefix: ["VITE_", "EMAIL_PUBLIC_KEY"],
    // GitHub Pages project site: https://<user>.github.io/blood-donor-connect/
    // Keep local dev at "/" so `npm run dev` still opens at localhost:5173.
    base: mode === "production" ? "/blood-donor-connect/" : "/",
}));
