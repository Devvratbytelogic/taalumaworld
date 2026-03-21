export interface IMyChaptersAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IMyChaptersAPIResponseData;
    message: string;
    timestamp: string;
}
export interface IMyChaptersAPIResponseData {
    summary: IMyChaptersAPIResponseSummary;
    items?: (ItemsEntity)[] | null;
    pagination: Pagination;
}
export interface IMyChaptersAPIResponseSummary {
    totalChapters: number;
    inProgress: number;
    completed: number;
    unread: number;
}
export interface ItemsEntity {
    chapterId: string;
    chapterNumber: number;
    title: string;
    description: string;
    bookId: string;
    bookTitle: string;
    coverImage: string;
    pageCount: number;
    price: number;
    isFree: boolean;
    accessType: string;
    readStatus: string;
    lastPageRead: number;
    completed: boolean;
    progressPercent: number;
    progressUpdatedAt?: null;
    author: string;
    authorAvatar?: null;
    category: Category;
    subcategory?: null;
}
export interface Category {
    _id: string;
    name: string;
    slug: string;
}
export interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
}
