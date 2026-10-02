import { chromium } from 'playwright';
/* The org chart must agree with the roster: everybody on it, nobody
   twice, every card opening that person's own page, and no name cramped
   at a width somebody might actually use. */
const PAGE = new URL('../../kpi-dashboard.html', import.meta.url).href;
const CHROME = process.env.CHROME_PATH || undefined;
const b = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const errs = [];
const p = await b.newPage({ viewport: { width: 1920, height: 1200 } });
p.on('pageerror', e => errs.push(String(e)));
await p.goto(PAGE); await p.waitForTimeout(400);
await p.click('.nav button[data-page="team"]'); await p.waitForTimeout(400);

const bad = [];
const roster = await p.evaluate(() => {
  const P = Object.values(DEEP.people);
  const cards = [...document.querySelectorAll('.pcard .pc-name')].map(x => x.textContent.trim());
  return { people: P.map(x => x.name).sort(), cards: cards.slice().sort(), n: P.length };
});
if (roster.people.join('|') !== roster.cards.join('|')) {
  bad.push('chart does not match the roster');
  roster.people.filter(n => !roster.cards.includes(n)).forEach(n => bad.push('  missing: ' + n));
  roster.cards.filter(n => !roster.people.includes(n)).forEach(n => bad.push('  extra: ' + n));
}

const names = await p.$$eval('.pcard .pc-name', e => e.map(x => x.textContent.trim()));
for (let i = 0; i < names.length; i++) {
  await p.click('.nav button[data-page="team"]'); await p.waitForTimeout(110);
  (await p.$$('.pcard'))[i].click(); await p.waitForTimeout(160);
  const t = await p.$eval('#pageTitle', e => e.textContent);
  if (t !== names[i]) bad.push(`${names[i]} opens ${t}`);
}

await p.click('.nav button[data-page="team"]'); await p.waitForTimeout(250);
for (const w of [1920, 1600, 1440, 1280, 900, 390]) {
  await p.setViewportSize({ width: w, height: 1000 }); await p.waitForTimeout(200);
  const r = await p.evaluate(() => ({
    over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    clipped: [...document.querySelectorAll('.pc-name')].filter(x => x.scrollWidth > x.clientWidth + 1).length
  }));
  if (r.over) bad.push(`${w}px: the page scrolls sideways by ${r.over}`);
  if (r.clipped) bad.push(`${w}px: ${r.clipped} names cramped`);
}

errs.forEach(e => bad.push('page error: ' + e));
console.log(bad.length ? 'PROBLEMS:\n  ' + bad.join('\n  ')
  : `every org chart check passed (${roster.n} people, all linked, no cramping)`);
await b.close();
