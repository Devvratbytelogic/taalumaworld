export type MentorEquityListStatus = 'all' | 'eligible' | 'granted' | 'pending';

export interface IMentorEquityUser {
  id: string;
  name?: string | null;
  email?: string | null;
  profile_pic?: string | null;
}

export interface IMentorEquityTier {
  id: string;
  code: string;
  rank?: number | null;
  equity_track?: boolean;
  equity_eligible_percent?: number | null;
}

export interface IMentorEquityFlags {
  track: boolean;
  eligible_percent?: number | null;
  meets_criteria?: boolean;
  is_eligible: boolean;
  is_granted: boolean;
  eligible_at?: string | null;
  granted_at?: string | null;
  notes?: string | null;
}

export interface IMentorEquityEligibilityRequired {
  min_rating?: number | null;
  min_words_per_blueprint?: number | null;
  min_confirmed_sales?: number | null;
  min_days_since_published?: number | null;
}

export interface IMentorEquityEligibilityChecks {
  min_rating?: boolean;
  qualifying_blueprint?: boolean;
  [key: string]: boolean | undefined;
}

export interface IMentorEquityEligibility {
  overall_rating?: number | null;
  total_reviews?: number | null;
  qualifying_blueprint_count?: number | null;
  required?: IMentorEquityEligibilityRequired | null;
  checks?: IMentorEquityEligibilityChecks | null;
  is_eligible?: boolean;
}

export interface IMentorEquityPool {
  size?: number | null;
  qualifying_count?: number | null;
  slots?: number | null;
  rank?: number | null;
}

export interface IMentorEquityEntity {
  mentor_id: string;
  user?: IMentorEquityUser | null;
  tier?: IMentorEquityTier | null;
  equity: IMentorEquityFlags;
  eligibility?: IMentorEquityEligibility | null;
  pool?: IMentorEquityPool | null;
}

export interface IMentorEquityPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IAllMentorEquityAPIResponseData {
  mentors?: IMentorEquityEntity[] | null;
  data?: IMentorEquityEntity[] | null;
  pagination?: IMentorEquityPagination;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface IAllMentorEquityAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllMentorEquityAPIResponseData;
  message: string;
  timestamp: string;
}

export interface IMyMentorEquityData {
  mentor_id?: string;
  user?: IMentorEquityUser | null;
  tier?: IMentorEquityTier | null;
  equity: IMentorEquityFlags;
  eligibility?: IMentorEquityEligibility | null;
  pool?: IMentorEquityPool | null;
}

export interface IMyMentorEquityAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IMyMentorEquityData;
  message: string;
  timestamp: string;
}

export interface IUpdateMentorEquityAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: IMentorEquityEntity | IMyMentorEquityData;
  message: string;
  timestamp: string;
}

export interface IAssignMentorTierAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: unknown;
  message: string;
  timestamp: string;
}
