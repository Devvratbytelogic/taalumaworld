export interface IHomeAllChaptersAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IHomeAllChaptersAPIResponseData;
  message: string;
  timestamp: string;
}

export interface IHomeAllChaptersAPIResponseData {
  viewMode: string;
  items?: IContentItem[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Discriminated union — narrows automatically via `type` field */
export type IContentItem = IBookItem | IChapterItem;

export interface IBookItem {
  type: 'book';
  id: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  pricingModel: string;
  totalPages: number;
  chapterCount: number;
  isChapterPricing?: boolean;
  priceLabel?: string;
  fromPrice?: number;
  author: string;
  authorAvatar: string | null;
  authorBio?: string | null;
  category: ICategory;
  subcategory: ICategory | null;
  isPurchased: boolean;
  canRead: boolean;
  chapters: IBookChapterItem[];
}

export interface IChapterItem {
  type: 'chapter';
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  pageCount: number;
  price: number;
  isFree: boolean;
  coverImage: string;
  bookId: IBookRef;
  bookTitle: string;
  author: string;
  authorAvatar: string | null;
  category: ICategory;
  subcategory: ICategory | null;
}

/** A chapter embedded inside an IBookItem */
export interface IBookChapterItem {
  _id: string;
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

export interface IBookRef {
  _id: string;
  title: string;
  thoughtLeader: IThoughtLeader;
  category: ICategory;
  subcategory: ICategory | null;
  description: string;
  coverImage: string;
  pricingModel: string;
  price: number;
  tags?: (string | null)[] | null;
  createdBy: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IThoughtLeader {
  _id: string;
  fullName: string;
  avatar: string | null;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
}
