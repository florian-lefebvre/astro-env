import type { HookParameters } from "astro";
import { createResolver } from "astro-integration-kit";
import { hasIntegration } from "astro-integration-kit/utilities";
import { readFileSync } from "node:fs";
import type { Options } from "./integration.js";

type Runtime = Required<Options>["runtime"];

const getRuntime = (
	config: HookParameters<"astro:config:setup">["config"],
): Runtime => {
	const check = (name: string) =>
		hasIntegration({
			name,
			config,
		});

	if (check("@astrojs/cloudflare")) {
		return "cloudflare";
	}
	if (check("@astrojs/deno")) {
		return "deno";
	}
	if (check("astro-bun-adapter")) {
		return "bun";
	}
	return "node";
};

export const dynamicEnv = (
	{ config, addMiddleware }: HookParameters<"astro:config:setup">,
	providedRuntime?: Runtime
) => {
	const { resolve } = createResolver(import.meta.url);

	const runtime = providedRuntime ?? getRuntime(config);

	addMiddleware({
		entrypoint: resolve("./middleware.ts"),
		order: "pre",
	});

	return {
		dtsContent: readFileSync(resolve("./stubs/dynamic-env/dts.d.ts"), "utf-8"),
		virtualImport: readFileSync(
			resolve(`./stubs/dynamic-env/${runtime}.mjs`),
			"utf-8",
		),
	};
};
