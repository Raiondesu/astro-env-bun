import type { envField } from 'astro/config';

/**
 * Define schema envars' defaults directly into `process.env`
 * @param schema Your config's `env.schema` with variables defined using `envField`
 * @example
 * ```
 * export default defineConfig({
 *   env: {
 *     // Integrate resulting variables into bun
 *     schema: defineSchema({
 *       // ... define your env variables as usual
 *       MY_VARIABLE: envField.string({
 *         context: 'client',
 *         access: 'public',
 *         default: 'my env variable'
 *         // ...
 *       }),
 *     })
 *   },
 *   integrations: [
 *     // ... if not auto-installed, make sure to add:
 *     envBun()
 *     // ...
 *   ]
 * });
 * ```
 */
export function defineSchema<T extends Record<string, ReturnType<typeof envField[keyof typeof envField]>>>(schema: T): T {
  // Load default values for all variables that weren't read from .env files
  for (const envar in schema) {
    // @ts-ignore types should fit once astro sync runs at least once
    process.env[envar] ??= schema[envar]?.default;
  }

  return schema;
}

/**
 * Integrates `astro:env` types into Bun's `env`
 */
export default () => ({
  name: 'astro-env-bun',
  hooks: {
    'astro:config:done'({ injectTypes, logger }) {
      injectTypes({
        filename: 'bun-env.d.ts',
        content: /* ts */`
          type AstroEnvModule = (typeof import('astro:env/client') & typeof import('astro:env/server'));
          type AstroEnv = {
            [key in keyof AstroEnvModule]:
              AstroEnvModule[key] extends (ReturnType<typeof import('astro/config').envField>['default'])
              ? AstroEnvModule[key]
              : never;
          };

          declare module 'bun' { interface ImportMetaEnv extends AstroEnv { } }
        `.replace(/^ {8,10}/gm, '').trimStart()
      });

      logger.info("Updated bun env types");
    },
  },
} satisfies import('astro').AstroIntegration);