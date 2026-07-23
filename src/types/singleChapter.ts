export interface ISingleChapterAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IChapter;
  message: string;
  timestamp: string;
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
  isFree: boolean;
  coverImage: string;
  pdf?: string | null;
  page: number;
  price: number;
  status: string;
  deletedAt?: string | null;
  isPublishAllowed: boolean;
  aiReview?: string | null;
  aiScore?: number | null;
  aiClassification?: string | null;
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

export interface Series {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  id: string;
}
