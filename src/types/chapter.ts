import type { BlueprintStatus } from '@/constants/blueprint';

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
  status: BlueprintStatus;
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

/** Lean blueprint lookup, filtered by book ids (used to populate blueprint pickers) */
export interface IBlueprintsByBookIdsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IBlueprintLookupEntity[];
  message: string;
  timestamp: string;
}
export interface IBlueprintLookupEntity {
  _id: string;
  title: string;
  slug: string;
  short_code: string;
}