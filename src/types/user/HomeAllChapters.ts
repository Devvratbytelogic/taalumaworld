export interface IHomeAllChaptersAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IHomeAllChaptersData;
  message: string;
  timestamp: string;
}
export interface IHomeAllChaptersData {
  viewMode: string;
  items?: (IHomeAllChaptersItemsEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IHomeAllChaptersItemsEntity {
  id: string;
  slug?: string;
  type: string;
  title: string;
  description: string;
  coverImage: string;
  // price: number;
  effectivePrice: number;
  pricingAccessType: string;
  tags?: (string)[] | null;
  canRead: boolean;
  isPurchased: boolean;
  isCart: boolean;
  isWishlisted: boolean;
  mentor: IHomeAllChaptersMentor;
  /** Original 'book' | 'chapter' value (see VISIBLE) — kept for backward compatibility since `type` can now also be 'series' */
  legacyType: string;
  series: IHomeAllChaptersSeries;

  /** Present when the item is a standalone blueprint (viewMode: "chapter") */
  chapterNumber?: number;
  blueprintNumber?: number;
  pageCount?: number;
  isFree?: boolean;
  bookId?: string;
  bookTitle?: string;
  seriesId?: string;
  seriesTitle?: string;

  /** Present when the item is a series/book (viewMode: "series") */
  pricingModel?: string;
  totalPages?: number;
  chapterCount?: number;
  isChapterPricing?: boolean;
  priceLabel?: string;
  // fromPrice?: number;
}
export interface IHomeAllChaptersMentor {
  name: string;
  email: string;
  profile_pic: string;
  bio?: string | null;
  is_verified: boolean;
  is_mentor_verified: boolean;
  linkedin?: string | null;
  facebook?: string | null;
}

/** @deprecated use IHomeAllChaptersItemsEntity */
export type IHomeAllContentItem = IHomeAllChaptersItemsEntity;
export interface IHomeAllChaptersSeries {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  effectivePrice: number;
  pricingModel: string;
}