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
    items?: (IMyReadingHistoryAPIResponseItemsEntity)[] | null;
    pagination: Pagination;
  }
  export interface Summary {
    total: number;
    completed: number;
    inProgress: number;
  }
  export interface IMyReadingHistoryAPIResponseItemsEntity {
    progressId: string;
    lastReadAt: string;
    createdAt: string;
    lastPageRead: number;
    completed: boolean;
    progressPercent: number;
    readStatus: string;
    chapterId: string;
    chapterNumber: number;
    chapterTitle: string;
    chapterCoverImage: string;
    pageCount: number;
    bookId: string;
    bookTitle: string;
    bookCoverImage: string;
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
  