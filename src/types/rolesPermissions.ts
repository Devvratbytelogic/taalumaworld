export interface IAllRolesAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllRolesAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAllRolesAPIResponseData {
  data?: (IAllRolesEntity)[] | null;
  total: number;
  limit: number;
  currentPage: number;
  pages: number;
}
export interface IAllRolesEntity {
  _id: string;
  name: string;
  description: string;
  number_of_users: number;
  permissions: string[];
}









export interface IAllUsersAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllUsersAPIResponseData;
  message: string;
  timestamp: string;
}

export interface IGetUserByIdAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllUsersEntity;
  message: string;
  timestamp: string;
}
export interface IAllUsersAPIResponseData {
  data?: (IAllUsersEntity)[] | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface IAllUsersEntity {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
  phone_number?: string | null;
  is_verified: boolean;
  status: string;
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
  role: Role;
  user_type?: string | null;
  mentor_info?: MentorInfo | null;
  profile_pic?: string | null;
  professionalBio?: string | null;
  agreement_status?: AgreementStatus | null;
  profile_completion_percentage?: number | null;
  profile_completion?: ProfileCompletion | null;
  mentor_economy?: MentorEconomy | null;
  score?: number | null;
  dob?: string | null;
  username?: string | null;
  short_code?: string | null;
}
export interface Role {
  _id: string;
  name: string;
  number_of_users: number;
  description: string;
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
export interface AgreementStatus {
  all_blocking_accepted: boolean;
  all_mandatory_accepted: boolean;
  pending_blocking_agreements?: (null)[] | null;
  pending_agreements?: (null)[] | null;
  items?: (ItemsEntity)[] | null;
}
export interface ItemsEntity {
  agreement_id: string;
  title: string;
  slug: string;
  version: string;
  is_accepted: boolean;
  is_consented_latest: boolean;
  is_required: boolean;
  can_block: boolean;
  accepted_agreement_id: string;
  accepted_at: string;
}
export interface ProfileCompletion {
  profile_completion_percentage: number;
  completed_fields?: (CompletedFieldsEntity)[] | null;
  pending_fields?: (CompletedFieldsEntity)[] | null;
}
export interface CompletedFieldsEntity {
  section: string;
  field: string;
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



export interface IAllRolePermissionsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: (IAllRolePermissionsAPIResponseDataEntity)[] | null;
  message: string;
  timestamp: string;
}
export interface IAllRolePermissionsAPIResponseDataEntity {
  _id: string;
  model: string;
  permission?: (string)[] | null;
}

export interface IAllPermissionsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: (string)[] | null;
  message: string;
  timestamp: string;
}



export interface IAllModelsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: (string)[] | null;
  message: string;
  timestamp: string;
}
