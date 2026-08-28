import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('completes a drill and saves its station locally', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('button', { name: /01.*Size before precision/ })).toHaveAttribute('aria-current', 'step');
  await page.getByRole('button', { name: /Estimate/ }).first().click();
  await expect(page.getByText(/Good route: Estimate/)).toBeVisible();
  await page.getByLabel('About £1,000').check();
  await page.getByRole('button', { name: 'Check this answer' }).click();
  await expect(page.getByText('Correct—the check agrees.')).toBeVisible();
  await expect(page.getByText('1 / 20 complete')).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('math-tooling-notebook:v1') ?? '{}'));
  expect(saved.completed).toContain(1);
});

test('plotter gives an accessible error and recovers', async ({ page }) => {
  await page.locator('#plot-expression').fill('2x');
  await page.getByRole('button', { name: 'Plot function' }).click();
  await expect(page.locator('#plot-error')).toContainText('Unexpected');
  await page.locator('#plot-expression').fill('x^2 - 4');
  await page.getByRole('button', { name: 'Plot function' }).click();
  await expect(page.locator('#plot-error')).toBeEmpty();
  await expect(page.locator('#plot-table table')).toBeVisible();
});

test('main page has no serious accessibility violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('legal pages are present and navigable', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible();
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms of use' })).toBeVisible();
});

test('390px layout does not overflow horizontally', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);
  await expect(page.getByRole('button', { name: /Estimate/ }).first()).toBeVisible();
});
