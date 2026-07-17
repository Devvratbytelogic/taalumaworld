export interface IAllTestimonialsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllTestimonialsAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAllTestimonialsAPIResponseData {
  data?: (IAllTestimonialsAPIResponseDataEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IAllTestimonialsAPIResponseDataEntity {
  _id: string;
  name: string;
  title?: string;
  photo?: string | null;
  rating: number;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export type ITestimonialsDataEntity = IAllTestimonialsAPIResponseDataEntity;
