import { expect, test, type Browser, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const baseURL = 'http://127.0.0.1:4173';
const realKey = 'math-tooling-notebook:v1';
const demoKey = 'demo:math-tooling-notebook:v1';

async function openNotebook(page: Page, path = '/'): Promise<void> {
  await page.goto(path);
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
}

async function openDemo(page: Page): Promise<void> {
  await openNotebook(page, '/demo');
  await expect(page.getByLabel('Demo mode')).toBeVisible();
  await expect(page.getByText('5 / 20 complete')).toBeVisible();
}

async function openIsolatedDemo(browser: Browser): Promise<{ context: Awaited<ReturnType<Browser['newContext']>>; page: Page }> {
  const context = await browser.newContext();
  const page = await context.newPage();
  await openDemo(page);
  return { context, page };
}

test('strict production CSP permits every rendered style', async ({ page }) => {
  await openNotebook(page);
  const response = await page.reload();
  const policy = await response?.headerValue('content-security-policy');

  expect(policy).toContain("style-src 'self'");
  expect(policy).toContain("connect-src 'self'");
  expect(policy).not.toContain("'unsafe-inline'");
  await expect(page.locator('[style]')).toHaveCount(0);
  await expect(page.getByRole('progressbar', { name: 'Drills completed' })).toHaveAttribute('value', '0');
});

test('notebook loads without browser console or page errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await openNotebook(page);
  expect(errors).toEqual([]);
});

test('landing copy audit is complete for the rendered notebook and passes plain-word checks', async ({ page }) => {
  await openNotebook(page);
  const audit = await readFile(new URL('../.factory/copy-audit.md', import.meta.url), 'utf8');
  const entries = Array.from(audit.matchAll(/^\|\s*(.*?)\s*\|\s*(\d+)\s*\|\s*(Pass)\s*\|$/gm), ([, text, words, result]) => ({ text, words: Number(words), result }));
  const wordCount = (text: string) => text.trim().split(/\s+/u).filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
  const banned = ['leverage', 'seamless', 'effortless', 'robust', 'powerful', 'intuitive', 'reimagine', 'supercharge', 'unlock', 'delightful', 'journey', 'ecosystem', 'AI-powered'];

  expect(entries.length).toBeGreaterThan(70);
  for (const entry of entries) {
    expect(entry.words, entry.text).toBe(wordCount(entry.text));
    expect(entry.words, entry.text).toBeLessThanOrEqual(22);
    expect(entry.result, entry.text).toBe('Pass');
    expect(entry.text.toLocaleLowerCase(), entry.text).not.toMatch(new RegExp(`\\b(?:${banned.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'i'));
  }

  const renderedCopy = await page.evaluate(() => {
    const normalize = (text: string | null) => (text ?? '').replace(/\s+/g, ' ').trim();
    const text = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector), (element) => normalize(element.innerText)).filter(Boolean);
    const imageDescription = Array.from(document.querySelectorAll<HTMLImageElement>('.poster-frame img'), (image) => image.alt);
    const quizPrompts = text('.quiz-question legend').map((prompt) => prompt.replace(/^\d+\s*/, ''));
    const quizTools = text('.quiz-tools label').map((tool) => tool.replace(/^[^\p{L}]+/u, ''));
    const placeholder = document.querySelector<HTMLTextAreaElement>('#scratchpad')?.placeholder ?? '';

    return [...new Set([
      normalize(document.querySelector('.skip-link')?.textContent),
      ...text('.site-header .brand > span:last-child, .site-header nav a'),
      ...text('.hero .eyebrow, .hero h1, .hero-lead, .hero-actions a, .action-result, .plain-facts li, .poster-frame figcaption'),
      ...imageDescription,
      ...text('.method .eyebrow, .method h2, .method-line strong, .method-line small'),
      ...text('.practice .eyebrow, .practice h2, .route-map .zone-label, .station em, .station-number, #drill-title, .drill-prompt, .tool-choice legend, .tool-choice > p, .tool-button strong, .tool-button small'),
      ...text('.plotter-section .eyebrow, .plotter-section h2, .plotter-section .section-heading p, .plot-controls label, .plot-controls button, #syntax-help'),
      ...text('.transfer .eyebrow, .transfer h2, .transfer .section-heading p, .transfer .route-badge'),
      ...quizPrompts,
      ...quizTools,
      ...text('.quiz-actions button'),
      ...text('.scratch-copy .eyebrow, .scratch-copy h2, .scratch-copy p, .scratch-paper label, #save-status, .scratch-actions button'),
      placeholder,
      ...text('.reset-zone h2, .reset-zone p, .reset-zone button, footer .brand > span:last-child, footer p, footer nav a'),
    ].filter(Boolean))];
  });
  const auditedCopy = new Set(entries.map(({ text }) => text.toLocaleLowerCase()));
  expect(renderedCopy.filter((copy) => !auditedCopy.has(copy.toLocaleLowerCase()))).toEqual([]);
});

test('Station 02 accepts x = 4 and shows both compared values', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: /02.*See repeated growth/ }).click();
  await page.getByRole('button', { name: /Table/ }).first().click();
  await expect(page.getByRole('table', { name: /Compare 2\^x and 3x/ })).toBeVisible();
  const fourthRow = page.getByRole('row', { name: /4\s+16\s+12/ });
  await expect(fourthRow).toBeVisible();
  await page.getByLabel('x = 4').check();
  await page.getByRole('button', { name: 'Check this answer' }).click();
  await expect(page.locator('.answer-feedback')).toHaveText('Correct—the check agrees.');
  await expect(page.locator('.explanation')).toContainText('2⁴ = 16 while 3x = 12');
});

test('plotter gives an accessible error and recovers', async ({ page }) => {
  await openDemo(page);
  await page.locator('#plot-expression').fill('2x');
  await page.getByRole('button', { name: 'Plot function' }).click();
  await expect(page.locator('#plot-error')).toContainText('Unexpected');
  await page.locator('#plot-expression').fill('x^2 - 4');
  await page.getByRole('button', { name: 'Plot function' }).click();
  await expect(page.locator('#plot-error')).toBeEmpty();
  await expect(page.locator('#plot-table table')).toBeVisible();
});

test('plotter handles non-real values and invalid axis bounds before recovering', async ({ page }) => {
  await openDemo(page);
  await page.locator('#plot-expression').fill('sqrt(-1)');
  await page.getByRole('button', { name: 'Plot function' }).click();
  await expect(page.locator('#plot-table')).toContainText('undefined');

  await page.locator('input[name="xMax"]').fill('-10');
  await page.getByRole('button', { name: 'Plot function' }).click();
  await expect(page.locator('#plot-error')).toHaveText('Each minimum must be smaller than its maximum.');

  await page.locator('input[name="xMax"]').fill('10');
  await page.locator('#plot-expression').fill('sin(x)');
  await page.getByRole('button', { name: 'Plot function' }).click();
  await expect(page.locator('#plot-error')).toBeEmpty();
  await expect(page.locator('#plot-table tbody tr')).toHaveCount(9);
});

test('main, legal, and 404 pages have no serious accessibility violations', async ({ page }) => {
  await openNotebook(page);
  for (const path of ['/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  }
});

test('core practice controls work from the keyboard without a trap', async ({ page }) => {
  await openNotebook(page);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to notebook' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);

  const estimate = page.getByRole('button', { name: /Estimate/ }).first();
  await estimate.focus();
  await page.keyboard.press('Space');
  await expect(page.getByText(/Good choice: Estimate/)).toBeVisible();
  await expect(estimate).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /Table/ }).first()).toBeFocused();
});

test('a confirmed real-notebook reset removes saved progress and notes', async ({ page }) => {
  await openNotebook(page);
  await page.getByRole('button', { name: /Estimate/ }).first().click();
  await page.getByLabel('About £1,000').check();
  await page.getByRole('button', { name: 'Check this answer' }).click();
  await page.getByLabel('Working notes').fill('A note that should be removed.');
  await expect(page.getByText('Saved locally')).toBeVisible({ timeout: 2_000 });
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Reset local notebook' }).click();
  await expect(page.getByRole('progressbar', { name: 'Drills completed' })).toHaveAttribute('value', '0');
  await expect(page.getByLabel('Working notes')).toHaveValue('');
  expect(await page.evaluate((key) => localStorage.getItem(key), realKey)).toBeNull();
});

test('installed service worker updates the versioned shell', async ({ page }) => {
  await openDemo(page);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  expect(await page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.update());
  const cacheState = await page.evaluate(async () => {
    const names = await caches.keys();
    const cache = await caches.open('math-tooling-notebook-v3');
    return { names, demo: Boolean(await cache.match('/demo')), root: Boolean(await cache.match('/')) };
  });
  expect(cacheState.names).toContain('math-tooling-notebook-v3');
  expect(cacheState.names).not.toContain('math-tooling-notebook-v2');
  expect(cacheState.demo).toBe(true);
  expect(cacheState.root).toBe(true);
});

test('dedicated routes have distinct titles and a designed not-found page', async ({ page }) => {
  await openNotebook(page, '/demo');
  await expect(page).toHaveTitle('Demo — Math Tooling Notebook');
  await page.goto('/privacy/');
  await expect(page).toHaveTitle('Privacy — Math Tooling Notebook');
  await page.goto('/terms/');
  await expect(page).toHaveTitle('Terms — Math Tooling Notebook');
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Math Tooling Notebook');
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to the notebook home' })).toBeVisible();
});

test('390px layout and every visible legal-page link meet target requirements', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'mobile') await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/privacy/', '/terms/', '/404.html']) {
    await openNotebook(page, path);
    const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(sizes.scroll, path).toBeLessThanOrEqual(sizes.client);
    const selector = path === '/' ? 'header a:visible, footer a:visible' : 'a:visible';
    const targets = await page.locator(selector).evaluateAll((links) => links.map((link) => {
      const bounds = link.getBoundingClientRect();
      return { name: link.textContent?.replace(/\s+/g, ' ').trim(), width: bounds.width, height: bounds.height };
    }));
    expect(targets.length, path).toBeGreaterThan(0);
    for (const target of targets) {
      expect.soft(target.width, `${path} ${target.name} width`).toBeGreaterThanOrEqual(44);
      expect.soft(target.height, `${path} ${target.name} height`).toBeGreaterThanOrEqual(44);
    }
  }
});

test('reduced motion removes poster movement', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    await openNotebook(page);
    const duration = await page.locator('.poster-frame').evaluate((element) => Number.parseFloat(getComputedStyle(element).animationDuration));
    expect(duration).toBeLessThanOrEqual(0.01);
  } finally {
    await context.close();
  }
});

test('@claim:demo-isolation Try sample data without changing your notebook', async ({ browser }) => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto('/');
    await page.evaluate((key) => localStorage.setItem(key, JSON.stringify({ completed: [9], quizAnswers: Array(6).fill(null), quizSubmitted: false, notes: 'real notebook note' })), realKey);
    await page.goto('/demo');
    await expect(page.getByLabel('Demo mode')).toContainText('Demo — sample data. Nothing is saved to your notebook.');
    await expect(page.getByLabel('Working notes')).toHaveValue(/at x = 4/);
    await page.getByRole('button', { name: 'Reset demo' }).click();
    const state = await page.evaluate(({ real, demo }) => ({ real: localStorage.getItem(real), demo: localStorage.getItem(demo) }), { real: realKey, demo: demoKey });
    expect(JSON.parse(state.real ?? '{}').notes).toBe('real notebook note');
    expect(JSON.parse(state.demo ?? '{}').completed).toEqual([1, 2, 3, 4, 5]);
    await page.getByRole('button', { name: 'Start for real' }).click();
    await expect(page).toHaveURL(`${baseURL}/`);
    await expect(page.getByLabel('Working notes')).toHaveValue('real notebook note');
    expect(await page.evaluate((key) => localStorage.getItem(key), demoKey)).toBeNull();
  } finally {
    await context.close();
  }
});

test('@claim:twenty-drills Includes 20 short maths-tool drills', async ({ page }) => {
  await openDemo(page);
  const ids = await page.locator('[data-drill]').evaluateAll((buttons) => buttons.map((button) => Number((button as HTMLElement).dataset.drill)));
  expect(ids).toEqual(Array.from({ length: 20 }, (_, index) => index + 1));
  await expect(page.getByRole('progressbar', { name: 'Drills completed' })).toHaveAttribute('max', '20');
  await expect(page.getByText('5 / 20 complete')).toBeVisible();
});

test('@claim:four-tool-practice Practise when to estimate, make a table, draw a graph, or check algebra', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: /01.*Size before precision/ }).click();
  await page.getByRole('button', { name: /Estimate/ }).first().click();
  await page.getByRole('button', { name: 'Reveal the working' }).click();
  await expect(page.getByText('50 × 20 = 1,000')).toBeVisible();

  await page.getByRole('button', { name: /02.*See repeated growth/ }).click();
  await page.getByRole('button', { name: /Table/ }).first().click();
  await expect(page.getByRole('table', { name: /Compare 2\^x and 3x/ })).toBeVisible();

  await page.getByRole('button', { name: /03.*Find the crossings/ }).click();
  await page.getByRole('button', { name: /Graph/ }).first().click();
  await expect(page.locator('canvas.mini-plot')).toHaveAttribute('aria-label', /Graph of y equals x\^2 - 4/);

  await page.getByRole('button', { name: /04.*Check an identity/ }).click();
  await page.getByRole('button', { name: /Algebra/ }).first().click();
  await expect(page.locator('.algebra-strip')).toContainText('(x + 3)(x + 3)');
});

test('@claim:function-plotter-table The function plotter gives a graph and an accessible value table', async ({ page }) => {
  await openDemo(page);
  await page.locator('#plot-expression').fill('x^2 - 4');
  await page.getByRole('button', { name: 'Plot function' }).click();
  await expect(page.getByRole('img', { name: /Graph of y equals x\^2 - 4/ })).toBeVisible();
  const table = page.locator('#plot-table table');
  await expect(table).toBeVisible();
  await expect(table.locator('tbody tr')).toHaveCount(9);
});

test('@claim:transfer-quiz A six-question transfer quiz uses a five-out-of-six target', async ({ page }) => {
  await openDemo(page);
  await expect(page.locator('.quiz-question')).toHaveCount(6);
  const answers = ['estimate', 'table', 'graph', 'algebra', 'estimate', 'table'];
  for (const [index, answer] of answers.entries()) await page.locator(`input[name="quiz-${index}"][value="${answer}"]`).check();
  await page.getByRole('button', { name: 'Check my tool choices' }).click();
  await expect(page.locator('.score-seal strong')).toHaveText('5/6');
  await expect(page.locator('.score-seal')).toContainText('Ready to practise');
});

test('@claim:scratchpad-autosave Scratchpad notes save in this browser as you type', async ({ page }) => {
  await openDemo(page);
  await page.getByLabel('Working notes').fill('Check the units before trusting the result.');
  await expect(page.getByText('Saved locally')).toBeVisible({ timeout: 2_000 });
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.getByLabel('Working notes')).toHaveValue('Check the units before trusting the result.');
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toEqual([demoKey]);
});

test('@claim:text-export Exports scratchpad notes as a text file', async ({ page }) => {
  await openDemo(page);
  await page.getByLabel('Working notes').fill('Use a table for repeated whole-number values.');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export .txt' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('math-tooling-notes.txt');
  const path = await download.path();
  expect(path).not.toBeNull();
  expect(await readFile(path!, 'utf8')).toBe('Use a table for repeated whole-number values.');
});

test('@claim:local-progress-reset You can reset notebook progress and notes stored in this browser', async ({ page }) => {
  await openDemo(page);
  await page.getByLabel('Working notes').fill('Changed sample note');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('5 / 20 complete')).toBeVisible();
  await expect(page.getByLabel('Working notes')).toHaveValue(/at x = 4/);
  await expect(page.getByLabel('Demo mode')).toContainText('Sample reset. Your regular notebook was not changed.');
});

test('@claim:offline-reload Works offline after your first visit', async ({ browser }) => {
  const { context, page } = await openIsolatedDemo(browser);
  try {
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload({ waitUntil: 'networkidle' });
    expect(await page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1, name: 'Choose the right maths tool' })).toBeVisible();
    await expect(page.getByLabel('Demo mode')).toBeVisible();
    await expect(page.getByText(/You’re offline/)).toBeVisible();
  } finally {
    await context.setOffline(false);
    await context.close();
  }
});

test('@claim:no-account-or-third-party-runtime Free use has no account, payment, analytics, CDN assets, or third-party runtime requests', async ({ browser }) => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    await openDemo(page);
    await page.getByLabel('Working notes').fill('A local-only check');
    await expect(page.locator('input[type="password"], input[autocomplete="cc-number"], [data-payment]')).toHaveCount(0);
    expect(requests.every((url) => new URL(url).origin === baseURL)).toBe(true);
    expect(await page.evaluate(() => document.cookie)).toBe('');
  } finally {
    await context.close();
  }
});

test('@claim:data-stays-on-device Notebook data stays on your device', async ({ browser }) => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    await openDemo(page);
    await page.getByLabel('Working notes').fill('Only this sandbox should change.');
    await expect(page.getByText('Saved locally')).toBeVisible({ timeout: 2_000 });
    const state = await page.evaluate(() => ({ keys: Object.keys(localStorage), note: JSON.parse(localStorage.getItem('demo:math-tooling-notebook:v1') ?? '{}').notes }));
    expect(state.keys).toEqual([demoKey]);
    expect(state.note).toBe('Only this sandbox should change.');
    expect(requests.every((url) => new URL(url).origin === baseURL)).toBe(true);
  } finally {
    await context.close();
  }
});
