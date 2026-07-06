export interface ISingleChapterAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: ISingleChapterAPIResponseData;
  message: string;
  timestamp: string;
}
export interface ISingleChapterAPIResponseData {
  id: string;
  chapterId: string;
  type: string;
  chapterNumber: number;
  title: string;
  shareable_link: string;
  description: string;
  pageCount: number;
  content: string;
  pdf?: string | null;
  price: number;
  isFree: boolean;
  coverImage: string;
  bookId: string;
  bookTitle: string;
  author: string;
  authorAvatar?: string | null;
  mentor: IMentor | null;
  category: Category;
  subcategory?: null;
  canRead: boolean;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  jsonLd?: string;
}
export interface Category {
  _id: string;
  name: string;
  slug: string;
}
export interface IMentor {
  name: string;
  profilePicture: string;
  email: string;
  phone: string;
  bio: string;
  social: {
    website: string;
    twitter: string;
    facebook: string;
  }
}