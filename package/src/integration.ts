import type { AstroIntegration } from "astro";
import {
	createResolver,
	defineIntegration,
	watchIntegration,
} from "astro-integration-kit";
import { loadEnv } from "vite";
import { generateEnvTemplate } from "./generate-env-template.js";
import { generateSchemaTypes } from "./generate-schema-types.js";
import type { Options } from "./types.js";
import { validateEnv } from "./validate-env.js";
import { z } from "astro/zod";

export const _integration = defineIntegration({
	name: "astro-env",
	options: z.object({
		schema: z.object,
		generateTypes: z.boolean().optional().default(true),
		generateEnvTemplate: z.boolean().optional().default(false),
	}).default({
		schema: z.object({})
	}),
	setup(options) {
		const { resolve } = createResolver(import.meta.url);

		return {
			"astro:config:setup": async ({ command, logger }) => {
				await watchIntegration(resolve());

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
		};
	},
});

export const integration = ({
	schema: _schema,
	generateTypes: _generateTypes = true,
	generateEnvTemplate: _generateEnvTemplate = false,
}: Options): AstroIntegration => {
	const options = {
		schema: _schema,
		generateTypes: _generateTypes,
		generateEnvTemplate: _generateEnvTemplate,
	};

	const { resolve } = createResolver(import.meta.url);

	return {
		name: "astro-env",
		hooks: {
			"astro:config:setup": ({
				addWatchFile,
				command,
				logger,
				updateConfig,
			}) => {
				watchIntegration({
					addWatchFile,
					command,
					dir: resolve(),
					updateConfig,
				});

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
