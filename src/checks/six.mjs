import { chromium } from 'playwright';
/* The board sits two directories up from this file, and the browser
   comes from PLAYWRIGHT_BROWSERS_PATH so nothing here is pinned to one
   machine. */
const PAGE = new URL('../../kpi-dashboard.html', import.meta.url).href;
const CHROME = process.env.CHROME_PATH || undefined;
const b = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const p = await b.newPage({ viewport: { width: 1600, height: 1080 }, deviceScaleFactor: 2 });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto(PAGE);
await p.waitForTimeout(400);
for (const id of ['mrr','profit','client-sat','colleague-perf','colleague-sat','checklist']) {
  await p.evaluate(k => { openKpi=k; selectedKpi=k; page='kpi'; render(); }, id);
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => ({
    tiles: [...document.querySelectorAll('.tiles .tile')].map(t => ({
      label: t.querySelector('.t-label').textContent,
      value: t.querySelector('.t-value').textContent,
      foot: t.querySelector('.t-foot').textContent.replace(/\s+/g,' ').trim(),
      flag: !!t.querySelector('.t-flag'),
      go: t.getAttribute('data-go'),
      spark: !!t.querySelector('.spark-box svg'),
    })),
    hero: !!document.querySelector('.hero'),
    stats: document.querySelectorAll('.stat').length,
  }));
  console.log('### ' + id + '  (hero ' + r.hero + ', old stat cards ' + r.stats + ')');
  r.tiles.forEach(t => console.log('   ' + (t.flag?'! ':'  ') + t.label.padEnd(24) + t.value.padEnd(12) + t.foot.padEnd(34) + (t.spark?'spark':'NO SPARK') + (t.go?'':'  NO LINK')));
}
await p.evaluate(() => { openKpi='mrr'; selectedKpi='mrr'; page='kpi'; render(); });
await p.waitForTimeout(500);
await p.screenshot({ path: 'shots/six-mrr.png' });
console.log('\nerrors:', errs.length ? errs : 'none');
await b.close();
