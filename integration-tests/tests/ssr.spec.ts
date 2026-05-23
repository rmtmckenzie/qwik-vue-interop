import { test, expect } from '@playwright/test';

test.describe('Qwik-Vue SSR Integration', () => {
  test('should pre-render Vue component on the server (SSR)', async ({ request }) => {
    // Fetch raw HTML from server directly without executing client JS
    const response = await request.get('http://localhost:5173/');
    const html = await response.text();
    
    // Assert that the Vue component markup is present in the initial server HTML
    expect(html).toContain('Vue Component');
    expect(html).toContain('id-vue-count');
    expect(html).toContain('10');
  });

  test('should hydrate and allow full reactive interop in browser', async ({ page }) => {
    // Load page in browser
    await page.goto('http://localhost:5173/');
    
    const qwikCountEl = page.locator('.id-qwik-count');
    const vueCountEl = page.locator('.id-vue-count');
    const consoleLogsEl = page.locator('#console-logs');
    
    await expect(qwikCountEl).toHaveText('10');
    await expect(vueCountEl).toHaveText('10');
    await expect(consoleLogsEl).toContainText('[Qwik] System initialized');
    
    // Test Qwik-to-Vue Reactivity
    const qwikButton = page.locator('#qwik-button');
    await qwikButton.click();
    
    await expect(qwikCountEl).toHaveText('11');
    await expect(vueCountEl).toHaveText('11');
    await expect(consoleLogsEl).toContainText('Qwik incremented counter to 11');
    
    // Test Vue-to-Qwik Reactivity
    const vueButton = page.locator('#vue-button');
    await vueButton.click();
    
    await expect(vueCountEl).toHaveText('12');
    await expect(qwikCountEl).toHaveText('12');
    await expect(consoleLogsEl).toContainText('Vue component updated local count to 12');
  });
});
