import { test, expect } from '@playwright/test';
import { registerInteropTests } from './interop-tests';

const targets = [
  { name: 'Dev', getUrl: () => `http://localhost:${process.env.PORT_DEV_SSR}/` },
  { name: 'Prod', getUrl: () => `http://localhost:${process.env.PORT_SERVE_SSR}/` },
];

for (const target of targets) {
  test.describe(`Qwik-Vue SSR Integration - ${target.name}`, () => {
    test('should pre-render Vue component on the server (SSR)', async ({ request }) => {
      const url = target.getUrl();
      // Fetch raw HTML from server directly without executing client JS
      const response = await request.get(url);
      const html = await response.text();

      // Assert that the Vue component markup is present in the initial server HTML
      expect(html).toContain('Vue Component');
      expect(html).toContain('id-vue-count');
      expect(html).toContain('10');
    });

    registerInteropTests(target.getUrl, 10, '[Qwik] System initialized');
  });
}
