export interface ICampaignAttribution {
  from_campaign: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  fbclid: string | null;
  gclid: string | null;
  ttclid: string | null;
  landing_url: string | null;
  referrer: string | null;
  captured_at: string | null;
}

export interface ICampaignUserReferral {
  referral_code: string | null;
  mentor_id: string | null;
}

export interface ICampaignUserRole {
  id: string;
  name: string;
}

export interface ICampaignUser {
  id: string;
  name: string;
  email: string;
  short_code?: string | null;
  role?: ICampaignUserRole | null;
  status?: string | null;
  auth_provider?: string | null;
  createdAt: string;
  campaign: ICampaignAttribution;
  referral: ICampaignUserReferral | null;
}

export interface IGetCampaignUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface ICampaignUsersListPayload {
  data: ICampaignUser[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ICampaignUsersAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: ICampaignUsersListPayload;
  message: string;
  timestamp: string;
}
