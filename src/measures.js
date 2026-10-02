/* ---------- Measure pages ----------
   Every figure on a measure page has a page of its own. The series are
   computed from the entity data rather than stored, so a measure page and
   the page that quotes it cannot drift apart. */

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

var CL = function () { return Object.keys(DEEP.clients).map(function (k) { return DEEP.clients[k]; }); };
var PE = function () { return Object.keys(DEEP.people).map(function (k) { return DEEP.people[k]; }); };
var COSTS = function () { return Object.keys(DEEP.cost).map(function (k) { return DEEP.cost[k]; }); };

function months(fn) { var o = [], i; for (i = 0; i < 12; i++) o.push(fn(i)); return o; }
function activeAt(i) { return CL().filter(function (c) { return c.retainer[i] > 0; }); }
function repliedAt(i) { return CL().filter(function (c) { return c.sat[i] !== null; }); }
function gradedAt(i) { return PE().filter(function (p) { return p.perf[i] !== null; }); }
function pulsedAt(i) { return PE().filter(function (p) { return p.sat[i] !== null; }); }
function avg(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
function firstMonth(c) { for (var i = 0; i < 12; i++) if (c.retainer[i] > 0) return i; return -1; }
function lastMonth(c) { for (var i = 11; i >= 0; i--) if (c.retainer[i] > 0) return i; return -1; }
function signedIn(i) { return CL().filter(function (c) { return firstMonth(c) === i && !(i === 0 && c.retainer[0] > 0 && c.tenure > 1); }); }
function lostIn(i) { return CL().filter(function (c) { var l = lastMonth(c); return l >= 0 && l === i - 1; }); }
function colMean(i, j, list, pick) {
  var v = [];
  list.forEach(function (x) { var q = pick(x, i); if (q) v.push(q[j]); });
  return avg(v);
}

var F = {
  n:     function (v) { return v === null ? 'None' : String(Math.round(v)); },
  one:   function (v) { return v === null ? 'None' : (Math.round(v * 10) / 10).toFixed(1); },
  pct:   function (v) { return v === null ? 'None' : (Math.round(v * 10) / 10).toFixed(1) + '%'; },
  pct0:  function (v) { return v === null ? 'None' : Math.round(v) + '%'; },
  money: function (v) { return v === null ? 'None' : '£' + Math.round(v).toLocaleString('en-GB'); }
};

/* ---------- who moves it ---------- */

function whoClients(i, pick, fmt, label, note) {
  var rows = activeAt(i).map(function (c) { return { c: c, v: pick(c, i) }; })
    .filter(function (r) { return r.v !== null && r.v !== undefined; })
    .sort(function (a, b) { return b.v - a.v; });
  if (!rows.length) return null;
  return { title: 'Which clients move it', note: note || '', kind: 'table',
    columns: ['Client', 'Pod', label],
    rows: rows.map(function (r) { return { cells: [r.c.name, r.c.pod, fmt(r.v)], tone: 'none' }; }) };
}

function whoPeople(i, pick, fmt, label, note) {
  var rows = PE().map(function (p) { return { p: p, v: pick(p, i) }; })
    .filter(function (r) { return r.v !== null && r.v !== undefined; })
    .sort(function (a, b) { return b.v - a.v; });
  if (!rows.length) return null;
  return { title: 'Who moves it', note: note || '', kind: 'table',
    columns: ['Person', 'Pod', 'Role', label],
    rows: rows.map(function (r) {
      return { cells: [r.p.name, r.p.pod || 'Outside pods',
        r.p.title || (r.p.role === 'strategist' ? 'Strategist' : r.p.role === 'editor' ? 'Editor' : 'Team'),
        fmt(r.v)], tone: 'none' };
    }) };
}

function whoPods(i, pick, fmt, label) {
  return { title: 'By pod', note: '', kind: 'table', columns: ['Pod', 'Lead', label],
    rows: DEEP.pods.map(function (pd) {
      return { cells: [pd.name, pd.lead, fmt(pick(pd.name, i))], tone: 'none' };
    }) };
}

/* ---------- the registry ---------- */

var MEAS = null, ALIAS = null;

function costSeries(slug) { return DEEP.cost[slug] ? DEEP.cost[slug].series : months(function () { return 0; }); }
function podChk(name, i) {
  var f = 0, d = 0;
  PE().filter(function (p) { return p.pod === name; }).forEach(function (p) {
    if (p.filed[i]) { f += p.filed[i][0]; d += p.filed[i][1]; }
  });
  return d ? f / d * 100 : null;
}

function buildMeasures() {
  if (MEAS) return MEAS;
  MEAS = {}; ALIAS = {};
  var Q = DEEP.clientQ, CQ = DEEP.colleagueQ, B = DEEP.beh;

  function M(kpi, name, series, fmt, o) {
    o = o || {};
    var id = kpi + ':' + slugify(name);
    MEAS[id] = { id: id, kpi: kpi, name: name, series: series, fmt: F[fmt], fmtKey: fmt,
      target: o.target === undefined ? null : o.target, targetLabel: o.targetLabel || '',
      goodUp: o.goodUp !== false, owner: o.owner || '', def: o.def || 'agreed',
      definition: o.definition || '', capture: o.capture || '',
      parts: o.parts || [], who: o.who || null };
    (o.aliases || []).forEach(function (a) { ALIAS[kpi + ':' + slugify(a)] = id; });
    return id;
  }

  /* ---- monthly recurring revenue ---- */
  M('mrr', 'MRR', DEEP.mrr.slice(), 'money', {
    targetLabel: 'Target, up on last month', owner: 'Nativ and the Creative Lead',
    definition: 'Contracted retainer value invoiced in the calendar month, added up across every live account.',
    capture: 'Read straight from the invoicing ledger at month end close.',
    parts: ['New business won, monthly value', 'Expansion from existing clients', 'MRR lost to churn'],
    who: function (i) { return whoClients(i, function (c, k) { return c.retainer[k] || null; }, F.money, 'Retainer',
      'Every live account and what it pays. These add up to the figure above.'); } });

  M('mrr', 'Last month MRR', months(function (i) { return i ? DEEP.mrr[i - 1] : null; }), 'money', {
    targetLabel: 'Target, up on last month', owner: 'Nativ and the Creative Lead',
    definition: 'What the book was worth the month before, so this month has something to sit against.',
    capture: 'The previous month from the same ledger.', parts: ['MRR'] });

  M('mrr', 'Active clients', months(function (i) { return activeAt(i).length; }), 'n', {
    owner: 'Creative Lead',
    definition: 'Accounts with a retainer invoiced in the month. Paused accounts are not counted.',
    capture: 'Counted from the ledger, the same source as the revenue itself.',
    parts: ['New clients signed', 'Clients churned'],
    who: function (i) { return whoClients(i, function (c, k) { return c.retainer[k] || null; }, F.money, 'Retainer'); } });

  M('mrr', 'Average retainer', months(function (i) {
      var a = activeAt(i); return a.length ? DEEP.mrr[i] / a.length : null; }), 'money', {
    aliases: ['Average retainer value'], target: 11000, targetLabel: 'Target £11,000', owner: 'Nativ',
    definition: 'Monthly recurring revenue divided by the number of live accounts.',
    capture: 'Falls out of the two figures above it, so it needs no separate entry.',
    parts: ['MRR', 'Active clients'],
    who: function (i) { return whoClients(i, function (c, k) { return c.retainer[k] || null; }, F.money, 'Retainer',
      'Sorted by size. The average is pulled up by the top two and down by the newest.'); } });

  M('mrr', 'Net new MRR', months(function (i) { return i ? DEEP.mrr[i] - DEEP.mrr[i - 1] : null; }), 'money', {
    target: 0, targetLabel: 'Anything above zero is growth', owner: 'Creative Lead',
    definition: 'The change in monthly recurring revenue on the month before. New business and expansion less churn and reductions.',
    capture: 'The difference between two months of the ledger.',
    parts: ['New business won, monthly value', 'Expansion from existing clients', 'MRR lost to churn'] });

  M('mrr', 'New clients signed', months(function (i) { return signedIn(i).length; }), 'n', {
    aliases: ['New retainers signed'], target: 3, targetLabel: 'Target 3 a month', owner: 'Creative Lead',
    definition: 'Accounts invoicing a retainer for the first time in the month.',
    capture: 'First appearance in the ledger. Objective today.',
    who: function (i) {
      var s = signedIn(i);
      if (!s.length) return { title: 'Signed this month', note: 'Nothing was signed in this month.', kind: 'table',
        columns: ['Client'], rows: [] };
      return { title: 'Signed this month', note: '', kind: 'table', columns: ['Client', 'Pod', 'Retainer'],
        rows: s.map(function (c) { return { cells: [c.name, c.pod, F.money(c.retainer[i])], tone: 'pos' }; }) };
    } });

  M('mrr', 'Clients churned', months(function (i) { return lostIn(i).length; }), 'n', {
    aliases: ['Accounts churned this month'], target: 0, targetLabel: 'Target 0', goodUp: false, owner: 'Creative Lead',
    definition: 'Accounts that were invoicing last month and are not invoicing this month.',
    capture: 'A gap in the ledger. The reason is written down by hand when the account closes.',
    who: function (i) {
      var l = lostIn(i);
      if (!l.length) return { title: 'Lost this month', note: 'Nothing was lost in this month.', kind: 'table', columns: ['Client'], rows: [] };
      return { title: 'Lost this month', note: '', kind: 'table', columns: ['Client', 'Pod', 'Was worth', 'Why'],
        rows: l.map(function (c) { return { cells: [c.name, c.pod, F.money(c.retainer[i - 1]), c.reason || 'Not recorded'], tone: 'neg' }; }) };
    } });

  M('mrr', 'MRR lost to churn', months(function (i) {
      return lostIn(i).reduce(function (a, c) { return a + c.retainer[i - 1]; }, 0); }), 'money', {
    goodUp: false, owner: 'Creative Lead',
    definition: 'The retainer value of every account lost in the month, counted at what it was paying when it left.',
    capture: 'From the ledger, at the last month invoiced.',
    parts: ['Clients churned'] });

  M('mrr', 'Client churn', months(function (i) {
      var base = i ? activeAt(i - 1).length : 0;
      return base ? lostIn(i).length / base * 100 : null; }), 'pct', {
    target: 0, targetLabel: 'Target 0%', goodUp: false, owner: 'Creative Lead',
    definition: 'Accounts lost in the month as a share of the accounts that were live at the start of it.',
    capture: 'Two counts from the ledger.',
    parts: ['Clients churned', 'Active clients'] });

  M('mrr', 'New business won, monthly value', months(function (i) {
      return signedIn(i).reduce(function (a, c) { return a + c.retainer[i]; }, 0); }), 'money', {
    owner: 'Creative Lead',
    definition: 'The monthly retainer value of every account signed in the month.',
    capture: 'From the ledger, at the first month invoiced.',
    parts: ['New clients signed'] });

  M('mrr', 'Expansion from existing clients', months(function (i) {
      if (!i) return 0;
      return CL().reduce(function (a, c) {
        if (!c.retainer[i] || !c.retainer[i - 1]) return a;
        var d = c.retainer[i] - c.retainer[i - 1];
        return a + (d > 0 ? d : 0);
      }, 0); }), 'money', {
    owner: 'Creative Lead',
    definition: 'Every increase on an account that was already live last month, added together. Reductions are not netted off here.',
    capture: 'The month on month change per account in the ledger.',
    who: function (i) {
      if (!i) return null;
      var rows = CL().map(function (c) {
        if (!c.retainer[i] || !c.retainer[i - 1]) return null;
        var d = c.retainer[i] - c.retainer[i - 1];
        return d > 0 ? { cells: [c.name, c.pod, F.money(c.retainer[i - 1]), F.money(c.retainer[i]), F.money(d)], tone: 'pos' } : null;
      }).filter(Boolean);
      return { title: 'Which accounts grew', note: rows.length ? '' : 'No account grew this month.', kind: 'table',
        columns: ['Client', 'Pod', 'Was', 'Now', 'Added'], rows: rows };
    } });

  M('mrr', 'MRR at risk', DEEP.extra['mrr:mrr-at-risk'].series.slice(), 'money', {
    target: 0, targetLabel: 'Target £0 flagged', goodUp: false, owner: 'Creative Lead', def: 'manual',
    definition: 'The retainer value of every account a lead has flagged at risk, before the client has raised it.',
    capture: 'Flagged by hand in the client record. The value is in the reason written next to the flag, not in the total.',
    who: function (i) {
      if (i !== 11) return null;
      var r = activeAt(11).filter(function (c) { return c.status === 'At risk'; });
      return { title: 'Flagged at risk', note: 'Flagged by a lead, not by the client.', kind: 'table',
        columns: ['Client', 'Pod', 'Retainer', 'Satisfaction'],
        rows: r.map(function (c) { return { cells: [c.name, c.pod, F.money(c.retainer[11]),
          c.sat[11] === null ? 'No form' : F.one(c.sat[11])], tone: 'neg' }; }) };
    } });

  M('mrr', 'Upsell conversations had', DEEP.extra['mrr:upsell-conversations-had'].series.slice(), 'n', {
    target: 4, targetLabel: 'Target 4 a month', owner: 'Creative Lead', def: 'drafting',
    definition: 'A conversation where a second service line was put to the client with a price against it.',
    capture: 'Entered by hand. Open question: a mention on a call is not a proposal sent, and the two need separating before this can be trusted.' });

  /* ---- operating profit ---- */
  var PAY = months(function (i) {
    return costSeries('editor-payroll')[i] + costSeries('strategist-payroll')[i]
      + costSeries('leadership-and-ops-payroll')[i];
  });

  function whoCost(group) {
    return function (i) {
      var lines = COSTS().filter(function (L) { return L.group === group; })
        .sort(function (a, b) { return b.series[i] - a.series[i]; });
      var tot = lines.reduce(function (a, L) { return a + L.series[i]; }, 0);
      return { title: 'What it is made of', note: 'Each of these has a page of its own.', kind: 'table',
        columns: ['Line', 'Pounds', '% of revenue', 'Share'],
        rows: lines.map(function (L) {
          return { cells: [L.name, F.money(L.series[i]), F.pct(L.series[i] / DEEP.rev[i] * 100),
            F.pct(L.series[i] / tot * 100)], tone: 'none' };
        }).concat([{ cells: ['Total', F.money(tot), F.pct(tot / DEEP.rev[i] * 100), '100.0%'], tone: 'none' }]) };
    };
  }

  M('profit', 'Revenue', DEEP.rev.slice(), 'money', {
    owner: 'Nativ', definition: 'Everything invoiced in the month. On this board that is the retainer book, since project fees are excluded.',
    capture: 'From the ledger at month end close.', parts: ['Operating profit'] });

  M('profit', 'Total delivery cost', DEEP.dcost.slice(), 'money', {
    aliases: ['delivery cost'], goodUp: false, owner: 'Editing Lead',
    definition: 'Everything spent making the work: the two pod payrolls, freelance help and the software used to deliver.',
    capture: 'Closed by the fractional CFO in the month end pack.',
    who: whoCost('Delivery cost') });

  M('profit', 'Delivery margin in pounds', DEEP.dmarg.slice(), 'money', {
    owner: 'Editing Lead', definition: 'Revenue less delivery cost. What is left to pay for everything that is not making the work.',
    capture: 'Two figures from the month end pack.', parts: ['Revenue', 'Total delivery cost'] });

  M('profit', 'Delivery margin', months(function (i) { return DEEP.dmarg[i] / DEEP.rev[i] * 100; }), 'pct', {
    target: 60, targetLabel: 'Target 60%', owner: 'Editing Lead',
    definition: 'Delivery margin as a share of revenue. The single number that says whether the work pays for itself.',
    capture: 'Falls out of revenue and delivery cost.',
    parts: ['Delivery margin in pounds', 'Revenue'], who: whoCost('Delivery cost') });

  M('profit', 'Total overheads', DEEP.ohtot.slice(), 'money', {
    aliases: ['Overheads'], goodUp: false, owner: 'Nativ',
    definition: 'Everything in the business that is not delivery cost: leadership and ops payroll, tooling, office, marketing, professional fees.',
    capture: 'Closed by the fractional CFO in the month end pack.',
    who: whoCost('Overheads') });

  M('profit', 'Operating profit', DEEP.op.slice(), 'money', {
    aliases: ['Operating profit (total)'], target: 42000, targetLabel: 'Target £42,000 a month',
    owner: 'Nativ and the fractional CFO',
    definition: 'Revenue less all delivery cost and all overhead. Before tax and before founder drawings.',
    capture: 'The only figure on this board that does not come from Notion.',
    parts: ['Delivery margin in pounds', 'Total overheads'] });

  M('profit', 'Operating margin', months(function (i) { return DEEP.op[i] / DEEP.rev[i] * 100; }), 'pct', {
    aliases: ['Operating profit margin'],
    targetLabel: 'Target, up on last month', owner: 'Nativ',
    definition: 'Operating profit as a share of revenue.',
    capture: 'Falls out of the two figures above it.', parts: ['Operating profit', 'Revenue'] });

  M('profit', 'Payroll as a share of revenue', months(function (i) { return PAY[i] / DEEP.rev[i] * 100; }), 'pct', {
    target: 45, targetLabel: 'Target 45%', goodUp: false, owner: 'Fractional CFO',
    definition: 'Every payroll line, delivery and leadership together, as a share of revenue.',
    capture: 'Three payroll lines from the month end pack over revenue.',
    who: function (i) {
      return { title: 'The three payroll lines', note: '', kind: 'table',
        columns: ['Line', 'Pounds', '% of revenue'],
        rows: ['editor-payroll', 'strategist-payroll', 'leadership-and-ops-payroll'].map(function (k) {
          return { cells: [DEEP.cost[k].name, F.money(DEEP.cost[k].series[i]),
            F.pct(DEEP.cost[k].series[i] / DEEP.rev[i] * 100)], tone: 'none' };
        }).concat([{ cells: ['Total', F.money(PAY[i]), F.pct(PAY[i] / DEEP.rev[i] * 100)], tone: 'none' }]) };
    } });

  M('profit', 'Revenue per head', months(function (i) { return DEEP.rev[i] / DEEP.head[i]; }), 'money', {
    target: 6000, targetLabel: 'Target £6,000', owner: 'Nativ',
    definition: 'Revenue divided by headcount. It falls every time you add a head and takes a month or two to come back.',
    capture: 'Revenue from the ledger, headcount from the team list.',
    parts: ['Revenue'],
    who: function (i) {
      return { title: 'Headcount behind it', note: 'The team grew from ' + DEEP.head[0] + ' to ' + DEEP.head[11] + ' across the year.',
        kind: 'table', columns: ['Month', 'Headcount', 'Revenue', 'Per head'],
        rows: months(function (k) {
          return { cells: [DEEP.months[k], String(DEEP.head[k]), F.money(DEEP.rev[k]), F.money(DEEP.rev[k] / DEEP.head[k])],
            tone: k === i ? 'pos' : 'none' };
        }) };
    } });

  /* ---- client satisfaction ----
     The score every client is held to, in one place so the page, the
     question rows and the below target count cannot drift apart. */
  var CSAT = 9;

  M('client-sat', 'Company score', months(function (i) {
      return avg(repliedAt(i).map(function (c) { return c.sat[i]; })); }), 'one', {
    aliases: ['Average score across six questions'], target: 9, targetLabel: 'Target 9.0 out of 10',
    owner: 'Creative Lead',
    definition: 'The average of the six scored questions, across every client that returned a form this month.',
    capture: 'Google Form, sent monthly to every account lead.',
    parts: Q.slice(),
    who: function (i) { return whoClients(i, function (c, k) { return c.sat[k]; }, F.one, 'Score',
      'Only the clients that answered. The five who did not are not averaged in.'); } });

  M('client-sat', 'Forms returned', months(function (i) { return repliedAt(i).length; }), 'n', {
    aliases: ['Pulse responses returned'], target: 12, targetLabel: 'Target 12', owner: 'Creative Lead',
    definition: 'Clients that returned the monthly form, out of the clients that were live that month.',
    capture: 'Counted from the form responses.',
    parts: ['Active clients'],
    who: function (i) {
      var live = activeAt(i);
      return { title: 'Who answered, who did not', note: '', kind: 'table',
        columns: ['Client', 'Pod', 'Retainer', 'This month'],
        rows: live.map(function (c) {
          return { cells: [c.name, c.pod, F.money(c.retainer[i]), c.sat[i] === null ? 'No form' : F.one(c.sat[i])],
            tone: c.sat[i] === null ? 'neg' : 'pos' };
        }) };
    } });

  M('client-sat', 'Clients below target', months(function (i) {
      return repliedAt(i).filter(function (c) { return c.sat[i] < CSAT; }).length; }), 'n', {
    target: 0, targetLabel: 'Target 0', goodUp: false, owner: 'Creative Lead',
    definition: 'Clients that answered and scored below the 9.0 target.',
    capture: 'Counted from the form responses.',
    who: function (i) {
      var r = repliedAt(i).filter(function (c) { return c.sat[i] < CSAT; }).sort(function (a, b) { return a.sat[i] - b.sat[i]; });
      return { title: 'Which clients', note: r.length ? 'Worst first.' : 'Every client that answered is at or above target.',
        kind: 'table', columns: ['Client', 'Pod', 'Score', 'Retainer'],
        rows: r.map(function (c) { return { cells: [c.name, c.pod, F.one(c.sat[i]), F.money(c.retainer[i])], tone: 'neg' }; }) };
    } });

  M('client-sat', 'Retainer value not scored', months(function (i) {
      return activeAt(i).filter(function (c) { return c.sat[i] === null; })
        .reduce(function (a, c) { return a + c.retainer[i]; }, 0); }), 'money', {
    target: 0, targetLabel: 'Target £0 unscored', goodUp: false, owner: 'Creative Lead',
    definition: 'The monthly fee of every client that did not return a form. Revenue you hold no opinion on.',
    capture: 'The clients missing from the form responses, priced from the ledger.',
    who: function (i) {
      var q = activeAt(i).filter(function (c) { return c.sat[i] === null; }).sort(function (a, b) { return b.retainer[i] - a.retainer[i]; });
      return { title: 'Clients you did not hear from', note: '', kind: 'table',
        columns: ['Client', 'Pod', 'Retainer', 'Months with NSY'],
        rows: q.map(function (c) { return { cells: [c.name, c.pod, F.money(c.retainer[i]), String(c.tenure || '')], tone: 'neg' }; }) };
    } });

  Q.forEach(function (qn, j) {
    M('client-sat', qn, months(function (i) { return colMean(i, j, repliedAt(i), function (c, k) { return c.q[k]; }); }), 'one', {
      aliases: [qn + ' score'], target: 9, targetLabel: 'Target 9.0 out of 10', owner: 'Creative Lead',
      definition: 'One of the six questions on the monthly client form, averaged across everyone who answered.',
      capture: 'Google Form, one score out of ten per question.',
      who: function (i) { return whoClients(i, function (c, k) { return c.q[k] ? c.q[k][j] : null; }, F.one, qn); } });
  });

  M('client-sat', 'Lowest question', months(function (i) {
      var v = Q.map(function (q, j) { return colMean(i, j, repliedAt(i), function (c, k) { return c.q[k]; }); })
        .filter(function (x) { return x !== null; });
      return v.length ? Math.min.apply(null, v) : null; }), 'one', {
    aliases: ['Lowest scoring question'], target: 9, targetLabel: 'Target 9.0, like every question',
    goodUp: true, owner: 'Creative Lead',
    definition: 'The weakest of the six questions in the month. Which question it is matters more than the number.',
    capture: 'The minimum of the six question averages.',
    who: function (i) {
      var rows = Q.map(function (q, j) { return { q: q, v: colMean(i, j, repliedAt(i), function (c, k) { return c.q[k]; }) }; })
        .filter(function (r) { return r.v !== null; }).sort(function (a, b) { return a.v - b.v; });
      return { title: 'The six questions this month', note: 'Weakest first.', kind: 'table',
        columns: ['Question', 'Score', 'Against target'],
        rows: rows.map(function (r) { return { cells: [r.q, F.one(r.v), (r.v - CSAT >= 0 ? '+' : '') + (Math.round((r.v - CSAT) * 10) / 10).toFixed(1)],
          tone: r.v < CSAT ? 'neg' : 'pos' }; }) };
    } });

  M('client-sat', 'Negative comments raised on a call first', DEEP.extra['client-sat:negative-comments-raised-on-a-call-first'].series.slice(), 'n', {
    owner: 'Creative Lead', def: 'manual',
    definition: 'A client wrote something negative on the form, and the account lead had already raised it on a call before the form came in.',
    capture: 'Entered by hand by the Creative Lead. The point is to catch a problem before the form does.' });


  /* ---- colleague performance ---- */
  function roleAvg(role) {
    return months(function (i) {
      return avg(gradedAt(i).filter(function (p) { return p.role === role; }).map(function (p) { return p.perf[i]; }));
    });
  }

  M('colleague-perf', 'Company average', months(function (i) {
      return avg(gradedAt(i).map(function (p) { return p.perf[i]; })); }), 'one', {
    target: 4, targetLabel: 'Target 4.0 out of 5', owner: 'Both leads', def: 'drafting',
    definition: 'Every person is graded one to five each week by the lead they report to, against the five behaviours. This is the average of everyone graded.',
    capture: 'Entered by each lead on a Friday. The open question is whether one grade covers all five behaviours or whether each is scored separately.',
    parts: B.slice(),
    who: function (i) { return whoPeople(i, function (p, k) { return p.perf[k]; }, F.one, 'Grade',
      'Only the people who were graded. The gaps are the point, not the average.'); } });

  M('colleague-perf', 'People graded', months(function (i) { return gradedAt(i).length; }), 'n', {
    aliases: ['People graded each week', 'People graded this week'], target: 30, targetLabel: 'Target 30',
    owner: 'Both leads', def: 'manual',
    definition: 'People who received a grade in the month, out of everyone employed that month.',
    capture: 'Counted from what the leads entered. A missing grade is a lead who did not do it, not a person who did badly.',
    who: function (i) {
      var here = PE().filter(function (p) { return p.joined <= i; });
      return { title: 'Who was graded, who was missed', note: '', kind: 'table',
        columns: ['Person', 'Pod', 'Role', 'This month'],
        rows: here.map(function (p) {
          return { cells: [p.name, p.pod || 'Outside pods',
            p.title || (p.role === 'strategist' ? 'Strategist' : p.role === 'editor' ? 'Editor' : 'Team'),
            p.perf[i] === null ? 'Not graded' : F.one(p.perf[i])], tone: p.perf[i] === null ? 'neg' : 'pos' };
        }) };
    } });

  M('colleague-perf', 'Grades below 3', months(function (i) {
      return gradedAt(i).filter(function (p) { return p.perf[i] < 3; }).length; }), 'n', {
    aliases: ['Graded below 3'], target: 0, targetLabel: 'Target 0', goodUp: false, owner: 'Both leads',
    definition: 'People whose overall grade came in under three out of five.',
    capture: 'Counted from the grades. Three is the line at which a lead is expected to act.',
    who: function (i) {
      var r = gradedAt(i).filter(function (p) { return p.perf[i] < 3; }).sort(function (a, b) { return a.perf[i] - b.perf[i]; });
      return { title: 'Who', note: r.length ? 'Each of these needs a conversation, not a number.' : 'Nobody was under three this month.',
        kind: 'table', columns: ['Person', 'Pod', 'Role', 'Grade'],
        rows: r.map(function (p) { return { cells: [p.name, p.pod || 'Outside pods',
          p.role === 'strategist' ? 'Strategist' : p.role === 'editor' ? 'Editor' : 'Team', F.one(p.perf[i])], tone: 'neg' }; }) };
    } });

  M('colleague-perf', 'At 4.5 or above', months(function (i) {
      return gradedAt(i).filter(function (p) { return p.perf[i] >= 4.5; }).length; }), 'n', {
    owner: 'Both leads',
    definition: 'People grading four and a half or better. The people you would build a second pod around.',
    capture: 'Counted from the grades.',
    who: function (i) {
      var r = gradedAt(i).filter(function (p) { return p.perf[i] >= 4.5; }).sort(function (a, b) { return b.perf[i] - a.perf[i]; });
      return { title: 'Who', note: r.length ? '' : 'Nobody reached 4.5 this month.', kind: 'table',
        columns: ['Person', 'Pod', 'Role', 'Grade'],
        rows: r.map(function (p) { return { cells: [p.name, p.pod || 'Outside pods',
          p.role === 'strategist' ? 'Strategist' : p.role === 'editor' ? 'Editor' : 'Team', F.one(p.perf[i])], tone: 'pos' }; }) };
    } });

  M('colleague-perf', 'Strategist average', roleAvg('strategist'), 'one', {
    target: 4, targetLabel: 'Target 4.0', owner: 'Creative Lead',
    definition: 'The average grade across the creative strategists who were graded.',
    capture: 'Entered by the Creative Lead on a Friday.',
    who: function (i) { return whoPeople(i, function (p, k) { return p.role === 'strategist' ? p.perf[k] : null; }, F.one, 'Grade'); } });

  M('colleague-perf', 'Editor average', roleAvg('editor'), 'one', {
    target: 4, targetLabel: 'Target 4.0', owner: 'Editing Lead',
    definition: 'The average grade across the video editors who were graded.',
    capture: 'Entered by the Editing Lead on a Friday.',
    who: function (i) { return whoPeople(i, function (p, k) { return p.role === 'editor' ? p.perf[k] : null; }, F.one, 'Grade'); } });

  B.forEach(function (bn, j) {
    M('colleague-perf', bn, months(function (i) { return colMean(i, j, gradedAt(i), function (p, k) { return p.beh[k]; }); }), 'one', {
      target: 4, targetLabel: 'Target 4.0', owner: 'Both leads', def: 'drafting',
      definition: 'One of the five behaviours every person is graded against each week, averaged across everyone graded.',
      capture: 'Entered by each lead. Whether these are scored separately or rolled into one grade is still open.',
      who: function (i) { return whoPeople(i, function (p, k) { return p.beh[k] ? p.beh[k][j] : null; }, F.one, bn); } });
  });

  M('colleague-perf', 'One-to-ones held', DEEP.extra['colleague-perf:one-to-ones-held'].series.slice(), 'n', {
    target: 24, targetLabel: 'Weekly with everyone', owner: 'Both leads', def: 'manual',
    definition: 'A one to one held and logged with a person in the month.',
    capture: 'Entered by hand. Nothing in Notion records whether a one to one actually happened.' });

  M('colleague-perf', 'Ramping strategists at 4 or above', DEEP.extra['colleague-perf:ramping-strategists-at-4-or-above'].series.slice(), 'n', {
    target: 3, targetLabel: 'Target 3', owner: 'Creative Lead', def: 'manual',
    definition: 'Strategists still inside their first six months who are already grading four or better.',
    capture: 'Entered by hand by the Creative Lead. It says whether the ramp is working, which the company average hides.' });

  /* ---- colleague satisfaction ---- */
  M('colleague-sat', 'Company score', months(function (i) {
      return avg(pulsedAt(i).map(function (p) { return p.sat[i]; })); }), 'one', {
    target: 8, targetLabel: 'Target 8.0 out of 10', owner: 'Nativ and the Ops Manager',
    definition: 'The average of the six scored questions on the monthly team pulse, across everyone who answered.',
    capture: 'Form sent on the last Friday of the month.',
    parts: CQ.slice(),
    who: function (i) { return whoPeople(i, function (p, k) { return p.sat[k]; }, F.one, 'Score',
      'Naming a score is what ends the anonymous pulse. See the note on the satisfaction page.'); } });

  M('colleague-sat', 'Responses returned', months(function (i) { return pulsedAt(i).length; }), 'n', {
    aliases: ['Pulse responses returned'], target: 27, targetLabel: 'Target 27', owner: 'Ops Manager',
    definition: 'People who returned the pulse, out of everyone employed that month.',
    capture: 'Counted from the form responses.',
    who: function (i) {
      var here = PE().filter(function (p) { return p.joined <= i; });
      return { title: 'Who answered, who did not', note: '', kind: 'table',
        columns: ['Person', 'Pod', 'Role', 'This month'],
        rows: here.map(function (p) {
          return { cells: [p.name, p.pod || 'Outside pods',
            p.title || (p.role === 'strategist' ? 'Strategist' : p.role === 'editor' ? 'Editor' : 'Team'),
            p.sat[i] === null ? 'Not returned' : F.one(p.sat[i])], tone: p.sat[i] === null ? 'neg' : 'pos' };
        }) };
    } });

  M('colleague-sat', 'People below 7', months(function (i) {
      return pulsedAt(i).filter(function (p) { return p.sat[i] < 7; }).length; }), 'n', {
    target: 0, targetLabel: 'Target 0', goodUp: false, owner: 'Ops Manager',
    definition: 'People who answered the pulse and scored under seven out of ten.',
    capture: 'Counted from the responses.',
    who: function (i) {
      var r = pulsedAt(i).filter(function (p) { return p.sat[i] < 7; }).sort(function (a, b) { return a.sat[i] - b.sat[i]; });
      return { title: 'Who', note: r.length ? '' : 'Nobody who answered was under seven this month.', kind: 'table',
        columns: ['Person', 'Pod', 'Role', 'Score'],
        rows: r.map(function (p) { return { cells: [p.name, p.pod || 'Outside pods',
          p.role === 'strategist' ? 'Strategist' : p.role === 'editor' ? 'Editor' : 'Team', F.one(p.sat[i])], tone: 'neg' }; }) };
    } });

  CQ.forEach(function (qn, j) {
    M('colleague-sat', qn, months(function (i) { return colMean(i, j, pulsedAt(i), function (p, k) { return p.satq[k]; }); }), 'one', {
      aliases: [qn + ' score'], target: 8, targetLabel: 'Target 8.0 out of 10', owner: 'Ops Manager',
      definition: 'One of the six questions on the monthly team pulse, averaged across everyone who answered.',
      capture: 'Form sent on the last Friday of the month, one score out of ten per question.',
      who: function (i) { return whoPeople(i, function (p, k) { return p.satq[k] ? p.satq[k][j] : null; }, F.one, qn); } });
  });

  M('colleague-sat', 'Lowest scoring question', months(function (i) {
      var v = CQ.map(function (q, j) { return colMean(i, j, pulsedAt(i), function (p, k) { return p.satq[k]; }); })
        .filter(function (x) { return x !== null; });
      return v.length ? Math.min.apply(null, v) : null; }), 'one', {
    target: 8, targetLabel: 'Target 8.0, like every question', owner: 'Ops Manager',
    definition: 'The weakest of the six pulse questions in the month.',
    capture: 'The minimum of the six question averages.',
    who: function (i) {
      var rows = CQ.map(function (q, j) { return { q: q, v: colMean(i, j, pulsedAt(i), function (p, k) { return p.satq[k]; }) }; })
        .filter(function (r) { return r.v !== null; }).sort(function (a, b) { return a.v - b.v; });
      return { title: 'The six questions this month', note: 'Weakest first.', kind: 'table',
        columns: ['Question', 'Score', 'Against target'],
        rows: rows.map(function (r) { return { cells: [r.q, F.one(r.v), (r.v - 8 >= 0 ? '+' : '') + (Math.round((r.v - 8) * 10) / 10).toFixed(1)],
          tone: r.v < 8 ? 'neg' : 'pos' }; }) };
    } });

  M('colleague-sat', 'Editors working past 19:00', DEEP.extra['colleague-sat:editors-working-past-19-00'].series.slice(), 'n', {
    target: 0, targetLabel: 'Target 0', goodUp: false, owner: 'Editing Lead', def: 'manual',
    definition: 'Editors still working after seven in the evening on any day in the week.',
    capture: 'Noticed by the Editing Lead rather than measured. This is the closest thing the board has to a burnout signal.' });

  M('colleague-sat', 'Voluntary leavers this quarter', DEEP.extra['colleague-sat:voluntary-leavers-this-quarter'].series.slice(), 'n', {
    target: 0, targetLabel: 'Target 0', goodUp: false, owner: 'Nativ',
    definition: 'People who resigned in the quarter. Not redundancies, not people asked to leave.',
    capture: 'From the team list. The lagging measure that the pulse is meant to predict.' });

  /* ---- end of day checklist ---- */
  function chkTotals(i, filter) {
    var f = 0, d = 0;
    PE().filter(filter).forEach(function (p) { if (p.filed[i]) { f += p.filed[i][0]; d += p.filed[i][1]; } });
    return { f: f, d: d, pct: d ? f / d * 100 : null };
  }

  M('checklist', 'Company completion', months(function (i) { return chkTotals(i, function () { return true; }).pct; }), 'pct0', {
    aliases: ['September completion'], target: 100, targetLabel: 'Target 100% filed every day',
    owner: 'Ops Manager', def: 'drafting',
    definition: 'Checklists filed as a share of checklists due, across every person and every working day in the month.',
    capture: 'Filed in Notion. Open question: whether a checklist filed the next morning counts, and whether a blank one counts at all.',
    parts: ['Editor completion', 'Strategist completion'],
    who: function (i) {
      return whoPeople(i, function (p, k) { return p.filed[k] ? Math.round(p.filed[k][0] / p.filed[k][1] * 100) : null; },
        F.pct0, 'Completion', 'Worst at the bottom. The target is 100%, so everyone here is short.');
    } });

  M('checklist', 'Checklists missed', months(function (i) { var t = chkTotals(i, function () { return true; }); return t.d - t.f; }), 'n', {
    target: 0, targetLabel: 'Target 0', goodUp: false, owner: 'Ops Manager',
    definition: 'Checklists that were due and never filed.',
    capture: 'Due days times people, less what arrived in Notion.',
    parts: ['Company completion'] });

  M('checklist', 'Editor completion', months(function (i) { return chkTotals(i, function (p) { return p.role === 'editor'; }).pct; }), 'pct0', {
    aliases: ['Editors filing by 18:00'], target: 100, targetLabel: 'Target 100%', owner: 'Editing Lead',
    definition: 'The same measure across the sixteen video editors only. It has sat below the strategists in every month of the year.',
    capture: 'Filed in Notion.',
    who: function (i) { return whoPeople(i, function (p, k) {
      return p.role === 'editor' && p.filed[k] ? Math.round(p.filed[k][0] / p.filed[k][1] * 100) : null; }, F.pct0, 'Completion'); } });

  M('checklist', 'Strategist completion', months(function (i) { return chkTotals(i, function (p) { return p.role === 'strategist'; }).pct; }), 'pct0', {
    aliases: ['Strategists filing by 18:00'], target: 100, targetLabel: 'Target 100%', owner: 'Creative Lead',
    definition: 'The same measure across the eight creative strategists only.',
    capture: 'Filed in Notion.',
    who: function (i) { return whoPeople(i, function (p, k) {
      return p.role === 'strategist' && p.filed[k] ? Math.round(p.filed[k][0] / p.filed[k][1] * 100) : null; }, F.pct0, 'Completion'); } });

  M('checklist', 'Weakest pod', months(function (i) {
      var v = DEEP.pods.map(function (pd) { return podChk(pd.name, i); }).filter(function (x) { return x !== null; });
      return v.length ? Math.min.apply(null, v) : null; }), 'pct0', {
    target: 100, targetLabel: 'Target 100%', owner: 'Ops Manager',
    definition: 'The completion rate of whichever pod is filing least this month. Which pod it is matters more than the number.',
    capture: 'The minimum of the four pod rates.',
    who: function (i) { return whoPods(i, podChk, F.pct0, 'Completion'); } });

  M('checklist', 'Checklists naming a blocker', DEEP.extra['checklist:checklists-naming-a-blocker'].series.slice(), 'n', {
    target: 200, targetLabel: 'Target 200 of the month\u2019s filed checklists', owner: 'Ops Manager', def: 'drafting',
    definition: 'Filed checklists that named something in the way. A checklist with no blocker on it is usually a checklist filled in without thinking.',
    capture: 'A free text field in Notion. Counting it needs the field made compulsory first.',
    parts: ['Company completion'] });

  M('checklist', 'Days the full team filed', DEEP.extra['checklist:days-the-full-team-filed'].series.slice(), 'n', {
    aliases: ['Days with the full team filed'], target: 22, targetLabel: 'Every working day',
    owner: 'Ops Manager', def: 'drafting',
    definition: 'Working days on which every single person filed. The measure that shows how far 78% really is from 100%.',
    capture: 'Needs a day level view in Notion that does not exist yet.',
    parts: ['Company completion'] });


  return MEAS;
}

/* The six that lead each measure page, in the same treatment as the
   overview. Names here are measure names; `as` renames one for the tile. */
var SIX = {
  'mrr': [
    { m: 'MRR' },
    { m: 'Last month MRR' },
    { m: 'Client churn' },
    { m: 'New clients signed', as: 'New clients' },
    { m: 'Active clients' },
    { m: 'Average retainer', as: 'Average retainer value' }
  ],
  'profit': [
    { m: 'Operating margin' },
    { m: 'Operating profit' },
    { m: 'Revenue' },
    { m: 'Total delivery cost' },
    { m: 'Delivery margin' },
    { m: 'Total overheads' }
  ],
  'client-sat': [
    { m: 'Company score', as: 'Client satisfaction' },
    { m: 'Forms returned' },
    { m: 'Clients below target' },
    { m: 'Lowest question' },
    { m: 'Communication' },
    { m: 'Retainer value not scored', as: 'Value not scored' }
  ],
  'colleague-perf': [
    { m: 'Company average', as: 'Colleague performance' },
    { m: 'People graded' },
    { m: 'Grades below 3' },
    { m: 'At 4.5 or above' },
    { m: 'Strategist average' },
    { m: 'Editor average' }
  ],
  'colleague-sat': [
    { m: 'Company score', as: 'Colleague satisfaction' },
    { m: 'Responses returned' },
    { m: 'People below 7' },
    { m: 'Lowest scoring question' },
    { m: 'Workload' },
    { m: 'Would recommend NSY' }
  ],
  'checklist': [
    { m: 'Company completion', as: 'Checklist completion' },
    { m: 'Checklists missed' },
    { m: 'Editor completion' },
    { m: 'Strategist completion' },
    { m: 'Weakest pod' },
    { m: 'Days the full team filed' }
  ]
};

function sixFor(kpi) {
  return (SIX[kpi] || []).map(function (e) {
    var m = measureFor(e.m, kpi);
    return m ? { m: m, label: e.as || m.name } : null;
  }).filter(Boolean);
}

/* ---------- lookup ---------- */

/* Which measure page a label on a KPI page belongs to. Labels differ between
   the stat strip, the trend rows and the supporting list, so aliases carry
   the spellings back to one page. */
function measureFor(label, kpi) {
  if (!kpi) return null;
  var m = buildMeasures();
  var k = kpi + ':' + slugify(String(label || '')
    .replace(/^Less\s+/i, '').replace(/,\s*\d+\s+people$/i, '')
    .replace(/\s*\(subtotal\)$/i, '').replace(/,\s*the six lines above$/i, ''));
  if (m[k]) return m[k];
  if (ALIAS[k] && m[ALIAS[k]]) return m[ALIAS[k]];
  return null;
}

function measurePage(id) {
  var m = buildMeasures()[id];
  if (!m) return null;
  var i, s = m.series, now = s[11], prev = s[10];
  var real = s.filter(function (v) { return v !== null; });
  var hi = Math.max.apply(null, real), lo = Math.min.apply(null, real);
  var hiM = DEEP.months[s.indexOf(hi)], loM = DEEP.months[s.indexOf(lo)];
  var secs = [];

  var stats = [
    { label: 'September', value: m.fmt(now),
      sub: m.target === null ? 'No target set' : (m.targetLabel || 'Target ' + m.fmt(m.target)),
      tone: m.target === null ? 'flat' : ((m.goodUp ? now >= m.target : now <= m.target) ? 'pos' : 'neg') },
    { label: 'Change on August',
      value: (prev === null || now === null) ? 'None' : ((now >= prev ? 'Up ' : 'Down ') + m.fmt(Math.abs(now - prev))),
      sub: 'August was ' + m.fmt(prev),
      tone: (prev === null || now === null || now === prev) ? 'flat' : (((now > prev) === m.goodUp) ? 'pos' : 'neg') },
    { label: 'Best month', value: m.fmt(m.goodUp ? hi : lo), sub: m.goodUp ? hiM : loM, tone: 'pos' },
    { label: 'Worst month', value: m.fmt(m.goodUp ? lo : hi), sub: m.goodUp ? loM : hiM, tone: 'neg' }
  ];

  if (m.parts && m.parts.length) {
    var prows = m.parts.map(function (pn) {
      var pm = measureFor(pn, m.kpi);
      return { cells: [pn, pm ? pm.fmt(pm.series[11]) : '', pm && pm.target !== null
        ? ((pm.goodUp ? pm.series[11] >= pm.target : pm.series[11] <= pm.target) ? 'On target' : 'Under target') : ''],
        tone: pm && pm.target !== null ? ((pm.goodUp ? pm.series[11] >= pm.target : pm.series[11] <= pm.target) ? 'pos' : 'neg') : 'none' };
    });
    secs.push({ title: 'What makes it', note: 'Each of these has a page of its own.', kind: 'table',
      columns: ['Measure', 'September', 'Against target'], rows: prows });
  }

  var rows = [];
  for (i = 0; i < 12; i++) {
    var ch = (i && s[i] !== null && s[i - 1] !== null) ? s[i] - s[i - 1] : null;
    rows.push({ cells: [DEEP.months[i], m.fmt(s[i]),
      ch === null ? '' : ((ch >= 0 ? 'Up ' : 'Down ') + m.fmt(Math.abs(ch))),
      m.target === null || s[i] === null ? '' : ((m.goodUp ? s[i] >= m.target : s[i] <= m.target) ? 'On target' : 'Under')],
      tone: m.target === null || s[i] === null ? 'none' : ((m.goodUp ? s[i] >= m.target : s[i] <= m.target) ? 'pos' : 'neg') });
  }
  secs.push({ title: 'Month by month', note: '', kind: 'table',
    columns: ['Month', m.name, 'Change', m.target === null ? '' : 'Against target'], rows: rows });

  if (m.who) { var w = m.who(11); if (w) secs.push(w); }

  var t = trendRow(m.name, s, m.fmt, m.goodUp);
  if (t) secs.push({ title: 'Twelve months', note: '', kind: 'trends', trends: [t] });

  var meta = '<span class="e-meta">'
    + (m.owner ? '<span>Owned by <b>' + esc(m.owner) + '</b></span>' : '')
    + '<span>' + esc(kpiById(m.kpi) ? kpiById(m.kpi).label : m.kpi) + '</span>'
    + '<span class="state ' + m.def + '">' + esc(STATE[m.def]) + '</span></span>';
  var right = '<span class="e-right"><span class="e-big num">' + esc(m.fmt(now))
    + '</span><span class="e-cap">' + esc(m.targetLabel || 'September') + '</span></span>';

  return {
    title: m.name, kpi: m.kpi,
    head: '<section class="card ehead"><div><h2>' + esc(m.name) + '</h2>' + meta + '</div>' + right + '</section>',
    note: '', stats: stats, sections: secs,
    method: '<div class="card behind"><div class="method">'
      + '<p><b>How this is counted.</b> ' + esc(m.definition) + '</p>'
      + '<p>' + esc(m.capture) + '</p>'
      + '<p><span class="state ' + m.def + '">' + esc(STATE[m.def]) + '</span></p></div></div>'
  };
}

PAGEFN.measure = measurePage;
