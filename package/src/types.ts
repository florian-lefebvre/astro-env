import type { z } from "astro/zod";

export type Options = {
	/**
	 * Schema used to validate your environment variables. It supports a subset of zod built-in schemas.
	 */
	schema: <T extends Record<string, any>>(args: {
		string: () => z.ZodString;
		number: () => z.ZodNumber;
		boolean: () => z.ZodBoolean;
		date: () => z.ZodDate;
	}) => T;
	/**
	 * If set to `true`, generates `.astro/astro-env.d.ts` with types
	 * based on {schema} and updates `src/env.d.ts`.
	 *
	 * @default true
	 */
	generateTypes?: boolean;
	/**
	 * If set to `true`, generates a `.env.template` with keys based
	 * on {schema}.
	 *
	 * @default false
	 */
	generateEnvTemplate?: boolean;
};
