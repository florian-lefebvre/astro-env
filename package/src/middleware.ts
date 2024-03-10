import { defineMiddleware } from "astro:middleware";
import { getEnvVariable } from "virtual:astro-env/entrypoint";

export const onRequest = defineMiddleware(async ({ locals }, next) => {
	locals.env = new Proxy<Record<string, string>>(
		{},
		{
			get(_target, prop, _receiver) {
				if (typeof prop === "string") {
					return getEnvVariable(prop, { locals });
				}
			},
		},
	);

	next();
});
