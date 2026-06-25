// ─── Institution Module Types ─────────────────────────────────────────────────

export type InstitutionStatus = 'active' | 'suspended' | 'terminated';
export type ReAccessPricingType = 'discounted' | 'market';

export interface IInstitutionEmailDomain {
  domain: string;    // e.g. "students.uonbi.ac.ke"
  is_primary: boolean;
}

export interface IInstitutionPromotionalAccess {
  start_date: string;       // ISO date string
  end_date: string;         // ISO date string
  is_active: boolean;
  grace_period_days: number;
}

export interface IReAccessPricing {
  type: ReAccessPricingType;
  discount_percentage?: number;  // only when type === 'discounted'
}

export interface IInstitution {
  _id: string;
  name: string;
  country: string;
  contact_email: string;
  logo_url?: string;
  email_domains: IInstitutionEmailDomain[];
  status: InstitutionStatus;
  promotional_access: IInstitutionalPromotionalAccess;
  re_access_pricing: IReAccessPricing;
  blueprint_ids: string[];        // IDs of blueprints enabled for this institution
  total_registrations: number;
  active_users: number;
  paid_conversions: number;
  createdAt: string;
  updatedAt: string;
}

// Corrected spelling alias used in component
export type IInstitutionalPromotionalAccess = IInstitutionPromotionalAccess;

export interface IInstitutionFormValues {
  name: string;
  country: string;
  contact_email: string;
  email_domains: string;          // comma-separated input, split on save
  promotional_start_date: string;
  promotional_end_date: string;
  re_access_type: ReAccessPricingType;
  re_access_discount: number;
}

// ─── Blueprint access per institution ─────────────────────────────────────────

export interface IInstitutionBlueprintEntry {
  blueprint_id: string;
  blueprint_title: string;
  thumbnail_url?: string;
  is_enabled: boolean;
  mentor_opted_out: boolean;  // mentor chose to exclude from this campaign
}

// ─── Registration Prompt Settings ─────────────────────────────────────────────

export interface IRegistrationPromptSettings {
  is_enabled: boolean;
  heading: string;
  message: string;
  contact_email: string;
}

// ─── Usage Report ─────────────────────────────────────────────────────────────

export interface IInstitutionUsageStat {
  institution_id: string;
  institution_name: string;
  total_registrations: number;
  active_users: number;
  blueprint_views: number;
  paid_conversions: number;
  conversion_rate: number;       // percentage
  days_remaining: number;        // until promotional period ends
}

// ─── API Response Wrappers ─────────────────────────────────────────────────────

export interface IAllInstitutionsAPIResponse {
  http_status_code: number;
  status: boolean;
  message: string;
  data: IInstitution[];
}

export interface ISingleInstitutionAPIResponse {
  http_status_code: number;
  status: boolean;
  message: string;
  data: IInstitution;
}

export interface IInstitutionUsageReportAPIResponse {
  http_status_code: number;
  status: boolean;
  message: string;
  data: IInstitutionUsageStat[];
}

export interface IRegistrationPromptAPIResponse {
  http_status_code: number;
  status: boolean;
  message: string;
  data: IRegistrationPromptSettings;
}
