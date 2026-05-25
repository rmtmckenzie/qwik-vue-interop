import { test, expect } from '@playwright/test';
import { registerInteropTests } from './interop-tests';

const targets = [
  { name: 'Dev', getUrl: () => `http://localhost:${process.env.PORT_DEV_CLIENT}/` },
  { name: 'Prod', getUrl: () => `http://localhost:${process.env.PORT_SERVE_CLIENT}/` },
];

for (const target of targets) {
  test.describe(`Qwik-Vue Client-Only Integration - ${target.name}`, () => {
    test('should NOT pre-render Vue component on the server (Client-Only)', async ({ request }) => {
      const url = target.getUrl();
      // Fetch raw HTML from server directly without executing client JS
      const response = await request.get(url);
      const html = await response.text();

      // Assert that the Vue component markup is NOT present in the initial server HTML
      expect(html).not.toContain('Vue Component');
      expect(html).not.toContain('id-vue-count');
    });

    registerInteropTests(target.getUrl, 20, '[Qwik] Client-Only System initialized');
  });
}
