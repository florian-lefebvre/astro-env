import { z } from "astro/zod";

export const numberFnArgs = z
	.object({
		gt: z.number().optional(),
		gte: z.number().optional(),
		lt: z.number().optional(),
		lte: z.number().optional(),
		int: z.boolean().optional(),
		optional: z.boolean().optional(),
		default: z.number().optional(),
	})
	.optional()
	.default({});

export const numberFnReturns = z.object({
	type: z.literal("number"),
	options: numberFnArgs,
	schema: z.any(),
});

export const numberFnSchema = z
	.function()
	.args(numberFnArgs)
	.returns(numberFnReturns);

export const numberFnPublicSchema =
	z.custom<
		(params?: z.infer<typeof numberFnArgs>) => z.infer<typeof numberFnReturns>
	>();

export const numberFn = numberFnSchema.implement((options) => {
	let schema: any = z.coerce.number();

	if (options.gt) {
		schema = schema.gt(options.gt);
	}
	if (options.gte) {
		schema = schema.gte(options.gte);
	}
	if (options.lt) {
		schema = schema.lt(options.lt);
	}
	if (options.lte) {
		schema = schema.lte(options.lte);
	}
	if (options.int) {
		schema = schema.int();
	}
	if (options.optional) {
		schema = schema.optional();
	}
	if (options.default) {
		schema = schema.default(options.default);
	}

	return { type: "number" as const, options, schema };
});
