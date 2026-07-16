export interface IMentorApplicationApplicant {
  _id: string;
  name?: string | null;
  email?: string | null;
  profile_pic?: string | null;
}

export interface IMentorApplicationEntity {
  _id: string;
  user?: IMentorApplicationApplicant | string | null;
  name?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
  facebook_url?: string | null;
  x_url?: string | null;
  personal_website?: string | null;
  career_summary?: string | null;
  years_of_experience?: number | null;
  payment_frequency?: string | null;
  bank_name?: string | null;
  account_name?: string | null;
  account_number?: string | null;
  mpesa_number?: string | null;
  tax_id?: string | null;
  status: string;
  admin_notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IAllMentorApplicationsAPIResponseData {
  data?: IMentorApplicationEntity[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IAllMentorApplicationsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllMentorApplicationsAPIResponseData;
  message: string;
  timestamp: string;
}
