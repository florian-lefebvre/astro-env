declare module "virtual:astro-env/entrypoint" {
	export const getEnvVariable: (key: string) => string | undefined;
}
