export interface ICartAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: (ICartAPIResponseDataEntity)[] | null;
  message: string;
  timestamp: string;
}
export interface ICartAPIResponseDataEntity {
  _id: string;
  user_id: string;
  guest_user?: null;
  city?: null;
  item_count: number;
  coupon_code?: null;
  coupon_type?: null;
  discount_amount: number;
  coupon_discount?: null;
  tax_amount: number;
  total_amount: number;
  createdAt: string;
  updatedAt: string;
  id: number;
  __v: number;
  cart_item?: (CartItemEntity)[] | null;
}
export interface CartItemEntity {
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
  chapter?: Chapter | null;
  book?: CartBook | null;
}
export interface Chapter {
  _id: string;
  book: Book;
  number: number;
  page: number;
  title: string;
  description: string;
  content: string;
  isFree: boolean;
  coverImage: string;
  pdf: string;
  price: number;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface Book {
  _id: string;
  title: string;
  thoughtLeader: ThoughtLeader;
  category: string;
  subcategory?: null;
}
export interface CartBook {
  _id: string;
  title: string;
  coverImage: string;
  description: string;
  price: number;
  pricingModel: string;
  thoughtLeader?: ThoughtLeader | null;
  category?: string | null;
}
export interface ThoughtLeader {
  _id: string;
  fullName: string;
  avatar?: null;
}
