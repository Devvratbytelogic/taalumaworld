import type { IMentor } from '@/types/user/singleChapter';

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
    slug?: string;
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
    authorAvatar?: string | null;
    authorBio?: string;
    mentor?: IMentor | null;
    shareable_link?: string;
    category: Category;
    subcategory?: null;
    isPurchased: boolean;
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    jsonLd?: string;
    chapters: IBookChapterItem[];
}
export interface Category {
    _id: string;
    name: string;
    slug: string;
}

export interface IBookChapterItem {
    _id: string;
    slug?: string;
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
