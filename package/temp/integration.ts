import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";
import { validateEnvPlugin } from "./validate-env.js";
import { staticEnvPlugin } from "./static-env.js";

const optionsSchema = z.object({
	/** TODO: */
	variables: z.array(z.string()),
	/** TODO: */
	validationLevel: z.enum(["warn", "error"]).optional().default("warn"),
});

export type Options = z.infer<typeof optionsSchema>;

export const integration = defineIntegration({
	name: "astro-env",
	plugins: [...corePlugins, validateEnvPlugin, staticEnvPlugin],
	optionsSchema,
	setup({ options }) {
		const { resolve } = createResolver(import.meta.url);

		return {
			"astro:config:setup": ({ watchIntegration, validateEnv, staticEnv }) => {
				watchIntegration(resolve());

				validateEnv(options);
				staticEnv({ name: "env:astro/static", variables: options.variables });
			},
		};
	},
});
