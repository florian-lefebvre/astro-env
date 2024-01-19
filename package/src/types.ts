import type { AnyZodObject } from "astro/zod"

export type Options = {
    schema: AnyZodObject;
    generateTypes?: boolean;
    generateEnvTemplate?: boolean;
}