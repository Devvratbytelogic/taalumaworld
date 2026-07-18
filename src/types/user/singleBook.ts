export interface ISingleBookAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: ISingleBookAPIResponseData;
    message: string;
    timestamp: string;
}
export interface ISingleBookAPIResponseData {
    bookDetails: IBookDetails;
    chapters: IChapters;
}
export interface IBookDetails {
    id: string;
    slug: string;
    type: string;
    title: string;
    description: string;
    shareable_link: string;
    coverImage: string;
    price: number;
    effectivePrice: number;
    pricingAccessType: string;
    pricingModel: string;
    status: string;
    tags?: (string)[] | null;
    totalPages: number;
    chapterCount: number;
    isChapterPricing: boolean;
    priceLabel: string;
    fromPrice: number;
    mentor: Mentor;
    isPurchased: boolean;
    purchasedDirectly: boolean;
    purchasedViaChapter: boolean;
    accessType: string;
    canRead: boolean;
    isWishlisted: boolean;
    meta_title: string;
    meta_description: string;
    og_title: string;
    og_description: string;
    og_image: string;
    json_ld: string;
    legacyType: string;
    blueprintNumbers?: (number)[] | null;
}
export interface Mentor {
    name: string;
    email: string;
    profile_pic: string;
    is_verified: boolean;
    is_mentor_verified: boolean;
    linkedin: string;
    facebook: string;
    short_code?: string | null;
}
export interface IChapters {
    data?: (IChapterEntity)[] | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface IChapterEntity {
    id: string;
    slug: string;
    chapterNumber: number;
    title: string;
    description: string;
    pageCount: number;
    price: number;
    effectivePrice: number;
    pricingAccessType: string;
    isFree: boolean;
    coverImage: string;
    canRead: boolean;
    isPurchased: boolean;
    isCart: boolean;
    isWishlisted: boolean;
    percentage: number;
    completed: boolean;
    readStatus: string;
    meta_title: string;
    meta_description: string;
    og_title: string;
    og_description: string;
    og_image: string;
    json_ld: string;
    blueprintNumber: number;
}
