import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm start',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      PORT: '3001',
      DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://ci:ci@localhost:5432/ci',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? 'ci-test-secret-minimum-32-characters-long',
      NEXTAUTH_URL: 'http://localhost:3001',
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3001',
      NEXT_PUBLIC_JANAGANA_PORTAL_BASE_URL: 'https://janagana.namasteneedham.com',
      NEXT_PUBLIC_JANAGANA_API_URL: 'https://janagana.namasteneedham.com',
      NEXT_PUBLIC_JANAGANA_TENANT_SLUG: 'namaste-boston',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
