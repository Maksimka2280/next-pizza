const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', (msg) => console.log('console:', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('pageerror:', err.message));

  await page.goto('http://localhost:3002/checkout');

  try {
    await page.getByRole('button', { name: 'Принять куки' }).click({ timeout: 20000 });
  } catch (e) {}

  await page.getByRole('button', { name: 'Оплатить' }).click({ timeout: 20000 });
  await page.waitForTimeout(1000);

  console.log('done');
  await browser.close();
})();
