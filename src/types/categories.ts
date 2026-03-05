export interface IAllCategoriesAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IAllCategoriesAPIResponseData)[] | null;
    message: string;
    timestamp: string;
  }
  export interface IAllCategoriesAPIResponseData {
    _id: string;
    name: string;
    slug: string;
    subcategories?: (SubcategoriesEntity | null)[] | null;
    deletedAt?: null;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
  }
  export interface SubcategoriesEntity {
    _id: string;
    name: string;
    slug: string;
    subcategories?: (null)[] | null;
    deletedAt?: null;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
  }

  /** Alias for category used in admin/books; same shape as API response. */
  export type CategoryEntity = IAllCategoriesAPIResponseData;
  