import { chromium } from 'playwright';
/* The board sits two directories up from this file, and the browser
   comes from PLAYWRIGHT_BROWSERS_PATH so nothing here is pinned to one
   machine. */
const PAGE = new URL('../../kpi-dashboard.html', import.meta.url).href;
const CHROME = process.env.CHROME_PATH || undefined;
const b = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto(PAGE);
await p.waitForTimeout(400);

const out = await p.evaluate(() => {
  const bad = [], note = [];
  const MEAS = buildMeasures();
  const M = Object.values(MEAS);

  // 1. every series is 12 long, finite or null
  M.forEach(m => {
    if (m.series.length !== 12) bad.push(`${m.id}: series is ${m.series.length} long`);
    m.series.forEach((v, i) => {
      if (v !== null && !isFinite(v)) bad.push(`${m.id}: month ${i} is ${v}`);
    });
  });

  // 2. percentages inside 0..100
  M.filter(m => m.fmtKey === 'pct' || m.fmtKey === 'pct0').forEach(m => {
    m.series.forEach((v, i) => {
      if (v !== null && (v < 0 || v > 100)) bad.push(`${m.id}: ${v} is not a percentage (month ${i})`);
    });
  });

  // 3. score measures inside their scale
  M.filter(m => m.fmtKey === 'one').forEach(m => {
    const cap = m.kpi === 'colleague-perf' ? 5 : 10;
    m.series.forEach((v, i) => {
      if (v !== null && (v < 0 || v > cap)) bad.push(`${m.id}: ${v} is outside 0 to ${cap} (month ${i})`);
    });
  });

  // 4. counts are whole numbers
  M.filter(m => m.fmtKey === 'n').forEach(m => {
    m.series.forEach((v, i) => {
      if (v !== null && Math.abs(v - Math.round(v)) > 1e-9) bad.push(`${m.id}: count ${v} is not whole (month ${i})`);
    });
  });

  // 5. every KPI headline equals its lead measure in the big six
  KPIS.forEach(k => {
    const six = sixFor(k.id);
    if (!six.length) { bad.push(`${k.id}: no big six`); return; }
    const lead = six[0].m, now = lead.series[11];
    const shown = String(k.value).replace(/[£,%]/g, '').replace(/,/g, '');
    const want = Number(shown);
    const got = lead.fmtKey === 'money' ? now : now;
    const near = lead.fmtKey === 'money' ? Math.abs(got - want) < 1 : Math.abs(got - want) < 0.06;
    if (!near) bad.push(`${k.id}: card says ${k.value}, lead measure "${lead.name}" says ${got}`);
  });

  // 6. every KPI delta equals the real month on month move
  KPIS.forEach(k => {
    const s = k.series, d = s[11] - s[10];
    const dir = Math.abs(d) < 1e-9 ? 'flat' : d > 0 ? 'up' : 'down';
    if (dir !== k.delta.dir) bad.push(`${k.id}: delta says ${k.delta.dir}, series moved ${dir}`);
    const txt = k.delta.text;
    if (/%$/.test(txt) && !/pts/.test(txt)) {
      const pct = (d / s[10]) * 100;
      if (Math.abs(Math.abs(pct) - parseFloat(txt)) > 0.06) bad.push(`${k.id}: delta ${txt}, series says ${pct.toFixed(1)}%`);
    } else {
      if (Math.abs(Math.abs(d) - parseFloat(txt)) > 0.06) bad.push(`${k.id}: delta ${txt}, series says ${d.toFixed(2)}`);
    }
  });

  // 7. every KPI support row matches the measure of the same name
  KPIS.forEach(k => {
    (k.support || []).forEach(s => {
      const m = measureFor(s.name, k.id);
      if (!m) { note.push(`${k.id}: support row "${s.name}" has no measure page`); return; }
      const now = m.series[11];
      if (now === null) return;
      const shown = String(s.v).replace(/[£,%]/g, '');
      if (/of/.test(shown)) return;
      const want = Number(shown);
      if (!isFinite(want)) return;
      const tol = m.fmtKey === 'money' ? 1 : 0.06;
      if (Math.abs(now - want) > tol) bad.push(`${k.id}: support "${s.name}" says ${s.v}, measure says ${m.fmt(now)}`);
    });
  });

  // 8. a target of a good-up measure that is already impossible, and hit flags
  KPIS.forEach(k => {
    (k.support || []).forEach(s => {
      const m = measureFor(s.name, k.id);
      if (!m || m.target === null) return;
      const now = m.series[11];
      if (now === null) return;
      const hit = m.goodUp ? now >= m.target : now <= m.target;
      if (s.hit !== undefined && s.hit !== hit) {
        bad.push(`${k.id}: support "${s.name}" marked ${s.hit ? 'hit' : 'missed'}, ${m.fmt(now)} against ${m.fmt(m.target)} is ${hit ? 'hit' : 'missed'}`);
      }
    });
  });

  // 9. parts that should add up
  const ADD = {
    'profit:operating-profit': ['Delivery margin in pounds', 'Total overheads'],
    'mrr:mrr': null
  };
  const sumCheck = [
    ['profit:revenue', ['profit:total-delivery-cost', 'profit:delivery-margin-in-pounds']],
    ['profit:delivery-margin-in-pounds', ['profit:total-overheads', 'profit:operating-profit']]
  ];
  sumCheck.forEach(([whole, partIds]) => {
    const w = MEAS[whole];
    if (!w) { bad.push(`missing measure ${whole}`); return; }
    for (let i = 0; i < 12; i++) {
      const sum = partIds.reduce((a, id) => a + (MEAS[id] ? MEAS[id].series[i] : NaN), 0);
      if (Math.abs(sum - w.series[i]) > 1.5) bad.push(`${whole} month ${i}: parts sum to ${Math.round(sum)}, whole is ${Math.round(w.series[i])}`);
    }
  });

  // 10. margin equals profit over revenue in every month
  for (let i = 0; i < 12; i++) {
    const r = MEAS['profit:revenue'].series[i], o = MEAS['profit:operating-profit'].series[i];
    const m = MEAS['profit:operating-margin'].series[i];
    if (Math.abs(o / r * 100 - m) > 0.05) bad.push(`operating margin month ${i}: ${m} vs ${(o / r * 100).toFixed(2)}`);
  }

  // 11. the KPI series matches its lead measure across all twelve months
  KPIS.forEach(k => {
    const lead = sixFor(k.id)[0];
    if (!lead) return;
    const scale = k.id === 'mrr' || k.id === 'profit' ? null : 1;
    for (let i = 0; i < 12; i++) {
      const a = k.series[i], bb = lead.m.series[i];
      if (a === null || bb === null) continue;
      const ratio = bb / a;
      const ok = Math.abs(a - bb) < 0.06 || (Math.abs(ratio - 1000) < 1) || Math.abs(a - bb) < Math.abs(bb) * 0.005;
      if (!ok) bad.push(`${k.id} month ${i}: card series ${a}, measure ${bb}`);
    }
  });

  return { bad, note, measures: M.length };
});
console.log('measures checked:', out.measures);
console.log('\nPROBLEMS (' + out.bad.length + ')');
out.bad.forEach(x => console.log('  ! ' + x));
console.log('\nNOTES (' + out.note.length + ')');
out.note.forEach(x => console.log('  - ' + x));
await b.close();
