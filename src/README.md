# The NSY measurement board, source

`kpi-dashboard.html` at the repository root is **output**. It is assembled
from the files in here. Never edit it by hand; edit a part and rebuild.

## Build

```
python3 src/build.py
```

Writes `kpi-dashboard.html`. One self-contained file: the images are
inlined as data URIs and the only thing it fetches is the Inter font.
It opens from disk with no server.

## The parts, in the order they are concatenated

| File | What it holds |
| --- | --- |
| `newtop.html` | The page shell: all the CSS, the rail, the page head |
| `brandmark.html` | The NSY logo as one inlined `img` tag |
| `roster.js` | Pods, people, clients. The shared spine every other file names |
| `newdata.js` | The six KPIs, their targets and the role tabs |
| `weeks.js` | September week by week, behind the WTD / LW / MTD / YTD control |
| `detail.js` | Level 2: what makes up each KPI |
| `deep.js` | Level 3: every client, person, pod and cost line, twelve months each |
| `entity.js` | The end point pages for a client, a person, a pod, a cost line |
| `measures.js` | The 66 measures, and which six lead each KPI page |
| `newjs.js` | Rendering, the chart, the period control, interaction |

Order matters. `roster.js` is first because everything else refers to the
names it declares, and `newjs.js` is last because it draws what the
others describe.

## Generated data

`deep.js` and `weeks.js` are generated, not written. Regenerating is how
you keep the board internally consistent: every client retainer sums to
company MRR in all twelve months, every cost line sums through the bridge
to operating profit, and each figure on a deeper page equals the one on
the page above it.

```
python3 src/gen.py      # builds the deep data
python3 src/emit.py     # writes deep.js and re-derives the level 2 trends
python3 src/gweeks.py   # writes weeks.js, September split into five weeks
```

`gweeks.py` asserts that the five weeks add back to September and that
month to date equals the figure the rest of the board carries. If an
assertion fails, the data is wrong, not the assertion.

## Checks

```
cd src/checks && npm install        # once
cd ../.. && node src/checks/<name>.mjs
```

Set `CHROME_PATH` if Chromium is not where Playwright expects it.

| Check | What it proves |
| --- | --- |
| `sweep2.mjs` | All 132 end point pages render with no errors |
| `agree.mjs` | Every figure quoted on a level 2 page matches its measure page |
| `rollup.mjs` | Level 3 sums to level 2 sums to the six KPIs, in all twelve months |
| `audit.mjs` | Level 2 arithmetic, roster counts, series lengths |
| `crosscheck.mjs` | 106 facts that appear on more than one page still agree |
| `covercheck.mjs` | Every row that should open a deeper page does |
| `six.mjs` | The big six on each KPI page resolve and read correctly |
| `windows.mjs` | The part weeks sit inside the month, the month inside the year, and no KPI repeats a figure across the four periods |
| `review.mjs` | Hunts contradictions across all 66 measures: scales, targets, percentages, parts against wholes |

Run them all after any data change. They are the reason the board holds
together; the numbers are placeholder, but they are consistent placeholder.

## A note on the data

Every name is invented and every figure is placeholder. The point of the
prototype is the structure and the drill-down, not the values. Where the
board states a target, the target drives the colouring, so changing one
target moves what the page says about performance.
