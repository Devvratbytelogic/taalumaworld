export interface IAllBooksAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: (IAllBooksAPIResponseDataEntity)[] | null;
  message: string;
  timestamp: string;
}
export interface IAllBooksAPIResponseDataEntity {
  _id: string;
  title: string;
  thoughtLeader: ThoughtLeader;
  category: Category;
  subcategory?: SubcategoryOrCategory | null;
  description: string;
  coverImage: string;
  pricingModel: string;
  price: number;
  tags?: (string | null)[] | null;
  createdBy: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
export interface ThoughtLeader {
  deletedAt?: null;
  _id: string;
  fullName: string;
  email: string;
  professionalBio: string;
  avatar: string;
  status: string;
  followersCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
export interface Category {
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
export interface SubcategoryOrCategory {
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
