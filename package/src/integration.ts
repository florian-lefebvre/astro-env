import { createResolver, defineIntegration } from "astro-integration-kit";
import {
	addDts,
	addVirtualImports,
	watchIntegration,
} from "astro-integration-kit/utilities";
import { AstroError } from "astro/errors";
import { z } from "astro/zod";
import { dynamicEnv } from "./dynamic-env.js";
import { generateEnvTemplate } from "./generate-env-template.js";
import { staticEnv } from "./static-env.js";
import { validateEnv } from "./validate-env.js";
import * as validators from "./validators/index.js";

export const variablesSchemaReturns = z.record(
	z.union([
		validators.booleanFnReturns,
		validators.enumFnReturns,
		validators.numberFnReturns,
		validators.stringFnReturns,
	]),
);

const variablesSchema = z
	.function()
	.args(
		z.object({
			boolean: validators.booleanFnPublicSchema,
			enum: validators.enumFnPublicSchema,
			number: validators.numberFnPublicSchema,
			string: validators.stringFnPublicSchema,
		}),
	)
	.returns(variablesSchemaReturns);

const optionsSchema = z.object({
	/**
	 * @description Allows you to define a schema to validate your environment variables
	 * at runtime. Types will be inferred based on those.
	 */
	variables: variablesSchema,
	/**
	 * @description Specifies if running the app (not matter the mode) should warn or
	 * fail if provided variables are invalid.
	 *
	 * @default `"warn"`
	 */
	validationLevel: z.enum(["warn", "error"]).optional().default("warn"),
	/**
	 * @description Changes how dynamic environment varriables are retrieved at runtime.
	 * The value depends on the adapter being used but fallbacks to `"node"`. You can override
	 * it if you're using another runtime without its corresponding adapter.
	 *
	 * @default `"node"`
	 */
	runtime: z.enum(["node", "deno", "cloudflare", "bun"]).optional(),
	/**
	 * @description Generates a `.env.template` with the {variables} returned object keys
	 * if enabled.
	 *
	 * @default `false`
	 */
	generateEnvTemplate: z.boolean().optional().default(false),
});

export type Options = z.infer<typeof optionsSchema>;

export const integration = defineIntegration({
	name: "astro-env",
	optionsSchema,
	setup({ options, name }) {
		const { resolve } = createResolver(import.meta.url);

		return {
			"astro:config:setup": (params) => {
				const { config, logger } = params;
				watchIntegration({
					...params,
					dir: resolve(),
				});

				const ids = {
					static: "env:astro/static",
					entrypoint: "virtual:astro-env/entrypoint",
				};

				const { variables } = validateEnv(params, options);
				const staticData = staticEnv(ids.static, variables);
				if (options.generateEnvTemplate) {
					generateEnvTemplate({
						root: config.root,
						keys: Object.keys(variables),
						logger,
					});
				}

				const dynamicData = dynamicEnv(params, options.runtime);

				addVirtualImports({
					...params,
					name,
					imports: {
						[ids.static]: staticData.virtualImport,
						[ids.entrypoint]: dynamicData.virtualImport,
					},
				});

				addDts({
					root: config.root,
					srcDir: config.srcDir,
					logger,
					name,
					content: `${staticData.dtsContent}${dynamicData.dtsContent}`,
				});
			},
			"astro:server:setup": ({ server }) => {
				// TODO: do not kill the terminal, show in the error overlay
				server.ws.on(
					"astro-env:get-env:invalid-variable-usage",
					({ key }: { key: string }) => {
						throw new AstroError(
							`Can't access private variable "${key}" client-side.`,
						);
					},
				);
			},
		};
	},
});
