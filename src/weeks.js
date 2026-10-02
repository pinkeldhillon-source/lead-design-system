/* September week by week, so the period control reads real numbers.

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
  WTD: { mrr: 24241.38, profit: 24.97, 'client-sat': 8.7, 'colleague-perf': 4.52, 'colleague-sat': 8.57, 'checklist': 74.44,
    prev: { mrr: 24241.38, profit: 27.89 }, against: "last week", n: {"client-sat": 1, "colleague-perf": 9, "colleague-sat": 7, "checklist": [67, 90]} },
  LW: { mrr: 40402.29, profit: 27.89, 'client-sat': 8.9, 'colleague-perf': 4.37, 'colleague-sat': 7.91, 'checklist': 84.0,
    prev: { mrr: 40402.29, profit: 24.24 }, against: "prior week", n: {"client-sat": 3, "colleague-perf": 26, "colleague-sat": 17, "checklist": [126, 150]} },
  MTD: { mrr: 170400.0, profit: 22.42, 'client-sat': 8.8, 'colleague-perf': 4.3, 'colleague-sat': 8.1, 'checklist': 78.03,
    prev: { mrr: 152000, profit: 23.09 }, against: "August", n: {"client-sat": 9, "colleague-perf": 26, "colleague-sat": 24, "checklist": [515, 660]} },
  YTD: { mrr: 1162400, profit: 21.87, 'client-sat': 8.57, 'colleague-perf': 4.16, 'colleague-sat': 8.29, 'checklist': 75.36,
    prev: { mrr: 103000, profit: 20.97 }, against: "January", n: {"client-sat": 79, "colleague-perf": 181, "colleague-sat": 202, "checklist": [3783, 5020]} }
};

/* Year to date has no window of its own shape to sit against, so the two
   growth measures compare September with January instead. */
var YTD_NOW = { mrr: 170400, profit: 22.42 };
