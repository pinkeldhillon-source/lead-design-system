function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function icon(name) {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
    + ' stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + ICONS[name] + '</svg>';
}

function arrow(dir) {
  if (dir === 'up') return '<svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 1.5 9 8H1Z" fill="currentColor"/></svg>';
  if (dir === 'down') return '<svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 8.5 1 2h8Z" fill="currentColor"/></svg>';
  return '';
}

/* The distance to target, said in points or pounds rather than left for the
   reader to subtract. */
function gapText(k) {
  if (k.target === null || k.target === undefined) return '';
  var d = k.series[k.series.length - 1] - k.target;
  if (Math.abs(d) < 0.001) return 'On target';
  var mag;
  if (k.gapUnit === 'money') mag = '£' + Math.round(Math.abs(d) * 1000).toLocaleString('en-GB');
  else if (k.gapUnit === 'pts') mag = Math.round(Math.abs(d)) + ' pts';
  else mag = (Math.round(Math.abs(d) * 10) / 10).toFixed(1);
  return mag + (d > 0 ? ' above target' : ' below target');
}

var COUNT = ['zero', 'one', 'two', 'three', 'four', 'five', 'six',
             'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

/* Says what the shape means, so the chart is not left to argue its own case. */
function readLine(k) {
  var s = k.series, below = 0, i, head;
  var hasT = k.target !== null && k.target !== undefined;
  for (i = 0; i < s.length; i++) if (hasT && s[i] < k.target) below++;
  /* Where the target is growth rather than a level, the question is how
     often it went up, not how often it cleared a line. */
  if (!hasT && k.growth) {
    var up = 0;
    for (i = 1; i < s.length; i++) if (s[i] > s[i - 1]) up++;
    head = up === s.length - 1
      ? 'Up on the month before in every one of the last eleven months'
      : 'Up on the month before in ' + COUNT[up] + ' of the last eleven months';
  }
  else if (!hasT) head = 'Twelve months to September';
  else if (below === 0) head = 'At or above the ' + k.fmt(k.target) + ' target in every one of the last twelve months';
  else if (below === s.length) head = 'Below the ' + k.fmt(k.target) + ' target in every one of the last twelve months';
  else head = 'Below the ' + k.fmt(k.target) + ' target in ' + COUNT[below] + ' of the last twelve months';
  if (k.delta.dir === 'flat') return head + ', and level on August.';
  return head + ', and ' + (k.delta.dir === 'up' ? 'up ' : 'down ') + k.delta.text + ' on August.';
}

/* What a tile says under its number.

   Four of the six are held to a level, so the useful figure is the
   distance to it. Two are held to growth, so the useful figure is the
   move on the window before. Either way it is one number. */
function tileFoot(k, wid) {
  var w = WINDOW[wid], v = w[k.id];
  if (v === null || v === undefined) return { dir: 'flat', good: true, text: 'No reading', note: 'in this window' };

  if (k.target !== null && k.target !== undefined) {
    var g = v - k.target;
    var hit = k.goodUp === false ? g <= 0 : g >= 0;
    if (Math.abs(g) < 0.05) return { dir: 'flat', good: true, text: 'On target', note: '' };
    return { dir: g > 0 ? 'up' : 'down', good: hit,
      text: gapMag(k, Math.abs(g)), note: (g > 0 ? 'above' : 'below') + ' target' };
  }

  /* Growth. Year to date has no window of its own shape behind it, so
     the two money measures compare September with January instead. */
  var now = wid === 'YTD' ? YTD_NOW[k.id] : v;
  var was = w.prev[k.id];
  if (was === null || was === undefined || !was) return { dir: 'flat', good: true, text: 'No comparison', note: '' };
  var d = now - was;
  if (Math.abs(d) < (k.id === 'profit' ? 0.05 : Math.abs(was) * 0.0005)) {
    return { dir: 'flat', good: true, text: 'Level', note: 'vs ' + w.against };
  }
  var text = k.id === 'profit'
    ? (Math.round(Math.abs(d) * 10) / 10).toFixed(1) + ' pts'
    : (Math.round(Math.abs(d / was) * 1000) / 10).toFixed(1) + '%';
  return { dir: d > 0 ? 'up' : 'down', good: d > 0, text: text, note: 'vs ' + w.against };
}

function gapMag(k, d) {
  if (k.gapUnit === 'money') return '£' + Math.round(d).toLocaleString('en-GB');
  if (k.gapUnit === 'pts') return Math.round(d) + ' pts';
  return (Math.round(d * 10) / 10).toFixed(1);
}

function kpiById(id) {
  return KPIS.filter(function (x) { return x.id === id; })[0];
}

function reduceMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Monotone cubic through the points: smooth, but it never overshoots a
   value, so the curve does not invent a peak between two months. */
function monotone(pts) {
  var n = pts.length;
  if (n < 2) return '';
  var xs = pts.map(function (p) { return p[0]; });
  var ys = pts.map(function (p) { return p[1]; });
  var dx = [], m = [], t = [], i;
  for (i = 0; i < n - 1; i++) {
    dx[i] = xs[i + 1] - xs[i];
    m[i] = (ys[i + 1] - ys[i]) / (dx[i] || 1);
  }
  t[0] = m[0];
  for (i = 1; i < n - 1; i++) t[i] = (m[i - 1] * m[i] <= 0) ? 0 : (m[i - 1] + m[i]) / 2;
  t[n - 1] = m[n - 2];
  for (i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
    var a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
    if (s > 9) { var tau = 3 / Math.sqrt(s); t[i] = tau * a * m[i]; t[i + 1] = tau * b * m[i]; }
  }
  var d = 'M' + xs[0].toFixed(2) + ' ' + ys[0].toFixed(2);
  for (i = 0; i < n - 1; i++) {
    var h = dx[i];
    d += ' C' + (xs[i] + h / 3).toFixed(2) + ' ' + (ys[i] + t[i] * h / 3).toFixed(2)
      + ',' + (xs[i + 1] - h / 3).toFixed(2) + ' ' + (ys[i + 1] - t[i + 1] * h / 3).toFixed(2)
      + ',' + xs[i + 1].toFixed(2) + ' ' + ys[i + 1].toFixed(2);
  }
  return d;
}

/* Sparklines are scaled to the metric's own range, not to the series'
   extremes, so a small drift reads as small and a large climb as large. */
function sparkMarkup(series, lo, hi, W, H, gid, colour) {
  colour = colour || '#6E7688';
  var span = (hi - lo) || 1;
  var padT = 8, padB = 6, padR = 6;
  var n = series.length;
  var pts = series.map(function (v, i) {
    return [(i / (n - 1)) * (W - padR), padT + (1 - (v - lo) / span) * (H - padT - padB)];
  });
  var last = pts[n - 1];
  var line = monotone(pts);
  var area = line + ' L' + last[0].toFixed(2) + ' ' + H + ' L0 ' + H + ' Z';

  return '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">'
    + '<path d="' + line + '" fill="none" stroke="' + colour + '" stroke-width="1.4"'
    + ' stroke-linecap="round" stroke-linejoin="round"/>'
    + '<circle cx="' + last[0].toFixed(2) + '" cy="' + last[1].toFixed(2) + '" r="2.4" fill="' + colour + '"/>'
    + '</svg>';
}

function drawSpark(el, k) {
  var W = el.clientWidth, H = el.clientHeight;
  if (!W || !H) return;
  el.innerHTML = sparkMarkup(k.series, k.domain[0], k.domain[1], W, H, 'sg-' + k.id);
}

/* ---------- The chart ----------
   Built once and updated in place, so changing measure can morph from
   the shape already on screen rather than cutting to the new one. */

var CH = { pts: null, id: null, raf: 0, token: 0, xToY: null, W: 0, H: 0 };

function ptsFor(k, W, H) {
  var lo = k.domain[0], hi = k.domain[1], span = hi - lo || 1, n = k.series.length;
  return k.series.map(function (v, i) {
    return [(i / (n - 1)) * W, (1 - (v - lo) / span) * H];
  });
}

function ensureSvg(W, H) {
  var host = document.getElementById('plotSvg');
  if (!host) return null;
  if (host.firstChild && host.getAttribute('data-w') === String(W) && host.getAttribute('data-h') === String(H)) {
    return host;
  }
  host.setAttribute('data-w', W);
  host.setAttribute('data-h', H);
  host.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">'
    + '<defs>'
    + '<linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0%" stop-color="#7C82E8" stop-opacity="0.11"/>'
    + '<stop offset="100%" stop-color="#7C82E8" stop-opacity="0"/>'
    + '</linearGradient>'
    + '<filter id="glow" x="-10%" y="-40%" width="120%" height="180%">'
    + '<feGaussianBlur stdDeviation="4"/></filter>'
    + '</defs>'
    + '<path class="c-area" fill="url(#cg)"/>'
    + '<path class="c-glow" fill="none" stroke="#7C82E8" stroke-opacity="0.13" stroke-width="6"'
    + ' stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>'
    + '<path class="c-line" fill="none" stroke="#7C82E8" stroke-width="1.9"'
    + ' stroke-linecap="round" stroke-linejoin="round"/>'
    + '<circle class="c-halo" r="7" fill="#7C82E8" fill-opacity="0.18"/>'
    + '<circle class="c-ring" r="4.5" fill="#0E1017" stroke="#7C82E8" stroke-width="1.8"/>'
    + '</svg>';
  return host;
}

function paint(pts, W, H) {
  var host = ensureSvg(W, H);
  if (!host) return;
  var line = monotone(pts);
  var last = pts[pts.length - 1];
  host.querySelector('.c-area').setAttribute('d', line + ' L' + W + ' ' + H + ' L0 ' + H + ' Z');
  host.querySelector('.c-glow').setAttribute('d', line);
  host.querySelector('.c-line').setAttribute('d', line);
  var halo = host.querySelector('.c-halo'), ring = host.querySelector('.c-ring');
  halo.setAttribute('cx', last[0].toFixed(2)); halo.setAttribute('cy', last[1].toFixed(2));
  ring.setAttribute('cx', last[0].toFixed(2)); ring.setAttribute('cy', last[1].toFixed(2));
  var cal = document.getElementById('callout');
  if (cal) cal.style.top = last[1].toFixed(2) + 'px';
}

/* Sample the drawn line so hovering tests against the curve itself
   rather than against the whole plot rectangle. */
function buildProbe(W) {
  CH.xToY = null;
  var host = document.getElementById('plotSvg');
  var path = host && host.querySelector('.c-line');
  if (!path || !path.getTotalLength) return;
  var len = path.getTotalLength();
  if (!len) return;
  var table = new Float32Array(W + 1);
  var x;
  for (x = 0; x <= W; x++) table[x] = -1;
  var steps = Math.max(W, 200) * 2;
  for (var i = 0; i <= steps; i++) {
    var p = path.getPointAtLength((i / steps) * len);
    var xr = Math.round(p.x);
    if (xr >= 0 && xr <= W) table[xr] = p.y;
  }
  var seen = -1;
  for (x = 0; x <= W; x++) {
    if (table[x] < 0) table[x] = seen; else seen = table[x];
  }
  CH.xToY = table;
}

function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function setKpi(id, animate) {
  var k = kpiById(id);
  var plot = document.getElementById('plot');
  if (!k || !plot) return;
  selectedKpi = id;

  var W = plot.clientWidth, H = plot.clientHeight;
  if (!W || !H) return;

  var target = ptsFor(k, W, H);
  var from = (CH.pts && CH.pts.length === target.length && CH.W === W && CH.H === H) ? CH.pts : null;
  var token = ++CH.token;
  var changed = CH.id !== id;
  CH.id = id;
  CH.W = W;
  CH.H = H;

  hideReadout();
  if (changed) swapLabels(k, token, animate);

  if (CH.raf) { cancelAnimationFrame(CH.raf); CH.raf = 0; }

  if (!animate || !from || reduceMotion()) {
    CH.pts = target;
    paint(target, W, H);
    buildProbe(W);
    return;
  }

  var start = null, dur = 520;
  function step(ts) {
    if (token !== CH.token) return;
    if (start === null) start = ts;
    var t = Math.min(1, (ts - start) / dur);
    var e = easeInOut(t);
    var now = target.map(function (p, i) {
      return [p[0], from[i][1] + (p[1] - from[i][1]) * e];
    });
    CH.pts = now;
    paint(now, W, H);
    if (t < 1) {
      CH.raf = requestAnimationFrame(step);
    } else {
      CH.raf = 0;
      CH.pts = target;
      paint(target, W, H);
      buildProbe(W);
    }
  }
  CH.raf = requestAnimationFrame(step);
}

/* Title, legend, axis labels and the supporting card cross fade while
   the line morphs underneath them. */
function swapLabels(k, token, animate) {
  var title = document.getElementById('chartTitle');
  var legend = document.getElementById('chartLegend');
  var grid = document.getElementById('gridLayer');
  var cal = document.getElementById('callout');
  var behindCard = document.getElementById('behindCard');
  if (!title || !legend || !grid || !cal) return;

  var lo = k.domain[0], hi = k.domain[1], span = hi - lo || 1;
  var yOf = function (v) { return (1 - (v - lo) / span) * 100; };

  function write() {
    title.textContent = k.chartTitle;
    legend.innerHTML = (k.target === null ? '' : '<span class="dash"></span>') + esc(k.targetLabel);
    grid.innerHTML = k.ticks.map(function (tk) {
      return '<div class="gridline" style="top:' + yOf(tk).toFixed(2) + '%"></div>'
        + '<div class="ylabel" style="top:' + yOf(tk).toFixed(2) + '%">' + esc(k.fmt(tk)) + '</div>';
    }).join('') + (k.target === null ? ''
      : '<div class="gridline target" style="top:' + yOf(k.target).toFixed(2) + '%"></div>');
    cal.innerHTML = '<b>' + esc(k.value + k.unit) + '</b>'
      + (gapText(k) ? '<small>' + esc(gapText(k)) + '</small>' : '');
    var read = document.getElementById('chartRead');
    if (read) read.textContent = readLine(k);
    if (behindCard) behindCard.innerHTML = behind(k);
  }

  if (!animate || reduceMotion()) { write(); return; }

  var fading = [title, legend, grid, cal];
  var readEl = document.getElementById('chartRead');
  if (readEl) fading.push(readEl);
  if (behindCard) fading.push(behindCard);
  fading.forEach(function (el) { el.classList.add('is-out'); });
  setTimeout(function () {
    if (token !== CH.token) return;
    write();
    fading.forEach(function (el) { el.classList.remove('is-out'); });
  }, 140);
}

/* ---------- Hover readout ---------- */

var NEAR = 30;

function hideReadout() {
  var plot = document.getElementById('plot');
  if (plot) plot.classList.remove('probing');
}

function moveReadout(e) {
  var plot = document.getElementById('plot');
  if (!plot || !CH.xToY || !CH.pts) return;
  var r = plot.getBoundingClientRect();
  var x = Math.max(0, Math.min(CH.W, e.clientX - r.left));
  var y = e.clientY - r.top;
  var lineY = CH.xToY[Math.round(x)];

  if (lineY < 0 || Math.abs(y - lineY) > NEAR) { hideReadout(); return; }

  /* The marker rides the line under the pointer. The figure it carries
     is the month the pointer is nearest, so it steps as you cross into
     the next one rather than sliding through values never measured. */
  var k = kpiById(CH.id);
  var n = k.series.length;
  var i = Math.max(0, Math.min(n - 1, Math.round((x / CH.W) * (n - 1))));

  var dot = document.getElementById('hoverDot');
  var tip = document.getElementById('hoverTip');
  dot.style.left = x.toFixed(2) + 'px';
  dot.style.top = lineY.toFixed(2) + 'px';
  tip.textContent = MONTHS[i] + ' · ' + k.fmtPoint(k.series[i]);
  tip.style.top = lineY.toFixed(2) + 'px';
  tip.style.left = Math.max(46, Math.min(CH.W - 46, x)).toFixed(2) + 'px';
  plot.classList.add('probing');
}

/* ---------- Views ---------- */

function detailShell() {
  return '<div class="detail-head">'
    + '<h2 id="chartTitle"></h2>'
    + '<span class="legend" id="chartLegend"></span>'
    + '</div>'
    + '<p class="chart-read" id="chartRead"></p>'
    + '<div class="chart">'
    + '<div class="plot" id="plot">'
    + '<div class="grid-layer" id="gridLayer"></div>'
    + '<div class="plot-svg" id="plotSvg"></div>'
    + '<span class="callout num" id="callout"></span>'
    + '<span class="hover-dot" id="hoverDot"></span>'
    + '<span class="hover-tip num" id="hoverTip"></span>'
    + '<span class="probe" id="probe"></span>'
    + '</div>'
    + '<div class="xaxis">' + MONTHS.map(function (m, i) {
        var n = MONTHS.length - 1;
        var cls = i === 0 ? 'x-first' : i === n ? 'x-last' : (i % 3 === 0 ? '' : 'x-minor');
        return '<span class="' + cls + '" style="left:' + ((i / n) * 100).toFixed(3) + '%">' + m + '</span>';
      }).join('') + '</div>'
    + '</div>';
}

function behind(k) {
  return '<h3>Behind ' + esc(k.label.toLowerCase()) + '</h3>'
    + '<p class="note">Owned by ' + esc(k.owner) + '. '
    + 'These are the weekly inputs the team controls. The KPI above moves when these move.</p>'
    + '<ul class="support">'
    + k.support.map(function (s) {
        var sm = linkFor(s.name);
        return '<li><span>' + (sm ? goLink(s.name, sm) : esc(s.name))
          + '<span class="s-owner">' + esc(s.owner) + '</span></span>'
          + '<span class="s-fig num ' + (s.hit ? 'hit' : 'miss') + '">' + esc(s.v)
          + '<small>' + esc(s.t) + '</small></span></li>';
      }).join('')
    + '</ul>'
    + '<div class="method">'
    + '<p><b>How this is counted.</b> ' + esc(k.definition) + '</p>'
    + '<p>' + esc(k.capture) + '</p>'
    + '<p><span class="state ' + k.def + '">' + esc(STATE[k.def]) + '</span></p>'
    + '</div>';
}

/* ---------- KPI detail pages ----------
   A page is a hero, a strip of sub figures, the twelve month chart, then
   the sections that break the number apart. Sections come in three
   shapes: rows carrying a sparkline, a plain table, and a score grid. */

var TRENDS = [];

/* Right align a column when its figures are numbers, leave it left when
   they are words, so the tables set themselves without hand tuning. */
/* "No form" and "Not graded" mark an absence, not a word, so they should not
   drag a column of figures over to the left. */
var ABSENT = /^(no form|not returned|not graded|none|not a client|not here yet|n\/a)$/i;

function numericCol(rows, i) {
  var seen = 0, num = 0;
  rows.forEach(function (r) {
    var c = r.cells[i];
    if (c === undefined || c === null || c === '') return;
    if (ABSENT.test(String(c).trim())) return;
    seen++;
    if (/^[-+(]?[£$]?[\d.,]+%?\)?( pts)?$/.test(String(c).trim())) num++;
  });
  return seen > 0 && num / seen > 0.6;
}

function rowClass(cells) {
  var first = String(cells[0] || '').trim();
  if (/^Total\b/i.test(first)) return ' class="total"';
  if (/^(Operating profit|Delivery margin|Gross margin|Net)\b/i.test(first)) return ' class="rule"';
  return '';
}

function tableSection(sec) {
  var cols = sec.columns || [];
  var rows = sec.rows || [];
  var right = cols.map(function (c, i) { return i > 0 && numericCol(rows, i); });

  return '<div class="scroll-x"><table class="dt"><thead><tr>'
    + cols.map(function (c, i) {
        return '<th' + (right[i] ? ' class="r"' : '') + ' scope="col">' + esc(c) + '</th>';
      }).join('')
    + '</tr></thead><tbody>'
    + rows.map(function (r) {
        var last = r.cells.length - 1;
        return '<tr' + rowClass(r.cells) + '>'
          + r.cells.map(function (c, i) {
              var cls = [];
              if (right[i]) cls.push('r');
              if (i === 0) cls.push('name');
              else if (!right[i]) cls.push('dim');
              if (i === last && r.tone && r.tone !== 'none') cls.push(r.tone);
              cls.push('num');
              var ent = i === 0 ? linkFor(c) : null;
              return '<td class="' + cls.join(' ') + '">' + (ent ? goLink(c, ent) : esc(c)) + '</td>';
            }).join('')
          + '</tr>';
      }).join('')
    + '</tbody></table></div>';
}

/* Three bands, not a gradient. Coloured by what the score means against
   its target rather than by where it falls on a ramp, so a genuinely bad
   cell cannot clamp to the floor and read as merely poor. */
function band(v, bad, good) {
  if (v < bad) return 'bad';
  if (v >= good) return 'good';
  return '';
}

function gridSection(sec) {
  var cols = sec.columns || [];
  var labels = sec.rowLabels || [];
  var subs = sec.sublabels || [];
  var vals = sec.values || [];
  var bad = sec.bad, good = sec.good;
  var blank = sec.nullLabel || 'Not returned';

  return '<div class="scroll-x"><table class="dt"><thead><tr>'
    + cols.map(function (c, i) {
        return '<th' + (i > 0 ? ' class="r"' : '') + ' scope="col">' + esc(c) + '</th>';
      }).join('')
    + '</tr></thead><tbody>'
    + labels.map(function (name, r) {
        var row = vals[r] || [];
        var last = row.length - 1;
        var ge = linkFor(name);
        return '<tr><td class="name">' + (ge ? goLink(name, ge) : esc(name))
          + (subs[r] ? '<span class="sub-lab">' + esc(subs[r]) + '</span>' : '') + '</td>'
          + row.map(function (v, i) {
              if (v === null || v === undefined) {
                return i === last ? '<td class="cell none">' + esc(blank) + '</td>' : '<td class="cell none"></td>';
              }
              if (i === last) return '<td class="avg num">' + v.toFixed(1) + '</td>';
              return '<td class="cell num ' + band(v, bad, good) + '">' + v.toFixed(1) + '</td>';
            }).join('')
          + '</tr>';
      }).join('')
    + '</tbody></table></div>';
}

function trendsSection(sec) {
  return '<div class="card trendrows">'
    + (sec.trends || []).map(function (t) {
        var i = TRENDS.push({ series: t.series, lo: t.lo, hi: t.hi }) - 1;
        var lm = LINKCTX ? measureFor(t.name, LINKCTX) : null;
        return '<div class="trow">'
          + '<span class="tr-name">' + (lm ? goLink(t.name, { kind: 'measure', id: lm.id }) : esc(t.name)) + '</span>'
          + '<span class="tr-val num">' + esc(t.value) + '</span>'
          + '<span class="tr-d delta ' + (t.deltaGood ? 'good' : 'bad') + '">'
          + arrow(t.deltaDir)
          + '<span class="sr-only">' + (t.deltaDir === 'up' ? 'Up ' : t.deltaDir === 'down' ? 'Down ' : '') + '</span>'
          + esc(t.deltaText) + '</span>'
          + '<span class="tr-spark" data-tr="' + i + '"></span>'
          + '</div>';
      }).join('')
    + '</div>';
}

/* An entity first, then a measure on whichever page is being drawn. */
function linkFor(label) {
  var e = entityFor(label);
  if (e) return e;
  var m = LINKCTX ? measureFor(label, LINKCTX) : null;
  return m ? { kind: 'measure', id: m.id } : null;
}

function statCards(list) {
  return '<div class="statstrip">' + list.map(function (x) {
    var m = LINKCTX ? measureFor(x.label, LINKCTX) : null;
    return '<div class="card stat ' + (x.tone === 'flat' ? '' : esc(x.tone)) + '">'
      + '<span class="s-lab">' + (m ? goLink(x.label, { kind: 'measure', id: m.id }) : esc(x.label)) + '</span>'
      + '<span class="s-val num">' + esc(x.value) + '</span>'
      + '<span class="s-sub">' + esc(x.sub) + '</span></div>';
  }).join('') + '</div>';
}

function section(sec) {
  var body = sec.kind === 'trends' ? trendsSection(sec)
    : sec.kind === 'grid' ? gridSection(sec)
    : tableSection(sec);

  return '<section class="sect">'
    + '<h3>' + esc(sec.title) + '</h3>'
    + (sec.note ? '<p class="s-note">' + esc(sec.note) + '</p>' : '')
    + body
    + (sec.caveat ? '<p class="caveat"><b>Worth knowing.</b> ' + esc(sec.caveat) + '</p>' : '')
    + '</section>';
}

/* The same tile as the overview, built from a measure rather than a KPI, so
   a measure page leads with six numbers instead of a paragraph. */
/* A gap between two percentages is points, not per cent. Saying 22% when you
   mean 22 points is the kind of thing a founder repeats in a board meeting. */
function diffFmt(m, v) {
  if (m.fmtKey === 'pct' || m.fmtKey === 'pct0') {
    return (m.fmtKey === 'pct' ? (Math.round(v * 10) / 10).toFixed(1) : String(Math.round(v))) + ' pts';
  }
  return m.fmt(v);
}

function measureTile(m, label) {
  var s = m.series, n = s.length;
  var now = s[n - 1], prev = s[n - 2];
  var d = (now === null || prev === null) ? 0 : now - prev;
  var good = d === 0 ? true : (d > 0) === m.goodUp;
  var lo = Math.min.apply(null, s.filter(function (v) { return v !== null; }));
  var hi = Math.max.apply(null, s.filter(function (v) { return v !== null; }));
  var pad = Math.max((hi - lo) * 0.35, Math.abs(hi) * 0.04 || 1);
  var i = TRENDS.push({ series: s.map(function (v) { return v === null ? lo : v; }), lo: lo - pad, hi: hi + pad }) - 1;

  return '<button type="button" class="tile" data-go="measure:' + m.id + '">'
    + '<span class="t-top"><span class="t-label">' + esc(label || m.name) + '</span></span>'
    + '<span class="t-value num">' + esc(m.fmt(now)) + '</span>'
    + '<span class="t-bottom"><span class="t-foot">'
    + (d === 0 ? '<span class="delta">Level</span>'
        : '<span class="delta ' + (good ? 'good' : 'bad') + '">' + arrow(d > 0 ? 'up' : 'down')
          + '<span class="sr-only">' + (d > 0 ? 'Up ' : 'Down ') + '</span>'
          + esc(diffFmt(m, Math.abs(d))) + '</span>')
    + '<span>vs last month</span>'
    + '</span>'
    + '<span class="spark-box" data-tr="' + i + '"></span>'
    + '</span></button>';
}

function kpiPage() {
  var k = kpiById(openKpi);
  var d = DETAIL[openKpi];

  TRENDS = [];
  var six = sixFor(openKpi);
  var tiles = six.length
    ? '<div class="tiles">' + six.map(function (x) {
        return measureTile(x.m, x.label);
      }).join('') + '</div>'
    : (d && d.stats && d.stats.length ? statCards(d.stats) : '');

  return '<button type="button" class="back" id="back">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
    + ' stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M15 18l-6-6 6-6"/></svg>Back to overview</button>'
    + tiles
    + (d ? d.sections.map(section).join('') : '')
    + '<section class="card behind">' + behind(k) + '</section>';
}

function crumbs(here) {
  var out = '<nav class="crumbs" aria-label="Breadcrumb">'
    + '<button type="button" data-crumb="overview">Overview</button>';
  if (fromKpi) {
    out += '<span class="sep">/</span><button type="button" data-crumb="kpi">'
      + esc(kpiById(fromKpi).label) + '</button>';
  }
  return out + '<span class="sep">/</span><span class="here">' + esc(here) + '</span></nav>';
}

function entityPage() {
  var fn = PAGEFN[openEntity.kind];
  var store = openEntity.kind === 'cost' ? DEEP.cost
    : openEntity.kind === 'person' ? DEEP.people
    : openEntity.kind === 'client' ? DEEP.clients : null;
  if (!fn || (store && !store[openEntity.id])) {
    return crumbs('Not found') + '<div class="card stub"><h2>Nothing here</h2>'
      + '<p>That page does not exist. Go back to the overview.</p></div>';
  }
  var d = fn(openEntity.id);
  if (!d) return crumbs('Not found') + '<div class="card stub"><h2>Nothing here</h2><p>That page does not exist.</p></div>';
  TRENDS = [];
  /* A measure page links on to the measures that make it up, so it keeps its
     own page's context. An entity page carries names, not measures. */
  LINKCTX = openEntity.kind === 'measure' ? d.kpi : null;
  var out = crumbs(d.title)
    + d.head
    + (d.note ? '<p class="caveat"><b>Worth knowing.</b> ' + esc(d.note) + '</p>' : '')
    + (d.stats && d.stats.length ? statCards(d.stats) : '')
    + d.sections.map(section).join('')
    + (d.method || '');
  LINKCTX = null;
  return out;
}

function drawTrendSparks() {
  Array.prototype.forEach.call(document.querySelectorAll('[data-tr]'), function (el) {
    var t = TRENDS[Number(el.getAttribute('data-tr'))];
    if (!t) return;
    var W = el.clientWidth, H = el.clientHeight;
    if (!W || !H) return;
    el.innerHTML = sparkMarkup(t.series, t.lo, t.hi, W, H, 'tr-' + el.getAttribute('data-tr'));
  });
}

var openKpi = 'mrr';
var openEntity = null;
var fromKpi = null;
/* The page currently being drawn, so a label like "Company score" resolves
   to the right measure. Two pages use that name for different things. */
var LINKCTX = null;

var selectedKpi = 'mrr';
var currentRole = ROLES[0].id;
var currentPeriod = 'MTD';
var page = 'overview';

var view = document.getElementById('view');
var titleEl = document.getElementById('pageTitle');
var subEl = document.getElementById('pageSub');
var headRight = document.querySelector('.head-right');

function overview() {
  var wid = currentPeriod;
  return '<div class="tiles">'
    + KPIS.map(function (t) {
        var v = WINDOW[wid][t.id];
        var f = tileFoot(t, wid);
        var shown = v === null || v === undefined ? 'None' : t.wfmt(v);
        return '<button type="button" class="tile" data-kpi="' + t.id + '">'
          + '<span class="t-top"><span class="t-label">' + esc(t.label) + '</span></span>'
          + '<span class="t-value num">' + esc(shown)
          + (t.unit && v !== null ? '<span class="unit">' + esc(t.unit) + '</span>' : '') + '</span>'
          + '<span class="t-bottom">'
          + '<span class="t-foot">'
          + '<span class="delta ' + (f.good ? 'good' : 'bad') + '">'
          + (f.dir === 'flat' ? '' : arrow(f.dir))
          + esc(f.text) + '</span>'
          + (f.note ? '<span>' + esc(f.note) + '</span>' : '')
          + '</span>'
          + '<span class="spark-box" data-spark="' + t.id + '"></span>'
          + '</span>'
          + '</button>';
      }).join('')
    + '</div>'
    + '<section class="card detail">' + detailShell() + '</section>'
    + '<section class="card behind" id="behindCard"></section>';
}

function team() {
  var r = ROLES.filter(function (x) { return x.id === currentRole; })[0];

  return '<div class="seg roles" role="group" aria-label="Role">'
    + ROLES.map(function (x) {
        return '<button type="button" data-role="' + x.id + '"'
          + ' aria-pressed="' + (x.id === currentRole) + '">' + esc(x.name) + '</button>';
      }).join('')
    + '</div>'
    + '<p class="role-note">' + esc(r.blurb) + '</p>'
    + '<div class="card rows-card" id="rows">'
    + r.metrics.map(function (m, i) {
        var w = Math.min(m.pct, 100);
        return '<div class="mrow" data-row="' + i + '">'
          + '<div><p class="m-name">' + esc(m.name)
          + '<span class="state ' + m.def + '">' + esc(STATE[m.def]) + '</span></p>'
          + '<p class="m-def">' + esc(m.definition) + '</p></div>'
          + '<span class="bar' + (m.hit ? '' : ' miss') + '"><i style="width:' + w + '%"></i></span>'
          + '<span class="m-fig"><span class="v num' + (m.hit ? '' : ' miss') + '">' + esc(m.v) + '</span>'
          + '<span class="t num">' + esc(m.t) + '</span></span>'
          + '<button type="button" class="src" data-src="' + i + '" aria-expanded="false">Source</button>'
          + '</div>';
      }).join('')
    + '</div>'
    + '<div class="card open-question">'
    + '<h3>Open before this goes live</h3>'
    + '<p>An edit is currently anything an editor marks Delivered in Notion. A sixty second cut and a five minute cut count the same, so the five a day target means different work for different people.</p>'
    + '<p><b>Three tiers, or two. Where does a tier stop. Who assigns it, and at what point in the pipeline.</b> Answer those and the editing numbers become objective.</p>'
    + '</div>'
    + '<div class="cadence">'
    + '<article class="card"><h4>Monday</h4><p class="when">Plan</p>'
    + '<p>Leads open this view, read last week against target, and set the week. Fifteen minutes, no deck.</p></article>'
    + '<article class="card"><h4>Friday</h4><p class="when">Report</p>'
    + '<p>Each lead files the week. Anything below target carries one line on what changes next week.</p></article>'
    + '<article class="card"><h4>Month end</h4><p class="when">Roll up</p>'
    + '<p>Weekly inputs roll into the business KPIs. Nativ and the fractional CFO review the six.</p></article>'
    + '</div>';
}

function stub(id) {
  return '<div class="card stub"><h2>' + esc(STUBS[id][0]) + '</h2><p>' + esc(STUBS[id][1]) + '</p></div>';
}

function openDefs() {
  var n = KPIS.filter(function (k) { return k.def === 'drafting'; }).length;
  var total = KPIS.length;
  ROLES.forEach(function (r) {
    total += r.metrics.length;
    n += r.metrics.filter(function (m) { return m.def === 'drafting'; }).length;
  });
  return n + ' of ' + total + ' measures still being defined';
}

function drawSparks() {
  Array.prototype.forEach.call(document.querySelectorAll('[data-spark]'), function (el) {
    drawSpark(el, kpiById(el.getAttribute('data-spark')));
  });
}

function render() {
  var period = PERIODS.filter(function (p) { return p.id === currentPeriod; })[0];
  var periodsEl = document.getElementById('periods');

  CH.pts = null;
  CH.id = null;

  if (page === 'overview') {
    titleEl.textContent = 'Performance';
    subEl.textContent = period.sub;
    headRight.hidden = false;
    periodsEl.hidden = false;
    view.innerHTML = overview();
    drawSparks();
    setKpi(selectedKpi, false);
  } else if (page === 'kpi') {
    var k = kpiById(openKpi);
    titleEl.textContent = k.label;
    subEl.textContent = 'What makes this number, broken down. Twelve months to September.';
    headRight.hidden = false;
    periodsEl.hidden = true;
    LINKCTX = openKpi;
    view.innerHTML = kpiPage();
    LINKCTX = null;
    drawTrendSparks();
  } else if (page === 'entity') {
    var e = PAGEFN[openEntity.kind] ? PAGEFN[openEntity.kind](openEntity.id) : null;
    if (openEntity.kind === 'measure' && e && !fromKpi) fromKpi = e.kpi;
    titleEl.textContent = e ? e.title : 'Not found';
    subEl.textContent = openEntity.kind === 'cost' ? 'One cost line, twelve months.'
      : openEntity.kind === 'pod' ? 'One pod, everything it carries.'
      : openEntity.kind === 'measure' ? 'One measure, what makes it and what moves it.'
      : 'Everything the board holds on this ' + openEntity.kind + '.';
    headRight.hidden = false;
    periodsEl.hidden = true;
    view.innerHTML = entityPage();
    drawTrendSparks();
  } else if (page === 'team') {
    titleEl.textContent = 'Team';
    subEl.textContent = 'Weekly leading indicators, ' + openDefs();
    headRight.hidden = false;
    periodsEl.hidden = true;
    view.innerHTML = team();
  } else {
    titleEl.textContent = STUBS[page][0];
    subEl.textContent = 'Not built yet';
    headRight.hidden = true;
    view.innerHTML = stub(page);
  }

  Array.prototype.forEach.call(document.querySelectorAll('.nav button'), function (b) {
    if (b.getAttribute('data-page') === page) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
}

/* ---------- Rail ---------- */

var NAV = [
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'overview', label: 'Overview', icon: 'overview' },
  { id: 'clients', label: 'Clients', icon: 'clients' },
  { id: 'team', label: 'Team', icon: 'team' },
  { id: 'delivery', label: 'Delivery', icon: 'delivery' },
  { id: 'finance', label: 'Finance', icon: 'finance' },
  { id: 'reports', label: 'Reports', icon: 'reports' }
];

function navButton(item) {
  return '<button type="button" data-page="' + item.id + '">'
    + icon(item.icon) + '<span>' + esc(item.label) + '</span></button>';
}

document.getElementById('nav').innerHTML = NAV.map(navButton).join('');
document.getElementById('navFoot').innerHTML = navButton({ id: 'settings', label: 'Settings', icon: 'settings' });
STUBS.settings = ['Settings', 'Workspace, people and permissions. Editors see their own row, leads see their team, Nativ sees everything.'];

var menuBtn = document.getElementById('menu');

function setNav(open) {
  document.body.classList.toggle('nav-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

menuBtn.addEventListener('click', function () {
  setNav(!document.body.classList.contains('nav-open'));
});

document.getElementById('scrim').addEventListener('click', function () { setNav(false); });

document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  if (document.body.classList.contains('nav-open')) {
    setNav(false);
    menuBtn.focus();
    return;
  }
  if (page === 'entity') {
    page = fromKpi ? 'kpi' : 'overview';
    if (fromKpi) { openKpi = fromKpi; selectedKpi = fromKpi; }
    window.scrollTo(0, 0);
    render();
    return;
  }
  /* Escape backs out of a measure the same way the button does. */
  if (page === 'kpi') {
    page = 'overview';
    window.scrollTo(0, 0);
    render();
    var tile = view.querySelector('.tile[data-kpi="' + openKpi + '"]');
    if (tile) tile.focus();
  }
});

document.querySelector('.rail').addEventListener('click', function (e) {
  var btn = e.target.closest('button[data-page]');
  if (!btn) return;
  page = btn.getAttribute('data-page');
  setNav(false);
  window.scrollTo(0, 0);
  render();
});

/* ---------- Periods ---------- */

/* The periods only mean something against a date, so the board says it. */
document.getElementById('stamp').textContent = 'Placeholder data, ' + TODAY + ' at 09:12';

document.getElementById('periods').innerHTML = PERIODS.map(function (p) {
  return '<button type="button" aria-pressed="' + (p.id === currentPeriod) + '">' + p.id + '</button>';
}).join('');

document.getElementById('periods').addEventListener('click', function (e) {
  var btn = e.target.closest('button');
  if (!btn) return;
  currentPeriod = btn.textContent.trim();
  Array.prototype.forEach.call(this.querySelectorAll('button'), function (b) {
    b.setAttribute('aria-pressed', String(b === btn));
  });
  var period = PERIODS.filter(function (p) { return p.id === currentPeriod; })[0];
  if (page !== 'overview') return;
  subEl.textContent = period.sub;
  /* Redraw the six, keeping the chart where it is. Only the tiles change. */
  var tiles = view.querySelector('.tiles');
  if (!tiles) return;
  var fresh = document.createElement('div');
  fresh.innerHTML = overview();
  tiles.innerHTML = fresh.querySelector('.tiles').innerHTML;
  drawSparks();
});

/* ---------- View interaction ---------- */

/* Pointing at a measure brings its chart up, and keyboard focus does the
   same, so the two routes agree. */
function hasChart() { return page === 'overview'; }

function tileTarget(e) {
  var t = e.target && e.target.closest ? e.target.closest('.tile') : null;
  return t ? t.getAttribute('data-kpi') : null;
}

view.addEventListener('mouseover', function (e) {
  if (page !== 'overview') return;
  var id = tileTarget(e);
  if (id && id !== CH.id) setKpi(id, true);
});

view.addEventListener('focusin', function (e) {
  if (page !== 'overview') return;
  var id = tileTarget(e);
  if (id && id !== CH.id) setKpi(id, true);
});

view.addEventListener('click', function (e) {
  var tile = e.target.closest('.tile[data-kpi]');
  if (tile) {
    openKpi = tile.getAttribute('data-kpi');
    selectedKpi = openKpi;
    page = 'kpi';
    window.scrollTo(0, 0);
    render();
    var back = document.getElementById('back');
    if (back) back.focus();
    return;
  }

  var go = e.target.closest('[data-go]');
  if (go) {
    /* A measure id carries its own colon, as in "measure:mrr:client-churn",
       so split on the first one only. */
    var raw = go.getAttribute('data-go');
    var cut = raw.indexOf(':');
    if (page === 'kpi') fromKpi = openKpi;
    openEntity = { kind: raw.slice(0, cut), id: raw.slice(cut + 1) };
    page = 'entity';
    window.scrollTo(0, 0);
    render();
    var c1 = view.querySelector('.crumbs button');
    if (c1) c1.focus();
    return;
  }

  var crumb = e.target.closest('[data-crumb]');
  if (crumb) {
    var to = crumb.getAttribute('data-crumb');
    page = to === 'kpi' ? 'kpi' : 'overview';
    if (to === 'kpi') { openKpi = fromKpi; selectedKpi = fromKpi; }
    else fromKpi = null;
    window.scrollTo(0, 0);
    render();
    return;
  }

  if (e.target.closest('#back')) {
    page = 'overview';
    window.scrollTo(0, 0);
    render();
    var tileBack = view.querySelector('.tile[data-kpi="' + openKpi + '"]');
    if (tileBack) tileBack.focus();
    return;
  }

  var tab = e.target.closest('button[data-role]');
  if (tab) {
    currentRole = tab.getAttribute('data-role');
    render();
    var back = view.querySelector('button[data-role="' + currentRole + '"]');
    if (back) back.focus();
    return;
  }

  var src = e.target.closest('.src');
  if (src) {
    var row = src.closest('.mrow');
    var existing = row.querySelector('.src-panel');
    if (existing) {
      existing.remove();
      src.setAttribute('aria-expanded', 'false');
      src.textContent = 'Source';
      return;
    }
    var role = ROLES.filter(function (x) { return x.id === currentRole; })[0];
    var m = role.metrics[Number(src.getAttribute('data-src'))];
    var panel = document.createElement('div');
    panel.className = 'src-panel';
    panel.innerHTML = '<p>' + esc(m.capture) + '</p>'
      + (m.open ? '<p class="open">Open. ' + esc(m.open) + '</p>' : '');
    row.appendChild(panel);
    src.setAttribute('aria-expanded', 'true');
    src.textContent = 'Hide';
  }
});

/* The readout appears only when the pointer is near the line itself. */
view.addEventListener('pointermove', function (e) {
  if (!hasChart()) return;
  if (!e.target || !e.target.closest || !e.target.closest('#probe')) { hideReadout(); return; }
  moveReadout(e);
});

view.addEventListener('pointerleave', hideReadout, true);
view.addEventListener('pointercancel', hideReadout, true);

var resizeTimer;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    drawSparks();
    drawTrendSparks();
    if (page === 'overview') { CH.pts = null; setKpi(selectedKpi, false); }
    if (page === 'entity') render();
  }, 100);
});

render();
