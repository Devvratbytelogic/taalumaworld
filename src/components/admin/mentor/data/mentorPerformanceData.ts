export function formatKes(amount: number) {
  return `KES ${amount.toLocaleString()}`;
}

export const MENTOR_OVERVIEW = {
  profileCompletion: 85,
  verificationStatus: 'Not Applied' as const,
  mentorType: 'Founding Mentor',
  isFoundingMentor: true,
  revenueShare: '90% Mentor / 10% Taaluma',
  agreementsAccepted: true,
  publishedBlueprints: 3,
  pendingReview: 1,
  suspendedBlueprints: 1,
  unpublishedBlueprints: 0,
  draftSubmissions: 1,
  totalSales: 48,
  revenueEarned: 124_500,
  revenuePending: 18_200,
  walletBalance: 18_200,
  payoutThreshold: 5_000,
  payoutFrequency: 'Monthly',
};

export const AGREEMENTS = [
  { name: 'Master Mentor Agreement', version: 'v1.2', acceptedAt: '2026-03-10 14:22', required: true },
  { name: 'Schedule A – Revenue Share', version: 'v1.1', acceptedAt: '2026-03-10 14:22', required: true },
  { name: 'Schedule B – Founding Mentor Program', version: 'v1.0', acceptedAt: '2026-03-10 14:23', required: true },
  { name: 'Schedule C – Community & Content Standards', version: 'v1.0', acceptedAt: '2026-03-10 14:23', required: true },
  { name: 'Schedule D – Mentor Verification Policy', version: 'v1.0', acceptedAt: '2026-03-10 14:24', required: true },
  { name: 'Privacy Policy', version: 'v2.0', acceptedAt: '2026-03-10 14:24', required: true },
  { name: 'Platform Terms of Service', version: 'v2.1', acceptedAt: '2026-03-10 14:24', required: true },
];

export const PAYOUT_SETTINGS = {
  bankName: 'Kenya Commercial Bank',
  accountName: 'Devvrat Sarkar',
  accountNumber: '****4521',
  mpesaNumber: '+254 7** *** 892',
  taxId: 'A012345678Z',
  country: 'Kenya',
  preferredCurrency: 'KES',
  withdrawalMethod: 'M-Pesa' as 'M-Pesa' | 'Bank transfer',
};

export const WITHDRAWAL_FREQUENCIES = ['Monthly', 'Quarterly', 'Semi-annually', 'Annually'] as const;

export const FOUNDING_MENTOR = {
  badgeActive: true,
  startDate: '2026-03-01',
  expiryDate: '2031-03-01',
  highValueAchieved: 2,
  highValueTarget: 10,
  highValuePending: 1,
  highValueDisqualified: 0,
  equityEligibility: 'Eligible for Super Admin review',
  hvBlueprints: [
    { title: 'Leading Through Change', status: 'High Value', reason: 'All criteria met' },
    { title: 'Building Resilient Teams', status: 'High Value', reason: 'All criteria met' },
    { title: 'Strategic Decision Making', status: 'Pending qualification', reason: 'Needs 90 days published' },
    { title: 'Executive Communication', status: 'Disqualified', reason: 'Under admin review' },
  ],
};


export const BLUEPRINT_PERFORMANCE = [
  { title: 'Leading Through Change', views: 842, sales: 20, conversion: 2.4, status: 'Published', aiScore: 8.7, classification: 'High Value' },
  { title: 'Building Resilient Teams', views: 615, sales: 15, conversion: 2.4, status: 'Published', aiScore: 8.2, classification: 'High Value' },
  { title: 'Strategic Decision Making', views: 520, sales: 13, conversion: 2.5, status: 'Published', aiScore: 7.4, classification: 'Standard' },
  { title: 'Executive Communication', views: 180, sales: 0, conversion: 0, status: 'Pending review', aiScore: 6.8, classification: 'Needs Improvement' },
  { title: 'Legacy Leadership Playbook', views: 95, sales: 0, conversion: 0, status: 'Suspended', aiScore: 7.1, classification: 'Standard' },
  { title: 'Old Career Framework', views: 40, sales: 2, conversion: 5.0, status: 'Unpublished', aiScore: 6.2, classification: 'Standard' },
];

export const SALES_BY_MONTH = [
  { month: 'Jul 2026', sales: 8, revenue: 18_000 },
  { month: 'Jun 2026', sales: 12, revenue: 27_000 },
  { month: 'May 2026', sales: 10, revenue: 22_500 },
  { month: 'Apr 2026', sales: 9, revenue: 20_250 },
  { month: 'Mar 2026', sales: 9, revenue: 20_250 },
];

export const REVENUE_BY_MONTH = [
  { month: 'Jul 2026', gross: 18_000, discounts: 900, refunds: 0, platformShare: 4_500, earned: 13_500 },
  { month: 'Jun 2026', gross: 27_000, discounts: 1_350, refunds: 2_250, platformShare: 6_750, earned: 20_250 },
  { month: 'May 2026', gross: 22_500, discounts: 0, refunds: 0, platformShare: 5_625, earned: 16_875 },
  { month: 'Apr 2026', gross: 20_250, discounts: 500, refunds: 0, platformShare: 5_063, earned: 15_187 },
];

export const PENDING_PAYOUTS = [
  { period: 'Jul 2026 (in progress)', amount: 18_200, payoutDate: '2026-08-15', status: 'Pending approval' },
  { period: 'Jun 2026 adjustments', amount: 1_250, payoutDate: '2026-08-15', status: 'Held below threshold roll-forward' },
];

export const PAYMENT_HISTORY = [
  { date: '2026-06-15', amount: 42_500, method: 'M-Pesa', status: 'Paid', reference: 'PAY-2026-06-001' },
  { date: '2026-05-15', amount: 38_200, method: 'Bank transfer', status: 'Paid', reference: 'PAY-2026-05-001' },
  { date: '2026-04-15', amount: 43_800, method: 'M-Pesa', status: 'Paid', reference: 'PAY-2026-04-001' },
  { date: '2026-03-15', amount: 0, method: '—', status: 'No payout', reference: '—' },
];

export const REFUNDS_CHARGEBACKS = [
  { date: '2026-06-08', blueprint: 'Strategic Decision Making', type: 'Refund', amount: 2_250, status: 'Deducted from wallet' },
  { date: '2026-05-22', blueprint: 'Leading Through Change', type: 'Chargeback', amount: 2_250, status: 'Under review' },
];

export const STATEMENTS = [
  {
    month: 'June 2026',
    fileName: 'mentor-statement-june-2026.pdf',
    grossSales: 27_000,
    discounts: 1_350,
    refunds: 2_250,
    platformCommission: 6_750,
    netEarnings: 20_250,
    payoutsProcessed: 42_500,
    outstandingBalance: 18_200,
    sales: 12,
  },
  {
    month: 'May 2026',
    fileName: 'mentor-statement-may-2026.pdf',
    grossSales: 22_500,
    discounts: 0,
    refunds: 0,
    platformCommission: 5_625,
    netEarnings: 16_875,
    payoutsProcessed: 38_200,
    outstandingBalance: 12_400,
    sales: 10,
  },
  {
    month: 'April 2026',
    fileName: 'mentor-statement-april-2026.pdf',
    grossSales: 20_250,
    discounts: 500,
    refunds: 0,
    platformCommission: 5_063,
    netEarnings: 15_187,
    payoutsProcessed: 43_800,
    outstandingBalance: 8_900,
    sales: 9,
  },
];

export const REVENUE_BY_BLUEPRINT = [
  { title: 'Leading Through Change', sales: 20, earned: 45_000, pending: 6_750 },
  { title: 'Building Resilient Teams', sales: 15, earned: 33_750, pending: 5_063 },
  { title: 'Strategic Decision Making', sales: 13, earned: 29_250, pending: 4_387 },
];

export const COUPON_PERFORMANCE = [
  { code: 'MENTOR10', type: '10% discount', redemptions: 14, revenueGenerated: 31_500, revenueWaived: 3_500, conversionRate: '4.2%' },
  { code: 'LAUNCH2026', type: 'Fixed KES 500 off', redemptions: 8, revenueGenerated: 18_000, revenueWaived: 4_000, conversionRate: '3.1%' },
  { code: 'UON2026', type: 'University promo', redemptions: 22, revenueGenerated: 0, revenueWaived: 49_500, conversionRate: '6.8%' },
];

export const RECENT_PAYMENTS = PAYMENT_HISTORY.filter((p) => p.status === 'Paid').slice(0, 3);

export const TOP_BLUEPRINTS = REVENUE_BY_BLUEPRINT.map((row) => ({
  title: row.title,
  sales: row.sales,
  revenue: row.earned,
}));
