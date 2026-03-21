export interface ISearchResultsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: ISearchResultsAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface ISearchResultsAPIResponseData {
    books?: (BooksEntity)[] | null;
    chapters?: (ChaptersEntity)[] | null;
    authors?: (AuthorsEntity)[] | null;
  }
  export interface BooksEntity {
    id: string;
    type: string;
    title: string;
    description: string;
    coverImage: string;
    price: number;
    pricingModel: string;
    author: string;
    authorAvatar?: string | null;
    category: CategoryOrSubcategory;
    subcategory?: CategoryOrSubcategory1 | null;
  }
  export interface CategoryOrSubcategory {
    _id: string;
    name: string;
    slug: string;
  }
  export interface CategoryOrSubcategory1 {
    _id: string;
    name: string;
    slug: string;
  }
  export interface ChaptersEntity {
    id: string;
    type: string;
    chapterNumber: number;
    title: string;
    description: string;
    pageCount: number;
    price: number;
    isFree: boolean;
    coverImage: string;
    bookId: string;
    bookTitle: string;
    author: string;
    authorAvatar?: string | null;
    category: CategoryOrSubcategory;
    subcategory?: CategoryOrSubcategory2 | null;
  }
  export interface CategoryOrSubcategory2 {
    _id: string;
    name: string;
    slug: string;
  }
  export interface AuthorsEntity {
    id: string;
    type: string;
    fullName: string;
    avatar?: string | null;
    professionalBio: string;
    followersCount: number;
  }
  