export interface IAllMentorApplicationsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllMentorApplicationsAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAllMentorApplicationsAPIResponseData {
  applications?: (ApplicationsEntity)[] | null;
  pagination: Pagination;
}
export interface ApplicationsEntity {
  _id: string;
  user_id: UserId;
  previous_role: string;
  status: string;
  professional_summary: string;
  linkedin?: null;
  facebook?: null;
  bank_name: string;
  bank_number: string;
  bank_branch?: null;
  mpesa_number: string;
  tax_id?: null;
  preferred_payment_frequency: string;
  admin_notes?: string | null;
  decision_reason?: string | null;
  reviewed_by?: ReviewedBy | string | null;
  reviewed_at?: string | null;
  submitted_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  summary_word_count: number;
  can_withdraw: boolean;
  valid_statuses?: (string)[] | null;
}
export interface UserId {
  _id: string;
  name: string;
  profile_pic: string;
  email: string;
  status: string;
  institution_id?: null;
}
export interface ReviewedBy {
  _id: string;
  name: string;
  email: string;
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
