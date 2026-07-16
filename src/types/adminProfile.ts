export interface IAdminProfileAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAdminProfileAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAdminProfileAPIResponseData {
  _id: string;
  name: string;
  profile_pic: string;
  email: string;
  is_verified: boolean;
  status: string;
  fcm_token?: (null)[] | null;
  professionalBio: string;
  linkedin: string;
  facebook: string;
  role_id: string;
  institution_id?: null;
  status_reason: string;
  status_changed_at: string;
  deleted_at?: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  short_code: string;
  id: string;
  role: Role;
  user_type: string;
  permission?: (null)[] | null;
  mentor_info: MentorInfo;
  profile_completion_percentage: number;
  mentor_economy: MentorEconomy;
}
export interface Role {
  _id: string;
  name: string;
  description: string;
  number_of_users: number;
}
export interface MentorInfo {
  _id: string;
  mentor_id: string;
  bank_number: string;
  bank_name: string;
  bank_branch: string;
  mpesa_number: string;
  tax_id: string;
  preferred_payment_frequency: string;
  is_vat_registered?: boolean;
  vat_number?: string | null;
  tier_id: string;
  tier_assigned_at: string;
  is_verified_mentor: boolean;
  verified_mentor_at?: null;
  verified_mentor_by?: null;
  verification_notes?: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface MentorEconomy {
  is_verified_mentor: boolean;
  verified_mentor_badge: boolean;
  verified_mentor_at?: null;
  tier: Tier;
  wallet: Wallet;
}
export interface Tier {
  id: string;
  code: string;
  mentor_share_percent: number;
  platform_share_percent: number;
  rank: number;
}
export interface Wallet {
  enabled: boolean;
  currency: string;
  balance: number;
  lifetime_earnings: number;
  lifetime_refunds: number;
  payout_threshold: number;
}
