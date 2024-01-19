import tailwind from "@astrojs/tailwind";
import astroEnv from "astro-env";
import { defineConfig } from "astro/config";
import { z } from "astro/zod";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		astroEnv({
			schema: z.object({
				ABC: z.string(),
				DEF: z.string()
			}),
			generateEnvTemplate: true
		}),
	],
});
