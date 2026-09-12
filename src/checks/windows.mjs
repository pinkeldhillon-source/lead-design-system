import { chromium } from 'playwright';
/* The board sits two directories up from this file, and the browser
   comes from PLAYWRIGHT_BROWSERS_PATH so nothing here is pinned to one
   machine. */
const PAGE = new URL('../../kpi-dashboard.html', import.meta.url).href;
const CHROME = process.env.CHROME_PATH || undefined;
const b = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const p = await b.newPage({ viewport: { width: 1920, height: 1100 } });
await p.goto(PAGE);
await p.waitForTimeout(400);

const bad = await p.evaluate(() => {
  const bad = [], W = WINDOW;
  const near = (a, x, t) => Math.abs(a - x) <= t;

  // 1. month to date is the September figure the rest of the board carries
  const sep = { mrr: DEEP.rev[11], profit: DEEP.op[11] / DEEP.rev[11] * 100 };
  if (!near(W.MTD.mrr, sep.mrr, 1)) bad.push(`MTD MRR ${W.MTD.mrr} vs September ${sep.mrr}`);
  if (!near(W.MTD.profit, sep.profit, 0.02)) bad.push(`MTD margin ${W.MTD.profit} vs ${sep.profit}`);
  KPIS.forEach(k => {
    const lead = sixFor(k.id)[0].m, now = lead.series[11];
    const w = W.MTD[k.id];
    const scaled = lead.fmtKey === 'money' && k.id === 'mrr' ? now : now;
    if (k.id === 'mrr' || k.id === 'profit') return;
    if (!near(w, scaled, 0.06)) bad.push(`MTD ${k.id} ${w} vs measure ${scaled}`);
  });

  // 2. the part windows sit inside the month
  ['WTD', 'LW'].forEach(w => {
    const n = W[w].n, m = W.MTD.n;
    if (n['checklist'][0] > m['checklist'][0]) bad.push(`${w} filed more checklists than the month`);
    if (n['checklist'][1] > m['checklist'][1]) bad.push(`${w} owed more checklists than the month`);
    ['client-sat', 'colleague-perf', 'colleague-sat'].forEach(k => {
      if (n[k] > m[k]) bad.push(`${w} has more ${k} readings than the month`);
    });
    if (W[w].mrr > W.MTD.mrr) bad.push(`${w} booked more than the month`);
  });

  // 3. the two part weeks do not overlap, so together they fit in the month
  const a = W.WTD.n, c = W.LW.n, m = W.MTD.n;
  if (a['checklist'][1] + c['checklist'][1] > m['checklist'][1]) bad.push('the two weeks owe more than the month');
  if (a['client-sat'] + c['client-sat'] > m['client-sat']) bad.push('the two weeks hold more forms than the month');

  // 4. the year holds the month
  ['client-sat', 'colleague-perf', 'colleague-sat'].forEach(k => {
    if (W.YTD.n[k] < W.MTD.n[k]) bad.push(`YTD has fewer ${k} readings than the month`);
  });
  if (W.YTD.mrr < W.MTD.mrr) bad.push('YTD booked less than the month');

  // 5. every rate is a rate, every score inside its scale
  ['WTD', 'LW', 'MTD', 'YTD'].forEach(w => {
    KPIS.forEach(k => {
      const v = W[w][k.id];
      if (v === null || v === undefined) return;
      const cap = k.id === 'colleague-perf' ? 5 : k.id === 'mrr' ? Infinity : 100;
      if (v < 0 || v > cap) bad.push(`${w} ${k.id} is ${v}`);
    });
    if (Math.abs(W[w].checklist - W[w].n.checklist[0] / W[w].n.checklist[1] * 100) > 0.02)
      bad.push(`${w} checklist rate does not match its own filed over due`);
  });
  return bad;
});

// 6. every KPI shows four different figures on screen
const seen = {};
for (const id of ['MTD', 'WTD', 'LW', 'YTD']) {
  await p.evaluate(x => [...document.querySelectorAll('#periods button')].find(b => b.textContent.trim() === x).click(), id);
  await p.waitForTimeout(220);
  const rows = await p.$$eval('.tiles .tile', els => els.map(e => [
    e.querySelector('.t-label').textContent, e.querySelector('.t-value').textContent]));
  rows.forEach(([l, v]) => { (seen[l] = seen[l] || []).push(v); });
}
Object.entries(seen).forEach(([k, v]) => {
  if (new Set(v).size !== 4) bad.push(`${k} repeats a figure across the four periods: ${v.join(', ')}`);
});

// 7. the foot fits on one line at every width
for (const w of [1920, 1600, 1440, 1280]) {
  await p.setViewportSize({ width: w, height: 1000 });
  for (const id of ['MTD', 'WTD', 'LW', 'YTD']) {
    await p.evaluate(x => [...document.querySelectorAll('#periods button')].find(b => b.textContent.trim() === x).click(), id);
    await p.waitForTimeout(180);
    const h = await p.$$eval('.t-foot', e => e.map(x => Math.round(x.getBoundingClientRect().height)));
    const clip = await p.$$eval('.t-foot > span:last-child', e => e.filter(x => x.scrollWidth > x.clientWidth + 1).map(x => x.textContent));
    if (h.some(x => x > 22)) bad.push(`${w}px ${id}: a foot wrapped (${h.join(',')})`);
    if (clip.length) bad.push(`${w}px ${id}: truncated ${JSON.stringify(clip)}`);
  }
}

console.log(bad.length ? 'PROBLEMS:\n  ' + bad.join('\n  ') : 'every window check passed');
await b.close();
