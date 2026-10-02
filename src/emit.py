import json, re, unicodedata, io
d = json.load(open('deep.json'))
def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode()
    return re.sub(r'[^a-z0-9]+','-', s.lower()).strip('-')
podname = {p['id']: p['name'] for p in d['pods']}
lead = {p['name']: p['lead'] for p in d['pods']}
clients = {slug(c['name']): dict(name=c['name'], pod=c['pod'], lead=lead[c['pod']],
    active='tenure' in c, tenure=c.get('tenure'), status=c.get('status'), fee=c.get('fee'),
    reason=c.get('reason'), last=c.get('last'), first=c.get('first'),
    retainer=c['retainer'], sat=c['sat'], q=c['q']) for c in d['clients']}
people = {slug(p['name']): dict(name=p['name'], role=p['role'], title=p.get('title'),
    pod=podname[p['pod']] if p['pod'] else None,
    lead=lead[podname[p['pod']]] if p['pod'] else None,
    podLead=p.get('podLead', False), joined=p['joined'],
    perf=p['perf'], beh=p['beh'], sat=p['sat'], satq=p['satq'], filed=p['filed']) for p in d['people']}
cost = {}
for grp, lines in (('Delivery cost', d['deliv']), ('Overheads', d['ohead'])):
    for L in lines: cost[slug(L['name'])] = dict(name=L['name'], group=grp, owner=L['owner'], series=L['series'])
out = dict(months=d['months'], head=d['head'], days=d['days'], mrr=d['mrr'], rev=d['rev'],
           dcost=d['dcost'], dmarg=d['dmarg'], ohtot=d['ohtot'], op=d['op'], pods=d['pods'],
           clientQ=d['clientQ'], colleagueQ=d['colleagueQ'], beh=d['beh'],
           clients=clients, people=people, cost=cost, extra=d.get('extra', {}))
open('deep.js','w').write('/* Twelve months behind every client, person, pod and cost line.\n'
  '   Generated so each entity rolls up to the figures on the pages above it. */\nvar DEEP = '
  + json.dumps(out, ensure_ascii=False, separators=(',',':')) + ';\n')

D = json.load(io.StringIO(open('detail.js').read().split('var DETAIL = ',1)[1].rstrip().rstrip(';')))
P, C, R = d['people'], d['clients'], range(12)
derived = {
 ('client-sat','Forms returned'):              [sum(1 for c in C if c['sat'][i] is not None) for i in R],
 ('colleague-perf','People graded each week'): [sum(1 for p in P if p['perf'][i] is not None) for i in R],
 ('colleague-perf','Grades below 3'):          [sum(1 for p in P if p['perf'][i] is not None and p['perf'][i] < 3) for i in R],
 ('colleague-sat','Responses returned'):       [sum(1 for p in P if p['sat'][i] is not None) for i in R],
}
for (k, name), series in derived.items():
    for s in D[k]['sections']:
        if s['kind'] != 'trends': continue
        for t in s['trends']:
            if t['name'] != name: continue
            t['series'] = series; t['value'] = str(series[-1])
            dl = series[-1] - series[-2]
            t['deltaDir'] = 'up' if dl > 0 else 'down' if dl < 0 else 'flat'
            t['deltaText'] = 'level' if dl == 0 else str(abs(dl))
            t['lo'] = min(series) - 2; t['hi'] = max(series) + 2
open('detail.js','w').write('/* Detail page data. Placeholder throughout, but it reconciles. */\nvar DETAIL = '
    + json.dumps(D, ensure_ascii=False, indent=1) + ';\n')
print('deep.js and detail.js re-emitted')

# ---------- level 2 trends that a measure page now derives ----------
D2 = json.load(io.StringIO(open('detail.js').read().split('var DETAIL = ',1)[1].rstrip().rstrip(';')))
CLI, PPL, R = d['clients'], d['people'], range(12)
def act(i):  return [c for c in CLI if c['retainer'][i] > 0]
def first(c):
    for i in R:
        if c['retainer'][i] > 0: return i
    return -1
def last(c):
    for i in reversed(R):
        if c['retainer'][i] > 0: return i
    return -1
signed = lambda i: [c for c in CLI if first(c) == i and not (i == 0 and c['retainer'][0] > 0 and c.get('tenure', 0) > 1)]
lost   = lambda i: [c for c in CLI if last(c) >= 0 and last(c) == i - 1]
def expansion(i):
    if not i: return 0
    return sum(max(0, c['retainer'][i] - c['retainer'][i-1]) for c in CLI if c['retainer'][i] and c['retainer'][i-1])
gbp = lambda v: '£{:,}'.format(int(round(v)))

DER = {
 ('mrr','MRR'):                              (d['mrr'], gbp),
 ('mrr','New clients signed'):                ([len(signed(i)) for i in R], str),
 ('mrr','Clients churned'):                   ([len(lost(i)) for i in R], str),
 ('mrr','Net new MRR'):                       ([d['mrr'][i]-d['mrr'][i-1] if i else 0 for i in R], gbp),
 ('mrr','Average retainer'):                  ([int(round(d['mrr'][i]/len(act(i)))) for i in R], gbp),
 ('mrr','New business won, monthly value'):   ([sum(c['retainer'][i] for c in signed(i)) for i in R], gbp),
 ('mrr','Expansion from existing clients'):   ([expansion(i) for i in R], gbp),
 ('mrr','MRR lost to churn'):                 ([sum(c['retainer'][i-1] for c in lost(i)) for i in R], gbp),
 ('checklist','Checklists naming a blocker'): (d['extra']['checklist:checklists-naming-a-blocker']['series'], str),
 ('checklist','Days with the full team filed'):(d['extra']['checklist:days-the-full-team-filed']['series'], str),
}
for (k, name), (series, f) in DER.items():
    for s2 in D2[k]['sections']:
        if s2['kind'] != 'trends': continue
        for t in s2['trends']:
            if t['name'] != name: continue
            t['series'] = [round(v, 1) if isinstance(v, float) else v for v in series]
            t['value'] = f(series[-1])
            dl = series[-1] - series[-2]
            t['deltaDir'] = 'up' if dl > 0 else 'down' if dl < 0 else 'flat'
            t['deltaText'] = 'level' if dl == 0 else f(abs(dl))
            lo, hi = min(series), max(series)
            pad = max((hi - lo) * 0.3, abs(hi) * 0.05, 1)
            t['lo'] = lo - pad; t['hi'] = hi + pad

# figures quoted in prose that the derivation now settles
exp, nb, ch = expansion(11), sum(c['retainer'][11] for c in signed(11)), sum(c['retainer'][10] for c in lost(11))
for s2 in D2['mrr']['sections']:
    if s2.get('note','').startswith('Money in the sparklines'):
        s2['note'] = ('Money in the sparklines is in thousands, apart from average retainer which is in pounds. '
            'September net new MRR is ' + gbp(nb) + ' of new business plus ' + gbp(exp) + ' of expansion, '
            'less ' + gbp(ch) + ' churned, which is ' + gbp(d['mrr'][11]-d['mrr'][10]) + '.')
json.dump(D2, open('_d2.json','w'))
open('detail.js','w').write('/* Detail page data. Placeholder throughout, but it reconciles. */\nvar DETAIL = '
    + json.dumps(D2, ensure_ascii=False, indent=1) + ';\n')
print('level 2 trends re-derived; Sept expansion', gbp(exp), 'new business', gbp(nb), 'churn', gbp(ch))
