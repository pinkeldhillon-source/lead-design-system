# NSY Measurement Board

## What this is

A measurement board for NSY Digital, built by LEAD. One self-contained
HTML file. Every figure in it is placeholder, but placeholder that
reconciles: the prototype's argument is the structure and the drill
down, not the values.

## Who it is for

**Nativ, owner of NSY Digital.** A UK performance creative agency, around
30 people, roughly £170k a month recurring. They make UGC video ads for
health and wellness DTC brands. He opens this on a Monday, before a round
of one to ones, at month end, and when deciding who to hire.

**His two leads**, Aisha K on creative and Rhys M on editing, read the
parts that belong to them.

Nobody arrives here to be impressed. They arrive to find out whether the
business is doing what it said it would.

## How the company is shaped

Four pods of six: a pod lead who is a creative strategist, a second
strategist, and four video editors. Six people sit outside the pods:
Nativ, the two craft leads, an ops manager, a motion designer and a
creative producer.

This is a matrix, not a tree. Strategists answer to Aisha K on craft and
to their pod lead day to day; editors answer to Rhys M the same way. Any
design that draws one line has to be honest about hiding the other.

Pods are the unit of delivery. Clients belong to pods. Every roll up on
the board goes person, pod, company.

## The six KPIs, fixed

Monthly recurring revenue · Operating margin · Client satisfaction ·
Colleague performance · Colleague satisfaction · End of day checklist
completion.

MRR and operating margin are held to monthly growth rather than a level.
The other four have targets: 9.0, 4.0, 8.0 and 100%.

## The rules this board holds itself to

**Every number reconciles.** A client's retainer sums to company MRR in
all twelve months. A cost line sums through the bridge to operating
profit. September on a person's page equals the September on the page
above it. Nine checks in `src/checks/` prove it and are run after any
data change.

**Three levels, always.** The six KPIs, what makes each one, and an end
point page for every client, person, pod, cost line and measure. No row
that names a thing is a dead end.

**Say what is not known.** Where a definition is still being argued, the
board says so rather than showing a confident number. Where a client has
not returned a form, it says when they last did.

**Nothing is deleted.** Churned clients and departed colleagues stay on
the board with the reason. A measurement product that loses its past
cannot measure.

## Voice

British English. No em dashes. No emoji. No hype. Plain sentences that
would survive being read aloud in a board meeting. Where a figure needs a
caveat, the caveat goes next to the figure rather than in a footnote.

## Constraints that are not negotiable

One self contained HTML file, assembled by `src/build.py`. Images inline
as data URIs. The only external fetch is the Inter font. It opens from
disk with no server.

It lives in two places: a Vercel link, which is what gets sent to Nativ,
and a Claude artifact. Anything that needs a signed in viewer works only
on the artifact, so any such feature has to degrade to something honest
on the Vercel link rather than breaking.

## What would make a change wrong

A page that is decorative rather than measured. A number that cannot be
traced to the one beneath it. A control that implies the data is live
when it is placeholder. Tidying reality into the shape the layout
expects.
