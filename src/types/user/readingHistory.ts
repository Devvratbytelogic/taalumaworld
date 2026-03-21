export interface IMyReadingHistoryAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IMyReadingHistoryAPIResponseData;
    message: string;
    timestamp: string;
}
export interface IMyReadingHistoryAPIResponseData {
    summary: Summary;
    items?: IReadingHistoryItem[] | null;
    pagination: Pagination;
}
export interface IReadingHistoryItem {
    chapterId: string;
    chapterNumber: number;
    title: string;
    description: string;
    bookId: string;
    bookTitle: string;
    coverImage: string;
    progressPercent: number;
    completed: boolean;
    lastReadAt: string;
    author: string;
    authorAvatar?: string | null;
}
export interface Summary {
    total: number;
    completed: number;
    inProgress: number;
}
export interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
}
