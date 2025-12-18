# astro-env-bun

> A small astro integration to add `.env` types defined using `envField` to Bun's `env`

Astro has a really nice API with virtual modules to define type-safe `.env` variables for the Astro environment.
Unfortunately, virtual modules aren't always available to use (in `astro.config`, for example), so there's still a possibility to end up with untyped `.env` variables

# Auto-install

```bash
bun astro add astro-env-bun
```

# Manual install

```bash
bun add -D astro-env-bun
```

# Use

1. Set up your Astro config.\
  `astro.config.ts`
    ```ts
    import envBun, { defineSchema } from 'astro-env-bun';

    // ...
    export default defineConfig({
      env: {
        // [optional] Integrate resulting variables into bun
        schema: defineSchema({
          // ... define your env variables as usual
          MY_VARIABLE: envField.string({
            context: 'client',
            access: 'public',
            default: 'my env variable'
            // ...
          }),
        })
      }
      // ...
      integrations: [
        // ... if not auto-installed, make sure to add:
        envBun()
      ]
    });
    ```

2. `bun astro sync` (automatically runs on any other astro command like `dev`).

3. Use Bun's `env` with types from `astro:env/client` and `astro:env/server`!
    ```ts
    import { env } from 'bun';

    // typed as string
    env.MY_VARIABLE;
    ```
