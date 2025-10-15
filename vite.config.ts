import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [fresh(), tailwindcss()],
  server: {
    proxy: {
      "^.*/socket": {
        target: "ws://localhost:8000", // Started by `deno task start`
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
