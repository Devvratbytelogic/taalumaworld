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
