import tailwind from "@astrojs/tailwind";
import astroEnv from "astro-env";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		astroEnv({
			schema: ({ string, number }) => ({
				ABC: string(),
				DEF: number(),
			}),
			generateEnvTemplate: true,
		}),
	],
});
