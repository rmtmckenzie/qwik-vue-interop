import { test, expect } from '@playwright/test';

test.describe('Qwik-Vue Client-Only Integration', () => {
  test('should NOT pre-render Vue component on the server (Client-Only)', async ({ request }) => {
    // Fetch raw HTML from server directly without executing client JS
    const response = await request.get('http://localhost:5174/');
    const html = await response.text();
    
    // Assert that the Vue component markup is NOT present in the initial server HTML
    expect(html).not.toContain('Vue Component');
    expect(html).not.toContain('id-vue-count');
  });

  test('should mount Vue component in browser and allow full reactive interop', async ({ page }) => {
    // Load page in browser
    await page.goto('http://localhost:5174/');
    
    const qwikCountEl = page.locator('.id-qwik-count');
    const vueCountEl = page.locator('.id-vue-count');
    const consoleLogsEl = page.locator('#console-logs');
    
    // Wait for Vue to mount on client
    await expect(page.locator('.vue-card')).toBeVisible();
    
    await expect(qwikCountEl).toHaveText('20');
    await expect(vueCountEl).toHaveText('20');
    await expect(consoleLogsEl).toContainText('[Qwik] Client-Only System initialized');
    
    // Test Qwik-to-Vue Reactivity
    const qwikButton = page.locator('#qwik-button');
    await qwikButton.click();
    
    await expect(qwikCountEl).toHaveText('21');
    await expect(vueCountEl).toHaveText('21');
    await expect(consoleLogsEl).toContainText('Qwik incremented counter to 21');
    
    // Test Vue-to-Qwik Reactivity
    const vueButton = page.locator('#vue-button');
    await vueButton.click();
    
    await expect(vueCountEl).toHaveText('22');
    await expect(qwikCountEl).toHaveText('22');
    await expect(consoleLogsEl).toContainText('Vue component updated local count to 22');
  });
});
