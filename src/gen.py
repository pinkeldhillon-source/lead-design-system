import json, io, random, re, unicodedata

M = ['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep']
MRR = [int(round(v*1000)) for v in [92,96,94,103,110,118,121,119,128,141,152,170.4]]
D = json.load(io.StringIO(open('detail.js').read().split('var DETAIL = ',1)[1].rstrip().rstrip(';')))
ROS = open('roster.js').read()

def sec(k, t):
    return [s for s in D[k]['sections'] if t in s['title']][0]

def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode()
    return re.sub(r'[^a-z0-9]+','-', s.lower()).strip('-')

def money(s):
    return int(str(s).replace('£','').replace(',',''))

# ---------- roster ----------
PODS = [dict(id=m[0], name=m[1], lead=m[2]) for m in
        re.findall(r"\{ id: '(\w+)', name: '([^']+)', lead: '([^']+)' \}", ROS)]
PEOPLE = []
for m in re.finditer(r"\{\s*name:\s*'([^']+)',\s*role:\s*'(\w+)',\s*pod:\s*(?:'(\w+)'|null)(?:,\s*podLead:\s*true)?(?:,\s*title:\s*'([^']+)')?\s*\}", ROS):
    PEOPLE.append(dict(name=m.group(1), role=m.group(2), pod=m.group(3), title=m.group(4),
                       podLead=", podLead: true" in m.group(0)))
CLIENT_Q = re.search(r"var CLIENT_Q = \[(.*?)\]", ROS, re.S).group(1)
CLIENT_Q = re.findall(r"'([^']+)'", CLIENT_Q)
COLLEAGUE_Q = re.findall(r"'([^']+)'", re.search(r"var COLLEAGUE_Q = \[(.*?)\]", ROS, re.S).group(1))
BEH = re.findall(r"'([^']+)'", re.search(r"var BEHAVIOURS = \[(.*?)\]", ROS, re.S).group(1))
PODNAME = {p['id']: p['name'] for p in PODS}
PODLEAD = {p['name']: p['lead'] for p in PODS}
assert len(PEOPLE) == 30, len(PEOPLE)

# ---------- helpers ----------
def fit(vals, target, lo, hi, dp=1):
    """Shift a list so its mean is exactly `target` at `dp` decimals, staying in range."""
    if not vals: return []
    q = 10 ** dp
    cur = sum(vals) / len(vals)
    v = [x + (target - cur) for x in vals]
    v = [min(hi, max(lo, round(x, dp))) for x in v]
    need = int(round(target * q * len(v)))
    have = int(round(sum(x * q for x in v)))
    step = 1.0 / q
    guard = 0
    while have != need and guard < 20000:
        guard += 1
        d = 1 if have < need else -1
        idx = sorted(range(len(v)), key=lambda i: (v[i] * -d))
        moved = False
        for i in idx:
            nv = round(v[i] + d * step, dp)
            if lo <= nv <= hi:
                v[i] = nv; have += d; moved = True; break
        if not moved: break
    return [round(x, dp) for x in v]

def split(total, n, rng, spread, lo, hi, dp=1):
    """n values at `dp` decimals whose mean is exactly `total`."""
    v = [total + rng.uniform(-spread, spread) for _ in range(n)]
    return fit(v, total, lo, hi, dp)

# ---------- clients ----------
rows = [r for r in sec('mrr','Every client')['rows'] if r['cells'][0] != 'Total']
CUR = [dict(name=r['cells'][0], pod=r['cells'][1], fee=money(r['cells'][2]),
            tenure=int(r['cells'][3]), status=r['cells'][4]) for r in rows]
FORMER = [
  dict(name='Verdant Labs',         pod='Pod 1', fee=9800, first=0, last=4,  reason='Moved creative in house'),
  dict(name='Peak Provisions',      pod='Pod 2', fee=8400, first=0, last=2,  reason='Cut all paid social'),
  dict(name='Aurelia Skin',         pod='Pod 3', fee=7200, first=0, last=1,  reason='Acquired, budget frozen'),
  dict(name='Bright Hollow',        pod='Pod 4', fee=6600, first=0, last=5,  reason='Went to a cheaper studio'),
  dict(name='Cedarcroft Health',    pod='Pod 1', fee=5900, first=0, last=6,  reason='Founder left, account paused'),
  dict(name='Selwyn Botanicals',    pod='Pod 2', fee=6800, first=8, last=8,  reason='Never got past the first month'),
  dict(name='Harrowgate Wellness',  pod='Pod 3', fee=6200, first=0, last=10, reason='Results plateaued, not renewed'),
  dict(name='Oakfield Supplements', pod='Pod 4', fee=4300, first=0, last=0,  reason='Ended a long relationship'),
]

def ramp(t, tenure):
    if tenure <= 1: return 1.0
    x = min(1.0, t / max(1.0, tenure - 1))
    start = 0.62 if tenure >= 18 else (0.70 if tenure >= 8 else 0.82)
    return start + (1 - start) * (x ** 0.55)

F = [sum(f['fee'] for f in FORMER if f['first'] <= i <= f['last']) for i in range(12)]
for c in CUR: c['retainer'] = [0]*12
for f in FORMER: f['retainer'] = [f['fee'] if f['first'] <= i <= f['last'] else 0 for i in range(12)]

for i in range(12):
    act = [c for c in CUR if c['tenure'] >= 12 - i]
    need = MRR[i] - F[i]
    w = [c['fee'] * ramp(c['tenure'] - (11 - i) - 1, c['tenure']) for c in act]
    k = need / sum(w)
    vals = [int(round(x * k / 50.0)) * 50 for x in w]
    vals[0] += need - sum(vals)                      # put the rounding residue on the biggest account
    for c, v in zip(act, vals): c['retainer'][i] = v
for c in CUR:
    c['retainer'][11] = c['fee']                     # September is pinned by the board

for i in range(12):
    tot = sum(c['retainer'][i] for c in CUR) + F[i]
    assert tot == MRR[i], (M[i], tot, MRR[i])
print('client retainers reconcile to company MRR in all 12 months')
json.dump(dict(CUR=CUR, FORMER=FORMER, PEOPLE=PEOPLE, PODS=PODS,
               CLIENT_Q=CLIENT_Q, COLLEAGUE_Q=COLLEAGUE_Q, BEH=BEH),
          open('stage1.json','w'), indent=1)

# ---------- headcount ----------
# Revenue per head on the profit page implies the team grew from about
# nineteen to thirty across the year. The eleven most recent joiners are the
# people still ramping, which is why they sit lowest on the September grades.
rng = random.Random(20260906)
_g = sec('colleague-perf','Video editors'), sec('colleague-perf','Creative strategists')
_sept = {}
for g in _g:
    for n, v in zip(g['rowLabels'], g['values']):
        if v[0] is not None: _sept[n] = v[5]
_pod = [p for p in PEOPLE if p['pod']]
_rank = sorted(_pod, key=lambda p: (_sept.get(p['name'], 9), p['name']))[:11]
_when = [1,2,3,4,5,6,7,8,9,10,10]
for p in PEOPLE: p['joined'] = 0
for p, w in zip(_rank, _when): p['joined'] = w
HEAD = [sum(1 for p in PEOPLE if p['joined'] <= i) for i in range(12)]
assert HEAD == [19,20,21,22,23,24,25,26,27,28,30,30], HEAD
print('headcount by month:', HEAD)
print('revenue per head:', [int(round(MRR[i]/HEAD[i])) for i in range(12)])

# ---------- client satisfaction ----------
grid = sec('client-sat','Question scores by client')
SEPT_Q = {n: v[:6] for n, v in zip(grid['rowLabels'], grid['values'])}
CO   = [8.2,8.3,8.1,8.4,8.5,8.4,8.6,8.5,8.7,8.6,8.5,8.8]
PIN  = {0:[9,9.1,8.9,9.1,9.2,9.2,9.3,9.2,9.4,9.3,9.3,9.4],       # Creative quality
        1:[8.4,8.3,8.2,8.4,8.5,8.3,8.2,8.1,8,7.9,7.8,7.6],       # Communication
        2:[8.1,8.2,7.9,8.3,8.5,8.4,8.6,8.5,8.7,8.6,8.4,8.6]}     # Speed of delivery

ALLC = CUR + FORMER
for c in ALLC:
    c['q'] = [None]*12
    c['sat'] = [None]*12
    c['mood'] = rng.uniform(-0.55, 0.55)
    c['reply'] = rng.uniform(0.62, 0.97)

for i in range(12):
    act = [c for c in ALLC if c['retainer'][i] > 0]
    if i == 11:
        resp = [c for c in act if c['name'] in SEPT_Q]
    else:
        # A client in its first month has not been sent a form yet.
        cand = [c for c in act if c['retainer'][max(0, i-1)] > 0 or i == 0]
        resp = [c for c in cand if rng.random() < c['reply']]
        resp = resp or cand[:max(1, len(cand)//2)]
    cols = {}
    free = [3,4,5]
    rest = (6*CO[i] - sum(PIN[j][i] for j in (0,1,2))) / 3.0
    CQ_OFF = {3: 0.31, 4: 0.12, 5: -0.43}              # sums to zero
    for j in range(6):
        tgt = PIN[j][i] if j in PIN else round(rest + CQ_OFF[j], 2)
        raw = [tgt + c['mood'] + rng.uniform(-0.35,0.35) for c in resp]
        cols[j] = fit(raw, tgt, 4.5, 10.0)
    for n, c in enumerate(resp):
        if i == 11:
            c['q'][i] = [round(x,1) for x in SEPT_Q[c['name']]]
        else:
            c['q'][i] = [cols[j][n] for j in range(6)]
        c['sat'][i] = round(sum(c['q'][i])/6, 1)

for i in range(12):
    got = [c['sat'][i] for c in ALLC if c['sat'][i] is not None]
    assert abs(sum(got)/len(got) - CO[i]) < 0.051, (M[i], round(sum(got)/len(got),3), CO[i])
print('client satisfaction: company score reconciles in all 12 months')
print('forms returned by month:', [sum(1 for c in ALLC if c['sat'][i] is not None) for i in range(12)],
      'of', [sum(1 for c in ALLC if c['retainer'][i] > 0) for i in range(12)])
json.dump(dict(ALLC=[{k:v for k,v in c.items() if k not in ('mood','reply')} for c in ALLC],
               PEOPLE=PEOPLE, HEAD=HEAD), open('stage2.json','w'), indent=1)

# ---------- colleague performance ----------
PERF_CO  = [3.8,3.9,3.9,4.0,4.1,4.0,4.2,4.1,4.2,4.3,4.2,4.3]
PERF_STR = [3.9,4.0,4.0,4.1,4.2,4.1,4.3,4.2,4.3,4.4,4.3,4.4]
PERF_EDI = [3.7,3.8,3.8,3.9,4.0,3.9,4.1,4.0,4.1,4.2,4.1,4.2]
BELOW3   = [5,4,3,4,3,3,2,3,2,1,3,2]
SEPT_BEH = {}
SEPT_OVERALL = {}
for t in ('Creative strategists','Video editors','Outside the pods'):
    g = sec('colleague-perf', t)
    for n, v in zip(g['rowLabels'], g['values']):
        if v[0] is not None:
            SEPT_BEH[n] = [round(x,1) for x in v[:5]]
            SEPT_OVERALL[n] = v[5]

for p in PEOPLE:
    p['beh'] = [None]*12
    p['perf'] = [None]*12
    p['grit'] = rng.uniform(-0.28, 0.28)

for i in range(12):
    here = [p for p in PEOPLE if p['joined'] <= i]
    if i == 11:
        graded = [p for p in here if p['name'] in SEPT_BEH]
    else:
        # A lead grades their pod. People outside a pod are rarely graded,
        # which is exactly the gap the board already reports.
        graded = [p for p in here if p['pod'] and (p['joined'] == 0 or p['joined'] < i)]
        drop = rng.sample(graded, k=min(len(graded), rng.choice([0,1,1,2,2,3])))
        graded = [p for p in graded if p not in drop]
        extra = [p for p in here if not p['pod'] and rng.random() < 0.35]
        graded += extra
    strat = [p for p in graded if p['role'] == 'strategist']
    edit  = [p for p in graded if p['role'] == 'editor']
    other = [p for p in graded if p['role'] not in ('strategist','editor')]
    sv = fit([PERF_STR[i] + p['grit'] + rng.uniform(-.25,.25) for p in strat], PERF_STR[i], 1.0, 5.0)
    ev = fit([PERF_EDI[i] + p['grit'] + rng.uniform(-.30,.30) for p in edit],  PERF_EDI[i], 1.0, 5.0)
    # The board reports people graded under 3, falling across the year. Hold
    # that many genuinely below 3 and re-centre the rest so the mean still lands.
    want_low = BELOW3[i] if i < 11 else 0
    # Sort by the person, not by this month's draw. Someone who is struggling
    # in September was struggling in June, so the same names come up and a
    # trajectory reads as a trajectory rather than noise.
    order = sorted(range(len(ev)), key=lambda k: (SEPT_OVERALL.get(edit[k]['name'], 4.2), edit[k]['name']))
    while want_low > 0:
        forced = {k: round(rng.uniform(2.2, 2.9), 1) for k in order[:want_low]}
        free = [k for k in range(len(ev)) if k not in forced]
        if not free: want_low -= 1; continue
        need = (PERF_EDI[i]*len(ev) - sum(forced.values())) / len(free)
        if need > 4.75:            # the rest would have to be implausibly high
            want_low -= 1; continue
        fv = fit([ev[k] for k in free], need, 1.0, 5.0)
        for k, v in zip(free, fv): ev[k] = v
        for k, v in forced.items(): ev[k] = v
        break
    if other:
        need = (PERF_CO[i]*len(graded) - PERF_STR[i]*len(strat) - PERF_EDI[i]*len(edit)) / len(other)
        need = min(5.0, max(1.0, need))
        ov = fit([need + rng.uniform(-.2,.2) for p in other], need, 1.0, 5.0)
    else:
        ov = []
    for grp, vals in ((strat,sv),(edit,ev),(other,ov)):
        for p, v in zip(grp, vals):
            p['perf'][i] = v
            p['beh'][i] = [round(x,1) for x in SEPT_BEH[p['name']]] if i == 11 else split(v, 5, rng, 0.45, 1.0, 5.0)
            if i == 11: p['perf'][i] = round(sum(p['beh'][i])/5, 1)

for i in range(12):
    g = [p['perf'][i] for p in PEOPLE if p['perf'][i] is not None]
    d = abs(sum(g)/len(g) - PERF_CO[i])
    assert d < 0.06, (M[i], round(sum(g)/len(g),3), PERF_CO[i])
print('colleague performance: company average reconciles in all 12 months')
print('people graded:', [sum(1 for p in PEOPLE if p['perf'][i] is not None) for i in range(12)], 'of', HEAD)

# ---------- colleague satisfaction ----------
SAT_CO   = [7.6,7.8,7.9,8.0,8.2,8.3,8.4,8.5,8.4,8.3,8.3,8.1]
SAT_PIN  = {0:[7.9,8,7.8,7.9,8,7.9,7.8,7.6,7.4,7.2,7.1,6.9],      # Workload
            5:[8.2,8.3,8.4,8.5,8.7,8.8,8.9,9,8.9,8.8,8.8,8.6]}    # Would recommend NSY
srows = sec('colleague-sat','Every person')['rows']
SEPT_SAT = {r['cells'][0]: (None if r['cells'][3] == 'Not returned' else float(r['cells'][3])) for r in srows}

for p in PEOPLE:
    p['sat'] = [None]*12
    p['satq'] = [None]*12
    p['morale'] = rng.uniform(-0.6, 0.6)

for i in range(12):
    here = [p for p in PEOPLE if p['joined'] <= i]
    if i == 11:
        resp = [p for p in here if SEPT_SAT.get(p['name']) is not None]
    else:
        resp = [p for p in here if rng.random() < 0.86]
    rest = (6*SAT_CO[i] - sum(SAT_PIN[j][i] for j in SAT_PIN)) / 4.0
    SAT_OFF = {1: 0.42, 2: 0.18, 3: -0.51, 4: -0.09}   # sums to zero
    cols = {}
    for j in range(6):
        tgt = SAT_PIN[j][i] if j in SAT_PIN else round(rest + SAT_OFF[j], 2)
        cols[j] = fit([tgt + p['morale'] + rng.uniform(-0.4,0.4) for p in resp], tgt, 3.0, 10.0)
    for n, p in enumerate(resp):
        p['satq'][i] = [cols[j][n] for j in range(6)]
        p['sat'][i] = round(sum(p['satq'][i])/6, 1)
    if i == 11:
        # September has to satisfy two pinned things at once: each person's own
        # score, which is on the board, and each question's company average,
        # which is also on the board. Fit the rows and columns together rather
        # than splitting each person's score on its own.
        rows = [SEPT_SAT[p['name']] for p in resp]
        cols = [SAT_PIN[j][11] if j in SAT_PIN else round(rest + SAT_OFF[j], 2) for j in range(6)]
        gm = sum(cols)/6.0
        m = [[r + c - gm for c in cols] for r in rows]
        for _ in range(80):
            for a in range(len(m)):
                d = rows[a] - sum(m[a])/6.0
                for j in range(6): m[a][j] += d
            for j in range(6):
                d = cols[j] - sum(m[a][j] for a in range(len(m)))/float(len(m))
                for a in range(len(m)): m[a][j] += d
        m = [[min(10.0, max(3.0, round(x,1))) for x in r] for r in m]
        # Rounding drags the columns off. Move a tenth from one question to
        # another inside the same row, which leaves that person's score alone.
        for _ in range(4000):
            off = [(j, cols[j] - sum(m[a][j] for a in range(len(m)))/float(len(m))) for j in range(6)]
            j_lo = max(off, key=lambda t: t[1]); j_hi = min(off, key=lambda t: t[1])
            if abs(j_lo[1]) < 0.008 and abs(j_hi[1]) < 0.008: break
            moved = False
            for a in range(len(m)):
                if m[a][j_lo[0]] + 0.1 <= 10.0 and m[a][j_hi[0]] - 0.1 >= 3.0:
                    m[a][j_lo[0]] = round(m[a][j_lo[0]] + 0.1, 1)
                    m[a][j_hi[0]] = round(m[a][j_hi[0]] - 0.1, 1)
                    moved = True; break
            if not moved: break
        for a, p in enumerate(resp):
            p['satq'][i] = [round(x,1) for x in m[a]]
            p['sat'][i] = round(sum(m[a])/6.0, 1)

for i in range(12):
    g = [p['sat'][i] for p in PEOPLE if p['sat'][i] is not None]
    assert abs(sum(g)/len(g) - SAT_CO[i]) < 0.06, (M[i], round(sum(g)/len(g),3), SAT_CO[i])
print('colleague satisfaction: company score reconciles in all 12 months')
print('responses:', [sum(1 for p in PEOPLE if p['sat'][i] is not None) for i in range(12)], 'of', HEAD)

# ---------- end of day checklist ----------
DAYS   = [22,21,19,22,20,21,21,21,21,23,21,22]
CH_CO  = [62,65,68,71,69,74,76,73,78,80,76,78]
CH_ED  = [54,57,60,64,62,67,69,66,71,74,69,71]
CH_ST  = [72,76,79,81,79,84,85,83,88,90,85,86]
crows = sec('checklist','By person, all 30')['rows']
SEPT_CH = {r['cells'][0]: tuple(int(x) for x in r['cells'][3].split(' of ')) for r in crows if ' of ' in r['cells'][3]}

for p in PEOPLE:
    p['filed'] = [None]*12
    p['habit'] = rng.uniform(-11, 11)

def ints(pcts, due, want_filed):
    v = [int(round(x/100*due)) for x in pcts]
    v = [min(due, max(0, x)) for x in v]
    guard = 0
    while sum(v) != want_filed and guard < 100000:
        guard += 1
        d = 1 if sum(v) < want_filed else -1
        order = sorted(range(len(v)), key=lambda i: v[i]*-d)
        for i in order:
            if 0 <= v[i]+d <= due: v[i] += d; break
        else: break
    return v

for i in range(12):
    here = [p for p in PEOPLE if p['joined'] <= i]
    due = DAYS[i]
    ed = [p for p in here if p['role']=='editor']
    st = [p for p in here if p['role']=='strategist']
    ot = [p for p in here if p['role'] not in ('editor','strategist')]
    tot_due = len(here)*due
    want_co = int(round(CH_CO[i]/100*tot_due))
    fe = ints([CH_ED[i]+p['habit']+rng.uniform(-6,6) for p in ed], due, int(round(CH_ED[i]/100*len(ed)*due)))
    fs = ints([CH_ST[i]+p['habit']+rng.uniform(-5,5) for p in st], due, int(round(CH_ST[i]/100*len(st)*due)))
    rem = want_co - sum(fe) - sum(fs)
    fo = ints([rem/(len(ot)*due)*100 + rng.uniform(-6,6) for p in ot], due, rem)
    for grp, vals in ((ed,fe),(st,fs),(ot,fo)):
        for p, v in zip(grp, vals): p['filed'][i] = [v, due]
    if i == 11:
        for p in here:
            if p['name'] in SEPT_CH: p['filed'][i] = list(SEPT_CH[p['name']])

for i in range(12):
    f = sum(p['filed'][i][0] for p in PEOPLE if p['filed'][i])
    d = sum(p['filed'][i][1] for p in PEOPLE if p['filed'][i])
    assert abs(round(f/d*100) - CH_CO[i]) <= 1, (M[i], round(f/d*100,2), CH_CO[i])
print('checklist: company completion reconciles in all 12 months')
print('September completion:', round(sum(p['filed'][11][0] for p in PEOPLE)/sum(p['filed'][11][1] for p in PEOPLE)*100), '%')

json.dump(dict(clients=ALLC, people=[{k:v for k,v in p.items() if k not in ('grit','morale','habit')} for p in PEOPLE],
               head=HEAD, days=DAYS, pods=PODS, months=M,
               clientQ=CLIENT_Q, colleagueQ=COLLEAGUE_Q, beh=BEH),
          open('deep.json','w'))
print('deep.json written')

# ---------- the cost lines behind operating profit ----------
DM   = [56.4,56.9,55.8,57.2,58.1,58.6,59,58.2,59.7,60.4,61.1,61.8]
OP   = [int(round(v*1000)) for v in [18.2,19.4,18.8,21.6,23.1,25.4,26.2,24.8,28.6,31.2,35.1,38.2]]
REV  = MRR[:]
DCOST = [int(round(REV[i]*(100-DM[i])/100)) for i in range(12)]
DMARG = [REV[i]-DCOST[i] for i in range(12)]
OHTOT = [DMARG[i]-OP[i] for i in range(12)]
nED  = [sum(1 for p in PEOPLE if p['role']=='editor' and p['joined']<=i) for i in range(12)]
nST  = [sum(1 for p in PEOPLE if p['role']=='strategist' and p['joined']<=i) for i in range(12)]

def line(sept, driver, i):
    return sept * driver[i] / float(driver[11])

DELIV = [
  dict(name='Editor payroll',                     sept=33180, drv=nED,  owner='Editing Lead'),
  dict(name='Strategist payroll',                 sept=20620, drv=nST,  owner='Creative Lead'),
  dict(name='Software and licences used in delivery', sept=1893, drv=HEAD, owner='Ops Manager'),
  dict(name='Contractor spend',                   sept=9400,  drv=None, owner='Fractional CFO'),
]
# Overheads grew faster than the team did, so these lines track the overhead
# total rather than headcount. Marketing is the balancing line.
OHEAD = [
  dict(name='Leadership and ops payroll', sept=34300, drv=OHTOT, owner='Nativ'),
  dict(name='Software and tooling',       sept=6240,  drv=OHTOT, owner='Ops Manager'),
  dict(name='Office and equipment',       sept=11400, drv=OHTOT, owner='Ops Manager'),
  dict(name='Marketing and new business', sept=8600,  drv=None,  owner='Nativ'),
  dict(name='Professional fees',          sept=4250,  drv=OHTOT, owner='Fractional CFO'),
  dict(name='Other',                      sept=2317,  drv=OHTOT, owner='Fractional CFO'),
]

def build(group, totals):
    for L in group: L['series'] = [0]*12
    bal = [L for L in group if L['drv'] is None][0]
    for i in range(12):
        used = 0
        for L in group:
            if L is bal: continue
            v = int(round(line(L['sept'], L['drv'], i) * rng.uniform(0.96, 1.04) / 10.0)) * 10
            L['series'][i] = v; used += v
        bal['series'][i] = totals[i] - used
    for L in group: L['series'][11] = L['sept']
    # September is pinned, so make the pinned month add up exactly
    fixed = sum(L['sept'] for L in group)
    assert fixed == totals[11], (fixed, totals[11])
    for i in range(12):
        assert sum(L['series'][i] for L in group) == totals[i], (i, sum(L['series'][i] for L in group), totals[i])
        assert all(L['series'][i] > 0 for L in group), (i, [L['series'][i] for L in group])

build(DELIV, DCOST)
build(OHEAD, OHTOT)
for i in range(12):
    assert REV[i] - sum(L['series'][i] for L in DELIV) - sum(L['series'][i] for L in OHEAD) == OP[i]
print('cost lines: the bridge reconciles to operating profit in all 12 months')

json.dump(dict(clients=ALLC,
               people=[{k:v for k,v in p.items() if k not in ('grit','morale','habit')} for p in PEOPLE],
               head=HEAD, days=DAYS, pods=PODS, months=M, mrr=MRR,
               rev=REV, dcost=DCOST, dmarg=DMARG, ohtot=OHTOT, op=OP, dm=DM,
               deliv=DELIV, ohead=OHEAD,
               clientQ=CLIENT_Q, colleagueQ=COLLEAGUE_Q, beh=BEH),
          open('deep.json','w'))
print('deep.json written')

# ---------- measures with nothing underneath them yet ----------
# These seven are counted by hand today, so there is no entity level data to
# roll up. Each gets a history that runs from a plausible start to the figure
# already on the board, with noise on top rather than a one way drift.
def track(start, end, lo, hi, noise, seed, whole=True):
    r = random.Random(seed)
    out = []
    for i in range(12):
        base = start + (end - start) * (i / 11.0)
        v = base + r.uniform(-noise, noise)
        out.append(min(hi, max(lo, round(v) if whole else round(v, 1))))
    out[11] = end
    return out

EXTRA = {
 'mrr:upsell-conversations-had':            dict(series=track(2, 3, 0, 7, 1.4, 11), unit='n'),
 'mrr:mrr-at-risk':                         dict(series=[int(x) for x in track(9200, 17700, 0, 30000, 3600, 12)], unit='money'),
 'client-sat:negative-comments-raised-on-a-call-first': dict(series=track(2, 2, 0, 5, 1.0, 13), unit='n'),
 'colleague-perf:one-to-ones-held':         dict(series=track(14, 17, 4, 26, 3.0, 14), unit='n'),
 'colleague-perf:ramping-strategists-at-4-or-above': dict(series=track(2, 3, 0, 6, 1.1, 15), unit='n'),
 'colleague-sat:editors-working-past-19-00': dict(series=track(3, 5, 0, 14, 1.8, 16), unit='n'),
 'colleague-sat:voluntary-leavers-this-quarter': dict(series=track(1, 1, 0, 3, 0.8, 17), unit='n'),
 # Neither of these can be worked out from monthly totals. They need a day
 # level view in Notion that does not exist yet.
 'checklist:checklists-naming-a-blocker':   dict(series=track(41, 96, 0, 200, 8, 18), unit='n'),
 'checklist:days-the-full-team-filed':      dict(series=track(0, 2, 0, 8, 1.1, 19), unit='n'),
}
for k, v in EXTRA.items():
    assert len(v['series']) == 12, k
d = json.load(open('deep.json'))
d['extra'] = EXTRA
json.dump(d, open('deep.json','w'))
print('extra series for', len(EXTRA), 'hand counted measures')
for k, v in EXTRA.items(): print('  ', k.split(':')[1].ljust(42), v['series'])
