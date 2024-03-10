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
				TEST_BOOLEAN_DEFAULT: fields.boolean({
					optional: true,
					default: false,
				}),
				TEST_ENUM: fields.enum({ values: ["a", "b", "c"] }),
				TEST_ENUM_OPTIONAL: fields.enum({ values: ["a", "b", "c"], optional: true }),
				TEST_ENUM_DEFAULT: fields.enum({ values: ["a", "b", "c"], optional: true, default: "b" }),
				TEST_NUMBER: fields.number(),
				TEST_NUMBER_OPTIONAL: fields.number({ optional: true }),
				TEST_NUMBER_DEFAULT: fields.number({ optional: true, default: 11 }),
				TEST_STRING: fields.string(),
				TEST_STRING_OPTIONAL: fields.string({ optional: true }),
				TEST_STRING_DEFAULT: fields.string({ optional: true, default: "def" }),
			}),
			validationLevel: "error",
		}),
	],
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
});
