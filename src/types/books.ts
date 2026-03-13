import type { Book, Author, Category } from './content';

export type { Book, Author, Category };

/** @deprecated Use Author from @/types/content */
export type ThoughtLeader = Author;

export interface IAllBooksAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: Book[] | null;
  message: string;
  timestamp: string;
}

/** @deprecated Use Book from @/types/content */
export type BooksEntity = Book;
