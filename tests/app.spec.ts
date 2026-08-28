import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('strict production CSP permits every rendered style', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  const response = await page.reload();
  const policy = await response?.headerValue('content-security-policy');

  expect(policy).toContain("style-src 'self'");
  expect(policy).not.toContain("'unsafe-inline'");
  await expect(page.locator('[style]')).toHaveCount(0);
  await expect(page.getByRole('progressbar', { name: 'Drills completed' })).toHaveAttribute('value', '0');
  expect(consoleErrors.filter((message) => /content security policy|csp/i.test(message))).toEqual([]);
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
  await expect(page.getByRole('progressbar', { name: 'Drills completed' })).toHaveAttribute('value', '1');
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

test('core practice controls work from the keyboard without a trap', async ({ page }) => {
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to notebook' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);

  const estimate = page.getByRole('button', { name: /Estimate/ }).first();
  await estimate.focus();
  await page.keyboard.press('Space');
  await expect(page.getByText(/Good route: Estimate/)).toBeVisible();
  await expect(estimate).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /Table/ }).first()).toBeFocused();
});

test('installed shell updates cleanly and reloads offline', async ({ page, context }) => {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  expect(await page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.update());

  const cacheState = await page.evaluate(async () => {
    const names = await caches.keys();
    const cache = await caches.open('math-tooling-notebook-v2');
    const script = document.querySelector<HTMLScriptElement>('script[type="module"]')?.src ?? '';
    const scriptResponse = await cache.match(script, { ignoreVary: true });
    return { names, hasRoot: Boolean(await cache.match('/')), scriptBytes: (await scriptResponse?.blob())?.size ?? 0 };
  });
  expect(cacheState.names).toContain('math-tooling-notebook-v2');
  expect(cacheState.names).not.toContain('math-tooling-notebook-v1');
  expect(cacheState.hasRoot).toBe(true);
  expect(cacheState.scriptBytes).toBeGreaterThan(0);

  await context.setOffline(true);
  try {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1, name: /Find your route/ })).toBeVisible();
    await expect(page.getByText(/You’re offline/)).toBeVisible();
  } finally {
    await context.setOffline(false);
  }
});

test('keeps user data local and loads no third-party resources', async ({ page }) => {
  const thirdPartyRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') thirdPartyRequests.push(request.url());
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByLabel('Working notes').fill('private estimate');
  await expect(page.getByRole('status', { name: '' }).filter({ hasText: 'Saved locally' })).toBeVisible();

  const privacyState = await page.evaluate(() => ({
    cookie: document.cookie,
    keys: Object.keys(localStorage),
    remoteResources: performance.getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((url) => new URL(url).origin !== location.origin),
  }));
  expect(thirdPartyRequests).toEqual([]);
  expect(privacyState.cookie).toBe('');
  expect(privacyState.keys).toEqual(['math-tooling-notebook:v1']);
  expect(privacyState.remoteResources).toEqual([]);
});

test('legal pages are present and navigable', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible();
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms of use' })).toBeVisible();
});

test('390px layout does not overflow horizontally', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'mobile') await page.setViewportSize({ width: 390, height: 844 });
  const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);
  await expect(page.getByRole('button', { name: /Estimate/ }).first()).toBeVisible();
});
