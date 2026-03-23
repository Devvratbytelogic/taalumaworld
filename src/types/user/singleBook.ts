
export interface ISingleBookAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: ISingleBookAPIResponseData;
    message: string;
    timestamp: string;
}
export interface ISingleBookAPIResponseData {
    id: string;
    type: string;
    title: string;
    description: string;
    coverImage: string;
    price: number;
    pricingModel: string;
    totalPages: number;
    chapterCount: number;
    isChapterPricing: boolean;
    priceLabel: string;
    fromPrice: number;
    author: string;
    authorAvatar?: null;
    category: Category;
    subcategory?: null;
    isPurchased: boolean;
    chapters: IBookChapterItem[];
}
export interface Category {
    _id: string;
    name: string;
    slug: string;
}

export interface IBookChapterItem {
    _id: string;
    book: string;
    number: number;
    page: number;
    title: string;
    description: string;
    content: string;
    isFree: boolean;
    canRead: boolean;
    coverImage: string;
    pdf: string | null;
    price: number;
    status: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
