import type { AstroIntegration } from "astro";
import { createResolver, watchIntegration } from "astro-integration-kit";
import { loadEnv } from "vite";
import { generateEnvTemplate } from "./generate-env-template.js";
import { generateSchemaTypes } from "./generate-schema-types.js";
import type { Options } from "./types.js";
import { validateEnv } from "./validate-env.js";

/** @deprecated Astro 4.10 now has `astro:env` in experimental: https://astro.build/blog/astro-4100/ */
export const integration = ({
  schema: _schema,
  generateTypes: _generateTypes = true,
  generateEnvTemplate: _generateEnvTemplate = false,
}: Options): AstroIntegration => {
  const options = {
    schema: _schema,
    generateTypes: _generateTypes,
    generateEnvTemplate: _generateEnvTemplate,
  };

  const { resolve } = createResolver(import.meta.url);

  return {
    name: "astro-env",
    hooks: {
      "astro:config:setup": ({
        addWatchFile,
        command,
        logger,
        updateConfig,
      }) => {
        logger.error(
          "This integration is deprecated. Astro 4.10 now has \`astro:env\` in experimental: https://astro.build/blog/astro-4100/"
        );

        watchIntegration({
          addWatchFile,
          command,
          dir: resolve(),
          updateConfig,
        });

        validateEnv({
          schema: options.schema,
          command,
          logger,
          env: loadEnv(
            command === "dev" ? "development" : "production",
            process.cwd(),
            ""
          ),
        });
      },
      "astro:config:done": async ({ config, logger }) => {
        if (options.generateTypes) {
          await generateSchemaTypes({
            root: config.root,
            srcDir: config.srcDir,
            logger,
            schema: options.schema,
          });
        }
        if (options.generateEnvTemplate) {
          await generateEnvTemplate({
            root: config.root,
            logger,
            schema: options.schema,
          });
        }
      },
    },
  };
};
