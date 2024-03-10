/// <reference types="astro/client" />

declare module "virtual:astro-env/entrypoint" {
	export const getEnvVariable: import("./types.js").GetEnvVariable;
}
