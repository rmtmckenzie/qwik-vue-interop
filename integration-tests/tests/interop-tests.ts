import { test, expect } from '@playwright/test';

export function registerInteropTests(
  getUrl: () => string,
  initialVal: number,
  expectedInitLog?: string
) {
  test('vite stuff is rendered on page load', async ({ page }) => {
    const url = getUrl();
    await page.goto(url);

    // Check that Vue/Vite card actually exists in the DOM
    await expect(page.locator('.vue-card')).toBeAttached({ timeout: 10000 });
    await expect(page.locator('.vue-card')).toBeVisible({ timeout: 10000 });

    // Check initial values are rendered correctly
    const valStr = initialVal.toString();
    await expect(page.locator('.id-qwik-count')).toHaveText(valStr);
    await expect(page.locator('.id-vue-count')).toHaveText(valStr);

    if (expectedInitLog) {
      await expect(page.locator('#console-logs')).toContainText(expectedInitLog);
    }
  });

  test('clicking on vite increment increments counter and adds to console', async ({ page }) => {
    const url = getUrl();
    await page.goto(url);

    // Check that Vue/Vite card is visible
    await expect(page.locator('.vue-card')).toBeVisible({ timeout: 10000 });

    const vueButton = page.locator('#vue-button');
    await vueButton.click();

    const expectedVal = (initialVal + 1).toString();
    await expect(page.locator('.id-vue-count')).toHaveText(expectedVal);
    await expect(page.locator('.id-qwik-count')).toHaveText(expectedVal);
    await expect(page.locator('#console-logs')).toContainText(`updated local count to ${expectedVal}`);
  });

  test('increment qwik 10 times and check that vite stuff still there after each click', async ({ page }) => {
    const url = getUrl();
    await page.goto(url);

    // Check that Vue/Vite card is visible
    await expect(page.locator('.vue-card')).toBeVisible({ timeout: 10000 });

    const qwikButton = page.locator('#qwik-button');
    const qwikCountEl = page.locator('.id-qwik-count');
    const vueCountEl = page.locator('.id-vue-count');
    const vueCardEl = page.locator('.vue-card');

    for (let i = 1; i <= 10; i++) {
      await qwikButton.click();
      const expectedVal = (initialVal + i).toString();
      await expect(qwikCountEl).toHaveText(expectedVal);
      await expect(vueCountEl).toHaveText(expectedVal);
      await expect(vueCardEl).toBeVisible();
    }
  });
}
