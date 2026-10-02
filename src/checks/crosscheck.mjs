import fs from 'fs';
/* The source parts sit one directory up, so this reads them from beside
   the checks rather than from wherever it was invoked. */
const SRC = new URL('../', import.meta.url).pathname;
const src = fs.readFileSync(SRC + 'roster.js','utf8') + fs.readFileSync(SRC + 'detail.js','utf8');
const { PODS, PEOPLE, CLIENTS, DETAIL } = new Function(src + '; return { PODS, PEOPLE, CLIENTS, DETAIL };')();
const bad = [];
const claim = new Map();               // "entity|attribute" -> [{page, value}]
const say = (ent, attr, val, page) => {
  const k = ent + ' | ' + attr;
  if (!claim.has(k)) claim.set(k, []);
  claim.get(k).push({ page, val: String(val).trim() });
};

const podName = id => (PODS.find(p => p.id === id) || {}).name;
const clientPod = Object.fromEntries(CLIENTS.map(c => [c.name, podName(c.pod)]));
const personPod = Object.fromEntries(PEOPLE.map(p => [p.name, p.pod ? podName(p.pod) : 'Outside pods']));
const podLead   = Object.fromEntries(PODS.map(p => [p.name, p.lead]));

for (const [page, spec] of Object.entries(DETAIL)) {
  for (const s of spec.sections) {
    const cols = s.columns || [];
    const ix = n => cols.findIndex(c => new RegExp(n, 'i').test(c));
    for (const r of (s.rows || [])) {
      const ent = r.cells[0];
      if (ent === 'Total' || /^(Company|All 30)/.test(ent)) continue;
      const grab = (re, attr) => { const i = ix(re); if (i > 0 && r.cells[i]) say(ent, attr, r.cells[i], page); };
      grab('^retainer|retainer per month|monthly retainer', 'retainer');
      grab('^pod$', 'pod');
      grab('^lead$', 'lead');
      grab('^role$', 'role');
      grab('^people$', 'people');
      grab('^clients$', 'clients');
      // roster truth
      if (clientPod[ent]) { const i = ix('^pod$'); if (i > 0) say(ent, 'pod', clientPod[ent], 'roster'); }
      if (personPod[ent]) { const i = ix('^pod$'); if (i > 0) say(ent, 'pod', personPod[ent], 'roster'); }
      if (podLead[ent])   { const i = ix('^lead$'); if (i > 0 && !/No pod lead/.test(r.cells[i])) say(ent, 'lead', podLead[ent], 'roster'); }
    }
    for (let i = 0; i < (s.rowLabels || []).length; i++) {
      const ent = s.rowLabels[i], sub = (s.sublabels || [])[i];
      if (sub && /^Pod |Outside/.test(sub)) {
        say(ent, 'pod', sub, page);
        if (clientPod[ent]) say(ent, 'pod', clientPod[ent], 'roster');
        if (personPod[ent]) say(ent, 'pod', personPod[ent], 'roster');
      }
    }
  }
}

for (const [k, vs] of claim) {
  const distinct = [...new Set(vs.map(v => v.val))];
  if (distinct.length > 1)
    bad.push(`${k}: ` + vs.map(v => `${v.page}="${v.val}"`).join('  vs  '));
}

// pod headcount must be 6 on every page that states it
for (const [page, spec] of Object.entries(DETAIL))
  for (const s of spec.sections)
    for (const r of (s.rows || [])) {
      const i = (s.columns || []).findIndex(c => /^people$/i.test(c));
      if (i > 0 && /^Pod \d$/.test(r.cells[0]) && Number(r.cells[i]) !== 6)
        bad.push(`${page}: ${r.cells[0]} says ${r.cells[i]} people, roster says 6`);
    }

console.log(bad.length ? 'CROSS PAGE CLASHES:' : 'No cross page clashes.');
bad.forEach(b => console.log('  ' + b));
console.log(`\n${claim.size} shared facts compared across pages.`);
