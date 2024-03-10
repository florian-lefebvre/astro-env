import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { AstroIntegrationLogger } from "astro";

export const generateEnvTemplate = async ({
	root,
	logger,
	keys,
}: {
	root: URL;
	logger: AstroIntegrationLogger;
	keys: Array<string>;
}) => {
	const filePath = fileURLToPath(new URL(".env.template", root));
	const fileContent = keys.map((key) => `${key}=\n`).join("");

	await writeFile(filePath, fileContent);
	logger.info("Generated .env.template");
};
