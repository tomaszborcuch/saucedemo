import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,

  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
