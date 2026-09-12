import fs from 'fs';
/* The source parts sit one directory up, so this reads them from beside
   the checks rather than from wherever it was invoked. */
const SRC = new URL('../', import.meta.url).pathname;
const src = fs.readFileSync(SRC + 'roster.js','utf8') + fs.readFileSync(SRC + 'detail.js','utf8');
const { PEOPLE, CLIENTS, DETAIL } = new Function(src + '; return { PEOPLE, CLIENTS, DETAIL };')();
const money = s => Number(String(s).replace(/[£,%\s]/g,'')) || 0;
const sec = (k,t) => DETAIL[k].sections.find(s => s.title === t);
let fails = 0;
const chk = (label, got, want, tol=0) => {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) fails++;
  console.log(`  ${ok?'ok  ':'FAIL'} ${label}: ${got}${ok?'':'  expected '+want}`);
};

console.log('MRR');
const cl = sec('mrr','Every client on the book').rows.filter(r => r.cells[0] !== 'Total');
chk('14 client rows', cl.length, 14);
chk('client retainers sum', cl.reduce((a,r)=>a+money(r.cells[2]),0), 170400);
const pod = sec('mrr','MRR by pod').rows.filter(r => r.cells[0] !== 'Total');
chk('pod MRR sum', pod.reduce((a,r)=>a+money(r.cells[3]),0), 170400);
chk('pod shares sum', pod.reduce((a,r)=>a+money(r.cells[4]),0), 100, 0.11);
chk('pod client counts', pod.reduce((a,r)=>a+money(r.cells[2]),0), 14);

console.log('Operating profit');
const br = sec('profit','The profit bridge, September').rows;
const get = n => money(br.find(r => r.cells[0].startsWith(n)).cells[1]);
chk('revenue less delivery cost = delivery margin', get('Revenue') - get('Less delivery cost'), get('Delivery margin'));
const ovLines = br.filter(r => /^Less /.test(r.cells[0]) && !/delivery cost/.test(r.cells[0]));
chk('six overhead lines', ovLines.length, 6);
const ovSum = ovLines.reduce((a,r)=>a+money(r.cells[1]),0);
chk('overhead lines sum to stated total', ovSum, get('Total overheads'));
chk('delivery margin less overheads = operating profit', get('Delivery margin') - ovSum, 38200);
const dc = sec('profit','What delivery cost is made of').rows.filter(r=>!/^Total/.test(r.cells[0]));
chk('delivery cost lines sum', dc.reduce((a,r)=>a+money(r.cells[1]),0), get('Less delivery cost'));
const oh = sec('profit','What overheads are made of').rows.filter(r=>!/^Total/.test(r.cells[0]));
chk('overheads table sum', oh.reduce((a,r)=>a+money(r.cells[1]),0), ovSum);

console.log('Client satisfaction');
const g = sec('client-sat','Question scores by client');
chk('9 responding clients', g.rowLabels.length, 9);
const avgs = g.values.map(v => v[v.length-1]);
chk('mean of the 9 client averages', +(avgs.reduce((a,b)=>a+b,0)/9).toFixed(2), 8.8, 0.05);
g.values.forEach((v,i) => {
  const q = v.slice(0,6), m = +(q.reduce((a,b)=>a+b,0)/6).toFixed(1);
  if (Math.abs(m - v[6]) > 0.05) { fails++; console.log(`  FAIL ${g.rowLabels[i]} row average ${v[6]} but questions mean ${m}`); }
});
chk('non-responders listed', sec('client-sat','Five clients did not return the form').rows.length, 5);

console.log('Colleague performance');
const pp = sec('colleague-perf','By pod').rows;
const graded = pp.filter(r => !/^Company/.test(r.cells[0]));
chk('graded this week', graded.reduce((a,r)=>a+money(r.cells[3]),0), 26);
chk('headcount', graded.reduce((a,r)=>a+money(r.cells[2]),0), 30);
const wt = graded.reduce((a,r)=>a+money(r.cells[3])*money(r.cells[4]),0) / 26;
chk('weighted pod average', +wt.toFixed(2), 4.3, 0.05);
let below3 = 0;
['Creative strategists','Video editors','Outside the pods'].forEach(t => {
  const s = sec('colleague-perf',t);
  s.values.forEach(v => { if (v[5] !== null && v[5] < 3) below3++; });
});
chk('people graded below 3', below3, 2);

console.log('Colleague satisfaction');
const cp = sec('colleague-sat','By pod').rows.filter(r => !/^Company/.test(r.cells[0]));
const resp = r => Number(String(r.cells[3]).split(' of ')[0]);
chk('responded', cp.reduce((a,r)=>a+resp(r),0), 24);
const cw = cp.reduce((a,r)=>a+resp(r)*money(r.cells[4]),0) / 24;
chk('weighted pod score', +cw.toFixed(2), 8.1, 0.05);
const per = sec('colleague-sat','Every person').rows;
chk('all 30 people listed', per.length, 30);
chk('non-responders shown, not invented', per.filter(r => r.cells[3] === 'Not returned').length, 6);

console.log('Checklist');
const cper = sec('checklist','By person, all 30').rows.filter(r => !/^All 30/.test(r.cells[0]));
chk('30 people', cper.length, 30);
const fil = cper.reduce((a,r)=>a+Number(r.cells[3].split(' of ')[0]),0);
const due = cper.reduce((a,r)=>a+Number(r.cells[3].split(' of ')[1]),0);
chk('total filed', fil, 515);
chk('total due', due, 660);
chk('completion', Math.round(fil/due*100), 78);
chk('under 80% count matches the note', cper.filter(r=>money(r.cells[4])<80).length, 14);

console.log('Across every page');
const names = new Set(PEOPLE.map(p=>p.name)), clients = new Set(CLIENTS.map(c=>c.name));
let bad = [];
for (const k of Object.keys(DETAIL)) for (const s of DETAIL[k].sections) {
  (s.trends||[]).forEach(t => {
    if (t.series.length !== 12) bad.push(`${k}/${t.name} has ${t.series.length} points`);
    if (t.lo > Math.min(...t.series) || t.hi < Math.max(...t.series)) bad.push(`${k}/${t.name} series escapes its scale`);
  });
  (s.rowLabels||[]).forEach(n => { if (!names.has(n) && !clients.has(n) && !/Pod |Outside|Company/.test(n)) bad.push(`${k}: unknown row "${n}"`); });
}
chk('series and roster problems', bad.length, 0);
bad.forEach(x => console.log('       ', x));
console.log(fails ? `\n${fails} CHECK(S) FAILED` : '\nAll checks passed.');
