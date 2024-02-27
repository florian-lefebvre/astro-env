import type { AstroGlobal } from "astro";

export type GetEnvVariable = (
	key: string,
	options: { locals: AstroGlobal["locals"] },
) => string | undefined;
