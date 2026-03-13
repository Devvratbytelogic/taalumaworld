/**
 * API-backed types for books, chapters, authors, and categories.
 * Use these instead of mockData for type safety with real API responses.
 */

/** Author / Thought Leader from API (or mapped for UI: id, name) */
export interface Author {
  _id?: string;
  id?: string;
  fullName?: string;
  /** UI: display name (when mapping from API use fullName) */
  name?: string;
  email?: string;
  professionalBio?: string;
  /** UI alias for professionalBio */
  bio?: string;
  avatar?: string;
  status?: string;
  followersCount?: number;
  booksCount?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

/** Category from API */
export interface Category {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  subcategories?: null[] | null;
  deletedAt?: null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/** Book from API */
export interface Book {
  _id: string;
  id: string;
  title: string;
  thoughtLeader: Author;
  category: Category | string;
  subcategory?: Category | null;
  description: string;
  coverImage: string;
  pricingModel: string;
  price: number;
  tags?: (string | null)[] | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  __v?: number;
}

/** Chapter from API (entity with optional populated book) */
export interface Chapter {
  _id: string;
  id: string;
  book?: Book;
  /** Book id (when book is not populated or for convenience) */
  bookId?: string;
  number: number;
  title: string;
  description: string;
  content: string;
  coverImage?: string | null;
  /** Alias for coverImage for UI compatibility */
  featuredImage?: string;
  isFree: boolean;
  price: number;
  status: string;
  page?: number | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/** Content block for chapter content (e.g. read view) */
export interface ContentBlock {
  type: 'text' | 'image';
  content: string;
  alt?: string;
  caption?: string;
}
