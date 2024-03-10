import type { HookParameters } from "astro";
import { createResolver, definePlugin } from "astro-integration-kit";
import {
	addVirtualImport,
	hasIntegration,
} from "astro-integration-kit/utilities";
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

export const dynamicEnvPlugin = definePlugin({
	name: "dynamicEnv",
	hook: "astro:config:setup",
	implementation:
		({ config, updateConfig, addMiddleware }) =>
		({ runtime: providedRuntime }: { runtime?: Runtime }) => {
			const { resolve } = createResolver(import.meta.url);

			const runtime = providedRuntime ?? getRuntime(config);

			addVirtualImport({
				updateConfig,
				name: "virtual:astro-env/entrypoint",
				content: readFileSync(
					resolve(`./stubs/dynamic-env/${runtime}.mjs`),
					"utf-8",
				),
			});

			addMiddleware({
				entrypoint: resolve("./middleware.ts"),
				order: "pre",
			});

			const content = readFileSync(
				resolve("./stubs/dynamic-env/dts.d.ts"),
				"utf-8",
			);

			return content;
		},
});
