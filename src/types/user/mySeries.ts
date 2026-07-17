export interface IMySeriesAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IMySeriesAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IMySeriesAPIResponseData {
  summary: ISummary;
  items?: (ItemsEntity)[] | null;
  pagination: Pagination;
}
export interface ISummary {
  totalSeries: number;
  inProgress: number;
  completed: number;
  unread: number;
}
export interface ItemsEntity {
  id: string;
  order_id?: string | null;
  type: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  pricingModel: string;
  tags?: (string)[] | null;
  totalPages: number;
  chapterCount: number;
  isChapterPricing: boolean;
  priceLabel: string;
  fromPrice: number;
  mentor: Mentor;
  isPurchased: boolean;
  accessType: string;
  canRead: boolean;
  purchasedDirectly: boolean;
  purchasedViaChapter: boolean;
  isWishlisted: boolean;
  readStatus: string;
  progress: Progress;
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
}
export interface Progress {
  totalChapters: number;
  startedChapters: number;
  completedChapters: number;
}
export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}
