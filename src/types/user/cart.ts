export interface ICartAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: (ICartDataEntity)[] | null;
  message: string;
  timestamp: string;
}
export interface ICartDataEntity {
  _id: string;
  user_id: string;
  guest_user?: null;
  city?: null;
  item_count: number;
  coupon_code?: string | null;
  coupon_type?: string | null;
  coupon_value?: number | null;
  discount_amount: number;
  coupon_discount?: number | null;
  tax_amount: number;
  tax_percent?: number | null;
  sub_total?: number | null;
  subtotal_amount: number;
  total_amount: number;
  createdAt: string;
  updatedAt: string;
  id: number;
  __v: number;
  cart_item?: (ICartItemEntity)[] | null;
}
export interface ICartItemEntity {
  _id: string;
  cart_id: string;
  user_id: string;
  guest_user?: null;
  chapter_id?: string | null;
  book_id?: string | null;
  quantity: number;
  type: string;
  single_price: number;
  mrp: number;
  selling_price: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  id: number;
  __v: number;
  current_price: number;
  pricing_access_type: string;
  price_changed: boolean;
  legacyType: string;
  series_id?: string | null;
  series?: ISeries | null;
  blueprint_id?: string | null;
  blueprint?: IBlueprint | null;
}
export interface ISeries {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  status: string;
  pricingModel: string;
  price: number;
  tags?: (string)[] | null;
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
}
export interface IBlueprint {
  _id: string;
  number: number;
  title: string;
  slug: string;
  description: string;
  isFree: boolean;
  coverImage: string;
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
  series: ISeries1;
}
export interface ISeries1 {
  _id: string;
  title: string;
  coverImage: string;
  pricingModel: string;
}
