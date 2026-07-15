export interface IAllChaptersAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllChaptersAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAllChaptersAPIResponseData {
  data?: (IChapter)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IChapter {
  _id: string;
  number: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  isFree: boolean;
  coverImage: string;
  pdf: string;
  page: number;
  price: number;
  status: string;
  deletedAt?: null;
  meta_title: string;
  meta_description: string;
  og_title: string;
  createdBy: ICreatedBy;
  og_description: string;
  og_image: string;
  json_ld: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
  series: ISeries;
}
export interface ISeries {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  pricingModel: string;
  price: number;
  id: string;
}

export interface ICreatedBy {
  _id: string;
  name: string;
  profile_pic: string;
  email: string;
  id: string;
}