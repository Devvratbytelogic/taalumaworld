export interface IAllMentorTiersAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllMentorTiersAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAllMentorTiersAPIResponseData {
  data?: (IAllMentorTiersEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IAllMentorTiersEntity {
  _id: string;
  code: string;
  mentor_share_percent: number;
  platform_share_percent: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  is_verified_tier?: boolean | null;
  rank: number;
  max_mentors?: number | null;
  min_confirmed_sales?: number | null;
  min_days_since_published?: number | null;
  min_words_per_blueprint?: number | null;
  badge?: string | null;
}




export interface IGetMentorTierByIdAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IGetMentorTierByIdAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IGetMentorTierByIdAPIResponseData {
  _id: string;
  code: string;
  mentor_share_percent: number;
  platform_share_percent: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  is_verified_tier: boolean;
  label: string;
  rank: number;
  max_mentors?: number | null;
  min_confirmed_sales?: number | null;
  min_days_since_published?: number | null;
  min_words_per_blueprint?: number | null;
  badge?: string | null;
}