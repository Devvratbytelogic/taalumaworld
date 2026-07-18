export interface IWishlistAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IWishlistAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IWishlistAPIResponseData {
  data?: (IWishlistAPIResponseDataEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IWishlistAPIResponseDataEntity {
  _id: string;
  type: string;
  item_id: string;
  chapter?: null;
  is_purchased: boolean;
  createdAt: string;
  series: ISeriesEntity;
  blueprint?: IBlueprintEntity | null;
}
export interface ISeriesEntity {
  _id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  coverImage: string;
  status?: string | null;
  pricingModel: string;
  price: number;
  tags?: (string)[] | null;
  deletedAt?: null;
  meta_title?: string | null;
  meta_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  json_ld?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  __v?: number | null;
}
export interface IBlueprintEntity {
  _id: string;
  number: number;
  title: string;
  slug: string;
  short_code: string;
  description: string;
  content: string;
  isFree: boolean;
  coverImage: string;
  pdf: string;
  page: number;
  price: number;
  status: string;
  deletedAt?: null;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  json_ld: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  series: ISeriesEntity;
}
export interface ISeriesEntity {
  _id: string;
  title: string;
  coverImage: string;
  pricingModel: string;
  price: number;
}
