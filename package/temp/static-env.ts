import { definePlugin } from "astro-integration-kit";
import { addDts, addVirtualImport } from "astro-integration-kit/utilities";
import type { Options } from "./integration.js";

export const staticEnvPlugin = definePlugin({
	name: "staticEnv",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig, config, logger }) =>
		({ name, variables }: { name: string } & Pick<Options, "variables">) => {
			addVirtualImport({
				updateConfig,
				name,
				content: variables
					.map((v) => `export const ${v} = import.meta.env["${v}"];`)
					.join("\n"),
			});

			addDts({
				root: config.root,
				srcDir: config.srcDir,
				logger,
				name: "astro-env",
				content: `declare module "${name}" {
${variables.map((v) => `export const ${v}: string;`).join("\n")}
}`,
			});
		},
});
