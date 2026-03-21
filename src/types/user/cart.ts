export interface ICartAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (ICartAPIResponseData)[] | null;
    message: string;
    timestamp: string;
  }
  export interface ICartAPIResponseData {
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
    chapter_id: string;
    book_id?: null;
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
    chapter: Chapter;
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
    thoughtLeader: string;
    category: string;
    subcategory?: null;
    description: string;
    coverImage: string;
    pricingModel: string;
    price: number;
    tags?: (null)[] | null;
    createdBy: string;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  