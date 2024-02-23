import { createResolver, definePlugin } from "astro-integration-kit";
import type { Plugin as VitePlugin } from "vite";
import type { Options } from "./integration.js";
import {
	addDts,
	addVirtualImport,
	addVitePlugin,
} from "astro-integration-kit/utilities";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

function virtualEntrypoint(
	options: { name: string } & Pick<Options, "entrypoint">,
): VitePlugin {
	const virtualModuleId = `virtual:${options.name}/entrypoint`;
	const resolvedVirtualModuleId = `\0${virtualModuleId}`;

	let isBuild: boolean;
	let root: string;
	let entrypoint: string | undefined;

	return {
		name: `${options.name}/entrypoint`,
		config(_, { command }) {
			isBuild = command === "build";
		},
		configResolved(config) {
			root = config.root;
			if (options.entrypoint) {
				entrypoint = options.entrypoint.startsWith(".")
					? resolve(root, options.entrypoint)
					: options.entrypoint;
			}
		},
		resolveId(id) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
		},
		load(id) {
			if (id === resolvedVirtualModuleId) {
				if (entrypoint) {
					const message = `"[${options.name}] entrypoint \`${JSON.stringify(
						entrypoint,
					)}\` does not export a default function."`;

					return `\
import * as mod from ${JSON.stringify(entrypoint)};

export const getEnvVariable = (key) => {
    if ("default" in mod) {
        return mod.default(key);
    } else {
        ${isBuild ? `throw new Error(${message})` : `console.warn(${message})`};
    }
}`;
				}
				return "export const getEnvVariable = (key) => process.env[key];";
			}
		},
	};
}

export const dynamicEnvPlugin = definePlugin({
	name: "dynamicEnv",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig }, { name: integrationName }) =>
		({ entrypoint, name }: { name: string } & Pick<Options, "entrypoint">) => {
			const { resolve } = createResolver(import.meta.url);

			addVitePlugin({
				updateConfig,
				plugin: virtualEntrypoint({ entrypoint, name: integrationName }),
			});

			addVirtualImport({
				updateConfig,
				name,
				content: readFileSync(
					resolve("./stubs/dynamic-env/virtual-import.mjs"),
					"utf-8",
				),
			});

			const content = readFileSync(
				resolve("./stubs/dynamic-env/dts.d.ts"),
				"utf-8",
			);

			return content;
		},
});
