import type { AnyZodObject } from "astro/zod";

export type Options = {
	/**
	 * Zod schema used to validate your environment variables.
	 */
	schema: AnyZodObject;
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
