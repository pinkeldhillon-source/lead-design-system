/* ---------- The org chart ----------

   NSY is a matrix, not a tree. A strategist answers to Aisha K on craft
   and to their pod lead day to day; an editor answers to Rhys M the same
   way. A chart that draws one of those lines has to hide the other, so
   this draws neither: craft is the row you are in, pod is the column,
   and position carries the meaning instead of a connector.

   The consequence worth having is that an empty cell is a hiring need.
   The layout states it; no label has to.

   Everything here reads the roster. Nothing is typed in twice. */

var ORG_ROWS = [
  { id: 'lead', label: 'Leadership', note: 'Owns the company and the two crafts', central: true },
  { id: 'strategist', label: 'Creative strategists', note: 'Answer to Aisha K on craft' },
  { id: 'editor', label: 'Video editors', note: 'Answer to Rhys M on craft' },
  { id: 'ops', label: 'Operations', note: 'Serve every pod', central: true }
];

function orgPeople() {
  return Object.keys(DEEP.people).map(function (k) { return DEEP.people[k]; });
}

/* The grade a person was last given, and the band it falls in. Three
   bands rather than a ramp, because the point is to find the people who
   need a conversation, not to admire a gradient. */
function orgGrade(p) {
  var i, v = null, at = -1;
  for (i = 11; i >= 0; i--) { if (p.perf[i] !== null) { v = p.perf[i]; at = i; break; } }
  if (v === null) return { v: null, band: 'none', at: -1 };
  return { v: v, at: at, band: v >= 4.5 ? 'strong' : v < 3.5 ? 'weak' : 'mid' };
}

function orgCard(p) {
  var g = orgGrade(p);
  var initials = p.name.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2);
  var sub = p.title || (p.podLead ? 'Pod lead' : '');

  return '<button type="button" class="pcard' + (p.podLead ? ' is-lead' : '')
    + (g.band === 'weak' ? ' is-weak' : '') + '" data-go="person:' + slugify(p.name) + '">'
    + '<span class="pc-face" aria-hidden="true">' + esc(initials) + '</span>'
    + '<span class="pc-body">'
    + '<span class="pc-name">' + esc(p.name) + '</span>'
    + (sub ? '<span class="pc-role">' + esc(sub) + '</span>' : '')
    + '</span>'
    + '<span class="pc-grade num ' + g.band + '">'
    + (g.v === null ? '<span class="pc-new">New</span>' : one(g.v)) + '</span>'
    + '</button>';
}

/* A cell holds everyone of one craft in one pod. An empty one is drawn,
   not skipped: the gap is the thing worth seeing. */
function orgCell(list, rowId, podName) {
  if (!list.length) {
    return '<div class="ocell is-empty"><span class="ohole">'
      + 'No ' + (rowId === 'strategist' ? 'strategist' : 'editor') + '</span></div>';
  }
  return '<div class="ocell">' + list.map(orgCard).join('') + '</div>';
}

function orgChart() {
  var P = orgPeople();
  var pods = DEEP.pods;

  /* Pod header: who runs it, what it carries. The money is here because
     a pod is a delivery unit, and a thin pod running a big book is the
     thing you most want to notice. */
  var head = '<div class="orow ohead">'
    + '<div class="olabel"></div>'
    + pods.map(function (pd) {
        var people = P.filter(function (p) { return p.pod === pd.name; });
        var clients = Object.keys(DEEP.clients).map(function (k) { return DEEP.clients[k]; })
          .filter(function (c) { return c.active && c.pod === pd.name; });
        var book = clients.reduce(function (a, c) { return a + c.retainer[11]; }, 0);
        var graded = people.map(orgGrade).filter(function (g) { return g.v !== null; });
        var mean = graded.length
          ? graded.reduce(function (a, g) { return a + g.v; }, 0) / graded.length : null;
        return '<div class="ocol-head">'
          + '<span class="oc-name">' + esc(pd.name) + '</span>'
          + '<span class="oc-meta">' + people.length + ' people · '
          + clients.length + ' clients</span>'
          + '<span class="oc-meta">' + gbp(book) + ' a month</span>'
          + '<span class="oc-meta">' + (mean === null ? 'Not graded' : one(mean) + ' average grade') + '</span>'
          + '</div>';
      }).join('')
    + '<div class="ocol-head is-central">'
    + '<span class="oc-name">Company</span>'
    + '<span class="oc-meta">' + P.filter(function (p) { return !p.pod; }).length + ' people</span>'
    + '<span class="oc-meta">Serves every pod</span>'
    + '</div></div>';

  var body = ORG_ROWS.map(function (row) {
    var central = P.filter(function (p) { return p.role === row.id && !p.pod; });
    /* A craft that sits outside the pods gets one quiet span rather than
       four empty boxes. Four blanks would read as four gaps, and these
       are not gaps. */
    var cells = row.central
      ? '<div class="ocell is-na"><span class="ona">Not in a pod</span></div>'
      : pods.map(function (pd) {
          var list = P.filter(function (p) { return p.role === row.id && p.pod === pd.name; })
            .sort(function (a, b) { return (b.podLead ? 1 : 0) - (a.podLead ? 1 : 0); });
          return orgCell(list, row.id, pd.name);
        }).join('');

    return '<div class="orow' + (row.central ? ' is-outside' : '') + '">'
      + '<div class="olabel"><span class="ol-name">' + esc(row.label) + '</span>'
      + '<span class="ol-note">' + esc(row.note) + '</span></div>'
      + cells
      + '<div class="ocell is-central">'
      + (central.length ? central.map(orgCard).join('')
         : '<span class="ona">None at the centre</span>')
      + '</div></div>';
  }).join('');

  var n = P.length;
  return '<p class="org-read">' + n + ' people. Four pods of '
    + P.filter(function (p) { return p.pod === pods[0].name; }).length
    + ', and six who serve all of them. Craft runs across, pods run down.</p>'
    + '<div class="scroll-x"><div class="orgchart">' + head + body + '</div></div>';
}
