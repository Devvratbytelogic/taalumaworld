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


