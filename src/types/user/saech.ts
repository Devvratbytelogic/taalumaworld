export interface ISearchResultsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: ISearchResultsDataEntity;
    message: string;
    timestamp: string;
}
export interface ISearchResultsDataEntity {
    series?: (SeriesEntity)[] | null;
    blueprints?: (BlueprintsEntity)[] | null;
    mentors?: (MentorsEntity)[] | null;
}
export interface SeriesEntity {
    id: string;
    type: string;
    title: string;
    coverImage: string;
    price: number;
    effectivePrice: number;
    pricingAccessType: string;
    pricingModel: string;
    isPurchased: boolean;
    canRead: boolean;
    isCart: boolean;
    isWishlisted: boolean;
    legacyType: string;
}
export interface BlueprintsEntity {
    id: string;
    type: string;
    chapterNumber: number;
    title: string;
    coverImage: string;
    price: number;
    effectivePrice: number;
    pricingAccessType: string;
    isFree: boolean;
    seriesId: string;
    seriesTitle: string;
    isPurchased: boolean;
    canRead: boolean;
    isCart: boolean;
    isWishlisted: boolean;
    legacyType: string;
    blueprintNumber: number;
}
export interface MentorsEntity {
    id: string;
    type: string;
    name: string;
    email: string;
    profile_pic?: string | null;
    is_verified: boolean;
    is_verified_mentor: boolean;
    professionalBio: string;
    legacyType: string;
}
