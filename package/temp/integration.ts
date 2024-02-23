import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";
import { loadEnv } from "vite";

const STATIC_VIRTUAL_MODULE_NAME = "env:astro/static";

export const integration = defineIntegration({
	name: "astro-env",
	plugins: [...corePlugins],
	optionsSchema: z.object({
		/** TODO: */
		variables: z.array(z.string()),
		/** TODO: */
		validationLevel: z.enum(["warn", "error"]).optional().default("warn"),
	}),
	setup({ options }) {
		const { resolve } = createResolver(import.meta.url);

		return {
			"astro:config:setup": ({
				addDts,
				addVirtualImport,
				command,
				logger,
				watchIntegration,
			}) => {
				watchIntegration(resolve());

				const env = loadEnv(
					command === "dev" ? "development" : "production",
					process.cwd(),
					"",
				);

				const missingVariables: Array<string> = [];
				for (const variable of options.variables) {
					if (env[variable] === undefined) {
						missingVariables.push(variable);
					}
				}
				if (missingVariables.length > 0) {
					const message = `The following environment variables are invalid: ${missingVariables.join(
						", ",
					)}`;
					if (options.validationLevel === "warn") {
						logger.warn(message);
					} else {
						throw new Error(message);
					}
				}

				addVirtualImport({
					name: STATIC_VIRTUAL_MODULE_NAME,
					content: options.variables
						.map((v) => `export const ${v} = import.meta.env["${v}"];`)
						.join("\n"),
				});

				addDts({
					name: "astro-env",
					content: `declare module "${STATIC_VIRTUAL_MODULE_NAME}" {
${options.variables.map((v) => `export const ${v}: string;`).join("\n")}
}`,
				});
			},
		};
	},
});