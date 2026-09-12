import { chromium } from 'playwright';
/* The board sits two directories up from this file, and the browser
   comes from PLAYWRIGHT_BROWSERS_PATH so nothing here is pinned to one
   machine. */
const PAGE = new URL('../../kpi-dashboard.html', import.meta.url).href;
const CHROME = process.env.CHROME_PATH || undefined;
const b = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
await p.goto(PAGE);
await p.waitForTimeout(400);

// Does each measure's September figure match what the page quoting it shows?
const res = await p.evaluate(() => {
  const num = s => { const m = String(s).replace(/,/g, '').match(/-?\d+(\.\d+)?/); return m ? Number(m[0]) : null; };
  const out = { checked: 0, bad: [] };
  const M = buildMeasures();
  for (const kpi of Object.keys(DETAIL)) {
    const quote = [];
    DETAIL[kpi].stats.forEach(s => quote.push(['stat', s.label, s.value]));
    DETAIL[kpi].sections.forEach(sec => {
      if (sec.kind === 'trends') sec.trends.forEach(t => quote.push(['trend', t.name, t.value]));
    });
    (KPIS.find(k => k.id === kpi) || { support: [] }).support.forEach(s => quote.push(['support', s.name, s.v]));
    for (const [where, label, shown] of quote) {
      const m = measureFor(label, kpi);
      if (!m) continue;
      out.checked++;
      const mine = m.fmt(m.series[11]);
      if (String(shown).includes(mine)) continue;   // "Pod 4 at 59%" carries it
      const a = num(mine), c = num(shown);
      if (a === null || c === null) continue;
      // "9 of 14" style quotes carry the numerator only
      if (Math.abs(a - c) > Math.max(0.051, Math.abs(c) * 0.005))
        out.bad.push(`${kpi} ${where} "${label}": page shows ${shown}, measure page says ${mine}`);
    }
  }
  return out;
});
console.log(`compared ${res.checked} quoted figures against their measure pages`);
console.log(res.bad.length ? `${res.bad.length} DISAGREE:` : 'every quoted figure matches its measure page');
res.bad.forEach(x => console.log('  ' + x));
await b.close();
