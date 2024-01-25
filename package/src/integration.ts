import { createResolver, defineIntegration } from "astro-integration-kit";
import { z } from "astro/zod";
import { loadEnv } from "vite";
import zodToJsonSchema from "zod-to-json-schema";
import { generateEnvTemplate } from "./generate-env-template.js";
import { generateSchemaTypes } from "./generate-schema-types.js";
import type { Options } from "./types.js";
import { validateEnv } from "./validate-env.js";

export const integration = defineIntegration<Options>({
	name: "astro-env",
	// @ts-ignore
	defaults: {
		generateTypes: true,
		generateEnvTemplate: false,
	},
	setup({ options }) {
		const { resolve } = createResolver(import.meta.url);
		const schema = z.object(
			options.schema({
				string: z.string,
				number: z.coerce.number,
				boolean: z.coerce.boolean,
				date: z.coerce.date,
			}),
		);

		return {
			"astro:config:setup": async ({
				addVirtualImport,
				command,
				config,
				logger,
				watchIntegration,
			}) => {
				watchIntegration(resolve());

				validateEnv({
					schema,
					command,
					logger,
					env: loadEnv(
						command === "dev" ? "development" : "production",
						process.cwd(),
						"",
					),
				});

				addVirtualImport({
					name: "env:astro",
					content: `import { z as zImport } from "astro/zod";
import { jsonSchemaToZod } from "astro-env/deps";

const jsonSchema = ${JSON.stringify(zodToJsonSchema(schema))};

const z = zImport;
const schema = eval(jsonSchemaToZod(jsonSchema).replace("}).strict()", "}).partial()"));

export const env = {
    ${Object.keys(schema.shape)
			.map((key) => `${key}:schema.shape.${key}.parse(import.meta.env.${key})`)
			.join(",\n")}
};`,
				});

				if (options.generateTypes) {
					await generateSchemaTypes({
						root: config.root,
						srcDir: config.srcDir,
						logger,
						schema,
					});
				}
				if (options.generateEnvTemplate) {
					await generateEnvTemplate({
						root: config.root,
						logger,
						schema,
					});
				}
			},
		};
	},
});
