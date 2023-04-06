import { test, expect } from '@playwright/test';

test('has cookie consent banner deny path', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  // await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  expect(await page.locator('id=hotjar-script').count()).toBe(0);
  expect(await page.locator('id=gtm').count()).toBe(0);

  const dialog = await page.getByRole('dialog');
  await expect(dialog).toBeInViewport();
  await expect(dialog).toHaveAttribute('aria-describedby', 'cookie-consent-text');
  await expect(dialog).toHaveAttribute('aria-labelledby', 'cookie-consent-header');

  const denyButton = await page.getByRole('button', { name: 'Deny' });
  await denyButton.click();
  await page.waitForLoadState('networkidle');

  await expect(dialog).not.toBeInViewport();

  expect(await page.locator('id=hotjar-script').count()).toBe(0);
  expect(await page.locator('id=gtm').count()).toBe(0);

});

test('has cookie consent banner accept path', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  // await page.emulateMedia({ reducedMotion: 'reduce' });
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
  await page.waitForLoadState('networkidle');

  await expect(dialog).not.toBeInViewport();

  expect(await page.locator('id=hotjar-script').count()).toBe(1);
  expect(await page.locator('id=gtm').count()).toBe(1);

});

test('the cookie consent can be accepted via ESC', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const dialog = await page.getByRole('dialog');
  await expect(dialog).toBeInViewport();
  await page.keyboard.press('Escape');
  await page.waitForLoadState('networkidle');

  await expect(dialog).not.toBeInViewport();

  expect(await page.locator('id=hotjar-script').count()).toBe(1);
  expect(await page.locator('id=gtm').count()).toBe(1);

});
