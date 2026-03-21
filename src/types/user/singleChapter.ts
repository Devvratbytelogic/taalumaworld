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
    description: string;
    pageCount: number;
    content: string;
    pdf?: null;
    price: number;
    isFree: boolean;
    coverImage: string;
    bookId: string;
    bookTitle: string;
    author: string;
    authorAvatar?: null;
    category: Category;
    subcategory?: null;
    canRead: boolean;
  }
  export interface Category {
    _id: string;
    name: string;
    slug: string;
  }
  