export interface IAdminReviewsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAdminReviewsAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAdminReviewsAPIResponseData {
  data?: (IAdminReviewEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IAdminReviewEntity {
  id: string;
  type: string;
  itemId: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  item: Item;
}
export interface Customer {
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
  series: Series;
}
export interface Series {
  id: string;
  title: string;
  slug: string;
}
