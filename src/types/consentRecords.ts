export interface IGetConsentRecordsParams {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  agreement_type?: string;
}

export interface IConsentRecord {
  id: string;
  source: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  guest_email: string | null;
  touchpoint: string | null;
  agreement_id: string;
  agreement_type: {
    id: string;
    name: string;
  } | null;
  title: string;
  version: string;
  accepted_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export interface IUserConsentAuditUser {
  id: string;
  name: string;
  email: string;
  status: string;
  role_name: string;
  user_type: string;
}

export interface IUserConsentAuditSummary {
  all_latest_accepted: boolean;
  all_mandatory_accepted: boolean;
  pending_agreements: unknown[];
  pending_mandatory_agreements: unknown[];
  accepted_count: number;
  total_active_agreements: number;
  last_consent_at: string | null;
}

export interface IUserConsentAuditRecord {
  id: string;
  agreement_id: string;
  agreement_code: string;
  title: string;
  version: string;
  accepted_at: string;
  ip_address: string | null;
  user_agent: string | null;
  is_current_version: boolean;
  is_latest_active_accepted: boolean;
}

export interface IUserConsentAuditAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: {
    user: IUserConsentAuditUser;
    summary: IUserConsentAuditSummary;
    consents: IUserConsentAuditRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
  timestamp: string;
}

export interface IConsentRecordsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: {
    summary: {
      total: number;
      users: number;
      guests: number;
    };
    data: {
      data: IConsentRecord[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  message: string;
  timestamp: string;
}
