import { z } from "astro/zod";

const stringFnOptions = z
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
const stringFnSchema = z
	.function()
	.args(stringFnOptions)
	.returns(
		z.object({
			type: z.literal("string"),
			options: stringFnOptions,
			schema: z.any(),
		}),
	);
const stringFn = stringFnSchema.implement((options) => {
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

const numberFnOptions = z
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
const numberFnSchema = z
	.function()
	.args(numberFnOptions)
	.returns(
		z.object({
			type: z.literal("number"),
			options: numberFnOptions,
			schema: z.any(),
		}),
	);
const numberFn = numberFnSchema.implement((options) => {
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

// TODO: use zod
const booleanFn = (options: {
	optional?: boolean;
	default?: boolean;
}) => {
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
};

// TODO: use zod
const enumFn = <TValues extends string = string>(options: {
	values: Array<TValues>;
	optional?: boolean;
	default?: TValues;
}) => {
	let schema: any = z.enum(options.values as any);

	if (options.optional) {
		schema = schema.optional();
	}
	if (options.default) {
		schema = schema.default(options.default);
	}

	return { type: "enum" as const, options, schema };
};

export const validators = {
	string: stringFn,
	number: numberFn,
	boolean: booleanFn,
	enum: enumFn,
};
