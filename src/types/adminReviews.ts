export interface IAdminReviewsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAdminReviewsAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAdminReviewsAPIResponseData {
  data?: (IAdminReviewsAPIResponseDataEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IAdminReviewsAPIResponseDataEntity {
  id: string;
  type: string;
  itemId: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: CreatedByOrUpdatedByOrCustomer | null;
  customer: Customer;
  createdBy: CreatedByOrUpdatedByOrCustomer1;
  item: Item;
}
export interface CreatedByOrUpdatedByOrCustomer {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
}
export interface Customer {
  id: string;
  name: string;
  email: string;
  profile_pic?: string | null;
}
export interface CreatedByOrUpdatedByOrCustomer1 {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
}
export interface Item {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  number: number;
  createdBy: CreatedByOrUpdatedByOrCustomer1;
  series: Series;
}
export interface Series {
  id: string;
  title: string;
  slug: string;
}
