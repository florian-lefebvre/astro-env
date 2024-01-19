import type { AstroIntegration } from "astro";
import type { Options } from "./types";
import { loadEnv } from "vite";
import { validateEnv } from "./validate-env";
import { generateSchemaTypes } from "./generate-schema-types";

export const integration = ({
	schema: _schema,
	generateTypes: _generateTypes = true,
}: Options): AstroIntegration => {
	const options = { schema: _schema, generateTypes: _generateTypes };

	return {
		name: "astro-env",
		hooks: {
			"astro:config:setup": ({ command, logger }) => {
				const env = validateEnv({
					schema: options.schema,
					command,
					logger,
					env: loadEnv(
						command === "dev" ? "development" : "production",
						process.cwd(),
						"",
					),
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
			},
		},
	};
};
