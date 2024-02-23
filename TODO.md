- [x] env validation
- [x] `env:astro/static`
- [ ] dynamic variables
  - [ ] `getEnvEntrypoint`
  - [ ] `env:astro/dynamic` + `getEnv`
  - [ ] `getEnv` client-side leaking protection
- [ ] alternate schema for `variables`
- [ ] testing
- [ ] docs update

Example usage

```ts
env({
	variables: ["PORT"],
	validationLevel: "warn",
	getEnvEntrypoint: "./file.ts"
})

env({
	variables: ({ string }) => ({
		FOO: string({ maxLength: 5 })
	}),
	validationLevel: "error"
})

import { PORT } from "env:astro"
import * as env from "env:astro"
import { getEnv } from "env:astro/dynamic"

getEnv("MY_DYNAMIC_VAR")
getEnv("PUBLIC_MY_DYNAMIC_VAR") // TODO: error on client
```