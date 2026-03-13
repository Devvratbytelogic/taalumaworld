import type { Book, Chapter } from './content';

export type { Book, Chapter };

/** Payload for POST /admin/chapters (add chapter) */
export interface AddChapterPayload {
  book: string;
  number: number;
  title: string;
  description: string;
  content: string;
  isFree: boolean;
  price: number;
  status: string;
}

/** Payload for PUT /admin/chapters/:id (update chapter) */
export interface UpdateChapterPayload {
  book: string;
  number: number;
  title: string;
  description: string;
  content?: string;
  isFree: boolean;
  price: number;
  status?: string;
  page?: number;
}

export interface IAllChaptersAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: Chapter[] | null;
  message: string;
  timestamp: string;
}

/** @deprecated Use Chapter from @/types/content */
export type IAllChaptersAPIResponseDataEntity = Chapter;
