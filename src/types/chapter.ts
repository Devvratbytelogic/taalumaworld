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
  aiCriteria: AiCriteria;
  _id: string;
  number: number;
  title: string;
  slug: string;
  short_code: string;
  description: string;
  content: string;
  content_type?: string;
  isFree: boolean;
  coverImage: string;
  pdf?: string | null;
  page: number;
  price: number;
  status: string;
  createdBy: CreatedBy;
  deletedAt?: null;
  isPublishAllowed: boolean;
  aiReview?: string | null;
  aiScore?: number | null;
  aiClassification?: string | null;
  isMine?: boolean;
  aiWordCount?: number | null;
  aiScoredAt?: string | null;
  aiScoringStatus: string;
  isContentFlagged: boolean;
  contentFlagTypes?: (string | null)[] | null;
  contentFlagDetails?: string | null;
  contentFlaggedAt?: string | null;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  json_ld: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
  series: Series;
}
export interface AiCriteria {
  authenticity?: number | null;
  storytelling?: number | null;
  educational_value?: number | null;
  career_insight?: number | null;
  actionability?: number | null;
  originality?: number | null;
  taaluma_fit?: number | null;
}
export interface CreatedBy {
  _id: string;
  name: string;
  email: string;
  profile_pic?: string | null;
  id: string;
}
export interface Series {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  pricingModel: string;
  price: number;
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