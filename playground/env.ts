import { defineEnvSchema } from "astro-env";
import { z } from "astro/zod";

export default defineEnvSchema(
	z.object({
		ABC: z.string(),
		DEF: z.coerce.number(),
	}),
);
