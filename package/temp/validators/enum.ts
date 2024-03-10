import { z } from "astro/zod";

export const enumFnArgs = z
	.object({
		values: z.array(z.string()),
		optional: z.boolean().optional(),
		default: z.string().optional(),
	})
	.refine(
		(val) =>
			val.default === undefined ? true : val.values.includes(val.default),
		{
			message: "Must be part of `values`",
			path: ["default"],
		},
	);

export const enumFnReturns = z.object({
	type: z.literal("enum"),
	options: enumFnArgs,
	schema: z.any(),
});

export const enumFnSchema = z
	.function()
	.args(enumFnArgs)
	.returns(enumFnReturns);

export const enumFnPublicSchema = enumFnSchema;

export const enumFn = enumFnSchema.implement((options) => {
	let schema: any = z.enum(options.values as any);

	if (options.optional) {
		schema = schema.optional();
	}
	if (options.default) {
		schema = schema.default(options.default);
	}

	return { type: "enum" as const, options, schema };
});
