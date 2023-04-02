import { test, expect } from '@playwright/test';

test('has cookie consent banner deny path', async ({ page }) => {
  await page.goto('/');

  expect(await page.locator('id=hotjar-script').count()).toBe(0);
  expect(await page.locator('id=gtm').count()).toBe(0);

  const dialog = await page.getByRole('dialog');
  await expect(dialog).toBeInViewport();
  await expect(dialog).toHaveAttribute('aria-describedby', 'cookie-consent-text');
  await expect(dialog).toHaveAttribute('aria-labelledby', 'cookie-consent-header');

  const denyButton = await page.getByRole('button', { name: 'Deny' });
  await denyButton.click();

  await expect(dialog).not.toBeInViewport();

  expect(await page.locator('id=hotjar-script').count()).toBe(0);
  expect(await page.locator('id=gtm').count()).toBe(0);

});

test('has cookie consent banner accept path', async ({ page }) => {
  await page.goto('/');

  expect(await page.locator('id=hotjar-script').count()).toBe(0);
  expect(await page.locator('id=gtm').count()).toBe(0);

  const dialog = await page.getByRole('dialog');
  await expect(dialog).toBeInViewport();
  await expect(dialog).toHaveAttribute('aria-describedby', 'cookie-consent-text');
  await expect(dialog).toHaveAttribute('aria-labelledby', 'cookie-consent-header');
  const analyticsCheckbox = await page.getByLabel('Analytics');

  expect(await analyticsCheckbox.isChecked()).toBe(true);

  const denyButton = await page.getByRole('button', { name: 'Accept' });
  await denyButton.click();

  await expect(dialog).not.toBeInViewport();

  expect(await page.locator('id=hotjar-script').count()).toBe(1);
  expect(await page.locator('id=gtm').count()).toBe(1);

});
