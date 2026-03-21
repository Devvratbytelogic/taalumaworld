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
    items?: (IHomeAllChaptersAPIResponseItemsEntity)[] | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  export interface IHomeAllChaptersAPIResponseItemsEntity {
    id: string;
    type: string;
    chapterNumber: number;
    title: string;
    description: string;
    pageCount: number;
    price: number;
    isFree: boolean;
    coverImage: string;
    bookId: BookId;
    bookTitle: string;
    author: string;
    authorAvatar?: null;
    category: Category;
    subcategory?: null;
  }
  export interface BookId {
    _id: string;
    title: string;
    thoughtLeader: ThoughtLeader;
    category: Category;
    subcategory?: null;
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
  export interface ThoughtLeader {
    _id: string;
    fullName: string;
    avatar?: null;
  }
  export interface Category {
    _id: string;
    name: string;
    slug: string;
  }
  