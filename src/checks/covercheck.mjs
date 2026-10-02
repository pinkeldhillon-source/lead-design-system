import { chromium } from 'playwright';
/* The board sits two directories up from this file, and the browser
   comes from PLAYWRIGHT_BROWSERS_PATH so nothing here is pinned to one
   machine. */
const PAGE = new URL('../../kpi-dashboard.html', import.meta.url).href;
const CHROME = process.env.CHROME_PATH || undefined;
const b = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto(PAGE);
await p.waitForTimeout(400);

const n = await p.evaluate(() => Object.keys(buildMeasures()).length);
console.log('measure pages defined:', n);
console.log();

// on each level 2 page, is every stat / trend / support row linked?
const gaps = [];
for (const id of ['mrr','profit','client-sat','colleague-perf','colleague-sat','checklist']) {
  const r = await p.evaluate(k => {
    openKpi = k; selectedKpi = k; page = 'kpi'; render();
    const un = [];
    document.querySelectorAll('.stat .s-lab').forEach(e => { if (!e.querySelector('[data-go]')) un.push('stat: ' + e.textContent.trim()); });
    document.querySelectorAll('.trow .tr-name').forEach(e => { if (!e.querySelector('[data-go]')) un.push('trend: ' + e.textContent.trim()); });
    document.querySelectorAll('.support li > span:first-child').forEach(e => {
      if (!e.querySelector('[data-go]')) un.push('support: ' + e.firstChild.textContent.trim()); });
    return { total: document.querySelectorAll('[data-go]').length, un };
  }, id);
  console.log(id.padEnd(16), r.total, 'links |', r.un.length ? r.un.length + ' NOT linked' : 'everything linked');
  r.un.forEach(u => gaps.push(id + ' ' + u));
}
console.log();
if (gaps.length) { console.log('GAPS:'); gaps.forEach(g => console.log('  ' + g)); }
console.log('page errors:', errs.length ? errs.slice(0,3) : 'none');
await b.close();
