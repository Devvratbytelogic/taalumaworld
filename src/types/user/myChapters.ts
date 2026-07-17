export interface IMyChaptersAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IMyChaptersAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IMyChaptersAPIResponseData {
  summary: ISummary;
  items?: (ItemsEntity)[] | null;
  pagination: Pagination;
}
export interface ISummary {
  totalChapters: number;
  inProgress: number;
  completed: number;
  unread: number;
}
export interface ItemsEntity {
  chapterId: string;
  order_id?: string | null;
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
  isWishlisted: boolean;
  readStatus: string;
  percentage: number;
  completed: boolean;
  progressUpdatedAt?: string | null;
  mentor: string;
  seriesId: string;
  seriesTitle: string;
  blueprintNumber: number;
}
export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}
