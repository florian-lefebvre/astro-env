import { z } from "astro/zod";

export const stringFnArgs = z
	.object({
		max: z.number().optional(),
		min: z.number().optional(),
		length: z.number().optional(),
		email: z.boolean().optional(),
		url: z.boolean().optional(),
		uuid: z.boolean().optional(),
		regex: z.instanceof(RegExp).optional(),
		includes: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		datetime: z.boolean().optional(),
		ip: z.boolean().optional(),
		optional: z.boolean().optional(),
		default: z.string().optional(),
	})
	.optional()
	.default({});

export const stringFnReturns = z.object({
	type: z.literal("string"),
	options: stringFnArgs,
	schema: z.any(),
});

export const stringFnSchema = z
	.function()
	.args(stringFnArgs)
	.returns(stringFnReturns);

export const stringFnPublicSchema =
	z.custom<
		(params?: z.infer<typeof stringFnArgs>) => z.infer<typeof stringFnReturns>
	>();

export const stringFn = stringFnSchema.implement((options) => {
	let schema: any = z.string();
	if (options.max) {
		schema = schema.max(options.max);
	}
	if (options.min) {
		schema = schema.min(options.min);
	}
	if (options.length) {
		schema = schema.length(options.length);
	}
	if (options.email) {
		schema = schema.email();
	}
	if (options.url) {
		schema = schema.url();
	}
	if (options.uuid) {
		schema = schema.uuid();
	}
	if (options.regex) {
		schema = schema.regex(options.regex);
	}
	if (options.includes) {
		schema = schema.includes(options.includes);
	}
	if (options.startsWith) {
		schema = schema.startsWith(options.startsWith);
	}
	if (options.endsWith) {
		schema = schema.endsWith(options.endsWith);
	}
	if (options.datetime) {
		schema = schema.datetime();
	}
	if (options.ip) {
		schema = schema.ip();
	}
	if (options.optional) {
		schema = schema.optional();
	}
	if (options.default) {
		schema = schema.default(options.default);
	}

	return {
		type: "string",
		options,
		schema,
	};
});
