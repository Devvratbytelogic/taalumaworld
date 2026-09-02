/** ── GET /admin/dashboard — Admin overview stats ───────────────────────────── */

export interface IAdminDashboardAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAdminDashboardStats;
  message: string;
  timestamp: string;
}

export interface IDashboardMentorActionItem {
  _id: string;
  name: string;
  email: string;
  profile_pic?: string | null;
  subtitle?: string | null;
  createdAt: string;
  status: string;
  status_label?: string | null;
  from_tier?: string | null;
  to_tier?: string | null;
}

export interface IDashboardMentorActionQueue {
  total: number;
  latest?: IDashboardMentorActionItem[] | null;
}

export interface IAdminDashboardStats {
  total_users: number;
  total_mentors: number;
  institutional_staff: number;
  total_blueprints: number;
  total_series: number;
  flagged_content: number;
  pending_total?: number;
  min_publish_score?: number;
  reviewBlueprint?: number;
  newMentorRegistrations?: IDashboardMentorActionQueue;
  mentorConversions?: IDashboardMentorActionQueue;
  mentorVerification?: IDashboardMentorActionQueue;
  mentorTierUpgrade?: IDashboardMentorActionQueue;
}

/** Lean series reference embedded on performance/revenue rows */
export interface IBlueprintSeriesRef {
  id: string;
  title: string;
}

/** ── GET /blueprints/performance — Admin & Mentor ──────────────────────────── */

export interface IBlueprintPerformanceAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IBlueprintPerformanceAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IBlueprintPerformanceAPIResponseData {
  summary: IBlueprintPerformanceSummary;
  data: IBlueprintPerformanceListData;
}
export interface IBlueprintPerformanceSummary {
  totalViews: number;
  totalSales: number;
  avgConversion: number;
  highValueBlueprints: number;
}
export interface IBlueprintPerformanceListData {
  data?: (IBlueprintPerformanceEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IBlueprintPerformanceEntity {
  id: string;
  title: string;
  status: string;
  views: number;
  sales: number;
  revenue: number;
  conversion: number;
  aiScore?: number | null;
  classification: string;
  series: IBlueprintSeriesRef;
}

/** ── GET /blueprints/sales-volume — Admin & Mentor ──────────────────────────── */

export interface ISalesVolumeAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: ISalesVolumeAPIResponseData;
  message: string;
  timestamp: string;
}
export interface ISalesVolumeAPIResponseData {
  summary: ISalesVolumeSummary;
  data: ISalesVolumeListData;
}
export interface ISalesVolumeSummary {
  thisMonth: number;
  lastMonth: number;
  totalSales: number;
  totalRevenue: number;
}
export interface ISalesVolumeListData {
  data?: (ISalesVolumeEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface ISalesVolumeEntity {
  month: string;
  sales: number;
  revenue: number;
}

/** ── GET /blueprints/revenue — Admin & Mentor ──────────────────────────────── */

export interface IBlueprintRevenueAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IBlueprintRevenueAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IBlueprintRevenueAPIResponseData {
  summary: IBlueprintRevenueSummary;
  data: IBlueprintRevenueListData;
}
export interface IBlueprintRevenueSummary {
  blueprints: number;
  totalSales: number;
  totalEarned: number;
  totalPending: number;
}
export interface IBlueprintRevenueListData {
  data?: (IBlueprintRevenueEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IBlueprintRevenueEntity {
  id: string;
  title: string;
  status: string;
  sales: number;
  earned: number;
  pending: number;
  series: IBlueprintSeriesRef;
}


export interface IMentorEconomyRevenueAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IMentorEconomyRevenueAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IMentorEconomyRevenueAPIResponseData {
  summary: IMentorEconomyRevenueAPIResponseSummary;
  data: IMentorEconomyRevenueAPIResponseDataData;
}
export interface IMentorEconomyRevenueAPIResponseSummary {
  totalEarned: number;
  thisMonth: number;
  platformShare: number;
  totalGross: number;
  totalDiscount: number;
}
export interface IMentorEconomyRevenueAPIResponseDataData {
  data?: (IMentorEconomyRevenueAPIResponseDataEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IMentorEconomyRevenueAPIResponseDataEntity {
  month: string;
  gross: number;
  discount: number;
  platformShare: number;
  yourShare: number;
}






export type MentorReferralStatus = 'registered' | 'purchased' | 'pending';

export interface IMentorReferralsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IMentorReferralsAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IMentorReferralsAPIResponseData {
  summary: Summary;
  data: IMentorReferralsAPIResponseDataData;
}
export interface Summary {
  total_referrals: number;
  total_registered: number;
  total_purchased: number;
  total_pending: number;
  total_commission_earned: number;
  conversion_rate: number;
}
export interface IMentorReferralsAPIResponseDataData {
  data?: (IMentorReferralsAPIResponseDataEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IMentorReferralsAPIResponseDataEntity {
  _id: string;
  user_name: string;
  commission_type: string;
  commission_value: number;
  isRegistered: boolean;
  registered_user: IMentorReferralsAPIResponseDataRegisteredUser;
  isFirstPurchaseDone: boolean;
  order: IMentorReferralsAPIResponseDataOrder;
  commission_amount: number;
  is_credited: boolean;
  credited_at: string;
  referral_code: string;
  createdAt: string;
}
export interface IMentorReferralsAPIResponseDataRegisteredUser {
  _id: string;
  name: string;
  email: string;
}
export interface IMentorReferralsAPIResponseDataOrder {
  _id: string;
  order_number: number;
  total_amount: number;
}
