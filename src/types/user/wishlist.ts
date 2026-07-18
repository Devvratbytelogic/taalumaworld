import { IHomeAllChaptersItemsEntity } from './HomeAllChapters';

export interface IWishlistAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IWishlistAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IWishlistAPIResponseData {
  items?: (WishlistItemsEntity)[] | null;
  pagination: IWishlistPagination;
}
/** Wishlist items share the same shape as the home/library content cards (book or chapter), plus the wishlist entry id */
export type WishlistItemsEntity = IHomeAllChaptersItemsEntity & {
  wishlistId?: string;
};
export interface IWishlistPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}
