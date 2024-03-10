---
"astro-env": minor
---

This releases aims to align with the [env RFC](https://github.com/withastro/roadmap/issues/837). That unfortunately introduces breaking changes.

### From `schema` to `variables`

The `schema` option required a zod schema. Now, you need to use the `variables` options with their own validators. For example:

```diff
import { defineConfig } from "astro/config"
import env from "astro-env"
-import z from "astro/zod"

export default defineConfig({
    integrations: [
        env({
-            schema: z.object({
-                FOO: z.string().optional().default("bar")
-            }),
+            variables: (fields) => ({
+                FOO: fields.string({ optional: true, default: "bar" })
+            })
        })
    ]
})
```

More validators are available, check out the docs ("Configuration" section) to learn more.

### Removed `generateTypes`

`generateTypes` was optional and allowed to type `import.meta.env` for you. This option is now removed. Instead, a new import `env:astro/static` is automatically typed based on your `variables` option.

```diff
import { defineConfig } from "astro/config"
import env from "astro-env"

export default defineConfig({
    integrations: [
        env({
-            generateTypes: true
        })
    ]
})
```

```diff
-const FOO = import.meta.env.FOO;
+import { FOO } from "env:astro/static"
```

There are more non breaking changes, check the docs to learn more.