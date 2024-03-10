import { loadEnv } from "astro-env/deps";

/**
 * @type {import("../../types.js").GetEnvVariable}
 */
export const getEnvVariable = (key) =>
	loadEnv(
		import.meta.env.DEV ? "development" : "production",
		process.cwd(),
		"",
	)[key];
