# `astro-env`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that allows you to validate and type your environement variables automatically using zod.

## Usage

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-env
```

```bash
npx astro add astro-env
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
+import env from "astro-env";

export default defineConfig({
  integrations: [
+    env({ ... }),
  ],
});
```

### How to use?

`astro-env` allows to use static and dynamic environment variables in a convenient way.

### Static variables

Those variables needs to be manually registered using `variables` (see "Configuration" below). That will
check them at build-time and automatically type them. They can be accessed through the `env:astro/static` import.

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import env from "astro-env";

export default defineConfig({
	integrations: [
		env({
			variables: (fields) => ({
				MODE: fields.enum({
					values: ["dev", "prod"],
					optional: true,
					default: "dev"
				}),
				PORT: fields.number({
					gte: 2000,
					lte: 5000,
					optional: true,
					default: 4321
				}),
			})
		})
	]
})
```

```ts
// src/pages/index.astro
import { MODE, PORT} from "env:astro/static"

MODE
// ^? "dev" | "prod"
PORT
// ^? number
```

### Dynamic variables

Those variables can be accessed at runtime (if your host supports it). They can be accessed through `locals`.

```ts
// src/pages/index.astro
Astro.locals.env.MY_DYNAMIC_VAR
```

### Configuration

Here is the TypeScript type:

```ts
export type Options = {
    variables: (fields: Fields) => Schema;
    validationLevel?: "warn" | "error";
    runtime?: "node" | "deno" | "cloudflare" | "bun";
}
```

#### `variables`

Allows you to define a schema to validate your environment variables at runtime. Types will be inferred based on those.

```ts
import { defineConfig } from "astro/config";
import env from "astro-env";

export default defineConfig({
	integrations: [
		env({
			variables: (fields) => ({
				PROD_URL: fields.string({
					url: true
				}),
				MODE: fields.enum({
					values: ["dev", "prod"],
					optional: true,
					default: "dev"
				}),
				PORT: fields.number({
					gte: 2000,
					lte: 5000,
					optional: true,
					default: 4321
				}),
				SHOW_OVERLAY: fields.boolean({
					optional: true,
					default: false
				})
			})
		})
	]
})
```

#### `validationLevel`

Specifies if running the app (not matter the mode) should warn or fail if provided variables are invalid. Defaults to `"warn"`.

```ts
import { defineConfig } from "astro/config";
import env from "astro-env";

export default defineConfig({
	integrations: [
		env({
			// ...
			validationLevel: "error"
		})
	]
})
```

### `runtime`

Changes how dynamic environment varriables are retrieved at runtime. The value depends on the adapter being used but fallbacks to `"node"`. You can override it if you're using another runtime without its corresponding adapter.

```ts
import { defineConfig } from "astro/config";
import env from "astro-env";

export default defineConfig({
	integrations: [
		env({
			// ...
			runtime: "bun"
		})
	]
})
```

#### `generateEnvTemplate`

Generates a `.env.template` with the `variables` returned object keys if enabled. Defaults to `false`.

```ts
import { defineConfig } from "astro/config";
import env from "astro-env";

export default defineConfig({
	integrations: [
		env({
			// ...
			generateEnvTemplate: true
		})
	]
})
```

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

