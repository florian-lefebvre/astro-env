import tailwind from "@astrojs/tailwind";
import env from "astro-env";
import { defineConfig } from "astro/config";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		env({
			variables: (fields) => ({
				TEST_BOOLEAN: fields.boolean(),
				TEST_BOOLEAN_TWO: fields.boolean(),
				TEST_BOOLEAN_OPTIONAL: fields.boolean({ optional: true }),
				TEST_BOOLEAN_DEFAULT: fields.boolean({ optional: true, default: false }),
			}),
			validationLevel: "error",
		}),
	],
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
});
