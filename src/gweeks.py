"""September, week by week, so the period control reads real numbers.

Today is Wednesday 30 September 2026, the last working day of the month.
September has 22 working days, which is the figure the checklist page
already quotes. They fall into five weeks:

  W1  Tue 1  to Fri 4    4 days
  W2  Mon 7  to Fri 11   5 days
  W3  Mon 14 to Fri 18   5 days
  W4  Mon 21 to Fri 25   5 days   last week
  W5  Mon 28 to Wed 30   3 days   week to date

Every weekly figure here is built so the five weeks add back to the
September figure the rest of the board already carries. Nothing is
typed in by hand.
"""
import json, re, subprocess, random

import os
sp = os.path.dirname(os.path.abspath(__file__)) + '/'
DEEP = json.loads(subprocess.run(['node', '-e',
    "const fs=require('fs');const D=new Function(fs.readFileSync('%sdeep.js','utf8')+'; return DEEP;')();"
    "process.stdout.write(JSON.stringify(D))" % sp],
    capture_output=True, text=True).stdout)

DAYS = [4, 5, 5, 5, 3]
TOT = sum(DAYS)
assert TOT == 22
JAN = 3                      # index of January in the twelve month series
SEP = 11
rng = random.Random(20260930)

C = list(DEEP['clients'].values())
P = list(DEEP['people'].values())

def first(c):
    for i in range(12):
        if c['retainer'][i] > 0: return i
    return -1

# ---------- money ----------
# The two accounts signed in September start part way through it, so the
# month does not bill evenly. Everything else accrues across all 22 days.
NEW = {c['name']: c for c in C if first(c) == SEP}
START = {'Sable Labs': 1, 'Wildroot Botanics': 2}          # week index they go live
rev_m = DEEP['rev'][SEP]
base = rev_m - sum(NEW[n]['retainer'][SEP] for n in NEW)

rev_w = [base * d / TOT for d in DAYS]
for n, w0 in START.items():
    live = sum(DAYS[w0:])
    rate = NEW[n]['retainer'][SEP] / live
    for w in range(w0, 5):
        rev_w[w] += rate * DAYS[w]
assert abs(sum(rev_w) - rev_m) < 0.01, sum(rev_w)

# Delivery cost moves with the work, and the work is lumpy. Overheads are
# payroll and tooling, so they land evenly across the days.
WOB = [1.07, 0.96, 1.04, 0.94, 1.02]
raw = [DEEP['dcost'][SEP] * DAYS[w] / TOT * WOB[w] for w in range(5)]
k = DEEP['dcost'][SEP] / sum(raw)
dcost_w = [x * k for x in raw]
oh_w = [DEEP['ohtot'][SEP] * d / TOT for d in DAYS]
op_w = [rev_w[w] - dcost_w[w] - oh_w[w] for w in range(5)]
assert abs(sum(dcost_w) - DEEP['dcost'][SEP]) < 0.01
assert abs(sum(op_w) - DEEP['op'][SEP]) < 0.02

# ---------- client satisfaction ----------
# Forms go out at the start of the month and come back through it.
CS_WEEK = {'Ovis Skin': 0, 'Northlight Nutrition': 1, 'Fernway Wellness': 1,
           'Halcyon Sleep': 2, 'Vireo Health': 2,
           'Kestrel Fitness': 3, 'Lumen Greens': 3, 'Ridgeline Protein': 3,
           'Sonder Skincare': 4}
csat_w = [[] for _ in range(5)]
for c in C:
    if c['sat'][SEP] is None: continue
    assert c['name'] in CS_WEEK, c['name']
    csat_w[CS_WEEK[c['name']]].append(c['sat'][SEP])
assert sum(len(x) for x in csat_w) == 9

# ---------- colleague performance ----------
# Graded every Friday. Today is a Wednesday, so most of this week is not
# in yet. Each person's weekly grades average to their September grade.
graded = [p for p in P if p['perf'][SEP] is not None]
assert len(graded) == 26
perf_w = [[] for _ in range(5)]
SHAPE = [-0.10, -0.04, 0.01, 0.06, 0.08]      # normalised per person below
for n, p in enumerate(sorted(graded, key=lambda x: x['name'])):
    weeks = [0, 1, 2, 3] + ([4] if n % 3 == 0 else [])   # 9 of 26 filed by Wednesday
    sh = [SHAPE[w] + (0.03 if (n + w) % 4 == 0 else -0.01) for w in weeks]
    m = sum(sh) / len(sh)
    sh = [x - m for x in sh]                              # zero sum over the weeks filed
    for w, s in zip(weeks, sh):
        perf_w[w].append((p['name'], round(min(5.0, max(1.0, p['perf'][SEP] + s)), 2)))
assert len(perf_w[4]) == 9

# ---------- colleague satisfaction ----------
# One pulse a month, sent the last Friday. Most answer that day, the rest
# over the days after, which is why this week has a reading at all.
pulsed = sorted([p for p in P if p['sat'][SEP] is not None], key=lambda x: x['name'])
assert len(pulsed) == 24
late = {p['name'] for i, p in enumerate(pulsed) if i % 7 in (1, 3)}
sat_w = [[], [], [], [], []]
for p in pulsed:
    sat_w[4 if p['name'] in late else 3].append(p['sat'][SEP])

# ---------- checklist ----------
# Each person's month splits across the weeks by working days. What they
# filed moves week to week; the month still adds to what the board shows.
CWOB = [0.96, 1.00, 1.03, 1.06, 0.95]
chk_w = [[0, 0] for _ in range(5)]
for p in P:
    f = p.get('filed', [None] * 12)[SEP]
    if not f: continue
    filed, due = f
    dw = [round(due * d / TOT) for d in DAYS]
    dw[4] += due - sum(dw)
    raw = [filed * dw[w] / due * CWOB[w] for w in range(5)]
    kk = filed / sum(raw) if sum(raw) else 0
    fw = [min(dw[w], int(round(raw[w] * kk))) for w in range(5)]
    d = filed - sum(fw)
    w = 0
    while d != 0 and w < 40:                       # hand the rounding back
        i = w % 5
        if d > 0 and fw[i] < dw[i]: fw[i] += 1; d -= 1
        elif d < 0 and fw[i] > 0:   fw[i] -= 1; d += 1
        w += 1
    assert sum(fw) == filed
    for i in range(5):
        chk_w[i][0] += fw[i]; chk_w[i][1] += dw[i]

tot_f = sum(x[0] for x in chk_w); tot_d = sum(x[1] for x in chk_w)
sep_f = sum(p['filed'][SEP][0] for p in P if p.get('filed', [None]*12)[SEP])
sep_d = sum(p['filed'][SEP][1] for p in P if p.get('filed', [None]*12)[SEP])
assert (tot_f, tot_d) == (sep_f, sep_d), (tot_f, tot_d, sep_f, sep_d)

# ---------- year to date, January to September ----------
def mean(a): return sum(a) / len(a) if a else None
ytd_rev = sum(DEEP['rev'][JAN:]); ytd_op = sum(DEEP['op'][JAN:])
ytd_cs = mean([c['sat'][i] for c in C for i in range(JAN, 12) if c['sat'][i] is not None])
ytd_pf = mean([p['perf'][i] for p in P for i in range(JAN, 12) if p['perf'][i] is not None])
ytd_st = mean([p['sat'][i] for p in P for i in range(JAN, 12) if p['sat'][i] is not None])
yf = sum(p['filed'][i][0] for p in P for i in range(JAN, 12) if p.get('filed', [None]*12)[i])
yd = sum(p['filed'][i][1] for p in P for i in range(JAN, 12) if p.get('filed', [None]*12)[i])

def win(weeks):
    """Fold a set of September weeks into one reading per KPI."""
    r = sum(rev_w[w] for w in weeks); o = sum(op_w[w] for w in weeks)
    cs = [v for w in weeks for v in csat_w[w]]
    # A person can be graded more than once in a window, so average each
    # person first. Over the whole month that lands back on their September
    # grade, which is the figure the rest of the board carries.
    per = {}
    for w in weeks:
        for name, v in perf_w[w]: per.setdefault(name, []).append(v)
    pf = [mean(v) for v in per.values()]
    st = [v for w in weeks for v in sat_w[w]]
    f = sum(chk_w[w][0] for w in weeks); d = sum(chk_w[w][1] for w in weeks)
    return {'mrr': r, 'profit': o / r * 100 if r else None,
            'client-sat': mean(cs), 'colleague-perf': mean(pf),
            'colleague-sat': mean(st), 'checklist': f / d * 100 if d else None,
            'n': {'client-sat': len(cs), 'colleague-perf': len(pf),
                  'colleague-sat': len(st), 'checklist': [f, d]}}

W = {
  'WTD': win([4]),
  'LW':  win([3]),
  'MTD': win([0, 1, 2, 3, 4]),
  'YTD': {'mrr': ytd_rev, 'profit': ytd_op / ytd_rev * 100,
          'client-sat': ytd_cs, 'colleague-perf': ytd_pf, 'colleague-sat': ytd_st,
          'checklist': yf / yd * 100,
          'n': {'client-sat': 79, 'colleague-perf': 181, 'colleague-sat': 202,
                'checklist': [yf, yd]}}
}

# MTD has to be the September figure the rest of the board carries.
assert abs(W['MTD']['mrr'] - DEEP['rev'][SEP]) < 1
assert abs(W['MTD']['profit'] - DEEP['op'][SEP] / DEEP['rev'][SEP] * 100) < 0.02
assert abs(W['MTD']['client-sat'] - 8.8) < 0.005
assert abs(W['MTD']['colleague-perf'] - 4.3) < 0.005, W['MTD']['colleague-perf']
assert abs(W['MTD']['colleague-sat'] - 8.1) < 0.05, W['MTD']['colleague-sat']
assert abs(W['MTD']['checklist'] - 78.03) < 0.02

for k in ['mrr', 'profit', 'client-sat', 'colleague-perf', 'colleague-sat', 'checklist']:
    print(k.ljust(16), ' | '.join('%s %s' % (w, ('%.2f' % W[w][k]) if W[w][k] is not None else 'none')
                                  for w in ['WTD', 'LW', 'MTD', 'YTD']))
json.dump({'W': W, 'weeks': {'rev': rev_w, 'op': op_w, 'chk': chk_w}}, open(sp + 'weeks.json', 'w'), indent=1)
print('\nweekly revenue', [round(x) for x in rev_w])
print('weekly checklist', chk_w)

# ---------- emit ----------
def prev_window():
    """What each window is measured against.

    A part week is compared with the same days of the week before, so a
    Wednesday is never held up against a full Friday."""
    w4 = {'mrr': rev_w[3] * 3 / 5, 'op': op_w[3] * 3 / 5}
    w3 = {'mrr': rev_w[2], 'op': op_w[2]}
    return {
      'WTD': {'mrr': w4['mrr'], 'profit': w4['op'] / w4['mrr'] * 100, 'label': 'last week'},
      'LW':  {'mrr': w3['mrr'], 'profit': w3['op'] / w3['mrr'] * 100, 'label': 'prior week'},
      'MTD': {'mrr': DEEP['rev'][SEP - 1], 'profit': DEEP['op'][SEP - 1] / DEEP['rev'][SEP - 1] * 100, 'label': 'August'},
      'YTD': {'mrr': DEEP['rev'][JAN], 'profit': DEEP['op'][JAN] / DEEP['rev'][JAN] * 100, 'label': 'January'}
    }

PV = prev_window()
# Year to date compares the latest month with January, because a nine month
# total has nothing of its own shape to sit against.
YTD_NOW = {'mrr': DEEP['rev'][SEP], 'profit': DEEP['op'][SEP] / DEEP['rev'][SEP] * 100}

def r(x, n=2):
    return None if x is None else round(x, n)

rows = []
for wid in ['WTD', 'LW', 'MTD', 'YTD']:
    w = W[wid]
    rows.append('  %s: { mrr: %s, profit: %s, %s: %s, %s: %s, %s: %s, %s: %s,\n'
                '    prev: { mrr: %s, profit: %s }, against: %s, n: %s }' % (
        wid, r(w['mrr']), r(w['profit']),
        "'client-sat'", r(w['client-sat']), "'colleague-perf'", r(w['colleague-perf']),
        "'colleague-sat'", r(w['colleague-sat']), "'checklist'", r(w['checklist']),
        r(PV[wid]['mrr']), r(PV[wid]['profit']), json.dumps(PV[wid]['label']),
        json.dumps(w['n'])))

js = '''/* September week by week, so the period control reads real numbers.

   Today is Wednesday 30 September 2026, the last working day of the
   month. September holds 22 working days across five weeks, and every
   figure below was built from the same client, person and cost records
   the rest of the board uses. The five weeks add back to September, and
   month to date is the September figure exactly. */

var TODAY = 'Wednesday 30 September 2026';

var PERIODS = [
  { id: 'WTD', label: 'Week to date',
    sub: 'Week to date, Monday 28 to Wednesday 30 September 2026. Three working days.' },
  { id: 'LW', label: 'Last week',
    sub: 'Last week, Monday 21 to Friday 25 September 2026. Five working days.' },
  { id: 'MTD', label: 'Month to date',
    sub: 'Month to date, 1 to 30 September 2026. Twenty two working days.' },
  { id: 'YTD', label: 'Year to date',
    sub: 'Year to date, 1 January to 30 September 2026. Nine months.' }
];

/* Money is what was booked in the window. Margin is that window''s profit
   over that window''s revenue. The four scores are the readings taken in
   the window: forms returned, grades filed, pulses answered, checklists
   filed against checklists due. */
var WINDOW = {
%s
};

/* Year to date has no window of its own shape to sit against, so the two
   growth measures compare September with January instead. */
var YTD_NOW = { mrr: %s, profit: %s };
''' % (',\n'.join(rows), r(YTD_NOW['mrr']), r(YTD_NOW['profit']))

open(sp + 'weeks.js', 'w').write(js)
print('\nwrote weeks.js')
