import { chromium } from 'playwright';
/* The board sits two directories up from this file, and the browser
   comes from PLAYWRIGHT_BROWSERS_PATH so nothing here is pinned to one
   machine. */
const PAGE = new URL('../../kpi-dashboard.html', import.meta.url).href;
const CHROME = process.env.CHROME_PATH || undefined;
const b = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto(PAGE);
await p.waitForTimeout(400);

const all = await p.evaluate(() => ({
  client: Object.keys(DEEP.clients), person: Object.keys(DEEP.people),
  pod: DEEP.pods.map(x => x.id), cost: Object.keys(DEEP.cost),
  measure: Object.keys(buildMeasures()),
}));
let n = 0; const bad = [];
for (const kind of Object.keys(all)) {
  for (const id of all[kind]) {
    const r = await p.evaluate(([k, i]) => {
      openEntity = { kind: k, id: i }; fromKpi = null; page = 'entity';
      try { render(); drawTrendSparks(); } catch (e) { return { err: String(e) }; }
      const txt = document.querySelector('#view').textContent;
      return {
        h2: document.querySelector('.ehead h2')?.textContent || null,
        secs: document.querySelectorAll('.sect').length,
        sparkMissing: [...document.querySelectorAll('.tr-spark')].filter(s => !s.querySelector('svg')).length,
        nan: /NaN|undefined|Infinity/.test(txt),
        nulltxt: />null<|>null /.test(document.querySelector('#view').innerHTML),
        wide: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    }, [kind, id]);
    n++;
    if (r.err) bad.push(`${kind}/${id}: threw ${r.err}`);
    else {
      if (!r.h2) bad.push(`${kind}/${id}: no header`);
      if (r.secs < 2) bad.push(`${kind}/${id}: only ${r.secs} sections`);
      if (r.sparkMissing) bad.push(`${kind}/${id}: ${r.sparkMissing} sparklines blank`);
      if (r.nan) bad.push(`${kind}/${id}: NaN or undefined on the page`);
      if (r.nulltxt) bad.push(`${kind}/${id}: a raw null rendered`);
      if (r.wide) bad.push(`${kind}/${id}: body scrolls sideways`);
    }
  }
}
console.log(`walked ${n} end point pages (${all.measure.length} measures, ${n - all.measure.length} entities)`);
console.log(bad.length ? 'PROBLEMS:' : 'no rendering problems');
bad.slice(0, 30).forEach(x => console.log('  ' + x));
if (bad.length > 30) console.log(`  ...and ${bad.length - 30} more`);
console.log('page errors:', errs.length ? errs.slice(0,3) : 'none');
await b.close();
