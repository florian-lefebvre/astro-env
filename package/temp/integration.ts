import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";
import { validateEnvPlugin } from "./validate-env.js";
import { staticEnvPlugin } from "./static-env.js";
import { dynamicEnvPlugin } from "./dynamic-env.js";

const optionsSchema = z.object({
	/** TODO: */
	variables: z.array(z.string()),
	/** TODO: */
	validationLevel: z.enum(["warn", "error"]).optional().default("warn"),
	/** TODO */
	entrypoint: z.string().optional(),
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

				validateEnv(options);
				const staticContent = staticEnv({
					name: "env:astro/static",
					variables: options.variables,
				});
				const dynamicContent = dynamicEnv({
					name: "env:astro/dynamic",
					entrypoint: options.entrypoint,
				});

				addDts({ name, content: `${staticContent}\n${dynamicContent}` });
			},
		};
	},
});
