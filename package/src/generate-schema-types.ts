import { readFile, writeFile } from "node:fs/promises";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegrationLogger } from "astro";
import type { AnyZodObject } from "astro/zod";
import { createTypeAlias, printNode, zodToTs } from "zod-to-ts";
import { ensureDirExists } from "./utils.js";

// https://github.com/lilnasy/gratelets/blob/main/packages/typed-api/integration.ts#L71
const injectEnvDTS = async ({
	srcDir,
	logger,
	specifier,
}: {
	srcDir: URL;
	logger: AstroIntegrationLogger;
	specifier: URL | string;
}) => {
	const envDTsPath = fileURLToPath(new URL("env.d.ts", srcDir));

	if (specifier instanceof URL) {
		specifier = fileURLToPath(specifier);
		specifier = relative(fileURLToPath(srcDir), specifier);
		specifier = specifier.replaceAll("\\", "/");
	}

	const envDTsContents = await readFile(envDTsPath, "utf8");

	if (envDTsContents.includes(`/// <reference types='${specifier}' />`)) {
		return;
	}
	if (envDTsContents.includes(`/// <reference types="${specifier}" />`)) {
		return;
	}

	const newEnvDTsContents = envDTsContents
		.replace(
			`/// <reference types='astro/client' />`,
			`/// <reference types='astro/client' />\n/// <reference types='${specifier}' />\n`,
		)
		.replace(
			`/// <reference types="astro/client" />`,
			`/// <reference types="astro/client" />\n/// <reference types="${specifier}" />\n`,
		);

	// the odd case where the user changed the reference to astro/client
	if (newEnvDTsContents === envDTsContents) {
		return;
	}

	await writeFile(envDTsPath, newEnvDTsContents);
	logger.info("Updated env.d.ts types");
};

export const generateSchemaTypes = async ({
	root,
	srcDir,
	logger,
	schema,
}: {
	root: URL;
	srcDir: URL;
	logger: AstroIntegrationLogger;
	schema: AnyZodObject;
}) => {
	const identifier = "_AstroEnvSchema";
	const { node } = zodToTs(schema, identifier);
	const typeAlias = createTypeAlias(node, identifier);
	const nodeString = printNode(typeAlias);

	const dtsURL = new URL(".astro/astro-env.d.ts", root);
	const filePath = fileURLToPath(dtsURL);
	const fileContent = `${nodeString}

type AstroEnvSchema = Readonly<${identifier}>

interface ImportMetaEnv extends AstroEnvSchema {}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module "env:astro" {
	export type AstroEnv = Readonly<${identifier}>;

	export const env: AstroEnv;
}`;

	await ensureDirExists(filePath);
	await writeFile(filePath, fileContent);
	await injectEnvDTS({
		srcDir,
		logger,
		specifier: dtsURL,
	});
};
