/* Detail page data. Placeholder throughout, but it reconciles. */
var DETAIL = {
 "mrr": {
  "id": "mrr",
  "intro": "Where the £170,400 comes from: fourteen retainers, what was signed and lost this month, and which accounts look shaky.",
  "stats": [
   {
    "label": "Active clients",
    "value": "14",
    "sub": "2 signed, 1 lost this month",
    "tone": "pos"
   },
   {
    "label": "Average retainer",
    "value": "£12,171",
    "sub": "Up £479 on August",
    "tone": "pos"
   },
   {
    "label": "Net new MRR",
    "value": "£18,400",
    "sub": "Best month of the year",
    "tone": "pos"
   },
   {
    "label": "Client churn",
    "value": "7.7%",
    "sub": "1 of 13 accounts, £6,200 gone",
    "tone": "neg"
   },
   {
    "label": "MRR at risk",
    "value": "£17,700",
    "sub": "2 accounts flagged, 10.4% of the book",
    "tone": "neg"
   }
  ],
  "sections": [
   {
    "title": "Twelve months of movement",
    "kind": "trends",
    "note": "Money in the sparklines is in thousands, apart from average retainer.",
    "trends": [
     {
      "name": "MRR",
      "value": "£170,400",
      "deltaDir": "up",
      "deltaText": "£18,400",
      "deltaGood": true,
      "series": [
       92000,
       96000,
       94000,
       103000,
       110000,
       118000,
       121000,
       119000,
       128000,
       141000,
       152000,
       170400
      ],
      "lo": 68480.0,
      "hi": 193920.0
     },
     {
      "name": "New clients signed",
      "value": "2",
      "deltaDir": "up",
      "deltaText": "1",
      "deltaGood": true,
      "series": [
       7,
       0,
       0,
       1,
       1,
       1,
       1,
       0,
       1,
       2,
       1,
       2
      ],
      "lo": -2.1,
      "hi": 9.1
     },
     {
      "name": "Clients churned",
      "value": "1",
      "deltaDir": "up",
      "deltaText": "1",
      "deltaGood": false,
      "series": [
       0,
       1,
       1,
       1,
       0,
       1,
       1,
       1,
       0,
       1,
       0,
       1
      ],
      "lo": -1,
      "hi": 2
     },
     {
      "name": "Net new MRR",
      "value": "£18,400",
      "deltaDir": "up",
      "deltaText": "£7,400",
      "deltaGood": true,
      "series": [
       0,
       4000,
       -2000,
       9000,
       7000,
       8000,
       3000,
       -2000,
       9000,
       13000,
       11000,
       18400
      ],
      "lo": -8120.0,
      "hi": 24520.0
     },
     {
      "name": "Average retainer",
      "value": "£12,171",
      "deltaDir": "up",
      "deltaText": "£479",
      "deltaGood": true,
      "series": [
       7667,
       8727,
       9400,
       10300,
       10000,
       10727,
       11000,
       11900,
       11636,
       11750,
       11692,
       12171
      ],
      "lo": 6315.8,
      "hi": 13522.2
     },
     {
      "name": "New business won, monthly value",
      "value": "£17,300",
      "deltaDir": "up",
      "deltaText": "£9,750",
      "deltaGood": true,
      "series": [
       48400,
       0,
       0,
       8100,
       7100,
       9600,
       7500,
       0,
       6800,
       16300,
       7550,
       17300
      ],
      "lo": -14520.0,
      "hi": 62920.0
     },
     {
      "name": "Expansion from existing clients",
      "value": "£7,300",
      "deltaDir": "up",
      "deltaText": "£3,850",
      "deltaGood": true,
      "series": [
       0,
       8300,
       5200,
       9300,
       800,
       8200,
       2150,
       3900,
       2200,
       3500,
       3450,
       7300
      ],
      "lo": -2790.0,
      "hi": 12090.0
     },
     {
      "name": "MRR lost to churn",
      "value": "£6,200",
      "deltaDir": "up",
      "deltaText": "£6,200",
      "deltaGood": false,
      "series": [
       0,
       4300,
       7200,
       8400,
       0,
       9800,
       6600,
       5900,
       0,
       6800,
       0,
       6200
      ],
      "lo": -2940.0,
      "hi": 12740.0
     }
    ]
   },
   {
    "title": "Every client on the book",
    "kind": "table",
    "note": "The two at risk accounts carry £17,700 between them, 10.4% of the book.",
    "columns": [
     "Client",
     "Pod",
     "Monthly retainer",
     "Months with NSY",
     "Status"
    ],
    "rows": [
     {
      "cells": [
       "Northlight Nutrition",
       "Pod 1",
       "£18,500",
       "34",
       "Growing"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Ovis Skin",
       "Pod 1",
       "£14,200",
       "22",
       "Steady"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Halcyon Sleep",
       "Pod 1",
       "£12,400",
       "9",
       "Growing"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Braemar Supplements",
       "Pod 1",
       "£9,500",
       "6",
       "At risk"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Fernway Wellness",
       "Pod 2",
       "£16,800",
       "28",
       "Steady"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Tonic and Thorn",
       "Pod 2",
       "£13,500",
       "12",
       "Growing"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Vireo Health",
       "Pod 2",
       "£11,200",
       "8",
       "Steady"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Sable Labs",
       "Pod 2",
       "£9,800",
       "1",
       "Growing"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Kestrel Fitness",
       "Pod 3",
       "£15,400",
       "16",
       "Growing"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Lumen Greens",
       "Pod 3",
       "£12,100",
       "7",
       "Steady"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Marrow and Co",
       "Pod 3",
       "£8,200",
       "3",
       "At risk"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Ridgeline Protein",
       "Pod 4",
       "£11,900",
       "3",
       "Steady"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Sonder Skincare",
       "Pod 4",
       "£9,400",
       "2",
       "Steady"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Wildroot Botanics",
       "Pod 4",
       "£7,500",
       "1",
       "Steady"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Total",
       "14 clients",
       "£170,400",
       "",
       ""
      ],
      "tone": "none"
     }
    ]
   },
   {
    "title": "MRR by pod",
    "kind": "table",
    "note": "Two of the four largest accounts sit in Pod 1.",
    "columns": [
     "Pod",
     "Lead",
     "Clients",
     "MRR",
     "Share of total"
    ],
    "rows": [
     {
      "cells": [
       "Pod 1",
       "Maya R",
       "4",
       "£54,600",
       "32.0%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Pod 2",
       "Callum B",
       "4",
       "£51,300",
       "30.1%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Pod 3",
       "Priya N",
       "3",
       "£35,700",
       "21.0%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Pod 4",
       "Tom H",
       "3",
       "£28,800",
       "16.9%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Total",
       "",
       "14",
       "£170,400",
       "100%"
      ],
      "tone": "none"
     }
    ]
   }
  ]
 },
 "profit": {
  "id": "operating-profit",
  "intro": "Where September's £170,400 of revenue went, from delivery cost through every overhead line down to £38,200 of operating profit.",
  "stats": [
   {
    "label": "Operating margin",
    "value": "22.4%",
    "sub": "Down from 23.1% in August, revenue grew faster than profit",
    "tone": "neg"
   },
   {
    "label": "Delivery margin",
    "value": "61.8%",
    "sub": "5.4 points up on last October",
    "tone": "pos"
   },
   {
    "label": "Delivery margin in pounds",
    "value": "£105,307",
    "sub": "£3,759 more than August",
    "tone": "pos"
   },
   {
    "label": "Total overheads",
    "value": "£67,107",
    "sub": "39.4% of revenue, up £659",
    "tone": "neg"
   }
  ],
  "sections": [
   {
    "title": "The profit bridge, September",
    "kind": "table",
    "note": "Every percentage is of revenue. Take the six overhead lines off 61.8% and you land on 22.4%.",
    "columns": [
     "Line",
     "Pounds",
     "% of revenue"
    ],
    "rows": [
     {
      "cells": [
       "Revenue",
       "£170,400",
       "100.0%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Less delivery cost",
       "£65,093",
       "38.2%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Delivery margin (subtotal)",
       "£105,307",
       "61.8%"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Less leadership and ops payroll",
       "£34,300",
       "20.1%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Less software and tooling",
       "£6,240",
       "3.7%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Less office and equipment",
       "£11,400",
       "6.7%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Less marketing and new business",
       "£8,600",
       "5.0%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Less professional fees",
       "£4,250",
       "2.5%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Less other overheads",
       "£2,317",
       "1.4%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Total overheads, the six lines above",
       "£67,107",
       "39.4%"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Operating profit (total)",
       "£38,200",
       "22.4%"
      ],
      "tone": "pos"
     }
    ]
   },
   {
    "title": "What delivery cost is made of",
    "kind": "table",
    "note": "These two payroll lines cover the 24 people working on client accounts.",
    "columns": [
     "Delivery cost line",
     "Pounds",
     "% of revenue",
     "Share of delivery cost"
    ],
    "rows": [
     {
      "cells": [
       "Editor payroll, 16 people",
       "£33,180",
       "19.5%",
       "51.0%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Strategist payroll, 8 people",
       "£20,620",
       "12.1%",
       "31.7%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Contractor spend",
       "£9,400",
       "5.5%",
       "14.4%"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Software and licences used in delivery",
       "£1,893",
       "1.1%",
       "2.9%"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Total delivery cost",
       "£65,093",
       "38.2%",
       "100.0%"
      ],
      "tone": "none"
     }
    ]
   },
   {
    "title": "What overheads are made of",
    "kind": "table",
    "note": "Six people sit in that payroll line, you included.",
    "columns": [
     "Overhead line",
     "Pounds",
     "% of revenue",
     "Change on August"
    ],
    "rows": [
     {
      "cells": [
       "Leadership and ops payroll, 6 people",
       "£34,300",
       "20.1%",
       "Up £1,150"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Software and tooling",
       "£6,240",
       "3.7%",
       "Up £260"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Office and equipment",
       "£11,400",
       "6.7%",
       "Up £1,540"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Marketing and new business",
       "£8,600",
       "5.0%",
       "Down £1,640"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Professional fees",
       "£4,250",
       "2.5%",
       "Down £630"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Other",
       "£2,317",
       "1.4%",
       "Down £21"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Total overheads",
       "£67,107",
       "39.4%",
       "Up £659"
      ],
      "tone": "neg"
     }
    ]
   },
   {
    "title": "Twelve months to September",
    "kind": "trends",
    "note": "Revenue per head falls every time you add a head.",
    "trends": [
     {
      "name": "Operating profit",
      "value": "£38,200",
      "deltaDir": "up",
      "deltaText": "8.8%",
      "deltaGood": true,
      "series": [
       18.2,
       19.4,
       18.8,
       21.6,
       23.1,
       25.4,
       26.2,
       24.8,
       28.6,
       31.2,
       35.1,
       38.2
      ],
      "lo": 15,
      "hi": 42
     },
     {
      "name": "Delivery margin",
      "value": "61.8%",
      "deltaDir": "up",
      "deltaText": "0.7 pts",
      "deltaGood": true,
      "series": [
       56.4,
       56.9,
       55.8,
       57.2,
       58.1,
       58.6,
       59,
       58.2,
       59.7,
       60.4,
       61.1,
       61.8
      ],
      "lo": 54,
      "hi": 63
     },
     {
      "name": "Payroll as a share of revenue",
      "value": "51.7%",
      "deltaDir": "down",
      "deltaText": "0.7 pts",
      "deltaGood": true,
      "series": [
       57.8,
       57.2,
       58.1,
       56.4,
       55.9,
       55.1,
       54.6,
       55.3,
       53.8,
       53.1,
       52.4,
       51.7
      ],
      "lo": 50,
      "hi": 60
     },
     {
      "name": "Overheads",
      "value": "£67,107",
      "deltaDir": "up",
      "deltaText": "£659",
      "deltaGood": false,
      "series": [
       54,
       55.4,
       52,
       57.6,
       60.5,
       62,
       63.8,
       61.5,
       65.7,
       67.5,
       66.4,
       67.1
      ],
      "lo": 48,
      "hi": 70
     },
     {
      "name": "Revenue per head",
      "value": "£5,680",
      "deltaDir": "up",
      "deltaText": "£140",
      "deltaGood": true,
      "series": [
       4923,
       5058,
       4696,
       5126,
       5139,
       5329,
       5450,
       5114,
       5445,
       5634,
       5540,
       5680
      ],
      "lo": 4500,
      "hi": 5900
     }
    ]
   }
  ]
 },
 "client-sat": {
  "id": "client-satisfaction",
  "intro": "Where the 8.8 comes from: nine of fourteen clients returned a form this month, and the five who did not are listed below.",
  "stats": [
   {
    "label": "Company score",
    "value": "8.8 / 10",
    "sub": "Target 9.0, best month of the year",
    "tone": "neg"
   },
   {
    "label": "Forms returned",
    "value": "9 of 14",
    "sub": "One fewer than August, and five clients have now gone quiet",
    "tone": "neg"
   },
   {
    "label": "Lowest question",
    "value": "7.6",
    "sub": "Communication, down from 7.8 last month",
    "tone": "neg"
   },
   {
    "label": "Clients below target",
    "value": "5",
    "sub": "Fernway Wellness lowest at 8.0, then Vireo Health, Lumen Greens, Sonder Skincare and Kestrel Fitness",
    "tone": "neg"
   },
   {
    "label": "Retainer value not scored",
    "value": "£48,500",
    "sub": "Monthly fees of the five who did not reply",
    "tone": "neg"
   }
  ],
  "sections": [
   {
    "title": "Satisfaction by pod",
    "kind": "table",
    "note": "The average of the clients in each pod who returned a form.",
    "columns": [
     "Pod",
     "Lead",
     "Clients",
     "Forms returned",
     "Score",
     "Against target"
    ],
    "rows": [
     {
      "cells": [
       "Pod 1",
       "Maya R",
       "4",
       "3 of 4",
       "9.2",
       "+0.7"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Pod 2",
       "Callum B",
       "4",
       "2 of 4",
       "8.1",
       "-0.4"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Pod 3",
       "Priya N",
       "3",
       "2 of 3",
       "8.8",
       "+0.3"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Pod 4",
       "Tom H",
       "3",
       "2 of 3",
       "8.9",
       "+0.4"
      ],
      "tone": "pos"
     }
    ]
   },
   {
    "title": "Five clients did not return the form",
    "kind": "table",
    "note": "Two of these signed this month and have not been sent a form yet.",
    "columns": [
     "Client",
     "Pod",
     "Retainer per month",
     "Last returned a form"
    ],
    "rows": [
     {
      "cells": [
       "Tonic and Thorn",
       "Pod 2",
       "£13,500",
       "June, three months ago"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Sable Labs",
       "Pod 2",
       "£9,800",
       "Not yet, signed this month"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Wildroot Botanics",
       "Pod 4",
       "£7,500",
       "Not yet, signed this month"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Braemar Supplements",
       "Pod 1",
       "£9,500",
       "August, last month"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Marrow and Co",
       "Pod 3",
       "£8,200",
       "August, last month"
      ],
      "tone": "none"
     }
    ]
   },
   {
    "title": "Question scores by client",
    "kind": "grid",
    "note": "Communication is the weakest column, and the two Pod 2 clients pull it down hardest.",
    "columns": [
     "Client",
     "Creative quality",
     "Communication",
     "Speed of delivery",
     "Results against goals",
     "Understanding of our brand",
     "Value for money",
     "Average"
    ],
    "rowLabels": [
     "Northlight Nutrition",
     "Ovis Skin",
     "Halcyon Sleep",
     "Fernway Wellness",
     "Vireo Health",
     "Kestrel Fitness",
     "Lumen Greens",
     "Ridgeline Protein",
     "Sonder Skincare"
    ],
    "sublabels": [
     "Pod 1",
     "Pod 1",
     "Pod 1",
     "Pod 2",
     "Pod 2",
     "Pod 3",
     "Pod 3",
     "Pod 4",
     "Pod 4"
    ],
    "values": [
     [
      9.7,
      8.4,
      9.1,
      9.4,
      9.5,
      9.1,
      9.2
     ],
     [
      9.8,
      8.6,
      9.2,
      9.5,
      9.6,
      9.1,
      9.3
     ],
     [
      9.6,
      8.2,
      9,
      9.3,
      9.5,
      9,
      9.1
     ],
     [
      9,
      5.8,
      7.8,
      8.4,
      8.6,
      8.4,
      8
     ],
     [
      9.1,
      6.2,
      7.8,
      8.8,
      8.8,
      8.5,
      8.2
     ],
     [
      9.4,
      7.8,
      8.5,
      9.2,
      9.3,
      9.2,
      8.9
     ],
     [
      9.2,
      7.6,
      8.4,
      8.9,
      9.1,
      9,
      8.7
     ],
     [
      9.5,
      8.3,
      9,
      9.3,
      9.4,
      9.1,
      9.1
     ],
     [
      9.3,
      7.5,
      8.6,
      9.1,
      9,
      8.7,
      8.7
     ]
    ],
    "bad": 8.0,
    "good": 9.0
   },
   {
    "title": "Twelve month view",
    "kind": "trends",
    "note": "Communication has fallen every month since February while creative quality has held.",
    "trends": [
     {
      "name": "Company score",
      "value": "8.8",
      "deltaDir": "up",
      "deltaText": "0.3",
      "deltaGood": true,
      "series": [
       8.2,
       8.3,
       8.1,
       8.4,
       8.5,
       8.4,
       8.6,
       8.5,
       8.7,
       8.6,
       8.5,
       8.8
      ],
      "lo": 7.5,
      "hi": 9.5
     },
     {
      "name": "Forms returned",
      "value": "9",
      "deltaDir": "down",
      "deltaText": "1",
      "deltaGood": false,
      "series": [
       9,
       10,
       9,
       7,
       9,
       9,
       9,
       7,
       10,
       9,
       10,
       9
      ],
      "lo": 5,
      "hi": 12
     },
     {
      "name": "Creative quality",
      "value": "9.4",
      "deltaDir": "up",
      "deltaText": "0.1",
      "deltaGood": true,
      "series": [
       9,
       9.1,
       8.9,
       9.1,
       9.2,
       9.2,
       9.3,
       9.2,
       9.4,
       9.3,
       9.3,
       9.4
      ],
      "lo": 8.5,
      "hi": 10
     },
     {
      "name": "Communication",
      "value": "7.6",
      "deltaDir": "down",
      "deltaText": "0.2",
      "deltaGood": false,
      "series": [
       8.4,
       8.3,
       8.2,
       8.4,
       8.5,
       8.3,
       8.2,
       8.1,
       8,
       7.9,
       7.8,
       7.6
      ],
      "lo": 7,
      "hi": 9
     },
     {
      "name": "Speed of delivery",
      "value": "8.6",
      "deltaDir": "up",
      "deltaText": "0.2",
      "deltaGood": true,
      "series": [
       8.1,
       8.2,
       7.9,
       8.3,
       8.5,
       8.4,
       8.6,
       8.5,
       8.7,
       8.6,
       8.4,
       8.6
      ],
      "lo": 7.5,
      "hi": 9.5
     }
    ]
   }
  ]
 },
 "colleague-perf": {
  "id": "colleague-performance",
  "intro": "Every person is graded 1 to 5 each week on five behaviours. September, broken down by pod and then by role.",
  "stats": [
   {
    "label": "Company average",
    "value": "4.3",
    "sub": "Target 4.0. Up from 4.2 in August.",
    "tone": "pos"
   },
   {
    "label": "People graded this week",
    "value": "26 of 30",
    "sub": "All four gaps sit outside the pods",
    "tone": "neg"
   },
   {
    "label": "Graded below 3",
    "value": "2",
    "sub": "Sofia L in Pod 2, Marcus E in Pod 4",
    "tone": "neg"
   },
   {
    "label": "At 4.5 or above",
    "value": "13",
    "sub": "Half of everyone who was graded",
    "tone": "flat"
   }
  ],
  "sections": [
   {
    "title": "By pod",
    "kind": "table",
    "note": "Pod 2 and Pod 4 each carry one person below 3.",
    "columns": [
     "Pod",
     "Lead",
     "People",
     "Graded this week",
     "Average",
     "Against target"
    ],
    "rows": [
     {
      "cells": [
       "Pod 1",
       "Maya R",
       "6",
       "6",
       "4.5",
       "+0.5"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Pod 2",
       "Callum B",
       "6",
       "6",
       "4.1",
       "+0.1"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Pod 3",
       "Priya N",
       "6",
       "6",
       "4.4",
       "+0.4"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Pod 4",
       "Tom H",
       "6",
       "6",
       "4.1",
       "+0.1"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Outside the pods",
       "No pod lead",
       "6",
       "2",
       "4.6",
       "+0.6 on 2 people"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Company",
       "",
       "30",
       "26",
       "4.3",
       "+0.3"
      ],
      "tone": "pos"
     }
    ]
   },
   {
    "title": "Creative strategists",
    "kind": "grid",
    "note": "Sofia L is the one strategist below 3. Speed is the lowest behaviour for seven of the eight.",
    "columns": [
     "Strategist",
     "Ownership",
     "Proactive",
     "Performance driven",
     "Reliable",
     "Speed",
     "Overall"
    ],
    "rowLabels": [
     "Maya R",
     "Jonah P",
     "Callum B",
     "Sofia L",
     "Priya N",
     "Dan W",
     "Tom H",
     "Grace A"
    ],
    "sublabels": [
     "Pod 1 lead",
     "Pod 1",
     "Pod 2 lead",
     "Pod 2",
     "Pod 3 lead",
     "Pod 3",
     "Pod 4 lead",
     "Pod 4"
    ],
    "values": [
     [
      5,
      4.9,
      4.8,
      5,
      4.3,
      4.8
     ],
     [
      4.8,
      4.7,
      4.6,
      4.8,
      4.1,
      4.6
     ],
     [
      4.7,
      4.5,
      4.8,
      4.8,
      4.2,
      4.6
     ],
     [
      2.9,
      2.6,
      2.8,
      3.1,
      2.6,
      2.8
     ],
     [
      4.9,
      4.8,
      4.7,
      4.9,
      4.2,
      4.7
     ],
     [
      4.6,
      4.8,
      4.6,
      4.7,
      4.3,
      4.6
     ],
     [
      4.8,
      4.6,
      4.7,
      4.7,
      4.2,
      4.6
     ],
     [
      4.4,
      4.1,
      4.4,
      4.6,
      4,
      4.3
     ]
    ],
    "bad": 3.5,
    "good": 4.5
   },
   {
    "title": "Video editors",
    "kind": "grid",
    "note": "Marcus E is below 3 on three of the five behaviours. Speed is the weakest column in all four pods.",
    "columns": [
     "Editor",
     "Ownership",
     "Proactive",
     "Performance driven",
     "Reliable",
     "Speed",
     "Overall"
    ],
    "rowLabels": [
     "Leo B",
     "Amira D",
     "Kit F",
     "Rosa M",
     "Sam O",
     "Yusuf A",
     "Bea C",
     "Niall G",
     "Iris T",
     "Hugo L",
     "Freya J",
     "Otto K",
     "Nina S",
     "Marcus E",
     "Lena H",
     "Arun V"
    ],
    "sublabels": [
     "Pod 1",
     "Pod 1",
     "Pod 1",
     "Pod 1",
     "Pod 2",
     "Pod 2",
     "Pod 2",
     "Pod 2",
     "Pod 3",
     "Pod 3",
     "Pod 3",
     "Pod 3",
     "Pod 4",
     "Pod 4",
     "Pod 4",
     "Pod 4"
    ],
    "values": [
     [
      4.7,
      4.5,
      4.7,
      4.8,
      4.3,
      4.6
     ],
     [
      4.5,
      4.3,
      4.4,
      4.7,
      4.1,
      4.4
     ],
     [
      4.2,
      3.9,
      4.1,
      4.5,
      3.8,
      4.1
     ],
     [
      4.6,
      4.4,
      4.5,
      4.8,
      4.2,
      4.5
     ],
     [
      4.6,
      4.4,
      4.6,
      4.7,
      4.2,
      4.5
     ],
     [
      4.4,
      4.2,
      4.3,
      4.6,
      4,
      4.3
     ],
     [
      4.1,
      3.8,
      4,
      4.4,
      3.7,
      4
     ],
     [
      4.5,
      4.2,
      4.4,
      4.7,
      4.2,
      4.4
     ],
     [
      4.7,
      4.6,
      4.6,
      4.8,
      4.3,
      4.6
     ],
     [
      4.2,
      4,
      4.1,
      4.4,
      3.8,
      4.1
     ],
     [
      4.6,
      4.4,
      4.5,
      4.7,
      4.3,
      4.5
     ],
     [
      4,
      3.7,
      3.9,
      4.3,
      3.6,
      3.9
     ],
     [
      4.3,
      4.1,
      4.2,
      4.5,
      3.9,
      4.2
     ],
     [
      3,
      2.8,
      2.9,
      3.2,
      2.6,
      2.9
     ],
     [
      4.5,
      4.3,
      4.4,
      4.6,
      4.2,
      4.4
     ],
     [
      4.3,
      4,
      4.2,
      4.5,
      4,
      4.2
     ]
    ],
    "bad": 3.5,
    "good": 4.5
   },
   {
    "title": "Outside the pods",
    "kind": "grid",
    "note": "A blank row means no grade was taken, not a low score. Four of these six are the whole company gap.",
    "columns": [
     "Name",
     "Ownership",
     "Proactive",
     "Performance driven",
     "Reliable",
     "Speed",
     "Overall"
    ],
    "rowLabels": [
     "Nativ",
     "Aisha K",
     "Rhys M",
     "Elena V",
     "Oscar T",
     "Nadia S"
    ],
    "sublabels": [
     "Owner, grades others",
     "Creative Lead",
     "Editing Lead",
     "Ops Manager, not graded",
     "Motion Designer, not graded",
     "Creative Producer, not graded"
    ],
    "values": [
     [
      null,
      null,
      null,
      null,
      null,
      null
     ],
     [
      4.9,
      4.8,
      4.7,
      4.8,
      4.3,
      4.7
     ],
     [
      4.6,
      4.4,
      4.5,
      4.8,
      4.2,
      4.5
     ],
     [
      null,
      null,
      null,
      null,
      null,
      null
     ],
     [
      null,
      null,
      null,
      null,
      null,
      null
     ],
     [
      null,
      null,
      null,
      null,
      null,
      null
     ]
    ],
    "bad": 3.5,
    "good": 4.5,
    "nullLabel": "Not graded"
   },
   {
    "title": "Twelve months",
    "kind": "trends",
    "note": "October to September. People graded and grades below 3 are the average week in each month.",
    "trends": [
     {
      "name": "Company average",
      "value": "4.3",
      "deltaDir": "up",
      "deltaText": "0.1",
      "deltaGood": true,
      "series": [
       3.8,
       3.9,
       3.9,
       4,
       4.1,
       4,
       4.2,
       4.1,
       4.2,
       4.3,
       4.2,
       4.3
      ],
      "lo": 3.5,
      "hi": 4.6
     },
     {
      "name": "People graded each week",
      "value": "26",
      "deltaDir": "up",
      "deltaText": "5",
      "deltaGood": true,
      "series": [
       14,
       15,
       13,
       16,
       17,
       16,
       22,
       21,
       24,
       18,
       21,
       26
      ],
      "lo": 11,
      "hi": 28
     },
     {
      "name": "Grades below 3",
      "value": "2",
      "deltaDir": "down",
      "deltaText": "1",
      "deltaGood": true,
      "series": [
       2,
       3,
       2,
       3,
       2,
       3,
       2,
       3,
       2,
       1,
       3,
       2
      ],
      "lo": -1,
      "hi": 5
     },
     {
      "name": "Strategist average",
      "value": "4.4",
      "deltaDir": "up",
      "deltaText": "0.1",
      "deltaGood": true,
      "series": [
       3.9,
       4,
       4,
       4.1,
       4.2,
       4.1,
       4.3,
       4.2,
       4.3,
       4.4,
       4.3,
       4.4
      ],
      "lo": 3.6,
      "hi": 4.7
     },
     {
      "name": "Editor average",
      "value": "4.2",
      "deltaDir": "up",
      "deltaText": "0.1",
      "deltaGood": true,
      "series": [
       3.7,
       3.8,
       3.8,
       3.9,
       4,
       3.9,
       4.1,
       4,
       4.1,
       4.2,
       4.1,
       4.2
      ],
      "lo": 3.4,
      "hi": 4.5
     }
    ]
   }
  ]
 },
 "colleague-sat": {
  "id": "colleague-satisfaction",
  "intro": "Where the 8.1 comes from, broken to pod and then to the 24 people who answered, with the six who did not.",
  "stats": [
   {
    "label": "Company score",
    "value": "8.1 / 10",
    "sub": "Target 8.0. Down 0.2 on August.",
    "tone": "pos"
   },
   {
    "label": "Responses returned",
    "value": "24 of 30",
    "sub": "80 per cent, level with August",
    "tone": "neg"
   },
   {
    "label": "Lowest scoring question",
    "value": "Workload 6.9",
    "sub": "Lowest of the six questions.",
    "tone": "neg"
   },
   {
    "label": "People below 7",
    "value": "4",
    "sub": "All four are in Pod 3.",
    "tone": "neg"
   }
  ],
  "sections": [
   {
    "title": "By pod",
    "kind": "table",
    "note": "Pod 3's score rests on four replies out of six.",
    "columns": [
     "Pod",
     "Lead",
     "People",
     "Responded",
     "Score",
     "Against target"
    ],
    "rows": [
     {
      "cells": [
       "Pod 1",
       "Maya R",
       "6",
       "6 of 6",
       "8.6",
       "+0.6"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Pod 2",
       "Callum B",
       "6",
       "5 of 6",
       "8.2",
       "+0.2"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Pod 3",
       "Priya N",
       "6",
       "4 of 6",
       "6.7",
       "-1.3"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Pod 4",
       "Tom H",
       "6",
       "6 of 6",
       "8.4",
       "+0.4"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Outside pods",
       "Nativ",
       "6",
       "3 of 6",
       "8.2",
       "+0.2"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Company",
       "",
       "30",
       "24 of 30",
       "8.1",
       "+0.1"
      ],
      "tone": "pos"
     }
    ]
   },
   {
    "title": "The six questions, by group",
    "kind": "grid",
    "note": "Workload is the lowest score in all five groups, and Pod 3 is the lowest group on all six questions.",
    "columns": [
     "Group",
     "Workload",
     "Clarity of role",
     "Support from my lead",
     "Growth and progression",
     "Tools and process",
     "Would recommend NSY",
     "Average"
    ],
    "rowLabels": [
     "Pod 1",
     "Pod 2",
     "Pod 3",
     "Pod 4",
     "Outside pods"
    ],
    "sublabels": [
     "Maya R, 6 of 6",
     "Callum B, 5 of 6",
     "Priya N, 4 of 6",
     "Tom H, 6 of 6",
     "Nativ, 3 of 6"
    ],
    "values": [
     [
      7.5,
      9,
      9.1,
      8.2,
      8.8,
      9,
      8.6
     ],
     [
      7,
      8.6,
      8.5,
      8.1,
      8.5,
      8.5,
      8.2
     ],
     [
      5.2,
      7.1,
      6.7,
      6.3,
      7.3,
      7.6,
      6.7
     ],
     [
      7.4,
      8.8,
      8.9,
      7.9,
      8.6,
      8.8,
      8.4
     ],
     [
      6.8,
      8.6,
      8.1,
      8.3,
      8.5,
      8.9,
      8.2
     ]
    ],
    "bad": 7.5,
    "good": 8.5
   },
   {
    "title": "Every person",
    "kind": "table",
    "columns": [
     "Person",
     "Pod",
     "Role",
     "Score",
     "Against target"
    ],
    "rows": [
     {
      "cells": [
       "Maya R",
       "Pod 1",
       "Strategist, pod lead",
       "9.0",
       "+1.0"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Jonah P",
       "Pod 1",
       "Strategist",
       "8.8",
       "+0.8"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Leo B",
       "Pod 1",
       "Editor",
       "8.7",
       "+0.7"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Amira D",
       "Pod 1",
       "Editor",
       "8.5",
       "+0.5"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Kit F",
       "Pod 1",
       "Editor",
       "8.3",
       "+0.3"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Rosa M",
       "Pod 1",
       "Editor",
       "8.3",
       "+0.3"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Callum B",
       "Pod 2",
       "Strategist, pod lead",
       "8.8",
       "+0.8"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Sofia L",
       "Pod 2",
       "Strategist",
       "8.5",
       "+0.5"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Sam O",
       "Pod 2",
       "Editor",
       "8.2",
       "+0.2"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Yusuf A",
       "Pod 2",
       "Editor",
       "7.9",
       "-0.1"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Bea C",
       "Pod 2",
       "Editor",
       "7.6",
       "-0.4"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Niall G",
       "Pod 2",
       "Editor",
       "Not returned",
       "n/a"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Priya N",
       "Pod 3",
       "Strategist, pod lead",
       "6.9",
       "-1.1"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Dan W",
       "Pod 3",
       "Strategist",
       "6.9",
       "-1.1"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Iris T",
       "Pod 3",
       "Editor",
       "6.6",
       "-1.4"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Freya J",
       "Pod 3",
       "Editor",
       "6.4",
       "-1.6"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Hugo L",
       "Pod 3",
       "Editor",
       "Not returned",
       "n/a"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Otto K",
       "Pod 3",
       "Editor",
       "Not returned",
       "n/a"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Tom H",
       "Pod 4",
       "Strategist, pod lead",
       "8.9",
       "+0.9"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Grace A",
       "Pod 4",
       "Strategist",
       "8.7",
       "+0.7"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Nina S",
       "Pod 4",
       "Editor",
       "8.5",
       "+0.5"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Marcus E",
       "Pod 4",
       "Editor",
       "8.3",
       "+0.3"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Lena H",
       "Pod 4",
       "Editor",
       "8.1",
       "+0.1"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Arun V",
       "Pod 4",
       "Editor",
       "7.9",
       "-0.1"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Aisha K",
       "Outside pods",
       "Creative Lead",
       "8.6",
       "+0.6"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Elena V",
       "Outside pods",
       "Ops Manager",
       "8.2",
       "+0.2"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Nadia S",
       "Outside pods",
       "Creative Producer",
       "7.8",
       "-0.2"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Nativ",
       "Outside pods",
       "Owner",
       "Not returned",
       "n/a"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Rhys M",
       "Outside pods",
       "Editing Lead",
       "Not returned",
       "n/a"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Oscar T",
       "Outside pods",
       "Motion Designer",
       "Not returned",
       "n/a"
      ],
      "tone": "none"
     }
    ],
    "caveat": "Putting a name against a score ends the anonymous pulse: from here people are filling in a form they know you will read next to their name, and named answers come back higher and blander than anonymous ones."
   },
   {
    "title": "Twelve months",
    "kind": "trends",
    "note": "All four measures moved the wrong way in September. Workload has fallen every month since February.",
    "trends": [
     {
      "name": "Company score",
      "value": "8.1",
      "deltaDir": "down",
      "deltaText": "0.2",
      "deltaGood": false,
      "series": [
       7.6,
       7.8,
       7.9,
       8,
       8.2,
       8.3,
       8.4,
       8.5,
       8.4,
       8.3,
       8.3,
       8.1
      ],
      "lo": 7,
      "hi": 9
     },
     {
      "name": "Responses returned",
      "value": "24",
      "deltaDir": "flat",
      "deltaText": "level",
      "deltaGood": false,
      "series": [
       17,
       20,
       19,
       19,
       20,
       20,
       22,
       24,
       26,
       23,
       24,
       24
      ],
      "lo": 15,
      "hi": 28
     },
     {
      "name": "Workload score",
      "value": "6.9",
      "deltaDir": "down",
      "deltaText": "0.2",
      "deltaGood": false,
      "series": [
       7.9,
       8,
       7.8,
       7.9,
       8,
       7.9,
       7.8,
       7.6,
       7.4,
       7.2,
       7.1,
       6.9
      ],
      "lo": 6,
      "hi": 9
     },
     {
      "name": "Would recommend NSY score",
      "value": "8.6",
      "deltaDir": "down",
      "deltaText": "0.2",
      "deltaGood": false,
      "series": [
       8.2,
       8.3,
       8.4,
       8.5,
       8.7,
       8.8,
       8.9,
       9,
       8.9,
       8.8,
       8.8,
       8.6
      ],
      "lo": 7.5,
      "hi": 9.5
     }
    ]
   }
  ]
 },
 "checklist": {
  "id": "eod-checklist-completion",
  "intro": "Thirty people file a checklist at the end of each working day. In September 515 of 660 arrived, so 145 did not.",
  "stats": [
   {
    "label": "September completion",
    "value": "78%",
    "sub": "Target 100%",
    "tone": "neg"
   },
   {
    "label": "Checklists missed",
    "value": "145",
    "sub": "515 filed of 660 due",
    "tone": "neg"
   },
   {
    "label": "Days the full team filed",
    "value": "2 of 22",
    "sub": "Same as August",
    "tone": "neg"
   },
   {
    "label": "Checklists naming a blocker",
    "value": "96",
    "sub": "19% of the 515 filed",
    "tone": "flat"
   },
   {
    "label": "Weakest pod",
    "value": "Pod 4 at 59%",
    "sub": "Tom H, 78 filed of 132",
    "tone": "neg"
   }
  ],
  "sections": [
   {
    "title": "By pod",
    "kind": "table",
    "note": "Twenty-two working days each, so 132 checklists due per group.",
    "columns": [
     "Pod",
     "Lead",
     "People",
     "Due",
     "Filed",
     "Completion",
     "Against 100%"
    ],
    "rows": [
     {
      "cells": [
       "Pod 3",
       "Priya N",
       "6",
       "132",
       "117",
       "89%",
       "-11 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "No pod",
       "Nativ",
       "6",
       "132",
       "114",
       "86%",
       "-14 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Pod 1",
       "Maya R",
       "6",
       "132",
       "106",
       "80%",
       "-20 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Pod 2",
       "Callum B",
       "6",
       "132",
       "100",
       "76%",
       "-24 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Pod 4",
       "Tom H",
       "6",
       "132",
       "78",
       "59%",
       "-41 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "All 30",
       "",
       "30",
       "660",
       "515",
       "78%",
       "-22 pts"
      ],
      "tone": "neg"
     }
    ]
   },
   {
    "title": "By person, all 30",
    "kind": "table",
    "note": "Fourteen of the thirty are under 80%.",
    "columns": [
     "Person",
     "Pod",
     "Role",
     "Filed of due",
     "Completion",
     "Against 100%"
    ],
    "rows": [
     {
      "cells": [
       "Maya R",
       "Pod 1",
       "Strategist, pod lead",
       "21 of 22",
       "95%",
       "-5 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Jonah P",
       "Pod 1",
       "Strategist",
       "19 of 22",
       "86%",
       "-14 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Leo B",
       "Pod 1",
       "Editor",
       "18 of 22",
       "82%",
       "-18 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Amira D",
       "Pod 1",
       "Editor",
       "17 of 22",
       "77%",
       "-23 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Kit F",
       "Pod 1",
       "Editor",
       "16 of 22",
       "73%",
       "-27 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Rosa M",
       "Pod 1",
       "Editor",
       "15 of 22",
       "68%",
       "-32 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Callum B",
       "Pod 2",
       "Strategist, pod lead",
       "20 of 22",
       "91%",
       "-9 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Sofia L",
       "Pod 2",
       "Strategist",
       "18 of 22",
       "82%",
       "-18 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Sam O",
       "Pod 2",
       "Editor",
       "17 of 22",
       "77%",
       "-23 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Yusuf A",
       "Pod 2",
       "Editor",
       "16 of 22",
       "73%",
       "-27 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Niall G",
       "Pod 2",
       "Editor",
       "15 of 22",
       "68%",
       "-32 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Bea C",
       "Pod 2",
       "Editor",
       "14 of 22",
       "64%",
       "-36 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Priya N",
       "Pod 3",
       "Strategist, pod lead",
       "22 of 22",
       "100%",
       "On target"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Dan W",
       "Pod 3",
       "Strategist",
       "20 of 22",
       "91%",
       "-9 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Iris T",
       "Pod 3",
       "Editor",
       "20 of 22",
       "91%",
       "-9 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Hugo L",
       "Pod 3",
       "Editor",
       "19 of 22",
       "86%",
       "-14 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Freya J",
       "Pod 3",
       "Editor",
       "18 of 22",
       "82%",
       "-18 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Otto K",
       "Pod 3",
       "Editor",
       "18 of 22",
       "82%",
       "-18 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Tom H",
       "Pod 4",
       "Strategist, pod lead",
       "16 of 22",
       "73%",
       "-27 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Grace A",
       "Pod 4",
       "Strategist",
       "15 of 22",
       "68%",
       "-32 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Nina S",
       "Pod 4",
       "Editor",
       "13 of 22",
       "59%",
       "-41 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Marcus E",
       "Pod 4",
       "Editor",
       "12 of 22",
       "55%",
       "-45 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Lena H",
       "Pod 4",
       "Editor",
       "11 of 22",
       "50%",
       "-50 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Arun V",
       "Pod 4",
       "Editor",
       "11 of 22",
       "50%",
       "-50 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "Elena V",
       "Outside pods",
       "Ops Manager",
       "22 of 22",
       "100%",
       "On target"
      ],
      "tone": "pos"
     },
     {
      "cells": [
       "Rhys M",
       "Outside pods",
       "Editing Lead",
       "21 of 22",
       "95%",
       "-5 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Aisha K",
       "Outside pods",
       "Creative Lead",
       "20 of 22",
       "91%",
       "-9 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Oscar T",
       "Outside pods",
       "Motion Designer",
       "20 of 22",
       "91%",
       "-9 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Nadia S",
       "Outside pods",
       "Creative Producer",
       "19 of 22",
       "86%",
       "-14 pts"
      ],
      "tone": "none"
     },
     {
      "cells": [
       "Nativ",
       "Outside pods",
       "Owner",
       "12 of 22",
       "55%",
       "-45 pts"
      ],
      "tone": "neg"
     },
     {
      "cells": [
       "All 30",
       "",
       "",
       "515 of 660",
       "78%",
       "-22 pts"
      ],
      "tone": "neg"
     }
    ]
   },
   {
    "title": "Twelve months to September",
    "kind": "trends",
    "note": "Editors have sat below strategists in every one of the twelve months.",
    "trends": [
     {
      "name": "Company completion",
      "value": "78%",
      "deltaDir": "up",
      "deltaText": "2 pts",
      "deltaGood": true,
      "series": [
       62,
       65,
       68,
       71,
       69,
       74,
       76,
       73,
       78,
       80,
       76,
       78
      ],
      "lo": 55,
      "hi": 100
     },
     {
      "name": "Editor completion",
      "value": "71%",
      "deltaDir": "up",
      "deltaText": "2 pts",
      "deltaGood": true,
      "series": [
       54,
       57,
       60,
       64,
       62,
       67,
       69,
       66,
       71,
       74,
       69,
       71
      ],
      "lo": 45,
      "hi": 100
     },
     {
      "name": "Strategist completion",
      "value": "86%",
      "deltaDir": "up",
      "deltaText": "1 pt",
      "deltaGood": true,
      "series": [
       72,
       76,
       79,
       81,
       79,
       84,
       85,
       83,
       88,
       90,
       85,
       86
      ],
      "lo": 65,
      "hi": 100
     },
     {
      "name": "Checklists naming a blocker",
      "value": "96",
      "deltaDir": "up",
      "deltaText": "2",
      "deltaGood": true,
      "series": [
       36,
       49,
       48,
       51,
       61,
       66,
       71,
       75,
       77,
       82,
       94,
       96
      ],
      "lo": 18.0,
      "hi": 114.0
     },
     {
      "name": "Days with the full team filed",
      "value": "2",
      "deltaDir": "up",
      "deltaText": "1",
      "deltaGood": false,
      "series": [
       0,
       1,
       0,
       1,
       0,
       2,
       1,
       0,
       1,
       1,
       1,
       2
      ],
      "lo": -1,
      "hi": 3
     }
    ]
   }
  ]
 }
};
