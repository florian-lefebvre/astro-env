import { loadEnv } from "vite";
import type { Options } from "./integration.js";
import { definePlugin } from "astro-integration-kit";

export const validateEnvPlugin = definePlugin({
	name: "validateEnv",
	hook: "astro:config:setup",
	implementation:
		({ command, logger }) =>
		(options: Options) => {
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
		},
});
