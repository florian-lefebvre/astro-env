import tailwind from "@astrojs/tailwind";
import env from "astro-env";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		env({
			variables: ["ABC", "DEF"],
			validationLevel: "warn",
		}),
	],
});
