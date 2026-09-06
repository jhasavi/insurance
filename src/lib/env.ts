import { z } from 'zod';

const isProduction = process.env.NODE_ENV === 'production';

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  /** Required in production; optional in dev so planning tools work without Supabase */
  DATABASE_URL: isProduction
    ? z.string().min(1, 'Database connection string is required')
    : z.string().min(1).optional(),

  NEXTAUTH_SECRET: z.string().min(32, 'Secret key is required for session encryption').default(
    isProduction ? '' : 'dev-secret-replace-in-production-min-32-chars'
  ),
  NEXTAUTH_URL: z.string().url('Must be a valid URL').default('http://localhost:3001'),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional().default('noreply@namasteinsurance.com'),

  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.string().optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),

  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),

  NEXT_PUBLIC_JANAGANA_PORTAL_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_JANAGANA_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_JANAGANA_TENANT_SLUG: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

  SENTRY_DSN: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
});

const validatedEnv = envSchema.safeParse(process.env);

if (!validatedEnv.success) {
  console.error('❌ Invalid environment variables:', validatedEnv.error.flatten().fieldErrors);

  if (isProduction) {
    process.exit(1);
  }
}

export const env = validatedEnv.success ? validatedEnv.data : ({} as z.infer<typeof envSchema>);

export type Env = z.infer<typeof envSchema>;

/** True when Postgres is configured (auth, admin, compare flows). */
export const hasDatabase = Boolean(process.env.DATABASE_URL?.trim());

if (!hasDatabase && !isProduction) {
  console.warn(
    'ℹ️  DATABASE_URL not set — portfolio tools use browser storage + JSON files. Sign-in, admin, and compare need a database.'
  );
}
