export interface IAllCouponsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllCouponsData;
  message: string;
  timestamp: string;
}
export interface IAllCouponsData {
  data?: (IAdminCouponEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IAdminCouponEntity {
  _id: string;
  coupon_code: string;
  coupon_type: string;
  coupon_for: string;
  institutions?: (string)[] | null;
  value: number;
  affiliate_id?: null;
  affiliate_application_id?: null;
  give_value: number;
  take_value: number;
  expiry_date: string;
  minimum_cart_value: number;
  usage_limit: number;
  redeemed_count: number;
  status: string;
  deletedAt?: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
  blueprints?: (string)[] | null;
  series?: (string)[] | null;
}
