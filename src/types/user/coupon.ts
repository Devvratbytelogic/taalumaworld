export interface ICouponEntity {
  code: string;
  type: string;
}

export interface IAllCouponsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: (ICouponEntity)[] | null;
  message: string;
  timestamp: string;
}