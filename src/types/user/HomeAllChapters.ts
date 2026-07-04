export interface IHomeAllChaptersAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IHomeAllContentData;
  message: string;
  timestamp: string;
}
export interface IHomeAllContentData {
  viewMode: string;
  items?: (IHomeAllContentItem)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IHomeAllContentItem {
  _id: string;
  id: string;
  type: string;
  chapterNumber: number;
  title: string;
  description: string;
  chapters?: (IHomeAllContentItem)[] | null;
  pageCount?: number | null;
  number: number;
  price: number;
  isFree: boolean;
  coverImage: string;
  bookId: IHomeAllContentBookId;
  pricingModel: string;
  chapterCount: number; 
  bookTitle: string;
  author: string;
  authorBio: string;
  authorSocial: IHomeAllContentAuthorSocial;
  authorAvatar?: string | null;
  category: IHomeAllContentCategory;
  subcategory?: IHomeAllContentCategory | null;
  canRead: boolean;
  isCart: boolean;
}
export interface IHomeAllContentAuthorSocial {
  linkedin: string;
  facebook: string;
}
export interface IHomeAllContentBookId {
  _id: string;
  title: string;
  thoughtLeader: IHomeAllContentThoughtLeader;
  category: IHomeAllContentCategory;
  subcategory?: IHomeAllContentCategory | null;
  description: string;
  coverImage: string;
  pricingModel: string;
  price: number;
  tags?: (null)[] | null;
  createdBy: string;
  deletedAt?: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IHomeAllContentThoughtLeader {
  _id: string;
  fullName: string;
  avatar?: null;
}
export interface IHomeAllContentCategory {
  _id: string;
  name: string;
  slug: string;
}