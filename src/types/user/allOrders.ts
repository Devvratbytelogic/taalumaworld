export interface IAllOrdersAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllOrdersAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IAllOrdersAPIResponseData {
    orders?: (IAllOrdersAPIResponseDataEntity)[] | null;
    pagination: Pagination;
  }
  export interface IAllOrdersAPIResponseDataEntity {
    _id: string;
    user_id: string;
    invoice_number: number;
    order_number: string | number;
    item_count: number;
    purchase_type: string;
    coupon_code?: string | null;
    coupon_type?: string | null;
    coupon_value?: number | null;
    discount_amount: number;
    coupon_discount?: number | null;
    sub_total: number;
    tax_percent: number;
    tax_amount: number;
    total_amount: number;
    billing_address: BillingAddress;
    status: string;
    payment_method: string;
    transaction_id: string;
    payment_status: string;
    paid_at: string;
    is_gift?: boolean | null;
    gift_recipient_email?: null;
    gift_recipient_user_id?: null;
    gift_status?: null;
    gift_id?: null;
    gift_claimed_at?: null;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
    type: string;
    Order_items?: (OrderItemsEntity)[] | null;
  }
  export interface BillingAddress {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2: string;
    landmark?: null;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  }
  export interface OrderItemsEntity {
    _id: string;
    order_id: string;
    user_id: string;
    chapter_id?: string | null;
    book_id?: string | null;
    quantity: number;
    type: string;
    single_price: number;
    mrp?: null;
    selling_price: number;
    total: number;
    tax_name: string;
    tax_percent: number;
    tax_amount: number;
    tax: number;
    mentor_id: string;
    tier_code_at_sale: string;
    mentor_share_percent: number;
    platform_share_percent: number;
    mentor_share: number;
    platform_share: number;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
    legacyType: string;
    blueprint_id?: string | null;
    blueprint?: Blueprint | null;
    series_id?: string | null;
    series?: Series | null;
  }
  export interface Blueprint {
    _id: string;
    number: number;
    title: string;
    slug: string;
    short_code: string;
    description: string;
    content: string;
    isFree: boolean;
    coverImage: string;
    pdf?: string | null;
    page: number;
    price: number;
    status: string;
    deletedAt?: null;
    isPublishAllowed?: boolean | null;
    aiReview?: string | null;
    aiScore?: number | null;
    aiClassification?: string | null;
    aiCriteria?: AiCriteria | null;
    aiWordCount?: number | null;
    aiScoredAt?: string | null;
    aiScoringStatus?: string | null;
    isContentFlagged?: boolean | null;
    contentFlagTypes?: (null)[] | null;
    contentFlagDetails?: null;
    contentFlaggedAt?: null;
    meta_title: string;
    meta_description: string;
    og_title: string;
    og_description: string;
    og_image: string;
    json_ld: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    isAiGenerated?: boolean | null;
    aiGeneratedDetails?: string | null;
    aiGeneratedLikelihood?: number | null;
    series: Series1;
  }
  export interface AiCriteria {
    authenticity: number;
    storytelling: number;
    educational_value: number;
    career_insight: number;
    actionability: number;
    originality: number;
    taaluma_fit: number;
    human_voice: number;
  }
  export interface Series1 {
    _id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string;
    status: string;
    pricingModel: string;
    price: number;
    tags?: (string | null)[] | null;
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
  }
  export interface Series {
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
    meta_title: string;
    meta_description: string;
    og_title: string;
    og_description: string;
    og_image: string;
    json_ld: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  export interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  }
  