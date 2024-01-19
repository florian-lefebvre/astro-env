# `astro-env`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that allows you to validate and type your environement variables automatically using zod.

## Usage

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-env
```

```bash
npm astro add astro-env
```

```bash
yarn astro add astro-env
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-env
```

```bash
npm install astro-env
```

```bash
yarn add astro-env
```

2. Add the integration to your astro config

```diff
+import astroEnv from "astro-env";

export default defineConfig({
  integrations: [
+    astroEnv({ ... }),
  ],
});
```

### Configuration

Here is the TypeScript type:

```ts
export type Options = {
    schema: AnyZodObject;
    generateTypes?: boolean;
    generateEnvTemplate?: boolean;
}
```

#### `schema`

Zod schema used to validate your environment variables. You can import zod from `astro/zod`:

```ts
import astroEnv from "astro-env";
import { defineConfig } from "astro/config";
import { z } from "astro/zod";

// https://astro.build/config
export default defineConfig({
	integrations: [
		astroEnv({
			schema: z.object({
				ABC: z.string(),
			}),
		}),
	],
});
```

When using `generateTypes`, make sure that the schema doesn't contain any transform and that all values are strings (they can be `z.string().url()` for example).

> Interested in supporting more data types? Open an issue!

#### `generateTypes`

If set to `true`, generates `.astro/astro-env.d.ts` with types based on the schema and updates `src/env.d.ts`. Defaults to `true`.

#### `generateEnvTemplate`

If set to `true`, generates a `.env.template` with keys based on the schema. Defaults to `false`

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground:

```bash
pnpm playground:dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/florian-lefebvre/astro-env/blob/main/LICENSE). Made with ❤️ by [Florian Lefebvre](https://github.com/florian-lefebvre).

