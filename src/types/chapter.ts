export interface IAllChaptersAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: (IAllChaptersAPIResponseData)[] | null;
  message: string;
  timestamp: string;
}
export interface IAllChaptersAPIResponseData {
  _id: string;
  book: Book;
  number: number;
  page: number;
  title: string;
  description: string;
  content: string;
  isFree: boolean;
  coverImage: string;
  price: number;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
export interface Book {
  _id: string;
  title: string;
  thoughtLeader: ThoughtLeader;
  category: string;
  subcategory: string;
  description: string;
  coverImage: string;
  pricingModel: string;
  price: number;
  tags?: (string)[] | null;
  createdBy: string;
  deletedAt?: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
export interface ThoughtLeader {
  _id: string;
  fullName: string;
  email: string;
  professionalBio: string;
  avatar: string;
  status: string;
  followersCount: number;
  createdBy: string;
  deletedAt?: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
