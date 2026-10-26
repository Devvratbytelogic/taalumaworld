export interface IAdminWishlistsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAdminWishlistsData;
  message: string;
  timestamp: string;
}
export interface IAdminWishlistsData {
  data?: (IAdminWishlistsDataEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IAdminWishlistsDataEntity {
  id: string;
  type: string;
  item_id: string;
  saved_at: string;
  user: User;
  series?: Series | null;
  blueprint?: Blueprint | null;
  legacyType: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
}
export interface Series {
  id: string;
  title: string;
  slug: string;
}
export interface Blueprint {
  id: string;
  title: string;
  slug: string;
  series_id: string;
  series_title: string;
}
