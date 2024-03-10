import { definePlugin } from "astro-integration-kit";
import { addVirtualImport } from "astro-integration-kit/utilities";
import { variablesSchemaReturns } from "./integration.js";
import type { z } from "astro/zod";

export const staticEnvPlugin = definePlugin({
	name: "staticEnv",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig }) =>
		({
			name,
			variables,
		}: { name: string; variables: z.infer<typeof variablesSchemaReturns> }) => {
			addVirtualImport({
				updateConfig,
				name,
				content: (() => {
					let content = "";
					for (const [key, params] of Object.entries(variables)) {
						const variableDefault = (() => {
							if (params.options.default !== undefined) {
								if (params.type === "boolean") {
									return JSON.stringify(params.options.default);
								}
								if (params.type === "enum") {
									return `"${params.options.default}"`;
								}
								if (params.type === "number") {
									return `${params.options.default}`;
								}
								if (params.type === "string") {
									return `"${params.options.default}"`;
								}
								params satisfies never;
							}
							return "undefined";
						})();
						content += `export const ${key} = import.meta.env["${key}"] ?? ${variableDefault};`;
					}
					return content;
				})(),
			});

			return (() => {
				let content = `declare module "${name}" {`;
				for (const [key, params] of Object.entries(variables)) {
					const variableType = (() => {
						if (params.type === "boolean") {
							if (params.options.default !== undefined) {
								return "boolean";
							}
							if (params.options.optional !== undefined) {
								return "boolean | undefined";
							}
							return "boolean";
						}
						if (params.type === "enum") {
							const union = params.options.values
								.map((v) => `"${v}"`)
								.join(" | ");
							if (params.options.default !== undefined) {
								return union;
							}
							if (params.options.optional !== undefined) {
								return `${union} | undefined`;
							}
							return union;
						}
						if (params.type === "number") {
							if (params.options.default !== undefined) {
								return "number";
							}
							if (params.options.optional !== undefined) {
								return "number | undefined";
							}
							return "number";
						}
						if (params.type === "string") {
							if (params.options.default !== undefined) {
								return "string";
							}
							if (params.options.optional !== undefined) {
								return "string | undefined";
							}
							return "string";
						}
						params satisfies never;
						throw new Error("Should never be reached");
					})();
					content += `export const ${key}: ${variableType};\n`;
				}
				content += "}";
				return content;
			})();
		},
});
