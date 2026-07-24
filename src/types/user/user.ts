export interface IUserProfileAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IUserProfileAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IUserProfileAPIResponseData {
  _id: string;
  name: string;
  isNamePrivate: boolean;
  profile_pic?: string | null;
  email: string;
  isEmailPrivate: boolean;
  phone?: string | null;
  isPhonePrivate: boolean;
  is_verified: boolean;
  dob?: null;
  status: string;
  fcm_token?: (null)[] | null;
  linkedin?: null;
  facebook?: null;
  role_id: string;
  institution_id: string;
  status_reason?: null;
  status_changed_at?: null;
  deleted_at?: null;
  ifAffiliate: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  short_code: string;
  id: string;
  role: Role;
  user_type: string;
  account_type: string;
  profile_completion_percentage: number;
  institution: Institution;
}
export interface Role {
  _id: string;
  name: string;
  description: string;
  number_of_users: number;
}
export interface Institution {
  _id: string;
  name: string;
  domains?: (string)[] | null;
  promo_start: string;
  promo_end: string;
  status: string;
  books_pricing_type: string;
}
