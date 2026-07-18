export interface IWishlistAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IWishlistData;
  message: string;
  timestamp: string;
}
export interface IWishlistData {
  data?: (IWishlistItem)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IWishlistItem {
  _id: string;
  type: string;
  item_id: string;
  chapter?: null;
  is_purchased: boolean;
  createdAt: string;
  series: ISeries;
  blueprint?: IBlueprint | null;
}
export interface ISeries {
  _id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  coverImage: string;
  status?: string | null;
  pricingModel: string;
  price: number;
  tags?: (null)[] | null;
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
export interface IBlueprint {
  _id: string;
  number: number;
  title: string;
  slug: string;
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
  short_code: string;
  series: ISeries;
}
export interface ISeries {
  _id: string;
  title: string;
  coverImage: string;
  pricingModel: string;
  price: number;
}
