import tailwind from "@astrojs/tailwind";
import env from "astro-env";
import { defineConfig } from "astro/config";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), env({
    variables: ["ABC", "DEF"],
    validationLevel: "warn"
  })],
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});