import { loadEnv } from "vite";
import type { Options } from "./integration.js";
import * as validators from "./validators/index.js";
import type { z } from "astro/zod";
import type { HookParameters } from "astro";

export const validateEnv = (
	{ command, logger }: HookParameters<"astro:config:setup">,
	options: Options,
) => {
	const env = loadEnv(
		command === "dev" ? "development" : "production",
		process.cwd(),
		"",
	);

	const variables = options.variables({
		boolean: (args?: z.infer<typeof validators.booleanFnArgs>) =>
			validators.booleanFn(args ?? {}),
		enum: validators.enumFn,
		number: (args?: z.infer<typeof validators.numberFnArgs>) =>
			validators.numberFn(args ?? {}),
		string: (args?: z.infer<typeof validators.stringFnArgs>) =>
			validators.stringFn(args ?? {}),
	});

	const missingVariables: Array<string> = [];
	for (const [key, params] of Object.entries(variables)) {
		const schema = params.schema as z.ZodAny;
		const res = schema.safeParse(env[key]);
		if (!res.success) {
			missingVariables.push(key);
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

	return { variables };
};
