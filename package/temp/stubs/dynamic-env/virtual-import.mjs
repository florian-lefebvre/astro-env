import { AstroError } from "astro/errors";
import { getEnvVariable } from "virtual:astro-env/entrypoint";

/**
 * @param {string} key
 * @returns {string}
 */
export const getEnv = (key) => {
	if (!key.startsWith("PUBLIC_") && !import.meta.env.SSR) {
		// TODO: doesn't work
		throw new AstroError(`Can't access private variable "${key}" client-side.`);
	}
	const value = getEnvVariable(key);

	if (!value) {
		console.warn(`Variable "${key}" is undefined (called using \`getEnv\`)`);
	}

	return value;
};
