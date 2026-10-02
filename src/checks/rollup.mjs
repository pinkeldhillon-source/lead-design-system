import fs from 'fs';
/* The source parts sit one directory up, so this reads them from beside
   the checks rather than from wherever it was invoked. */
const SRC = new URL('../', import.meta.url).pathname;
const src = ['roster.js','newdata.js','detail.js','deep.js'].map(f => fs.readFileSync(SRC + f,'utf8')).join('\n');
const { KPIS, DETAIL, DEEP } = new Function(src + '; return { KPIS, DETAIL, DEEP };')();
const sec = (k,t) => DETAIL[k].sections.find(s => s.title.includes(t));
const money = s => Number(String(s).replace(/[£,%\s]/g,''));
const one = v => Math.round(v*10)/10;
let fail = 0;
const chk = (label, got, want, tol=0) => {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) { fail++; console.log(`  FAIL ${label}: ${got} expected ${want}`); }
  return ok;
};
const C = DEEP.clients, P = DEEP.people;
const byName = o => Object.fromEntries(Object.keys(o).map(k => [o[k].name, o[k]]));
const CN = byName(C), PN = byName(P);

console.log('Level 3 rolls up to level 2, September');
// clients: retainer + satisfaction
let n = 0;
for (const r of sec('mrr','Every client').rows) {
  if (r.cells[0] === 'Total') continue;
  const c = CN[r.cells[0]]; n++;
  chk(`${r.cells[0]} retainer`, c.retainer[11], money(r.cells[2]));
  chk(`${r.cells[0]} tenure`, c.retainer.filter(v=>v>0).length, Math.min(12, c.tenure));
}
console.log(`  ok   ${n} client retainers match the MRR table`);

const g = sec('client-sat','Question scores by client'); n = 0;
g.rowLabels.forEach((name, i) => {
  const c = CN[name]; n++;
  g.values[i].slice(0,6).forEach((v, j) => chk(`${name} q${j+1}`, c.q[11][j], v, 0.001));
});
console.log(`  ok   ${n} client question rows match the satisfaction grid`);

// people: behaviours
n = 0;
for (const t of ['Creative strategists','Video editors','Outside the pods']) {
  const gg = sec('colleague-perf', t);
  gg.rowLabels.forEach((name, i) => {
    const p = PN[name];
    if (gg.values[i][0] === null) { chk(`${name} ungraded`, p.perf[11] === null ? 1 : 0, 1); return; }
    n++;
    gg.values[i].slice(0,5).forEach((v, j) => chk(`${name} ${DEEP.beh[j]}`, p.beh[11][j], v, 0.001));
  });
}
console.log(`  ok   ${n} graded people match the performance grids`);

n = 0;
for (const r of sec('colleague-sat','Every person').rows) {
  const p = PN[r.cells[0]]; n++;
  if (r.cells[3] === 'Not returned') chk(`${r.cells[0]} no pulse`, p.sat[11] === null ? 1 : 0, 1);
  else chk(`${r.cells[0]} pulse`, p.sat[11], Number(r.cells[3]), 0.051);
}
console.log(`  ok   ${n} people match the pulse table`);

n = 0;
for (const r of sec('checklist','By person, all 30').rows) {
  if (r.cells[0].startsWith('All 30')) continue;
  const p = PN[r.cells[0]]; n++;
  const [f, d] = r.cells[3].split(' of ').map(Number);
  chk(`${r.cells[0]} filed`, p.filed[11][0], f);
  chk(`${r.cells[0]} due`, p.filed[11][1], d);
}
console.log(`  ok   ${n} people match the checklist table`);

console.log('\nLevel 2 rolls up to the six KPIs, September');
const act = i => Object.values(C).filter(c => c.retainer[i] > 0);
chk('MRR', act(11).reduce((a,c)=>a+c.retainer[11],0), money(KPIS[0].value));
const cs = Object.values(C).filter(c => c.sat[11] !== null).map(c => c.sat[11]);
chk('client satisfaction', one(cs.reduce((a,b)=>a+b,0)/cs.length), 8.8, 0.051);
const pf = Object.values(P).filter(p => p.perf[11] !== null).map(p => p.perf[11]);
chk('colleague performance', one(pf.reduce((a,b)=>a+b,0)/pf.length), 4.3, 0.051);
const st = Object.values(P).filter(p => p.sat[11] !== null).map(p => p.sat[11]);
chk('colleague satisfaction', one(st.reduce((a,b)=>a+b,0)/st.length), 8.1, 0.051);
let F=0,D=0; Object.values(P).forEach(p => { if (p.filed[11]) { F+=p.filed[11][0]; D+=p.filed[11][1]; } });
chk('checklist completion', Math.round(F/D*100), 78);
const opSep = DEEP.rev[11] - DEEP.dcost[11] - DEEP.ohtot[11];
chk('operating profit', opSep, DEEP.op[11]);
/* The headline is now the margin, so it has to equal the bridge over revenue. */
chk('operating margin', Math.round(opSep / DEEP.rev[11] * 1000) / 10, Number(KPIS[1].value), 0.051);

console.log('\nAll twelve months');
for (let i = 0; i < 12; i++) {
  chk(`MRR ${DEEP.months[i]}`, act(i).reduce((a,c)=>a+c.retainer[i],0), DEEP.mrr[i]);
  const dl = Object.keys(DEEP.cost).filter(k => DEEP.cost[k].group === 'Delivery cost');
  const oh = Object.keys(DEEP.cost).filter(k => DEEP.cost[k].group === 'Overheads');
  chk(`delivery cost ${DEEP.months[i]}`, dl.reduce((a,k)=>a+DEEP.cost[k].series[i],0), DEEP.dcost[i]);
  chk(`overheads ${DEEP.months[i]}`, oh.reduce((a,k)=>a+DEEP.cost[k].series[i],0), DEEP.ohtot[i]);
  chk(`bridge ${DEEP.months[i]}`, DEEP.rev[i]-DEEP.dcost[i]-DEEP.ohtot[i], DEEP.op[i]);
}
console.log('  ok   MRR, delivery cost, overheads and the profit bridge reconcile in every month');

console.log('\nDerived counts the level 2 pages state');
const forms = [...Array(12)].map((_,i) => Object.values(C).filter(c => c.sat[i] !== null).length);
const graded = [...Array(12)].map((_,i) => Object.values(P).filter(p => p.perf[i] !== null).length);
const resp = [...Array(12)].map((_,i) => Object.values(P).filter(p => p.sat[i] !== null).length);
const below3 = [...Array(12)].map((_,i) => Object.values(P).filter(p => p.perf[i] !== null && p.perf[i] < 3).length);
const tr = (k,name) => { for (const s of DETAIL[k].sections) if (s.kind==='trends') for (const t of s.trends) if (t.name===name) return t; };
console.log('  forms returned   deep', JSON.stringify(forms), '\n                   page', JSON.stringify(tr('client-sat','Forms returned').series));
console.log('  people graded    deep', JSON.stringify(graded), '\n                   page', JSON.stringify(tr('colleague-perf','People graded each week').series));
console.log('  pulse responses  deep', JSON.stringify(resp), '\n                   page', JSON.stringify(tr('colleague-sat','Responses returned').series));
console.log('  grades below 3   deep', JSON.stringify(below3), '\n                   page', JSON.stringify(tr('colleague-perf','Grades below 3').series));
console.log(fail ? `\n${fail} CHECK(S) FAILED` : '\nAll roll-up checks passed.');

console.log('\nPod roll ups, level 3 against level 2');
const podOf = n => DEEP.pods.find(p => p.name === n);
const cls = n => Object.values(C).filter(c => c.pod === n);
const ppl = n => Object.values(P).filter(p => p.pod === n);
let podFail = 0;
for (const t of [['mrr','MRR by pod',3,'money'], ['client-sat','Satisfaction by pod',4,'sat'],
                 ['colleague-perf','By pod',4,'perf'], ['colleague-sat','By pod',4,'sat2'],
                 ['checklist','By pod',5,'chk']]) {
  const [k, title, col, kind] = t;
  for (const r of sec(k, title).rows) {
    const name = r.cells[0];
    if (!/^Pod \d$/.test(name)) continue;
    const stated = money(r.cells[col]);
    let got;
    if (kind === 'money') got = cls(name).reduce((a,c)=>a+c.retainer[11],0);
    else if (kind === 'sat') { const v = cls(name).filter(c=>c.sat[11]!==null).map(c=>c.sat[11]); got = one(v.reduce((a,b)=>a+b,0)/v.length); }
    else if (kind === 'perf') { const v = ppl(name).filter(p=>p.perf[11]!==null).map(p=>p.perf[11]); got = one(v.reduce((a,b)=>a+b,0)/v.length); }
    else if (kind === 'sat2') { const v = ppl(name).filter(p=>p.sat[11]!==null).map(p=>p.sat[11]); got = one(v.reduce((a,b)=>a+b,0)/v.length); }
    else { let f=0,d=0; ppl(name).forEach(p=>{ if(p.filed[11]){f+=p.filed[11][0];d+=p.filed[11][1];} }); got = Math.round(f/d*100); }
    if (Math.abs(got - stated) > (kind==='money'?0:0.051)) { podFail++; console.log(`  FAIL ${k} ${name}: deep ${got}, page says ${stated}`); }
  }
}
console.log(podFail ? `  ${podFail} pod figures disagree` : '  ok   every pod figure on every page matches the people and clients in it');
