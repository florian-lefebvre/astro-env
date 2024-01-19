# `astro-env`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that allows you to validate and type your environement variables automatically using zod.

## Usage

### Prerequisites

TODO:

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
+import integration from "astro-env";

export default defineConfig({
  integrations: [
+    integration(),
  ],
});
```

### Configuration

TODO:

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

## Acknowledgements

TODO:
