import type { AnyZodObject } from "astro/zod";
import type { Plugin } from "vite";
import zodToJsonSchema from "zod-to-json-schema";

function resolveVirtualModuleId<T extends string>(id: T): `\0${T}` {
	return `\0${id}`;
}

export const virtualImportsPlugin = ({
	schema,
}: {
	schema: AnyZodObject;
}): Plugin => {
	const modules: Record<string, string> = {
		// TODO: Cannot find module 'json-schema-to-zod' imported from 'env:astro'
		"env:astro": `import { jsonSchemaToZod } from "json-schema-to-zod";

const jsonSchema = ${JSON.stringify(zodToJsonSchema(schema))};

const schema = jsonSchemaToZod(jsonSchema, { module: "esm" });

export const env = {
    ${Object.keys(schema.shape)
			.map((key) => `${key}:schema.shape[key].parse(import.meta.env.${key})`)
			.join(",\n")}
    };`,
	};

	/** Mapping names prefixed with `\0` to their original form. */
	const resolutionMap = Object.fromEntries(
		(Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
			resolveVirtualModuleId(key),
			key,
		]),
	);

	return {
		name: "astro-env/virtual",
		resolveId(id) {
			if (id in modules) return resolveVirtualModuleId(id);
		},
		load(id) {
			const resolution = resolutionMap[id];
			if (resolution) return modules[resolution];
		},
	};
};
