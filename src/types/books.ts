export interface IAllBooksAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllBooksAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAllBooksAPIResponseData {
  data?: (IBook)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IBook {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  status: string;
  pricingModel: string;
  price: number;
  tags?: (string)[] | null;
  createdBy?: null;
  deletedAt?: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  json_ld: string;
  meta_description: string;
  meta_title: string;
  og_description: string;
  og_image: string;
  og_title: string;
  id: string;
}
