export interface IUserReviewsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IUserReviewsAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IUserReviewsAPIResponseData {
  summary: IUserReviewsAPISummary;
  data?: (IUserReviewEntity)[] | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface IUserReviewsAPISummary {
  type: string;
  itemId: string;
  averageRating: number;
  lowestRating: number;
  highestRating: number;
  totalReviews: number;
}
export interface IUserReviewEntity {
  id: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  customer: IUserReviewCustomer;
}
export interface IUserReviewCustomer {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
}

/** GET /user/reviews/my */
export interface IMyReviewsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IMyReviewsAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IMyReviewsAPIResponseData {
  reviews?: (IMyReviewsAPIResponseDataEntity)[] | null;
  pagination: Pagination;
}
export interface IMyReviewsAPIResponseDataEntity {
  id: string;
  type: string;
  itemId: string;
  rating: number;
  comment: string;
  status: string;
  reason?: string | null;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
}
export interface Customer {
  id: string;
  name: string;
  email: string;
  profile_pic?: null;
}
export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}
