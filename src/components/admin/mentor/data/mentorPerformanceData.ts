export function formatKes(amount: number) {
  return `KES ${amount.toLocaleString()}`;
}

export const MENTOR_OVERVIEW = {
  profileCompletion: 85,
  verificationStatus: 'Pending review',
  mentorType: 'Standard Mentor',
  agreementsAccepted: true,
  publishedBlueprints: 3,
  pendingReview: 1,
  suspendedBlueprints: 0,
  totalSales: 48,
  revenueEarned: 124_500,
  revenuePending: 18_200,
};

export const BLUEPRINT_PERFORMANCE = [
  { title: 'Leading Through Change', views: 842, sales: 20, conversion: 2.4, status: 'Published' },
  { title: 'Building Resilient Teams', views: 615, sales: 15, conversion: 2.4, status: 'Published' },
  { title: 'Strategic Decision Making', views: 520, sales: 13, conversion: 2.5, status: 'Published' },
  { title: 'Executive Communication', views: 180, sales: 0, conversion: 0, status: 'Pending review' },
];

export const SALES_BY_MONTH = [
  { month: 'Jul 2026', sales: 8, revenue: 18_000 },
  { month: 'Jun 2026', sales: 12, revenue: 27_000 },
  { month: 'May 2026', sales: 10, revenue: 22_500 },
  { month: 'Apr 2026', sales: 9, revenue: 20_250 },
  { month: 'Mar 2026', sales: 9, revenue: 20_250 },
];

export const REVENUE_BY_MONTH = [
  { month: 'Jul 2026', gross: 18_000, platformShare: 4_500, earned: 13_500 },
  { month: 'Jun 2026', gross: 27_000, platformShare: 6_750, earned: 20_250 },
  { month: 'May 2026', gross: 22_500, platformShare: 5_625, earned: 16_875 },
  { month: 'Apr 2026', gross: 20_250, platformShare: 5_063, earned: 15_187 },
];

export const PENDING_PAYOUTS = [
  { period: 'Jul 2026 (in progress)', amount: 18_200, payoutDate: '2026-08-15' },
  { period: 'Jun 2026 adjustments', amount: 1_250, payoutDate: '2026-08-15' },
];

export const PAYMENT_HISTORY = [
  { date: '2026-06-15', amount: 42_500, method: 'M-Pesa', status: 'Paid', reference: 'PAY-2026-06-001' },
  { date: '2026-05-15', amount: 38_200, method: 'Bank transfer', status: 'Paid', reference: 'PAY-2026-05-001' },
  { date: '2026-04-15', amount: 43_800, method: 'M-Pesa', status: 'Paid', reference: 'PAY-2026-04-001' },
  { date: '2026-03-15', amount: 0, method: '—', status: 'No payout', reference: '—' },
];

export const STATEMENTS = [
  { month: 'June 2026', sales: 12, revenue: 20_250, fileName: 'mentor-statement-june-2026.pdf' },
  { month: 'May 2026', sales: 10, revenue: 16_875, fileName: 'mentor-statement-may-2026.pdf' },
  { month: 'April 2026', sales: 9, revenue: 15_187, fileName: 'mentor-statement-april-2026.pdf' },
];

export const REVENUE_BY_BLUEPRINT = [
  { title: 'Leading Through Change', sales: 20, earned: 45_000, pending: 6_750 },
  { title: 'Building Resilient Teams', sales: 15, earned: 33_750, pending: 5_063 },
  { title: 'Strategic Decision Making', sales: 13, earned: 29_250, pending: 4_387 },
];

export const RECENT_PAYMENTS = PAYMENT_HISTORY.filter((p) => p.status === 'Paid').slice(0, 3);

export const TOP_BLUEPRINTS = REVENUE_BY_BLUEPRINT.map((row) => ({
  title: row.title,
  sales: row.sales,
  revenue: row.earned,
}));
