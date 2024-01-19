import type { AstroIntegrationLogger, HookParameters } from "astro";
import type { AnyZodObject } from "astro/zod";

export const validateEnv = ({
	schema,
	env,
	logger,
	command,
}: {
	schema: AnyZodObject;
	env: Record<string, string>;
	logger: AstroIntegrationLogger;
	command: HookParameters<"astro:config:setup">["command"];
}) => {
	const result = schema.safeParse(env);
	if (!result.success) {
		logger.warn("Some environment variables are invalid:");
		for (const issue of result.error.issues) {
			for (const path of issue.path) {
				logger.warn(`${path} (${issue.code}): ${issue.message}`);
			}
		}
		if (command !== "dev") {
			let vars: Array<string> = [];
			for (const issue of result.error.issues) {
				vars.push(...issue.path.map((e) => e.toString()));
			}
			vars = [...new Set(vars)];
			throw new Error(
				`The following environment variables are invalid: ${vars.join(", ")}`,
			);
		}
	}

	return result;
};
