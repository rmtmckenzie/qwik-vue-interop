import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev --prefix ../qwik-vue-ssr-demo -- --port 5173 --strictPort',
      url: 'http://localhost:5173',
      reuseExistingServer: false,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 120 * 1000,
    },
    {
      command: 'npm run dev --prefix ../qwik-vue-client-demo -- --port 5174 --strictPort',
      url: 'http://localhost:5174',
      reuseExistingServer: false,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 120 * 1000,
    }
  ],
});
