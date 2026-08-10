/**
 * TrafficIQ seeded demo workspace — "Demo Dispensary · Midtown Manhattan".
 *
 * Every headline figure the UI shows is AGGREGATED IN CODE from this hand-authored
 * channel table, so the numbers always reconcile:
 *   New customers            427     (Σ channel.newCustomers)
 *   First-purchase revenue   $31,840 (Σ channel.firstRevenue)
 *   Blended CAC              $14.72  (Σ spend / Σ new customers)
 *   30-day new-customer value $47,930 (Σ channel.value30)
 *   Return rate              27.6%   (Σ returning / Σ new customers)
 *   Opportunities found      $18,420 (Σ opportunity.revenue, 6 items)
 *
 * Financial values are numbers (USD) computed by the app, never by a model.
 */

export const REFERENCE_DATE = "2026-08-10";

export const ORG = {
  id: "org-demo",
  name: "Demo Dispensary",
  location: "Midtown Manhattan",
  locations: 3,
  monthlyMarketingSpend: 6284,
} as const;

// ─────────────────────────────────────────────────────────────────────────
// Acquisition channels (this period = last 7 days)
// ─────────────────────────────────────────────────────────────────────────

export interface Channel {
  id: string;
  source: string;
  /** Paid marketing spend attributed to the channel this period. */
  spend: number;
  newCustomers: number;
  firstRevenue: number;
  /** 30-day revenue produced by this period's newly acquired customers. */
  value30: number;
  /** Newly acquired customers who returned for a 2nd purchase within 30 days. */
  returning: number;
  /** Weekly new-customer trend (8 points) for the sparkline. */
  trend: number[];
}

export const CHANNELS: Channel[] = [
  { id: "google", source: "Google Search / Maps", spend: 344, newCustomers: 84, firstRevenue: 6180, value30: 9400, returning: 26, trend: [58, 61, 66, 63, 71, 74, 79, 84] },
  { id: "walkby", source: "Walk-by", spend: 220, newCustomers: 63, firstRevenue: 4410, value30: 6600, returning: 14, trend: [55, 59, 57, 60, 58, 62, 61, 63] },
  { id: "hotel", source: "Hotel Partnerships", spend: 420, newCustomers: 38, firstRevenue: 3660, value30: 5548, returning: 16, trend: [18, 21, 24, 27, 29, 31, 35, 38] },
  { id: "directmail", source: "Direct Mail", spend: 810, newCustomers: 44, firstRevenue: 3300, value30: 4840, returning: 11, trend: [40, 47, 44, 49, 42, 46, 45, 44] },
  { id: "instagram", source: "Instagram", spend: 1150, newCustomers: 41, firstRevenue: 2870, value30: 4100, returning: 9, trend: [46, 44, 43, 45, 42, 43, 42, 41] },
  { id: "influencers", source: "Influencers", spend: 840, newCustomers: 22, firstRevenue: 1430, value30: 1870, returning: 3, trend: [31, 28, 30, 26, 27, 24, 23, 22] },
  { id: "events", source: "Events", spend: 980, newCustomers: 29, firstRevenue: 2030, value30: 3050, returning: 7, trend: [12, 18, 33, 41, 22, 27, 31, 29] },
  { id: "partners", source: "Partner Businesses", spend: 520, newCustomers: 34, firstRevenue: 2550, value30: 4420, returning: 11, trend: [22, 25, 27, 29, 30, 31, 33, 34] },
  { id: "streetteam", source: "Street Team", spend: 700, newCustomers: 26, firstRevenue: 1820, value30: 2600, returning: 5, trend: [20, 24, 22, 27, 25, 28, 26, 26] },
  { id: "referral", source: "Referral", spend: 300, newCustomers: 25, firstRevenue: 2000, value30: 3375, returning: 10, trend: [16, 18, 19, 21, 20, 23, 24, 25] },
  { id: "organic", source: "Organic Web", spend: 0, newCustomers: 12, firstRevenue: 960, value30: 1320, returning: 4, trend: [9, 10, 11, 10, 12, 11, 12, 12] },
  { id: "other", source: "Other", spend: 0, newCustomers: 9, firstRevenue: 630, value30: 807, returning: 2, trend: [7, 8, 8, 9, 8, 9, 9, 9] },
];

export interface ChannelDerived extends Channel {
  cac: number | null;
  value30PerCustomer: number;
  returnRate: number;
  roas: number | null;
}

export function deriveChannel(c: Channel): ChannelDerived {
  return {
    ...c,
    cac: c.spend > 0 ? c.spend / c.newCustomers : null,
    value30PerCustomer: c.value30 / c.newCustomers,
    returnRate: (c.returning / c.newCustomers) * 100,
    roas: c.spend > 0 ? c.value30 / c.spend : null,
  };
}

export const CHANNELS_DERIVED: ChannelDerived[] = CHANNELS.map(deriveChannel);

function sum(ns: number[]): number {
  return ns.reduce((a, b) => a + b, 0);
}

// ─────────────────────────────────────────────────────────────────────────
// Derived KPIs — the numbers that must reconcile everywhere
// ─────────────────────────────────────────────────────────────────────────

const totalNew = sum(CHANNELS.map((c) => c.newCustomers));
const totalSpend = sum(CHANNELS.map((c) => c.spend));
const totalFirst = sum(CHANNELS.map((c) => c.firstRevenue));
const totalValue30 = sum(CHANNELS.map((c) => c.value30));
const totalReturning = sum(CHANNELS.map((c) => c.returning));

export const KPIS = {
  newCustomers: totalNew, // 427
  newCustomersDelta: 18.4,
  firstRevenue: totalFirst, // 31,840
  firstRevenueDelta: 15.2,
  blendedCac: totalSpend / totalNew, // 14.72
  blendedCacDelta: -6.1, // CAC down = good
  value30: totalValue30, // 47,930
  value30Delta: 21.0,
  returnRate: (totalReturning / totalNew) * 100, // 27.6
  returnRateDelta: 2.3,
  ltvToCac: totalValue30 / totalSpend, // ~7.6x (blended)
  marketingSpend: totalSpend, // 6,284
} as const;

/** Acquisition performance time-series (new customers + first-purchase revenue). */
export interface SeriesPoint {
  label: string;
  customers: number;
  revenue: number;
}

function buildSeries(labels: string[], base: number, growth: number): SeriesPoint[] {
  // Deterministic wave so charts read as a believable, trending business.
  const wobble = [0.94, 1.03, 0.97, 1.06, 0.99, 1.08, 1.02, 1.11, 1.05, 1.14, 1.09, 1.18];
  return labels.map((label, i) => {
    const t = i / Math.max(1, labels.length - 1);
    const w = wobble[i % wobble.length]!;
    const customers = Math.round((base + base * growth * t) * w);
    return { label, customers, revenue: Math.round(customers * 74.6) };
  });
}

export const SERIES: Record<"7D" | "30D" | "90D" | "YTD", SeriesPoint[]> = {
  "7D": [
    { label: "Mon", customers: 54, revenue: 4030 },
    { label: "Tue", customers: 61, revenue: 4550 },
    { label: "Wed", customers: 58, revenue: 4327 },
    { label: "Thu", customers: 67, revenue: 4998 },
    { label: "Fri", customers: 72, revenue: 5371 },
    { label: "Sat", customers: 63, revenue: 4700 },
    { label: "Sun", customers: 52, revenue: 3864 },
  ],
  "30D": buildSeries(
    Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    48,
    0.42
  ),
  "90D": buildSeries(
    Array.from({ length: 13 }, (_, i) => `W${i + 1}`),
    280,
    0.55
  ),
  YTD: buildSeries(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    1180,
    0.58
  ),
};

// ─────────────────────────────────────────────────────────────────────────
// Opportunity engine — Σ revenue = $18,420 across 6 items
// ─────────────────────────────────────────────────────────────────────────

export type OppKind =
  | "trade-area"
  | "partner"
  | "channel-scale"
  | "budget-alert"
  | "timing"
  | "reactivation";

export interface Opportunity {
  id: string;
  kind: OppKind;
  title: string;
  area?: string;
  score: number; // 0-100 Opportunity Score
  customers: number; // estimated new customers / month
  revenue: number; // estimated monthly revenue impact
  cost: number; // estimated cost to capture
  expectedCac: number;
  confidence: "High" | "Medium" | "Low";
  effort: "Low" | "Medium" | "High";
  reason: string;
  recommendation: string;
  action: string;
}

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-midtown-east",
    kind: "trade-area",
    title: "Underperforming trade area — Midtown East",
    area: "Midtown East",
    score: 92,
    customers: 92,
    revenue: 7800,
    cost: 1200,
    expectedCac: 13.04,
    confidence: "High",
    effort: "Medium",
    reason:
      "Midtown East is producing ~38% fewer customers than expected given its proximity, daytime foot traffic and comparable trade areas — the largest single acquisition gap in your market.",
    recommendation: "Direct Mail + local partnerships targeting the ZIP cluster east of Park Ave.",
    action: "View Opportunity",
  },
  {
    id: "opp-hotels",
    kind: "partner",
    title: "Hotel traffic — 4 unsigned partners",
    area: "Midtown",
    score: 88,
    customers: 41,
    revenue: 4260,
    cost: 420,
    expectedCac: 10.24,
    confidence: "High",
    effort: "Low",
    reason:
      "Four hotels within a 6-minute walk generate concierge referral traffic that matches your highest-performing partner profile — but none are enrolled in your referral program.",
    recommendation: "Launch a concierge partnership with unique QR + promo per property.",
    action: "Build Partnership Campaign",
  },
  {
    id: "opp-google-scale",
    kind: "channel-scale",
    title: "Scale Google Local acquisition",
    score: 90,
    customers: 74,
    revenue: 2100,
    cost: 350,
    expectedCac: 4.73,
    confidence: "High",
    effort: "Low",
    reason:
      "Local search converts at a $4.10 CAC — 3.6× more efficient than your blended acquisition cost. Impression share is capped by budget, not demand.",
    recommendation: "Raise the local-search budget by $350/week and expand the served radius.",
    action: "Build Campaign",
  },
  {
    id: "opp-influencer",
    kind: "budget-alert",
    title: "Reallocate influencer budget",
    score: 74,
    customers: 51,
    revenue: 1860,
    cost: 0,
    expectedCac: 14.72,
    confidence: "Medium",
    effort: "Low",
    reason:
      "Influencer Campaign #14 is acquiring customers at a $38.18 CAC — 2.6× your $14.72 average — and its customers return at less than half your blended rate.",
    recommendation: "Pause the campaign and move $750 to hotel + local-search acquisition.",
    action: "Review Campaign",
  },
  {
    id: "opp-grandcentral",
    kind: "timing",
    title: "Evening commuter distribution — Grand Central",
    area: "Midtown East",
    score: 81,
    customers: 33,
    revenue: 1400,
    cost: 260,
    expectedCac: 7.88,
    confidence: "Medium",
    effort: "Medium",
    reason:
      "QR traffic from the Grand Central placement converts 2.4× better between 4:30–7:30 PM, yet distribution is weighted to the morning.",
    recommendation: "Shift street-team hours to the evening commuter window.",
    action: "Adjust Campaign",
  },
  {
    id: "opp-referral",
    kind: "reactivation",
    title: "Restaurant partner referral gap",
    area: "Flatiron",
    score: 76,
    customers: 18,
    revenue: 1000,
    cost: 180,
    expectedCac: 10.0,
    confidence: "Medium",
    effort: "Low",
    reason:
      "Two Flatiron restaurants drove strong referral volume last quarter but have gone dormant — their historical customers show above-average 30-day value.",
    recommendation: "Re-activate with a refreshed promo and staff incentive.",
    action: "Re-activate Partner",
  },
];

export const OPP_TOTALS = {
  revenue: sum(OPPORTUNITIES.map((o) => o.revenue)), // 18,420
  count: OPPORTUNITIES.length, // 6
  customers: sum(OPPORTUNITIES.map((o) => o.customers)),
};

// ─────────────────────────────────────────────────────────────────────────
// Geographic intelligence — trade areas + map points (0-100 coordinate space)
// ─────────────────────────────────────────────────────────────────────────

export type Penetration = "Low" | "Medium" | "High";

export interface TradeArea {
  id: string;
  name: string;
  /** Real coordinates + ZIP for the Leaflet tile map. */
  lat: number;
  lng: number;
  zip: string;
  x: number; // 0-100 within the stylized Midtown grid (marketing SVG map)
  y: number;
  /** Relative acquisition weight → drives heat + blob radius. */
  customers: number;
  newPerMonth: number;
  avgFirst: number;
  value30: number;
  penetration: Penetration;
  oppScore: number;
  potentialCustomers: number;
  potentialRevenue: number;
  recommendation: string;
}

export const TRADE_AREAS: TradeArea[] = [
  { id: "midtown-east", name: "Midtown East", lat: 40.7549, lng: -73.9740, zip: "10022", x: 74, y: 40, customers: 642, newPerMonth: 118, avgFirst: 76, value30: 121, penetration: "Low", oppScore: 92, potentialCustomers: 140, potentialRevenue: 11200, recommendation: "Direct Mail + local partnerships" },
  { id: "murray-hill", name: "Murray Hill", lat: 40.7479, lng: -73.9756, zip: "10016", x: 72, y: 58, customers: 486, newPerMonth: 74, avgFirst: 71, value30: 108, penetration: "Medium", oppScore: 79, potentialCustomers: 68, potentialRevenue: 5200, recommendation: "Residential building partnerships" },
  { id: "times-square", name: "Times Square", lat: 40.7580, lng: -73.9855, zip: "10036", x: 40, y: 34, customers: 908, newPerMonth: 176, avgFirst: 68, value30: 96, penetration: "High", oppScore: 44, potentialCustomers: 22, potentialRevenue: 1600, recommendation: "Maintain — tourist-heavy, low return" },
  { id: "hells-kitchen", name: "Hell's Kitchen", lat: 40.7638, lng: -73.9918, zip: "10019", x: 24, y: 30, customers: 734, newPerMonth: 132, avgFirst: 79, value30: 128, penetration: "High", oppScore: 58, potentialCustomers: 40, potentialRevenue: 3400, recommendation: "Referral + partner restaurants" },
  { id: "chelsea", name: "Chelsea", lat: 40.7465, lng: -74.0014, zip: "10011", x: 30, y: 66, customers: 520, newPerMonth: 88, avgFirst: 82, value30: 134, penetration: "Medium", oppScore: 71, potentialCustomers: 58, potentialRevenue: 5100, recommendation: "Events + gym partnerships" },
  { id: "flatiron", name: "Flatiron / NoMad", lat: 40.7411, lng: -73.9897, zip: "10010", x: 56, y: 70, customers: 448, newPerMonth: 66, avgFirst: 84, value30: 139, penetration: "Medium", oppScore: 76, potentialCustomers: 54, potentialRevenue: 4900, recommendation: "Re-activate restaurant partners" },
  { id: "koreatown", name: "Koreatown", lat: 40.7476, lng: -73.9864, zip: "10001", x: 52, y: 52, customers: 372, newPerMonth: 61, avgFirst: 73, value30: 112, penetration: "Medium", oppScore: 68, potentialCustomers: 44, potentialRevenue: 3300, recommendation: "Nightlife + hotel concierge" },
  { id: "garment", name: "Garment District", lat: 40.7539, lng: -73.9915, zip: "10018", x: 40, y: 50, customers: 298, newPerMonth: 42, avgFirst: 70, value30: 101, penetration: "Low", oppScore: 74, potentialCustomers: 48, potentialRevenue: 3400, recommendation: "Office-building direct mail" },
  { id: "upper-east", name: "Upper East Side", lat: 40.7736, lng: -73.9632, zip: "10065", x: 84, y: 18, customers: 264, newPerMonth: 38, avgFirst: 88, value30: 148, penetration: "Low", oppScore: 83, potentialCustomers: 62, potentialRevenue: 5900, recommendation: "High-value — residential partnerships" },
];

/** Torches NYC store locations (real addresses) for the tile map + store selector. */
export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  zip: string;
  lat: number;
  lng: number;
  flagship?: boolean;
}

export const TORCHES_LOCATIONS: StoreLocation[] = [
  { id: "e42-12", name: "Torches · Flagship", address: "12 E 42nd St", zip: "10017", lat: 40.7529, lng: -73.9808, flagship: true },
  { id: "e42-89", name: "Torches · Grand Central", address: "89 E 42nd St", zip: "10017", lat: 40.7522, lng: -73.9776 },
  { id: "5th-500", name: "Torches · 500 5th Ave", address: "500 5th Ave", zip: "10110", lat: 40.7541, lng: -73.9822 },
  { id: "5th-476", name: "Torches · 476 5th Ave", address: "476 5th Ave", zip: "10018", lat: 40.7533, lng: -73.9821 },
  { id: "ts-1", name: "Torches · 1 Times Sq", address: "1 Times Square", zip: "10036", lat: 40.7570, lng: -73.9859 },
];

export interface MapPoint {
  id: string;
  kind: "store" | "partner" | "competitor" | "campaign";
  label: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  detail?: string;
}

export const MAP_POINTS: MapPoint[] = [
  { id: "store", kind: "store", label: "Torches NYC", lat: 40.7529, lng: -73.9808, x: 50, y: 48, detail: "Flagship · 12 E 42nd St" },
  { id: "p1", kind: "partner", label: "The Chatwal Hotel", lat: 40.7561, lng: -73.9846, x: 43, y: 40, detail: "Top-performer · 38 customers" },
  { id: "p2", kind: "partner", label: "Bryant Park Hotel", lat: 40.7539, lng: -73.9840, x: 47, y: 44, detail: "Active · 21 customers" },
  { id: "p3", kind: "partner", label: "Refinery Rooftop", lat: 40.7517, lng: -73.9862, x: 44, y: 52, detail: "Active · 17 customers" },
  { id: "p4", kind: "partner", label: "Knickerbocker Concierge", lat: 40.7556, lng: -73.9862, x: 38, y: 46, detail: "Active · 16 customers" },
  { id: "cmp-qube", kind: "competitor", label: "Qube NYC", lat: 40.7529, lng: -73.9868, x: 40, y: 36, detail: "1412 Broadway · 0.3 mi" },
  { id: "cmp-daily", kind: "competitor", label: "The Daily Green", lat: 40.7605, lng: -73.9846, x: 36, y: 26, detail: "719 7th Ave · Times Square" },
  { id: "cmp-elevation", kind: "competitor", label: "Elevation HQ", lat: 40.7595, lng: -73.9897, x: 22, y: 30, detail: "701 8th Ave · Hell's Kitchen" },
  { id: "cmp-culture", kind: "competitor", label: "Culture House", lat: 40.7504, lng: -73.9880, x: 42, y: 52, detail: "958 6th Ave · Midtown" },
  { id: "cmp-stoops", kind: "competitor", label: "Stoops NYC", lat: 40.7407, lng: -73.9902, x: 56, y: 74, detail: "182 5th Ave · Flatiron" },
  { id: "cam1", kind: "campaign", label: "Grand Central QR", lat: 40.7527, lng: -73.9772, x: 70, y: 44, detail: "Evening commuter placement" },
  { id: "cam2", kind: "campaign", label: "Bryant Park Street Team", lat: 40.7536, lng: -73.9832, x: 46, y: 38, detail: "Weekend distribution" },
];

// ─────────────────────────────────────────────────────────────────────────
// Ask TrafficIQ — scripted analyst answer for the "$1,000 this week" prompt
// ─────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────
// Campaigns — every campaign tracked to real customer acquisition
// ─────────────────────────────────────────────────────────────────────────

export type CampaignStatus = "Active" | "Scheduled" | "Completed" | "Draft";

export interface Campaign {
  id: string;
  name: string;
  channel: string;
  status: CampaignStatus;
  spend: number;
  scans: number; // scans / clicks
  storeVisits: number;
  newCustomers: number;
  firstRevenue: number;
  value30: number;
  startedIso: string;
  /** Acquisition funnel for the detail view. */
  funnel: { label: string; value: number }[];
  topPerformer?: boolean;
  alert?: boolean;
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: "grand-central",
    name: "Grand Central Commuter Campaign",
    channel: "QR · Street Team",
    status: "Active",
    spend: 620,
    scans: 3120,
    storeVisits: 214,
    newCustomers: 96,
    firstRevenue: 7100,
    value30: 10450,
    startedIso: "2026-07-14",
    funnel: [
      { label: "QR scans", value: 3120 },
      { label: "Landing visits", value: 2180 },
      { label: "Menu visits", value: 940 },
      { label: "Store visits", value: 214 },
      { label: "First purchases", value: 96 },
      { label: "Repeat purchases", value: 29 },
    ],
  },
  {
    id: "hotel-concierge",
    name: "Hotel Concierge Program",
    channel: "Partner",
    status: "Active",
    spend: 420,
    scans: 1180,
    storeVisits: 132,
    newCustomers: 74,
    firstRevenue: 7030,
    value30: 10800,
    startedIso: "2026-06-02",
    topPerformer: true,
    funnel: [
      { label: "QR scans", value: 1180 },
      { label: "Landing visits", value: 910 },
      { label: "Menu visits", value: 470 },
      { label: "Store visits", value: 132 },
      { label: "First purchases", value: 74 },
      { label: "Repeat purchases", value: 31 },
    ],
  },
  {
    id: "midtown-east-dm",
    name: "Midtown East Direct Mail",
    channel: "Direct Mail",
    status: "Active",
    spend: 980,
    scans: 1460,
    storeVisits: 118,
    newCustomers: 53,
    firstRevenue: 3980,
    value30: 5620,
    startedIso: "2026-07-20",
    funnel: [
      { label: "QR scans", value: 1460 },
      { label: "Landing visits", value: 1010 },
      { label: "Menu visits", value: 402 },
      { label: "Store visits", value: 118 },
      { label: "First purchases", value: 53 },
      { label: "Repeat purchases", value: 13 },
    ],
  },
  {
    id: "summer-tourist",
    name: "Summer Tourist Campaign",
    channel: "Social",
    status: "Completed",
    spend: 1840,
    scans: 8600,
    storeVisits: 262,
    newCustomers: 118,
    firstRevenue: 8020,
    value30: 10600,
    startedIso: "2026-05-01",
    funnel: [
      { label: "Clicks", value: 8600 },
      { label: "Landing visits", value: 5200 },
      { label: "Menu visits", value: 1740 },
      { label: "Store visits", value: 262 },
      { label: "First purchases", value: 118 },
      { label: "Repeat purchases", value: 24 },
    ],
  },
  {
    id: "bryant-park",
    name: "Bryant Park Street Team",
    channel: "Street Team",
    status: "Active",
    spend: 540,
    scans: 2010,
    storeVisits: 96,
    newCustomers: 41,
    firstRevenue: 2870,
    value30: 4020,
    startedIso: "2026-07-08",
    funnel: [
      { label: "QR scans", value: 2010 },
      { label: "Landing visits", value: 1240 },
      { label: "Menu visits", value: 430 },
      { label: "Store visits", value: 96 },
      { label: "First purchases", value: 41 },
      { label: "Repeat purchases", value: 8 },
    ],
  },
  {
    id: "restaurant-partner",
    name: "Local Restaurant Partnership",
    channel: "Partner",
    status: "Scheduled",
    spend: 0,
    scans: 0,
    storeVisits: 0,
    newCustomers: 0,
    firstRevenue: 0,
    value30: 0,
    startedIso: "2026-08-18",
    funnel: [],
  },
  {
    id: "influencer-14",
    name: "Influencer Campaign #14",
    channel: "Influencer",
    status: "Active",
    spend: 840,
    scans: 4200,
    storeVisits: 61,
    newCustomers: 22,
    firstRevenue: 1430,
    value30: 1870,
    startedIso: "2026-07-25",
    alert: true,
    funnel: [
      { label: "Clicks", value: 4200 },
      { label: "Landing visits", value: 1980 },
      { label: "Menu visits", value: 520 },
      { label: "Store visits", value: 61 },
      { label: "First purchases", value: 22 },
      { label: "Repeat purchases", value: 3 },
    ],
  },
  {
    id: "google-local",
    name: "Google Local Always-On",
    channel: "Google",
    status: "Active",
    spend: 344,
    scans: 5900,
    storeVisits: 188,
    newCustomers: 84,
    firstRevenue: 6180,
    value30: 9400,
    startedIso: "2026-01-05",
    topPerformer: true,
    funnel: [
      { label: "Clicks", value: 5900 },
      { label: "Landing visits", value: 3600 },
      { label: "Menu visits", value: 1420 },
      { label: "Store visits", value: 188 },
      { label: "First purchases", value: 84 },
      { label: "Repeat purchases", value: 26 },
    ],
  },
  {
    id: "loyalty-relaunch",
    name: "Loyalty Re-launch Teaser",
    channel: "SMS",
    status: "Draft",
    spend: 0,
    scans: 0,
    storeVisits: 0,
    newCustomers: 0,
    firstRevenue: 0,
    value30: 0,
    startedIso: "2026-08-30",
    funnel: [],
  },
];

export interface CampaignDerived extends Campaign {
  cac: number | null;
  roas: number | null;
}

export function deriveCampaign(c: Campaign): CampaignDerived {
  return {
    ...c,
    cac: c.newCustomers > 0 ? c.spend / c.newCustomers : null,
    roas: c.spend > 0 ? c.value30 / c.spend : null,
  };
}

export const CAMPAIGNS_DERIVED: CampaignDerived[] = CAMPAIGNS.map(deriveCampaign);

// ─────────────────────────────────────────────────────────────────────────
// Acquisition funnel (trailing 30 days)
// ─────────────────────────────────────────────────────────────────────────

export const ACQ_HERO = {
  newCustomers: 1842,
  firstRevenue: 142620,
  cac: 16.18,
  ltvCac: 5.8,
} as const;

export interface FunnelStage {
  label: string;
  value: number;
  hint: string;
}

export const ACQ_FUNNEL: FunnelStage[] = [
  { label: "Impressions", value: 486000, hint: "Ad, search, QR and partner exposure" },
  { label: "Landing page visits", value: 58200, hint: "Tapped through to a TrafficIQ landing page" },
  { label: "Menu visits", value: 21400, hint: "Reached the live menu" },
  { label: "Store visits", value: 6120, hint: "Attributed in-store visits" },
  { label: "First purchase", value: 1842, hint: "Became a new paying customer" },
  { label: "30-day repeat", value: 508, hint: "Returned within 30 days" },
];

// ─────────────────────────────────────────────────────────────────────────
// Partners — local acquisition partnership CRM
// ─────────────────────────────────────────────────────────────────────────

export type PartnerStatus =
  | "Prospect"
  | "Contacted"
  | "Active"
  | "Top Performer"
  | "Paused";

export type PartnerCategory =
  | "Hotel"
  | "Restaurant"
  | "Bar"
  | "Gym"
  | "Residential"
  | "Office"
  | "Concierge"
  | "Tourist"
  | "Event venue";

export interface Partner {
  id: string;
  name: string;
  category: PartnerCategory;
  distanceMi: number;
  status: PartnerStatus;
  cost: number; // monthly referral / promo cost
  scans: number;
  newCustomers: number;
  firstRevenue: number;
  value30: number;
}

export const PARTNERS: Partner[] = [
  { id: "chatwal", name: "The Chatwal Hotel", category: "Hotel", distanceMi: 0.2, status: "Top Performer", cost: 420, scans: 1180, newCustomers: 38, firstRevenue: 3660, value30: 5548 },
  { id: "bofa", name: "Bank of America Tower", category: "Office", distanceMi: 0.3, status: "Active", cost: 300, scans: 880, newCustomers: 26, firstRevenue: 1950, value30: 3120 },
  { id: "bryant-hotel", name: "Bryant Park Hotel", category: "Hotel", distanceMi: 0.3, status: "Active", cost: 240, scans: 720, newCustomers: 21, firstRevenue: 1890, value30: 2860 },
  { id: "equinox", name: "Equinox Bryant Park", category: "Gym", distanceMi: 0.5, status: "Active", cost: 220, scans: 610, newCustomers: 19, firstRevenue: 1520, value30: 2400 },
  { id: "refinery", name: "Refinery Rooftop", category: "Bar", distanceMi: 0.4, status: "Active", cost: 190, scans: 540, newCustomers: 17, firstRevenue: 1360, value30: 2050 },
  { id: "knickerbocker", name: "Knickerbocker Concierge", category: "Concierge", distanceMi: 0.4, status: "Active", cost: 180, scans: 520, newCustomers: 16, firstRevenue: 1600, value30: 2540 },
  { id: "the-bryant", name: "The Bryant Residences", category: "Residential", distanceMi: 0.4, status: "Active", cost: 150, scans: 430, newCustomers: 14, firstRevenue: 1120, value30: 1820 },
  { id: "sushi-gari", name: "Sushi of Gari 46", category: "Restaurant", distanceMi: 0.6, status: "Paused", cost: 90, scans: 210, newCustomers: 6, firstRevenue: 480, value30: 640 },
  { id: "lanterns", name: "Lantern's Keep", category: "Bar", distanceMi: 0.3, status: "Contacted", cost: 0, scans: 0, newCustomers: 0, firstRevenue: 0, value30: 0 },
  { id: "haswell", name: "Haswell Green's", category: "Event venue", distanceMi: 0.5, status: "Contacted", cost: 0, scans: 0, newCustomers: 0, firstRevenue: 0, value30: 0 },
  { id: "aire", name: "Aire Ancient Baths", category: "Tourist", distanceMi: 0.7, status: "Prospect", cost: 0, scans: 0, newCustomers: 0, firstRevenue: 0, value30: 0 },
];

export interface PartnerDerived extends Partner {
  cac: number | null;
}

export const PARTNERS_DERIVED: PartnerDerived[] = PARTNERS.map((p) => ({
  ...p,
  cac: p.newCustomers > 0 ? p.cost / p.newCustomers : null,
}));

export interface PartnerProspect {
  id: string;
  name: string;
  category: PartnerCategory;
  distanceMi: number;
  oppScore: number;
  estRefsLow: number;
  estRefsHigh: number;
  action: string;
}

export const PARTNER_PROSPECTS: PartnerProspect[] = [
  { id: "edition", name: "The Times Square EDITION", category: "Hotel", distanceMi: 0.3, oppScore: 94, estRefsLow: 28, estRefsHigh: 42, action: "Concierge partnership" },
  { id: "langham", name: "The Langham", category: "Hotel", distanceMi: 0.6, oppScore: 90, estRefsLow: 24, estRefsHigh: 36, action: "Concierge partnership" },
  { id: "bluebottle", name: "Blue Bottle · Bryant Park", category: "Restaurant", distanceMi: 0.2, oppScore: 86, estRefsLow: 18, estRefsHigh: 26, action: "Counter QR + promo" },
  { id: "nysc", name: "New York Sports Club", category: "Gym", distanceMi: 0.4, oppScore: 81, estRefsLow: 14, estRefsHigh: 22, action: "Member referral" },
];

// ─────────────────────────────────────────────────────────────────────────
// Attribution — credit by model + representative customer journeys
// ─────────────────────────────────────────────────────────────────────────

export const ATTR_MODELS = ["First Touch", "Last Touch", "Linear", "TrafficIQ"] as const;
export type AttrModel = (typeof ATTR_MODELS)[number];

export interface AttrSource {
  source: string;
  /** Share of credited new customers (%) under each model — each model sums to 100. */
  credit: Record<AttrModel, number>;
}

export const ATTR_SOURCES: AttrSource[] = [
  { source: "Google Search / Maps", credit: { "First Touch": 15, "Last Touch": 24, Linear: 19, TrafficIQ: 20 } },
  { source: "Walk-by", credit: { "First Touch": 12, "Last Touch": 19, Linear: 15, TrafficIQ: 15 } },
  { source: "Hotel Partnerships", credit: { "First Touch": 13, "Last Touch": 8, Linear: 10, TrafficIQ: 9 } },
  { source: "Direct Mail", credit: { "First Touch": 10, "Last Touch": 13, Linear: 11, TrafficIQ: 11 } },
  { source: "Instagram", credit: { "First Touch": 15, "Last Touch": 8, Linear: 11, TrafficIQ: 10 } },
  { source: "Events", credit: { "First Touch": 10, "Last Touch": 5, Linear: 7, TrafficIQ: 7 } },
  { source: "Referral", credit: { "First Touch": 6, "Last Touch": 8, Linear: 7, TrafficIQ: 7 } },
  { source: "Influencers", credit: { "First Touch": 9, "Last Touch": 4, Linear: 6, TrafficIQ: 6 } },
  { source: "Other", credit: { "First Touch": 10, "Last Touch": 11, Linear: 14, TrafficIQ: 15 } },
];

export interface Journey {
  id: string;
  steps: string[];
  customers: number;
  avgFirst: number;
  confidence: "High" | "Medium" | "Low";
}

export const JOURNEYS: Journey[] = [
  { id: "google", steps: ["Google Search", "Website", "Menu", "Store", "Purchase"], customers: 84, avgFirst: 74, confidence: "High" },
  { id: "hotel", steps: ["Hotel QR", "Landing Page", "Menu", "Store", "Purchase"], customers: 38, avgFirst: 96, confidence: "High" },
  { id: "directmail", steps: ["Direct Mail QR", "Menu", "Purchase"], customers: 44, avgFirst: 75, confidence: "Medium" },
  { id: "instagram", steps: ["Instagram", "Website", "Menu", "Store", "Purchase"], customers: 41, avgFirst: 70, confidence: "Medium" },
  { id: "walkby", steps: ["Walk-by", "Store", "Purchase"], customers: 63, avgFirst: 70, confidence: "Low" },
];

// ─────────────────────────────────────────────────────────────────────────
// Customers — newly acquired customers (PII-safe, anonymized identifiers)
// ─────────────────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  source: string;
  firstIso: string;
  firstValue: number;
  lastIso: string;
  visits: number;
  value30: number;
  predLtv: number;
}

/** Subtract `n` days from an ISO date, deterministically in UTC (no `new Date()`). */
function daysBefore(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

const CUSTOMER_SOURCES = [
  "Google Search / Maps",
  "Hotel Partnerships",
  "Walk-by",
  "Direct Mail",
  "Instagram",
  "Referral",
  "Partner Businesses",
  "Events",
];

/** Days-before-reference for each cohort member — recent (1–6), this-month (7–30), older (31–48). */
const CUSTOMER_FIRST_DAYS = [
  2, 34, 5, 12, 40, 3, 22, 44, 6, 18, 36, 1,
  28, 46, 4, 15, 31, 9, 42, 7, 24, 48, 11, 38,
];

/** Store visits in the first 30 days — several one-and-done, several returned. */
const CUSTOMER_VISITS = [
  1, 2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 4,
  2, 1, 3, 2, 1, 4, 1, 3, 2, 1, 4, 2,
];

export const CUSTOMERS: Customer[] = Array.from({ length: 24 }, (_, i) => {
  const firstDays = CUSTOMER_FIRST_DAYS[i]!;
  const visits = CUSTOMER_VISITS[i]!;
  const firstIso = daysBefore(REFERENCE_DATE, firstDays);
  const firstValue = 52 + ((i * 9) % 78);
  const value30 =
    visits > 1 ? Math.round(firstValue * (1.5 + (i % 4) * 0.25)) : firstValue;
  const predLtv = Math.round(value30 * (2 + (i % 5) * 0.4));
  const lastIso =
    visits > 1
      ? daysBefore(REFERENCE_DATE, Math.max(0, firstDays - visits * 4))
      : firstIso;
  return {
    id: "TIQ-" + (4800 + i * 37),
    source: CUSTOMER_SOURCES[i % 8]!,
    firstIso,
    firstValue,
    lastIso,
    visits,
    value30,
    predLtv,
  };
});

export type CustomerSegment =
  | "New This Week"
  | "New This Month"
  | "Returned"
  | "One-and-Done"
  | "High Value"
  | "VIP Potential";

/** Whole-day difference between the reference date and an ISO date (deterministic, UTC). */
function daysSince(iso: string): number {
  const ref = new Date(REFERENCE_DATE + "T00:00:00Z").getTime();
  const then = new Date(iso + "T00:00:00Z").getTime();
  return Math.round((ref - then) / 86400000);
}

export function inSegment(c: Customer, seg: CustomerSegment): boolean {
  switch (seg) {
    case "New This Week":
      return daysSince(c.firstIso) <= 7;
    case "New This Month":
      return daysSince(c.firstIso) <= 31;
    case "Returned":
      return c.visits >= 2;
    case "One-and-Done":
      return c.visits === 1 && daysSince(c.firstIso) > 14;
    case "High Value":
      return c.value30 >= 150;
    case "VIP Potential":
      return c.predLtv >= 500;
  }
}

export const ASK_PLAN = {
  question: "Where should I spend $1,000 this week?",
  lines: [
    "Over the last 90 days, hotel partnerships produced your highest-value new customers — $146 in 30-day value at an $11.05 CAC.",
    "Google Local drove the greatest volume at a $4.10 CAC.",
    "Influencer acquisition is currently costing $38.18 per customer, 2.6× your $14.72 average.",
  ],
  allocation: [
    { channel: "Hotel Partnerships", amount: 500 },
    { channel: "Google Local", amount: 350 },
    { channel: "Direct Mail", amount: 150 },
    { channel: "Influencers", amount: 0 },
  ],
  projected: { customers: 73, firstRevenue: 5840, value30: 9210 },
} as const;
