import { z } from "astro/zod";

export const booleanFnArgs = z
	.object({
		optional: z.boolean().optional(),
		default: z.boolean().optional(),
	})
	.optional()
	.default({});

export const booleanFnReturns = z.object({
	type: z.literal("boolean"),
	options: booleanFnArgs,
	schema: z.any(),
});

export const booleanFnSchema = z
	.function()
	.args(booleanFnArgs)
	.returns(booleanFnReturns);

export const booleanFn = booleanFnSchema.implement((options) => {
	let schema: any = z.string();

	if (options.optional) {
		schema = schema.optional();
	}
	if (options.default) {
		schema = schema.default(options.default ? "true" : "false");
	}
	schema = schema
		.refine(
			(s: string | undefined) =>
				(options.optional && s === undefined) || s === "true" || s === "false",
		)
		.transform((s: string | undefined) =>
			typeof s === "string" ? s === "true" : undefined,
		);

	return { type: "boolean" as const, options, schema };
});
