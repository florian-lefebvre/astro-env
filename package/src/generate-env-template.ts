import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { AstroIntegrationLogger } from "astro";
import type { AnyZodObject } from "astro/zod";

export const generateEnvTemplate = async ({
	root,
	logger,
	schema,
}: {
	root: URL;
	logger: AstroIntegrationLogger;
	schema: AnyZodObject;
}) => {
	const keys = Object.keys(schema.shape);

	const filePath = fileURLToPath(new URL(".env.template", root));
	const fileContent = keys.map((key) => `${key}=\n`).join("");

	await writeFile(filePath, fileContent);
	logger.info("Generated .env.template");
};
