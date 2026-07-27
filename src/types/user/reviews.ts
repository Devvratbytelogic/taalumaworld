export interface ICreateReviewPayload {
  type?: 'Book' | 'Chapter';
  item_id: string;
  rating: number;
  comment?: string;
}

export interface IReviewsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IReviewsAPIResponseData;
  message: string;
  timestamp: string;
}

export interface IReviewsAPIResponseData {
  data?: (IReviewEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IReviewEntity {
  _id: string;
  type?: 'Book' | 'Chapter';
  item_id: string;
  rating: number;
  comment?: string | null;
  user_id?: IReviewUser | string | null;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
  id?: string;
}

export interface IReviewUser {
  _id: string;
  name: string;
  profile_pic?: string | null;
  email?: string | null;
  id?: string;
}
