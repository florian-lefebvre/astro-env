import type {
	AstroIntegration,
	AstroIntegrationLogger,
	HookParameters,
} from "astro";
import type { Options } from "./types";
import { loadEnv } from "vite";

const validateEnv = ({
	schema,
	env,
	logger,
	command,
}: {
	schema: Options["schema"];
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
};

export const integration = ({ schema }: Options): AstroIntegration => {
	const options = { schema };
	return {
		name: "astro-env",
		hooks: {
			"astro:config:setup": ({ command, logger }) => {
				const rawEnv = loadEnv(
					command === "dev" ? "development" : "production",
					process.cwd(),
					"",
				);
				const env = validateEnv({
					schema: options.schema,
					command,
					logger,
					env: rawEnv,
				});
			},
		},
	};
};
