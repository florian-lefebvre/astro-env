import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";
import { validateEnvPlugin } from "./validate-env.js";
import { staticEnvPlugin } from "./static-env.js";
import { dynamicEnvPlugin } from "./dynamic-env.js";
import { AstroError } from "astro/errors";
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
	 * The value depends on the adapter being used but fallback to node. You can override
	 * it if you're using another runtime without its corresponding adapter.
	 * 
	 * @default `"node"`
	 */
	runtime: z.enum(["node", "deno", "cloudflare", "bun"]).optional(),
});

export type Options = z.infer<typeof optionsSchema>;

export const integration = defineIntegration({
	name: "astro-env",
	plugins: [
		...corePlugins,
		validateEnvPlugin,
		staticEnvPlugin,
		dynamicEnvPlugin,
	],
	optionsSchema,
	setup({ options, name }) {
		const { resolve } = createResolver(import.meta.url);

		return {
			"astro:config:setup": ({
				addDts,
				watchIntegration,
				validateEnv,
				staticEnv,
				dynamicEnv,
			}) => {
				watchIntegration(resolve());

				const { variables } = validateEnv(options);
				const staticContent = staticEnv({
					name: "env:astro/static",
					variables,
				});
				const dynamicContent = dynamicEnv({ runtime: options.runtime });

				addDts({ name, content: `${staticContent}\n${dynamicContent}` });
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
