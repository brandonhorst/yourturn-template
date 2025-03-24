import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { initializeGameServer } from "./gameserver.ts";

if (!Deno.args.includes("build")) {
  await initializeGameServer();
}

export default defineConfig({
  plugins: [tailwind()],
});
