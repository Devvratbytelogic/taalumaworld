export interface IAllUsersAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllUsersAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAllUsersAPIResponseData {
  users?: (IAllUsersEntity)[] | null;
  pagination: Pagination;
}
export interface IAllUsersEntity {
  _id: string;
  name: string;
  profile_pic: string;
  email: string;
  is_verified: boolean;
  dob?: string | null;
  status: string;
  linkedin?: string | null;
  facebook?: string | null;
  role_id: string;
  institution_id?: string | null;
  status_reason?: null;
  status_changed_at?: null;
  deleted_at?: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  role: Role;
  user_type: string;
  mentor_info?: MentorInfo | null;
  professionalBio?: string | null;
  agreement_status?: AgreementStatus | null;
  profile_completion_percentage?: number | null;
  profile_completion?: ProfileCompletion | null;
  mentor_economy?: MentorEconomy | null;
  username?: string | null;
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
  tier_assigned_at: string;
  is_verified_mentor: boolean;
  verified_mentor_at: string;
  verified_mentor_by: string;
  verification_notes: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  tier_id: string;
}
export interface AgreementStatus {
  all_mandatory_accepted: boolean;
  pending_agreements?: (null)[] | null;
  pending_optional_agreements?: (null)[] | null;
  items?: (ItemsEntity)[] | null;
}
export interface ItemsEntity {
  agreement_type: string;
  agreement_type_id: string;
  active_agreement_id: string;
  active_version: string;
  title: string;
  is_accepted: boolean;
  accepted_agreement_id: string;
  preselected: boolean;
  is_mandatory: boolean;
  accepted_at: string;
}
export interface ProfileCompletion {
  profile_completion_percentage: number;
  completed_fields?: (CompletedFieldsEntity)[] | null;
  pending_fields?: (null)[] | null;
}
export interface CompletedFieldsEntity {
  section: string;
  field: string;
}
export interface MentorEconomy {
  is_verified_mentor: boolean;
  verified_mentor_badge: boolean;
  verified_mentor_at: string;
  tier: Tier;
  wallet: Wallet;
}
export interface Tier {
  code: string;
  label: string;
  mentor_share_percent: number;
  platform_share_percent: number;
  is_verified_tier: boolean;
}
export interface Wallet {
  enabled: boolean;
  currency: string;
  balance: number;
  lifetime_earnings: number;
  lifetime_refunds: number;
  payout_threshold: number;
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
