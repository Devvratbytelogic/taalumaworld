export type AdminReviewReportStatus = 'pending' | 'accepted' | 'ignored';

export interface IAdminReviewReportsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAdminReviewReportsAPIResponseData;
  message: string;
  timestamp: string;
}

export interface IAdminReviewReportsAPIResponseData {
  data?: IAdminReviewReportEntity[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IAdminReviewReportAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAdminReviewReportEntity;
  message: string;
  timestamp: string;
}

export interface IAdminReviewReportEntity {
  id: string;
  status: AdminReviewReportStatus | string;
  reason: string;
  process_reason?: string | null;
  createdAt: string;
  updatedAt: string;
  processed_at?: string | null;
  can_process?: boolean;
  reported_by?: IAdminReviewReportPerson | null;
  processed_by?: IAdminReviewReportPerson | null;
  review?: IAdminReviewReportReview | null;
}

export interface IAdminReviewReportPerson {
  id: string;
  name: string;
  email: string;
  profile_pic?: string | null;
}

export interface IAdminReviewReportReview {
  id: string;
  type: string;
  itemId: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  customer?: IAdminReviewReportPerson | null;
  item?: IAdminReviewReportItem | null;
}

export interface IAdminReviewReportItem {
  id?: string;
  title?: string;
  slug?: string;
  coverImage?: string | null;
  series?: {
    id?: string;
    title?: string;
    slug?: string;
  } | null;
}
