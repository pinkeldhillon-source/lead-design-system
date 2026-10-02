/* ---------- End point pages ----------
   A client, a person, a pod or a cost line. Every one is built from the same
   section shapes as the pages above it, so the board reads as one thing. */

var MN = DEEP.months;

function gbp(n) { return '£' + Math.round(n).toLocaleString('en-GB'); }
function one(n) { return (Math.round(n * 10) / 10).toFixed(1); }

/* Sparklines want a continuous run. Trim to the months the entity actually
   existed and carry any gap forward, because the table under it holds the
   month by month truth. */
function compact(series) {
  var a = 0, b = series.length - 1;
  while (a < series.length && series[a] === null) a++;
  while (b >= 0 && series[b] === null) b--;
  if (a > b) return null;
  var out = [], last = series[a];
  for (var i = a; i <= b; i++) {
    if (series[i] !== null) last = series[i];
    out.push(last);
  }
  return { v: out, from: MN[a], to: MN[b], a: a, b: b };
}

function trendRow(name, series, fmt, goodUp, pad) {
  var c = compact(series);
  if (!c || c.v.length < 2) return null;
  var n = c.v.length;
  var now = c.v[n - 1], prev = c.v[n - 2];
  var d = now - prev;
  var lo = Math.min.apply(null, c.v), hi = Math.max.apply(null, c.v);
  var p = pad === undefined ? Math.max((hi - lo) * 0.35, Math.abs(hi) * 0.04 || 1) : pad;
  return {
    name: name, value: fmt(now), series: c.v, lo: lo - p, hi: hi + p,
    deltaDir: d > 0.0001 ? 'up' : d < -0.0001 ? 'down' : 'flat',
    deltaText: Math.abs(d) < 0.0001 ? 'level' : fmt(Math.abs(d)),
    deltaGood: d === 0 ? true : (d > 0) === goodUp
  };
}

function trendsOf(rows, title, note) {
  rows = rows.filter(Boolean);
  if (!rows.length) return null;
  return { title: title, note: note || '', kind: 'trends', trends: rows };
}

/* ---------- who is who ---------- */

var INDEX = null;

function buildIndex() {
  if (INDEX) return INDEX;
  INDEX = {};
  function add(label, kind, id) { INDEX[label.toLowerCase()] = { kind: kind, id: id }; }
  Object.keys(DEEP.clients).forEach(function (id) { add(DEEP.clients[id].name, 'client', id); });
  Object.keys(DEEP.people).forEach(function (id) { add(DEEP.people[id].name, 'person', id); });
  Object.keys(DEEP.cost).forEach(function (id) { add(DEEP.cost[id].name, 'cost', id); });
  DEEP.pods.forEach(function (p) { add(p.name, 'pod', p.id); });
  return INDEX;
}

/* Table labels carry extra words: "Less editor payroll", "Editor payroll, 16
   people". Strip those before looking the row up. */
function entityFor(label) {
  var s = String(label || '').trim()
    .replace(/^Less\s+/i, '')
    .replace(/,\s*\d+\s+people$/i, '')
    .replace(/\s*\(subtotal\)$/i, '')
    .replace(/,\s*the six lines above$/i, '');
  return buildIndex()[s.toLowerCase()] || null;
}

function goLink(label, ent) {
  return '<button type="button" class="go" data-go="' + ent.kind + ':' + ent.id + '">' + esc(label) + '</button>';
}

/* ---------- pod roll ups ---------- */

function podPeople(podName) {
  return Object.keys(DEEP.people).map(function (id) { return DEEP.people[id]; })
    .filter(function (p) { return p.pod === podName; });
}

function podClients(podName) {
  return Object.keys(DEEP.clients).map(function (id) { return DEEP.clients[id]; })
    .filter(function (c) { return c.pod === podName; });
}

function meanAt(list, pick, i) {
  var v = [];
  list.forEach(function (x) { var n = pick(x, i); if (n !== null && n !== undefined) v.push(n); });
  if (!v.length) return null;
  return v.reduce(function (a, b) { return a + b; }, 0) / v.length;
}

function podSeries(podName) {
  var pe = podPeople(podName), cl = podClients(podName), i;
  var mrr = [], csat = [], perf = [], sat = [], chk = [];
  for (i = 0; i < 12; i++) {
    mrr.push(cl.reduce(function (a, c) { return a + c.retainer[i]; }, 0));
    csat.push(meanAt(cl, function (c, k) { return c.sat[k]; }, i));
    perf.push(meanAt(pe, function (p, k) { return p.perf[k]; }, i));
    sat.push(meanAt(pe, function (p, k) { return p.sat[k]; }, i));
    var f = 0, d = 0;
    pe.forEach(function (p) { if (p.filed[i]) { f += p.filed[i][0]; d += p.filed[i][1]; } });
    chk.push(d ? (f / d) * 100 : null);
  }
  return { mrr: mrr, csat: csat, perf: perf, sat: sat, chk: chk, people: pe, clients: cl };
}

/* ---------- the four page shapes ---------- */

function monthGrid(title, note, qs, rows, bad, good, blank, avgLabel) {
  return {
    title: title, note: note || '', kind: 'grid',
    columns: ['Month'].concat(qs).concat([avgLabel || 'Average']),
    rowLabels: MN.slice(), sublabels: [],
    values: rows, bad: bad, good: good, nullLabel: blank
  };
}

function clientPage(id) {
  var c = DEEP.clients[id];
  var i, secs = [];
  var months = c.retainer.filter(function (v) { return v > 0; }).length;
  var billed = c.retainer.reduce(function (a, b) { return a + b; }, 0);
  var replies = c.sat.filter(function (v) { return v !== null; }).length;
  var live = c.retainer[11] > 0;
  var latest = null;
  for (i = 11; i >= 0; i--) if (c.sat[i] !== null) { latest = i; break; }

  var stats = [
    { label: live ? 'Monthly retainer' : 'Retainer when it ended',
      value: gbp(live ? c.retainer[11] : c.retainer[c.last]),
      sub: live ? (c.tenure + ' months with NSY') : ('Lost in ' + MN[Math.min(11, c.last + 1)]),
      tone: live ? 'flat' : 'neg' },
    { label: 'Billed in the twelve months', value: gbp(billed),
      sub: months + ' of 12 months on the book', tone: 'flat' },
    { label: 'Latest satisfaction',
      value: latest === null ? 'None' : one(c.sat[latest]),
      sub: latest === null ? 'Never returned a form' : (MN[latest] + ', against a target of 9.0'),
      tone: latest === null ? 'neg' : (c.sat[latest] >= 9 ? 'pos' : 'neg') },
    { label: 'Forms returned', value: replies + ' of ' + months,
      sub: replies === months ? 'Answered every month' : ((months - replies) + ' months with no answer'),
      tone: replies === months ? 'pos' : 'neg' }
  ];

  var rows = [];
  for (i = 0; i < 12; i++) {
    rows.push(c.q[i] ? c.q[i].concat([c.sat[i]]) : new Array(DEEP.clientQ.length + 1).fill(null));
  }
  secs.push(monthGrid('Every score this client has given',
    'The six questions on the monthly form, month by month. A blank row is a month with no form returned, not a bad month.',
    DEEP.clientQ, rows, 8.0, 9.0, 'Not returned'));

  var rt = [];
  for (i = 0; i < 12; i++) {
    if (!c.retainer[i]) { rt.push({ cells: [MN[i], 'Not a client', '', ''], tone: 'none' }); continue; }
    var prev = i > 0 ? c.retainer[i - 1] : 0;
    var ch = prev ? c.retainer[i] - prev : null;
    rt.push({ cells: [MN[i], gbp(c.retainer[i]),
      ch === null ? 'First month' : (ch === 0 ? 'No change' : (ch > 0 ? 'Up ' : 'Down ') + gbp(Math.abs(ch))),
      c.sat[i] === null ? 'No form' : one(c.sat[i])],
      tone: ch === null ? 'none' : ch > 0 ? 'pos' : ch < 0 ? 'neg' : 'none' });
  }
  rt.push({ cells: ['Total billed', gbp(billed), '', ''], tone: 'none' });
  secs.push({ title: 'Month by month', note: '', kind: 'table',
    columns: ['Month', 'Retainer', 'Change', 'Satisfaction'], rows: rt });

  secs.push(trendsOf([
    trendRow('Retainer', c.retainer.map(function (v) { return v || null; }), gbp, true),
    trendRow('Satisfaction', c.sat, one, true, 0.4)
  ], 'Twelve months'));

  var meta = '<span class="e-meta">'
    + '<span><b>' + esc(c.pod) + '</b>, led by ' + esc(c.lead) + '</span>'
    + '<span>' + (live ? esc(c.tenure) + ' months with NSY' : 'Left in ' + esc(MN[Math.min(11, c.last + 1)])) + '</span>'
    + '<span class="chip ' + (live ? (c.status === 'At risk' ? 'bad' : c.status === 'Growing' ? 'good' : '') : 'bad') + '">'
    + esc(live ? c.status : 'Closed') + '</span></span>';

  var right = '<span class="e-right"><span class="e-big num">' + gbp(live ? c.retainer[11] : c.retainer[c.last])
    + '</span><span class="e-cap">' + (live ? 'a month, ' + (c.retainer[11] / DEEP.mrr[11] * 100).toFixed(1) + '% of MRR' : 'a month when it closed') + '</span></span>';

  return {
    title: c.name,
    head: '<section class="card ehead"><div><h2>' + esc(c.name) + '</h2>' + meta + '</div>' + right + '</section>',
    note: live ? '' : ('This account closed in ' + MN[Math.min(11, c.last + 1)] + '. ' + c.reason + '.'),
    stats: stats, sections: secs.filter(Boolean)
  };
}

function personPage(id) {
  var p = DEEP.people[id];
  var i, secs = [];
  var graded = p.perf.filter(function (v) { return v !== null; }).length;
  var replied = p.sat.filter(function (v) { return v !== null; }).length;
  var f = 0, d = 0;
  p.filed.forEach(function (x) { if (x) { f += x[0]; d += x[1]; } });
  var last = null;
  for (i = 11; i >= 0; i--) if (p.perf[i] !== null) { last = i; break; }
  var lastSat = null;
  for (i = 11; i >= 0; i--) if (p.sat[i] !== null) { lastSat = i; break; }

  var stats = [
    { label: 'Latest performance grade', value: last === null ? 'Never graded' : one(p.perf[last]),
      sub: last === null ? 'No lead owns this grade' : (MN[last] + ', against a target of 4.0'),
      tone: last === null ? 'neg' : (p.perf[last] >= 4 ? 'pos' : 'neg') },
    { label: 'Months graded', value: graded + ' of 12',
      sub: graded === 12 ? 'Graded every month' : ((12 - graded) + ' months missed'),
      tone: graded === 12 ? 'pos' : 'neg' },
    { label: 'Latest pulse score', value: lastSat === null ? 'None' : one(p.sat[lastSat]),
      sub: lastSat === null ? 'Never returned the pulse' : (MN[lastSat] + ', against a target of 8.0'),
      tone: lastSat === null ? 'neg' : (p.sat[lastSat] >= 8 ? 'pos' : 'neg') },
    { label: 'Checklists filed', value: d ? Math.round(f / d * 100) + '%' : 'None',
      sub: f + ' of ' + d + ' across the year', tone: d && (f / d) >= 0.95 ? 'pos' : 'neg' }
  ];

  var brows = [];
  for (i = 0; i < 12; i++) brows.push(p.beh[i] ? p.beh[i].concat([p.perf[i]]) : new Array(DEEP.beh.length + 1).fill(null));
  secs.push(monthGrid('Every grade this person has been given',
    'One to five against the five behaviours, every month. A blank row means no grade was taken, not a low grade.',
    DEEP.beh, brows, 3.5, 4.5, 'Not graded', 'Overall'));

  var srows = [];
  for (i = 0; i < 12; i++) srows.push(p.satq[i] ? p.satq[i].concat([p.sat[i]]) : new Array(DEEP.colleagueQ.length + 1).fill(null));
  secs.push(monthGrid('Every pulse answer', 'The monthly team pulse, month by month.',
    DEEP.colleagueQ, srows, 7.5, 8.5, 'Not returned'));

  var crows = [];
  for (i = 0; i < 12; i++) {
    if (!p.filed[i]) { crows.push({ cells: [MN[i], 'Not here yet', '', ''], tone: 'none' }); continue; }
    var pc = Math.round(p.filed[i][0] / p.filed[i][1] * 100);
    crows.push({ cells: [MN[i], p.filed[i][0] + ' of ' + p.filed[i][1], pc + '%', (pc - 100) + ' pts'],
      tone: pc === 100 ? 'pos' : pc < 80 ? 'neg' : 'none' });
  }
  crows.push({ cells: ['Total', f + ' of ' + d, (d ? Math.round(f / d * 100) : 0) + '%', ''], tone: 'none' });
  secs.push({ title: 'End of day checklist', note: 'The target is 100%, every working day.', kind: 'table',
    columns: ['Month', 'Filed of due', 'Completion', 'Against 100%'], rows: crows });

  secs.push(trendsOf([
    trendRow('Performance grade', p.perf, one, true, 0.4),
    trendRow('Pulse score', p.sat, one, true, 0.5),
    trendRow('Checklist completion', p.filed.map(function (x) { return x ? Math.round(x[0] / x[1] * 100) : null; }),
      function (v) { return Math.round(v) + '%'; }, true, 8)
  ], 'Twelve months'));

  var role = p.title || (p.role === 'strategist' ? (p.podLead ? 'Creative strategist, pod lead' : 'Creative strategist')
    : p.role === 'editor' ? 'Video editor' : 'Team');
  var meta = '<span class="e-meta"><span><b>' + esc(role) + '</b></span>'
    + (p.pod ? '<span>' + esc(p.pod) + ', led by ' + esc(p.lead) + '</span>' : '<span>Outside the pods</span>')
    + '<span>' + (p.joined ? 'Joined in ' + esc(MN[p.joined]) : 'Here the whole year') + '</span></span>';
  var right = '<span class="e-right"><span class="e-big num">' + (last === null ? 'Not graded' : one(p.perf[last]))
    + '</span><span class="e-cap">' + (last === null ? 'no grade this month' : 'performance in ' + MN[last]) + '</span></span>';

  return {
    title: p.name,
    head: '<section class="card ehead"><div><h2>' + esc(p.name) + '</h2>' + meta + '</div>' + right + '</section>',
    note: '', stats: stats, sections: secs.filter(Boolean)
  };
}

function podPage(id) {
  var pod = DEEP.pods.filter(function (x) { return x.id === id; })[0];
  var S = podSeries(pod.name);
  var secs = [], i;
  var mrrNow = S.mrr[11];

  var stats = [
    { label: 'MRR', value: gbp(mrrNow), sub: (mrrNow / DEEP.mrr[11] * 100).toFixed(1) + '% of the book', tone: 'flat' },
    { label: 'Client satisfaction', value: S.csat[11] === null ? 'None' : one(S.csat[11]),
      sub: 'Target 9.0', tone: S.csat[11] !== null && S.csat[11] >= 9 ? 'pos' : 'neg' },
    { label: 'Colleague performance', value: S.perf[11] === null ? 'None' : one(S.perf[11]),
      sub: 'Target 4.0', tone: S.perf[11] !== null && S.perf[11] >= 4 ? 'pos' : 'neg' },
    { label: 'Colleague satisfaction', value: S.sat[11] === null ? 'None' : one(S.sat[11]),
      sub: 'Target 8.0', tone: S.sat[11] !== null && S.sat[11] >= 8 ? 'pos' : 'neg' },
    { label: 'Checklist completion', value: S.chk[11] === null ? 'None' : Math.round(S.chk[11]) + '%',
      sub: 'Target 100%', tone: 'neg' }
  ];

  var live = S.clients.filter(function (c) { return c.retainer[11] > 0; });
  var gone = S.clients.filter(function (c) { return c.retainer[11] === 0; });

  secs.push({ title: 'Clients in this pod', note: '', kind: 'table',
    columns: ['Client', 'Retainer', 'Months with NSY', 'Satisfaction', 'Status'],
    rows: live.map(function (c) {
      return { cells: [c.name, gbp(c.retainer[11]), String(c.tenure),
        c.sat[11] === null ? 'No form' : one(c.sat[11]), c.status],
        tone: c.status === 'At risk' ? 'neg' : c.status === 'Growing' ? 'pos' : 'none' };
    }).concat([{ cells: ['Total', gbp(mrrNow), '', '', live.length + ' clients'], tone: 'none' }]) });

  if (gone.length) {
    secs.push({ title: 'Accounts this pod has lost', note: 'Every one of these was on the book at some point in the last twelve months.',
      kind: 'table', columns: ['Client', 'Retainer', 'Lost in', 'Why'],
      rows: gone.map(function (c) {
        return { cells: [c.name, gbp(c.retainer[c.last]), MN[Math.min(11, c.last + 1)], c.reason], tone: 'neg' };
      }) });
  }

  secs.push({ title: 'People in this pod', note: '', kind: 'table',
    columns: ['Person', 'Role', 'Performance', 'Pulse', 'Checklist'],
    rows: S.people.map(function (p) {
      var pc = p.filed[11] ? Math.round(p.filed[11][0] / p.filed[11][1] * 100) : null;
      return { cells: [p.name,
        p.role === 'strategist' ? (p.podLead ? 'Strategist, pod lead' : 'Strategist') : 'Editor',
        p.perf[11] === null ? 'Not graded' : one(p.perf[11]),
        p.sat[11] === null ? 'Not returned' : one(p.sat[11]),
        pc === null ? 'None' : pc + '%'],
        tone: p.perf[11] !== null && p.perf[11] < 3.5 ? 'neg' : 'none' };
    }) });

  secs.push(trendsOf([
    trendRow('MRR', S.mrr.map(function (v) { return v || null; }), gbp, true),
    trendRow('Client satisfaction', S.csat, one, true, 0.4),
    trendRow('Colleague performance', S.perf, one, true, 0.4),
    trendRow('Colleague satisfaction', S.sat, one, true, 0.5),
    trendRow('Checklist completion', S.chk, function (v) { return Math.round(v) + '%'; }, true, 8)
  ], 'Twelve months'));

  var meta = '<span class="e-meta"><span>Led by <b>' + esc(pod.lead) + '</b></span>'
    + '<span>' + S.people.length + ' people</span><span>' + live.length + ' clients</span></span>';
  var right = '<span class="e-right"><span class="e-big num">' + gbp(mrrNow)
    + '</span><span class="e-cap">a month, ' + (mrrNow / DEEP.mrr[11] * 100).toFixed(1) + '% of the book</span></span>';

  return {
    title: pod.name,
    head: '<section class="card ehead"><div><h2>' + esc(pod.name) + '</h2>' + meta + '</div>' + right + '</section>',
    note: '', stats: stats, sections: secs.filter(Boolean)
  };
}

function costPage(id) {
  var L = DEEP.cost[id], i;
  var tot = L.series.reduce(function (a, b) { return a + b; }, 0);
  var grp = L.group === 'Overheads' ? DEEP.ohtot : DEEP.dcost;
  var now = L.series[11], prev = L.series[10];

  var stats = [
    { label: 'September', value: gbp(now), sub: (now / DEEP.rev[11] * 100).toFixed(1) + '% of revenue', tone: 'flat' },
    { label: 'Share of ' + L.group.toLowerCase(), value: (now / grp[11] * 100).toFixed(1) + '%',
      sub: 'of ' + gbp(grp[11]), tone: 'flat' },
    { label: 'Change on August', value: (now >= prev ? 'Up ' : 'Down ') + gbp(Math.abs(now - prev)),
      sub: prev ? ((now - prev) / prev * 100).toFixed(1) + '% on the month' : '', tone: now > prev ? 'neg' : 'pos' },
    { label: 'Twelve month total', value: gbp(tot), sub: 'Average ' + gbp(tot / 12) + ' a month', tone: 'flat' }
  ];

  var rows = [];
  for (i = 0; i < 12; i++) {
    var ch = i ? L.series[i] - L.series[i - 1] : null;
    rows.push({ cells: [MN[i], gbp(L.series[i]), (L.series[i] / DEEP.rev[i] * 100).toFixed(1) + '%',
      (L.series[i] / grp[i] * 100).toFixed(1) + '%',
      ch === null ? '' : (ch >= 0 ? 'Up ' : 'Down ') + gbp(Math.abs(ch))],
      tone: ch === null ? 'none' : ch > 0 ? 'neg' : 'pos' });
  }
  rows.push({ cells: ['Total', gbp(tot), '', '', ''], tone: 'none' });

  var secs = [
    { title: 'Month by month', note: 'Percentages are of revenue in that month, and of ' + L.group.toLowerCase() + ' in that month.',
      kind: 'table', columns: ['Month', 'Pounds', '% of revenue', 'Share of ' + L.group.toLowerCase(), 'Change'], rows: rows },
    trendsOf([
      trendRow('This line', L.series, gbp, false),
      trendRow('As a share of revenue', L.series.map(function (v, k) { return v / DEEP.rev[k] * 100; }),
        function (v) { return v.toFixed(1) + '%'; }, false, 0.8)
    ], 'Twelve months', 'Down is good news on a cost line, so a falling line is coloured green.')
  ];

  var meta = '<span class="e-meta"><span>Sits inside <b>' + esc(L.group) + '</b></span>'
    + '<span>Owned by ' + esc(L.owner) + '</span></span>';
  var right = '<span class="e-right"><span class="e-big num">' + gbp(now)
    + '</span><span class="e-cap">' + (now / DEEP.rev[11] * 100).toFixed(1) + '% of September revenue</span></span>';

  return {
    title: L.name,
    head: '<section class="card ehead"><div><h2>' + esc(L.name) + '</h2>' + meta + '</div>' + right + '</section>',
    note: '', stats: stats, sections: secs.filter(Boolean)
  };
}

var PAGEFN = { client: clientPage, person: personPage, pod: podPage, cost: costPage };
