const { chromium, request } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.join(__dirname, 'qa-output');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const checks = [];
  const errors = [];
  const viewports = [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile390', width: 390, height: 844 },
    { name: 'mobile320', width: 320, height: 800 },
  ];

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`${viewport.name}: console: ${msg.text()}`);
    });
    page.on('pageerror', (err) => errors.push(`${viewport.name}: pageerror: ${err.message}`));
    await page.goto(`http://127.0.0.1:4175/index.html?v=pre5-removal-${viewport.name}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.title-screen.is-visible', { timeout: 5000 });
    await page.waitForTimeout(250);
    const data = await page.evaluate(() => {
      const rect = (selector) => {
        const r = document.querySelector(selector)?.getBoundingClientRect();
        return r ? { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height } : null;
      };
      const logo = document.querySelector('.title-logo');
      return {
        status: document.querySelector('.battle-status')?.textContent.replace(/\s+/g, ' ').trim(),
        logoAlt: logo?.alt,
        logoLoaded: Boolean(logo?.complete && logo?.naturalWidth),
        pre5Text: document.body.textContent.includes('PRE5'),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        statusRect: rect('.battle-status'),
        logoRect: rect('.title-logo-frame'),
        stageRect: rect('.title-stage'),
        commandRect: rect('.title-command'),
      };
    });
    checks.push({ viewport: viewport.name, ...data });
    await page.screenshot({ path: path.join(outDir, `home-${viewport.name}.png`), fullPage: true });
    await page.click('[data-start-button]');
    const menuText = await page.locator('[data-start-menu]').innerText();
    checks.push({ viewport: `${viewport.name}-menu`, menuHasPre5: menuText.includes('PRE5'), menuVisible: await page.locator('[data-start-menu]').isVisible() });
    await page.close();
  }

  const context = await request.newContext();
  for (const url of [
    'http://127.0.0.1:4175/pre5.html',
    'http://127.0.0.1:4175/column/',
    'http://127.0.0.1:4175/contact.html',
    'https://iinamath.com/',
    'https://iinamath.com/pre5.html',
    'https://iinamath.com/column/',
    'https://iinamath.com/contact.html',
    'https://iinamath.com/sitemap.xml',
  ]) {
    const response = await context.get(`${url}${url.includes('?') ? '&' : '?'}v=4cd49c6`);
    const body = await response.text();
    checks.push({
      url,
      status: response.status(),
      hasPre5: /PRE5|プレ5|新5年準備講座/i.test(body),
      hasStats: /ひらめき[\s\S]*H 100[\s\S]*かんがえる[\s\S]*M 100[\s\S]*さんすう[\s\S]*LV∞/.test(body),
      columnCards: (body.match(/class="column-card"/g) || []).length,
      contactPre5Option: /<option[^>]*>\s*PRE5\s*<\/option>/i.test(body),
    });
  }
  await context.dispose();
  await browser.close();
  console.log(JSON.stringify({ checks, errors }, null, 2));
})();
