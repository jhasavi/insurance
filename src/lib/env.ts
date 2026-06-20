import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // Required for production
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'Database connection string is required'),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32, 'Secret key is required for session encryption').default(
    process.env.NODE_ENV === 'production' 
      ? '' // Force explicit setting in production
      : 'dev-secret-replace-in-production'
  ),
  NEXTAUTH_URL: z.string().url('Must be a valid URL').default('http://localhost:3000'),
  
  // Email (SMTP or Resend)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional().default('noreply@namasteinsurance.com'),
  
  // SMTP Configuration (alternative to Resend)
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.string().optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
    
  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),

  // JanaGana CRM integration
  NEXT_PUBLIC_JANAGANA_PORTAL_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_JANAGANA_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_JANAGANA_TENANT_SLUG: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  
  // Optional but recommended
  SENTRY_DSN: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
});

// Validate the environment variables
const validatedEnv = envSchema.safeParse(process.env);

if (!validatedEnv.success) {
  console.error('❌ Invalid environment variables:', validatedEnv.error.flatten().fieldErrors);
  
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// Export validated environment variables
export const env = validatedEnv.success ? validatedEnv.data : {} as z.infer<typeof envSchema>;

// Export the type for use in other files
export type Env = z.infer<typeof envSchema>;
