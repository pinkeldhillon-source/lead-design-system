# Graph Report - lead-design-system  (2026-09-12)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 247 nodes · 373 edges · 20 communities (11 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 51,186 input · 1,034 output

## Graph Freshness
- Built from commit: `95ef73f4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Entity/KPI Page Rendering
- KPI Measures Computation
- React UI Component Library
- Client Audit Script
- Data Rollup Aggregation
- Playwright Test Checks
- Entity Index Builder
- Synthetic Data Generator
- Package Metadata
- Pod/Client Crosscheck
- Weekly KPI Windowing
- Dashboard HTML Build
- Idea Refinement Script

## God Nodes (most connected - your core abstractions)
1. `buildMeasures()` - 21 edges
2. `esc()` - 15 edges
3. `render()` - 11 edges
4. `react` - 11 edges
5. `setKpi()` - 10 edges
6. `kpiById()` - 7 edges
7. `kpiPage()` - 7 edges
8. `section()` - 7 edges
9. `playwright` - 7 edges
10. `entityPage()` - 6 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (20 total, 2 thin omitted)

### Community 0 - "Entity/KPI Page Rendering"
Cohesion: 0.10
Nodes (47): arrow(), band(), behind(), buildProbe(), crumbs(), detailShell(), diffFmt(), drawSpark() (+39 more)

### Community 1 - "KPI Measures Computation"
Cohesion: 0.16
Nodes (23): activeAt(), avg(), buildMeasures(), M(), roleAvg(), colMean(), costSeries(), firstMonth() (+15 more)

### Community 2 - "React UI Component Library"
Cohesion: 0.14
Nodes (6): Button(), variants, tones, DotGrid(), Eyebrow(), react

### Community 3 - "Client Audit Script"
Cohesion: 0.09
Nodes (19): avgs, bad, cl, clients, cp, cper, dc, due (+11 more)

### Community 4 - "Data Rollup Aggregation"
Cohesion: 0.09
Nodes (12): below3, CN, cs, forms, g, graded, { KPIS, DETAIL, DEEP }, pf (+4 more)

### Community 5 - "Playwright Test Checks"
Cohesion: 0.09
Nodes (15): playwright, errs, gaps, description, devDependencies, playwright, name, private (+7 more)

### Community 6 - "Entity Index Builder"
Cohesion: 0.23
Nodes (16): buildIndex(), clientPage(), compact(), costPage(), entityFor(), gbp(), meanAt(), monthGrid() (+8 more)

### Community 7 - "Synthetic Data Generator"
Cohesion: 0.18
Nodes (6): build(), fit(), line(), Shift a list so its mean is exactly `target` at `dp` decimals, staying in range., n values at `dp` decimals whose mean is exactly `total`., split()

### Community 8 - "Package Metadata"
Cohesion: 0.20
Nodes (9): description, keywords, license, main, name, peerDependencies, react, private (+1 more)

### Community 9 - "Pod/Client Crosscheck"
Cohesion: 0.28
Nodes (7): bad, claim, clientPod, personPod, podLead, podName(), { PODS, PEOPLE, CLIENTS, DETAIL }

### Community 10 - "Weekly KPI Windowing"
Cohesion: 0.25
Nodes (6): mean(), prev_window(), September, week by week, so the period control reads real numbers. Today is…, Fold a set of September weeks into one reading per KPI., What each window is measured against. A part week is compared with the same…, win()

## Knowledge Gaps
- **55 isolated node(s):** `idea-refine.sh script`, `variants`, `tones`, `avgs`, `bad` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 113 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `React UI Component Library` to `Package Metadata`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `idea-refine.sh script`, `variants`, `tones` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Entity/KPI Page Rendering` be split into smaller, more focused modules?**
  _Cohesion score 0.09647058823529411 - nodes in this community are weakly interconnected._
- **Should `React UI Component Library` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._
- **Should `Client Audit Script` be split into smaller, more focused modules?**
  _Cohesion score 0.09486166007905138 - nodes in this community are weakly interconnected._
- **Should `Data Rollup Aggregation` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Playwright Test Checks` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._