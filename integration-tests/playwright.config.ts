import { defineConfig, devices } from '@playwright/test';

// Fixed ports for all four servers.
// reuseExistingServer: true means if these are already running they'll be reused;
// if they're free, Playwright will start them fresh.
const DEV_SSR_PORT = 5173;
const DEV_CLIENT_PORT = 5174;
const SERVE_SSR_PORT = 5175;
const SERVE_CLIENT_PORT = 5176;

process.env.PORT_DEV_SSR = String(DEV_SSR_PORT);
process.env.PORT_DEV_CLIENT = String(DEV_CLIENT_PORT);
process.env.PORT_SERVE_SSR = String(SERVE_SSR_PORT);
process.env.PORT_SERVE_CLIENT = String(SERVE_CLIENT_PORT);

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
      command: `npm run dev --prefix ../qwik-vue-ssr-demo -- --port ${DEV_SSR_PORT} --strictPort`,
      url: `http://localhost:${DEV_SSR_PORT}`,
      reuseExistingServer: true,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 120 * 1000,
    },
    {
      command: `npm run dev --prefix ../qwik-vue-client-demo -- --port ${DEV_CLIENT_PORT} --strictPort`,
      url: `http://localhost:${DEV_CLIENT_PORT}`,
      reuseExistingServer: true,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 120 * 1000,
    },
    {
      command: `PORT=${SERVE_SSR_PORT} node ../qwik-vue-ssr-demo/server/entry.express`,
      url: `http://localhost:${SERVE_SSR_PORT}`,
      reuseExistingServer: true,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 120 * 1000,
    },
    {
      command: `PORT=${SERVE_CLIENT_PORT} node ../qwik-vue-client-demo/server/entry.express`,
      url: `http://localhost:${SERVE_CLIENT_PORT}`,
      reuseExistingServer: true,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 120 * 1000,
    }
  ],
});
