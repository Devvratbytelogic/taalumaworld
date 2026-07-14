export interface ISingleChapterAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: ISingleChapter;
    message: string;
    timestamp: string;
}
export interface ISingleChapter {
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
    id: string;
    series: ISeries;
}
export interface ISeries {
    _id: string;
    title: string;
    slug: string;
    coverImage: string;
    id: string;
}
