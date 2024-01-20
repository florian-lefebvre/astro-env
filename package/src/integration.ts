import type { AstroIntegration } from "astro";
import { z } from "astro/zod";
import { loadEnv } from "vite";
import { generateEnvTemplate } from "./generate-env-template";
import { generateSchemaTypes } from "./generate-schema-types";
import type { Options } from "./types";
import { validateEnv } from "./validate-env";
import { virtualImportsPlugin } from "./virtual-imports";

export const integration = ({
	schema: _schema,
	generateTypes: _generateTypes = true,
	generateEnvTemplate: _generateEnvTemplate = false,
}: Options): AstroIntegration => {
	const options = {
		schema: z.object(
			_schema({
				string: z.string,
				number: z.coerce.number,
				boolean: z.coerce.boolean,
				date: z.coerce.date,
			}),
		),
		generateTypes: _generateTypes,
		generateEnvTemplate: _generateEnvTemplate,
	};

	return {
		name: "astro-env",
		hooks: {
			"astro:config:setup": ({ command, logger, updateConfig }) => {
				validateEnv({
					schema: options.schema,
					command,
					logger,
					env: loadEnv(
						command === "dev" ? "development" : "production",
						process.cwd(),
						"",
					),
				});

				updateConfig({
					vite: {
						plugins: [virtualImportsPlugin({ schema: options.schema })],
					},
				});
			},
			"astro:config:done": async ({ config, logger }) => {
				if (options.generateTypes) {
					await generateSchemaTypes({
						root: config.root,
						srcDir: config.srcDir,
						logger,
						schema: options.schema,
					});
				}
				if (options.generateEnvTemplate) {
					await generateEnvTemplate({
						root: config.root,
						logger,
						schema: options.schema,
					});
				}
			},
		},
	};
};
