export interface IUserAllCategoriesAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IUserAllCategoriesAPIResponseData)[] | null;
    message: string;
    timestamp: string;
}
export interface IUserAllCategoriesAPIResponseData {
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
    subcategories?: (string | null)[] | null;
    deletedAt?: null;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
}
