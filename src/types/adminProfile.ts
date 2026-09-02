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
  profile_pic?: string | null;
  email: string;
  phone?: string | null;
  isEmailPrivate?: boolean;
  isNamePrivate?: boolean;
  isPhonePrivate?: boolean;
  is_verified: boolean;
  status: string;
  isSuspended?: boolean;
  fcm_token?: (string | null)[] | null;
  professionalBio?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  role_id: string;
  institution_id?: null;
  status_reason?: string | null;
  status_changed_at?: string | null;
  deleted_at?: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  short_code?: string;
  id: string;
  dob?: string | null;
  username?: string | null;
  role: Role;
  user_type: string;
  permission?: (IAdminProfilePermissionEntity)[] | null;
  mentor_info?: MentorInfo;
  profile_completion_percentage?: number;
  mentor_economy?: MentorEconomy;
  score?: number | null;
}
export interface Role {
  _id: string;
  name: string;
  description: string;
  number_of_users: number;
}
export interface IAdminProfilePermissionEntity {
  _id: string;
  model: string;
  permission?: (string)[] | null;
}
export interface MentorInfo {
  _id: string;
  mentor_id: string;
  bank_number: string;
  bank_name: string;
  bank_branch: string;
  mpesa_number: string;
  tax_id?: null;
  is_vat_registered: boolean;
  vat_number?: null;
  preferred_payment_frequency: string;
  tier_id: string;
  tier_assigned_at: string;
  is_verified_mentor: boolean;
  verified_mentor_at: string;
  verified_mentor_by: string;
  verification_notes?: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  paystack_bank_code: string;
  paystack_preferred_settlement: string;
  paystack_subaccount_status: string;
  settlement_country: string;
  paystack_bank_subaccount_code: string;
  paystack_bank_subaccount_id: string;
  paystack_mpesa_subaccount_code: string;
  paystack_mpesa_subaccount_id: string;
  paystack_subaccount_meta: PaystackSubaccountMeta;
  paystack_subaccount_synced_at: string;
  paystack_subaccount_error: string;
}
export interface PaystackSubaccountMeta {
  bank: BankOrMpesa;
  mpesa: BankOrMpesa;
  synced_at: string;
}
export interface BankOrMpesa {
  error: string;
  data: Data1;
}
export interface Data1 {
  status: boolean;
  message: string;
  meta: Meta;
  type: string;
  code: string;
}
export interface Meta {
  nextStep: string;
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
