import type { z } from "astro/zod";
import type { variablesSchemaReturns } from "./integration.js";

export const staticEnv = (
	name: string,
	variables: z.infer<typeof variablesSchemaReturns>,
) => {
	let virtualImport = "";
	let dtsContent = `declare module "${name}" {`;

	for (const [key, params] of Object.entries(variables)) {
		const variableDefault = (() => {
			if (params.options.default !== undefined) {
				if (params.type === "boolean") {
					return params.options.default ? '"true"' : '"false"';
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

		const transformer = (() => {
			if (params.type === "boolean") {
				return (input) =>
					`${input} === "true" ? true : ${input} === "false" ? false : undefined`;
			}
			if (params.type === "enum") {
				return (input) => input;
			}
			if (params.type === "number") {
				return (input) =>
					`${input} === undefined ? undefined : Number(${input})`;
			}
			if (params.type === "string") {
				return (input) => input;
			}
			params satisfies never;
			throw new Error("Should never reach this");
		})() satisfies (input: string) => string;

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
				const union = params.options.values.map((v) => `"${v}"`).join(" | ");
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

		virtualImport += `export const ${key} = ${transformer(
			`(import.meta.env["${key}"] ?? ${variableDefault})`,
		)};\n`;
		dtsContent += `export const ${key}: ${variableType};`;
	}

	dtsContent += "}";

	return { dtsContent, virtualImport };
};
