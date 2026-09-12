var STATE = {
  agreed: 'Definition agreed',
  drafting: 'Being defined',
  manual: 'Entered by hand'
};

var KPIS = [
  {
    id: 'mrr',
    wfmt: function (v) { return '£' + Math.round(v).toLocaleString('en-GB'); },
    gapUnit: 'money',
    label: 'Monthly recurring revenue',
    value: '£170,400',
    unit: '',
    delta: { dir: 'up', text: '12.1%', good: true },
    context: 'vs August',
    series: [92, 96, 94, 103, 110, 118, 121, 119, 128, 141, 152, 170.4],
    domain: [85, 180],
    ticks: [90, 120, 150, 180],
    fmt: function (v) { return '£' + v + 'k'; },
    /* The target here is growth, not a level, so there is no line to draw. */
    target: null,
    growth: true,
    targetLabel: 'Target, up on last month',
    fmtPoint: function (v) { return '£' + Math.round(v * 1000).toLocaleString('en-GB'); },
    chartTitle: 'Monthly recurring revenue, last 12 months',
    owner: 'Nativ and the Creative Lead',
    def: 'agreed',
    definition: 'Contracted retainer value invoiced in the calendar month. Project fees, one off edits and paused accounts are excluded.',
    capture: 'Captured by the fractional CFO at month end close, read straight from the invoicing ledger.',
    support: [
      { name: 'New retainers signed', owner: 'Creative Lead', v: '2', t: 'Target 3', hit: false },
      { name: 'Upsell conversations had', owner: 'Creative Lead', v: '3', t: 'Target 4', hit: false },
      { name: 'Accounts churned this month', owner: 'Creative Lead', v: '1', t: 'Target 0', hit: false },
      { name: 'Average retainer value', owner: 'Nativ', v: '£12,171', t: 'Target £11,000', hit: true }
    ]
  },
  {
    id: 'profit',
    wfmt: function (v) { return v.toFixed(1); },
    gapUnit: 'pts',
    label: 'Operating margin',
    value: '22.4',
    unit: '%',
    delta: { dir: 'down', text: '0.7 pts', good: false },
    context: '£38,200 in the month',
    series: [19.8, 20.2, 20.0, 21.0, 21.0, 21.5, 21.7, 20.8, 22.3, 22.1, 23.1, 22.4],
    domain: [19, 24],
    ticks: [19, 21, 23],
    fmt: function (v) { return v + '%'; },
    /* Growth again, so no line. Margin can fall in a good month, which is
       the thing this card is here to show. */
    target: null,
    growth: true,
    targetLabel: 'Target, up on last month',
    fmtPoint: function (v) { return v.toFixed(1) + '%'; },
    chartTitle: 'Operating margin, last 12 months',
    owner: 'Nativ and the fractional CFO',
    def: 'agreed',
    definition: 'Operating profit as a share of revenue in the calendar month. Profit is revenue less all delivery cost, payroll, contractor spend, tooling and overhead, before tax and before founder drawings.',
    capture: 'Closed by the fractional CFO in the month end pack. The only figure on this board that does not come from Notion.',
    support: [
      { name: 'Delivery margin', owner: 'Editing Lead', v: '61.8%', t: 'Target 60%', hit: true },
      { name: 'Payroll as a share of revenue', owner: 'Fractional CFO', v: '51.7%', t: 'Target 45%', hit: false },
      { name: 'Revenue per head', owner: 'Nativ', v: '£5,680', t: 'Target £6,000', hit: false },
      { name: 'Contractor spend', owner: 'Fractional CFO', v: '£9,400', t: 'Target £12,000', hit: true }
    ]
  },
  {
    id: 'client-sat',
    wfmt: function (v) { return v.toFixed(1); },
    gapUnit: 'score',
    label: 'Client satisfaction',
    value: '8.8',
    unit: '/10',
    delta: { dir: 'up', text: '0.3', good: true },
    context: '9 of 14 clients responded',
    series: [8.2, 8.3, 8.1, 8.4, 8.5, 8.4, 8.6, 8.5, 8.7, 8.6, 8.5, 8.8],
    domain: [7.8, 9.2],
    ticks: [8, 8.5, 9],
    fmt: function (v) { return v.toFixed(1); },
    target: 9,
    targetLabel: 'Target 9.0 out of 10',
    fmtPoint: function (v) { return v.toFixed(1) + ' out of 10'; },
    chartTitle: 'Client satisfaction, last 12 months',
    owner: 'the Creative Lead',
    def: 'agreed',
    definition: 'Average of the six scored questions on the monthly client form. A score of 8.8 reads as 88% on the business review.',
    capture: 'Google Form, sent monthly to every account lead. Answers land in the same table as everything else.',
    support: [
      { name: 'Forms returned', owner: 'Creative Lead', v: '9 of 14', t: 'Target 12', hit: false },
      { name: 'Average score across six questions', owner: 'Creative Lead', v: '8.8', t: 'Target 9.0', hit: false },
      { name: 'Lowest scoring question', owner: 'Creative Lead', v: '7.6', t: 'Communication', hit: false },
      { name: 'Negative comments raised on a call first', owner: 'Creative Lead', v: '2 of 3', t: 'Target 3 of 3', hit: false }
    ]
  },
  {
    id: 'colleague-perf',
    wfmt: function (v) { return v.toFixed(1); },
    gapUnit: 'score',
    label: 'Colleague performance',
    value: '4.3',
    unit: '/5',
    delta: { dir: 'up', text: '0.1', good: true },
    context: 'average weekly grade',
    series: [3.8, 3.9, 3.9, 4.0, 4.1, 4.0, 4.2, 4.1, 4.2, 4.3, 4.2, 4.3],
    domain: [3.5, 4.7],
    ticks: [3.6, 4.0, 4.4],
    fmt: function (v) { return v.toFixed(1); },
    target: 4.0,
    targetLabel: 'Target 4.0 out of 5',
    fmtPoint: function (v) { return v.toFixed(1) + ' out of 5'; },
    chartTitle: 'Colleague performance, last 12 months',
    owner: 'both leads',
    def: 'drafting',
    definition: 'Every person is graded one to five each week by the lead they report to, against the five behaviours: ownership, proactive, performance driven, reliable, speed.',
    capture: 'Entered by each lead on a Friday. The open question is whether one grade covers all five behaviours or whether each is scored separately.',
    support: [
      { name: 'People graded this week', owner: 'Both leads', v: '26 of 30', t: 'Target 30', hit: false },
      { name: 'Grades below 3', owner: 'Both leads', v: '2', t: 'Target 0', hit: false },
      { name: 'One-to-ones held', owner: 'Both leads', v: '17 of 24', t: 'Weekly', hit: false },
      { name: 'Ramping strategists at 4 or above', owner: 'Creative Lead', v: '3 of 5', t: 'Target 3', hit: true }
    ]
  },
  {
    id: 'colleague-sat',
    wfmt: function (v) { return v.toFixed(1); },
    gapUnit: 'score',
    label: 'Colleague satisfaction',
    value: '8.1',
    unit: '/10',
    delta: { dir: 'down', text: '0.2', good: false },
    context: '24 of 30 responded',
    series: [7.6, 7.8, 7.9, 8.0, 8.2, 8.3, 8.4, 8.5, 8.4, 8.3, 8.3, 8.1],
    domain: [7.2, 8.9],
    ticks: [7.4, 8.0, 8.6],
    fmt: function (v) { return v.toFixed(1); },
    target: 8.0,
    targetLabel: 'Target 8.0 out of 10',
    fmtPoint: function (v) { return v.toFixed(1) + ' out of 10'; },
    chartTitle: 'Colleague satisfaction, last 12 months',
    owner: 'Nativ and the Ops Manager',
    def: 'agreed',
    definition: 'Average of the six scored questions on the monthly team pulse. Anonymous, and reported at company level only, never per person.',
    capture: 'Form sent on the last Friday of the month. Anonymity is the reason it is reported at company level, and that rule does not bend.',
    support: [
      { name: 'Pulse responses returned', owner: 'Ops Manager', v: '24 of 30', t: 'Target 27', hit: false },
      { name: 'Lowest scoring question', owner: 'Ops Manager', v: '6.9', t: 'Workload', hit: false },
      { name: 'Editors working past 19:00', owner: 'Editing Lead', v: '5 of 16', t: 'Target 0', hit: false },
      { name: 'Voluntary leavers this quarter', owner: 'Nativ', v: '1', t: 'Target 0', hit: false }
    ]
  },
  {
    id: 'checklist',
    wfmt: function (v) { return String(Math.round(v)); },
    gapUnit: 'pts',
    label: 'End of day checklist completion',
    value: '78',
    unit: '%',
    delta: { dir: 'up', text: '2 pts', good: true },
    context: 'Target 100%',
    series: [62, 65, 68, 71, 69, 74, 76, 73, 78, 80, 76, 78],
    domain: [55, 106],
    ticks: [60, 80, 100],
    fmt: function (v) { return v + '%'; },
    target: 100,
    targetLabel: 'Target 100% filed every day',
    fmtPoint: function (v) { return v + '%'; },
    chartTitle: 'End of day checklist completion, last 12 months',
    owner: 'the Ops Manager',
    def: 'drafting',
    definition: 'Share of the team who filed their end of day checklist before leaving, across every working day in the period.',
    capture: 'Filed in Notion. Open question is whether a checklist filed the next morning counts as filed, and whether a blank one counts at all.',
    support: [
      { name: 'Editors filing by 18:00', owner: 'Editing Lead', v: '71%', t: 'Target 100%', hit: false },
      { name: 'Strategists filing by 18:00', owner: 'Creative Lead', v: '86%', t: 'Target 100%', hit: false },
      { name: 'Checklists naming a blocker', owner: 'Ops Manager', v: '96', t: 'Target 200', hit: false },
      { name: 'Days with the full team filed', owner: 'Ops Manager', v: '2', t: 'Of 22 working days', hit: false }
    ]
  }
];

var MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

var ROLES = [
  {
    id: 'creative-lead',
    name: 'Creative Lead',
    blurb: 'Owns the client relationship, retention and the revenue line. Reads this on a Monday morning.',
    metrics: [
      { name: 'Client check-ins held', v: '13', t: 'Of 14 accounts', pct: 93, def: 'manual', hit: true,
        definition: 'One scheduled call with the account lead, held and logged in the week.',
        capture: 'Ticked off by the Creative Lead on Friday. Four fields a week, not a daily form.' },
      { name: 'Pod lead one-to-ones held', v: '6', t: 'Of 8 strategists', pct: 75, def: 'manual', hit: false,
        definition: 'A thirty minute one-to-one with each creative strategist, held in the week.',
        capture: 'Entered by hand. Nothing in Notion records whether a one-to-one actually happened.' },
      { name: 'Upsell conversations had', v: '3', t: 'Target 4', pct: 75, def: 'drafting', hit: false,
        definition: 'A conversation where a second service line was put to the client with a price.',
        capture: 'Open question. A mention on a call is not the same as a proposal sent, and the two need separating.' },
      { name: 'At risk signals flagged early', v: '2', t: 'Flagged in week', pct: 100, def: 'manual', hit: true,
        definition: 'An account marked at risk before the client raises it, with the reason written down.',
        capture: 'Flagged by hand in the client record. The value is in the reason, not the count.' },
      { name: 'Founder touch rate on calls', v: '34%', t: 'Target under 20%', pct: 59, def: 'agreed', hit: false,
        definition: 'Share of client calls in the week that Nativ personally attended. Lower is better.',
        capture: 'Read from the calendar. This is the bottleneck measure, and it is the one to watch.' }
    ]
  },
  {
    id: 'editing-lead',
    name: 'Editing Lead',
    blurb: 'Owns throughput and on time delivery across sixteen editors. Three of these five are not yet objective.',
    metrics: [
      { name: 'Edits shipped on time', v: '82%', t: 'Target 90%', pct: 91, def: 'drafting', hit: false,
        definition: 'Edits marked Delivered on or before the agreed date, as a share of everything due that week.',
        capture: 'From the Notion pipeline. Reliable only once an edit has a single agreed definition.',
        open: 'Blocked by tiering. A five minute ad and a one minute cut both count as one.' },
      { name: 'Editor blockers cleared same day', v: '74%', t: 'Target 90%', pct: 82, def: 'drafting', hit: false,
        definition: 'A blocker raised by an editor and resolved before the end of the same working day.',
        capture: 'Needs a Blocked status in Notion with a timestamp. Not there yet.',
        open: 'Where does an editor raise a blocker today. Slack messages cannot be counted.' },
      { name: 'Edits sitting unassigned', v: '9', t: 'Target 3 or fewer', pct: 33, def: 'agreed', hit: false,
        definition: 'Edits in Ready to Edit with no editor against them at 09:00 on any weekday.',
        capture: 'Straight from the pipeline. Objective today, and it could go live now.' },
      { name: 'Editor one-to-ones held', v: '11', t: 'Of 16 editors', pct: 69, def: 'manual', hit: false,
        definition: 'A one-to-one with each editor in the week, held and logged.',
        capture: 'Entered by hand each Friday.' },
      { name: 'Own edits shipped', v: '6', t: 'Target 5', pct: 120, def: 'drafting', hit: true,
        definition: 'Edits the head editor cuts personally, on top of running the team.',
        capture: 'From the pipeline. Same tiering question as everything else in editing.',
        open: 'If the head editor is still cutting six a week, the lead role is not yet a lead role.' }
    ]
  },
  {
    id: 'pod-lead',
    name: 'Pod Lead',
    blurb: 'The creative strategist running a pod. Five of the eight are still ramping, so these are read per person, never averaged.',
    metrics: [
      { name: 'Daily stand-ups held', v: '5', t: 'Of 5 days', pct: 100, def: 'manual', hit: true,
        definition: 'A stand-up with the pod, held on each working day.',
        capture: 'Ticked by the pod lead. One field a day.' },
      { name: 'Concepts shipped', v: '14', t: 'Target 12', pct: 117, def: 'drafting', hit: true,
        definition: 'A concept handed to editing with a brief, a reference and a hook written.',
        capture: 'From the pipeline.',
        open: 'A concept with three hook variants. One concept or three.' },
      { name: 'Edits signed off first pass', v: '61%', t: 'Target 75%', pct: 81, def: 'agreed', hit: false,
        definition: 'Edits approved by the pod lead without a revision request, as a share of edits reviewed.',
        capture: 'From the pipeline. Objective today.' },
      { name: 'Client touchpoints', v: '9', t: 'Target 8', pct: 113, def: 'manual', hit: true,
        definition: 'Any direct contact with the client in the week that is not the scheduled call.',
        capture: 'Entered by hand.' }
    ]
  },
  {
    id: 'video-editor',
    name: 'Video Editor',
    blurb: 'Sixteen editors, each seeing only their own row. This is the view the tiering question matters most for.',
    metrics: [
      { name: 'Edits shipped', v: '21', t: 'Target 25', pct: 84, def: 'drafting', hit: false,
        definition: 'Five a day across a five day week. Currently any export marked Delivered.',
        capture: 'From the pipeline.',
        open: 'This is the number the whole tiering question hangs on. Nobody should be measured on it until it is settled.' },
      { name: 'Revision turnaround', v: '26h', t: 'Target 24h', pct: 92, def: 'agreed', hit: false,
        definition: 'Hours between a revision request landing and the new cut going back. Lower is better.',
        capture: 'From status timestamps in the pipeline. Objective today.' },
      { name: 'First time right rate', v: '68%', t: 'Target 80%', pct: 85, def: 'agreed', hit: false,
        definition: 'Edits approved with no revision request, as a share of edits delivered.',
        capture: 'From the pipeline. Objective today.' },
      { name: 'Stand-ups attended', v: '5', t: 'Of 5 days', pct: 100, def: 'manual', hit: true,
        definition: 'Attendance at the pod stand-up on each working day.',
        capture: 'Ticked by the pod lead.' }
    ]
  }
];

var STUBS = {
  clients: ['Clients', 'The account list, one row per client, with retention, satisfaction and the last check-in date. Reads from the same Notion sync as the board.'],
  delivery: ['Delivery', 'The edit pipeline. Throughput, on time rate and the queue by editor. This is the page that cannot be built until an edit has one agreed definition.'],
  finance: ['Finance', 'Retainer value, delivery margin and cash runway. Owned by the fractional CFO rather than pulled from Notion.'],
  reports: ['Reports', 'The Friday report and the month end roll up, written once and shared rather than rebuilt each time.'],
  search: ['Search', 'Search across clients, edits and people. Not wired up in the prototype.']
};

var ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  overview: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  clients: '<rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7"/>',
  team: '<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16.5 5.2a3.2 3.2 0 0 1 0 6"/><path d="M18 14.4a6.2 6.2 0 0 1 3.2 5.6"/>',
  delivery: '<path d="M12 3 4 7v10l8 4 8-4V7Z"/><path d="m4 7 8 4 8-4"/><path d="M12 11v10"/>',
  finance: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19"/>',
  reports: '<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 17h4"/>',
  settings: '<path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9" cy="7" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="17" r="2"/>'
};

/* ---------- Helpers ---------- */
