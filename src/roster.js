/* ---------- The shared spine ----------
   Pods, people and clients appear on four of the six KPI pages. They are
   declared once here so the pages cannot contradict each other. Every
   name is invented. Headcount is 30, which is what the pulse and the
   grading counts on the board already assume. */

var PODS = [
  { id: 'p1', name: 'Pod 1', lead: 'Maya R' },
  { id: 'p2', name: 'Pod 2', lead: 'Callum B' },
  { id: 'p3', name: 'Pod 3', lead: 'Priya N' },
  { id: 'p4', name: 'Pod 4', lead: 'Tom H' }
];

/* role: strategist | editor | lead | ops
   Eight creative strategists, four of whom lead a pod. Sixteen video
   editors, four to a pod. Six people sit outside the pods. Thirty in
   total, and the fractional CFO is a contractor so is not counted. */
var PEOPLE = [
  { name: 'Maya R',    role: 'strategist', pod: 'p1', podLead: true },
  { name: 'Jonah P',   role: 'strategist', pod: 'p1' },
  { name: 'Callum B',  role: 'strategist', pod: 'p2', podLead: true },
  { name: 'Sofia L',   role: 'strategist', pod: 'p2' },
  { name: 'Priya N',   role: 'strategist', pod: 'p3', podLead: true },
  { name: 'Dan W',     role: 'strategist', pod: 'p3' },
  { name: 'Tom H',     role: 'strategist', pod: 'p4', podLead: true },
  { name: 'Grace A',   role: 'strategist', pod: 'p4' },

  { name: 'Leo B',     role: 'editor', pod: 'p1' },
  { name: 'Amira D',   role: 'editor', pod: 'p1' },
  { name: 'Kit F',     role: 'editor', pod: 'p1' },
  { name: 'Rosa M',    role: 'editor', pod: 'p1' },
  { name: 'Sam O',     role: 'editor', pod: 'p2' },
  { name: 'Yusuf A',   role: 'editor', pod: 'p2' },
  { name: 'Bea C',     role: 'editor', pod: 'p2' },
  { name: 'Niall G',   role: 'editor', pod: 'p2' },
  { name: 'Iris T',    role: 'editor', pod: 'p3' },
  { name: 'Hugo L',    role: 'editor', pod: 'p3' },
  { name: 'Freya J',   role: 'editor', pod: 'p3' },
  { name: 'Otto K',    role: 'editor', pod: 'p3' },
  { name: 'Nina S',    role: 'editor', pod: 'p4' },
  { name: 'Marcus E',  role: 'editor', pod: 'p4' },
  { name: 'Lena H',    role: 'editor', pod: 'p4' },
  { name: 'Arun V',    role: 'editor', pod: 'p4' },

  { name: 'Nativ',     role: 'lead', pod: null, title: 'Owner' },
  { name: 'Aisha K',   role: 'lead', pod: null, title: 'Creative Lead' },
  { name: 'Rhys M',    role: 'lead', pod: null, title: 'Editing Lead' },
  { name: 'Elena V',   role: 'ops',  pod: null, title: 'Ops Manager' },
  { name: 'Oscar T',   role: 'ops',  pod: null, title: 'Motion Designer' },
  { name: 'Nadia S',   role: 'ops',  pod: null, title: 'Creative Producer' }
];

/* Fourteen active retainers. Health and wellness DTC, which is the
   book NSY actually sells into. */
var CLIENTS = [
  { name: 'Northlight Nutrition', pod: 'p1' },
  { name: 'Ovis Skin',            pod: 'p1' },
  { name: 'Halcyon Sleep',        pod: 'p1' },
  { name: 'Braemar Supplements',  pod: 'p1' },
  { name: 'Fernway Wellness',     pod: 'p2' },
  { name: 'Tonic and Thorn',      pod: 'p2' },
  { name: 'Vireo Health',         pod: 'p2' },
  { name: 'Sable Labs',           pod: 'p2' },
  { name: 'Kestrel Fitness',      pod: 'p3' },
  { name: 'Lumen Greens',         pod: 'p3' },
  { name: 'Marrow and Co',        pod: 'p3' },
  { name: 'Ridgeline Protein',    pod: 'p4' },
  { name: 'Sonder Skincare',      pod: 'p4' },
  { name: 'Wildroot Botanics',    pod: 'p4' }
];

/* The six scored questions on each monthly form. */
var CLIENT_Q = [
  'Creative quality',
  'Communication',
  'Speed of delivery',
  'Results against goals',
  'Understanding of our brand',
  'Value for money'
];

var COLLEAGUE_Q = [
  'Workload',
  'Clarity of role',
  'Support from my lead',
  'Growth and progression',
  'Tools and process',
  'Would recommend NSY'
];

/* The five behaviours every person is graded against each week. */
var BEHAVIOURS = ['Ownership', 'Proactive', 'Performance driven', 'Reliable', 'Speed'];
