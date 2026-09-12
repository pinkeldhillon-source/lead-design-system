"""Assemble kpi-dashboard.html from the parts in this directory.

    python3 src/build.py

The board is one self-contained file. Everything, the font aside, is
inlined, so it opens from disk with no server and no build step for the
reader. This script is the only thing that writes kpi-dashboard.html;
never edit that file by hand, it is output.

Order matters. roster comes first because everything else names the
people, pods and clients it declares, and newjs comes last because it
renders what the others describe.
"""
import base64
import pathlib

SRC = pathlib.Path(__file__).resolve().parent
ROOT = SRC.parent

PARTS = [
    'roster.js',    # pods, people, clients: the shared spine
    'newdata.js',   # the six KPIs and the roles
    'weeks.js',     # September week by week, for the period control
    'detail.js',    # level 2, what makes each KPI
    'deep.js',      # level 3, every client, person, pod and cost line
    'entity.js',    # the end point pages
    'measures.js',  # the 66 measures and the big six per page
    'newjs.js'      # rendering, the chart, and interaction
]


def build():
    page = (SRC / 'newtop.html').read_text().replace(
        '__BRAND_IMG__', (SRC / 'brandmark.html').read_text().strip())
    for name in PARTS:
        page += (SRC / name).read_text().rstrip() + '\n'
    page += '</script>\n'

    icon = base64.b64encode((ROOT / 'logo.png').read_bytes()).decode()
    cut = page.index('</style>') + len('</style>')
    out = ('<!DOCTYPE html>\n<html lang="en-GB">\n<head>\n<meta charset="utf-8">\n'
           '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
           '<link rel="icon" type="image/png" href="data:image/png;base64,' + icon + '">\n'
           + page[:cut].strip() + '\n</head>\n<body>\n' + page[cut:].strip() + '\n</body>\n</html>\n')
    (ROOT / 'kpi-dashboard.html').write_text(out)
    return len(out)


if __name__ == '__main__':
    print('built kpi-dashboard.html,', build(), 'characters')
