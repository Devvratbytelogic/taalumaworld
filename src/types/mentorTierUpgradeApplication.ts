export interface IAllMentorTierUpgradeApplicationsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllMentorTierUpgradeApplicationsAPIResponseData;
  message: string;
  timestamp: string;
}

export interface IAllMentorTierUpgradeApplicationsAPIResponseData {
  applications?: IAllMentorTierUpgradeApplicationsEntity[] | null;
  pagination: Pagination;
}

export interface IMentorTierUpgradeEligibilityRequired {
  min_rating?: number | null;
  min_words_per_blueprint?: number | null;
  min_confirmed_sales?: number | null;
  min_days_since_published?: number | null;
}

export interface IMentorTierUpgradeEligibilityChecks {
  min_rating?: boolean;
  qualifying_blueprint?: boolean;
}

export interface IMentorTierUpgradeEligibility {
  overall_rating?: number | null;
  total_reviews?: number | null;
  qualifying_blueprint_count?: number | null;
  required?: IMentorTierUpgradeEligibilityRequired | null;
  checks?: IMentorTierUpgradeEligibilityChecks | null;
  is_eligible?: boolean;
}

export interface IAllMentorTierUpgradeApplicationsEntity {
  _id: string;
  user_id: IAllMentorTierUpgradeApplicationsUserId;
  status: string;
  current_tier_id: CurrentTierIdOrRequestedTierId;
  requested_tier_id: CurrentTierIdOrRequestedTierId;
  application_statement?: string | null;
  portfolio_url?: string | null;
  admin_notes?: string | null;
  decision_reason?: string | null;
  reviewed_by?: IMentorTierUpgradeReviewer | string | null;
  reviewed_at?: string | null;
  submitted_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  statement_word_count?: number;
  can_withdraw: boolean;
  eligibility?: IMentorTierUpgradeEligibility | null;
}

export interface IAllMentorTierUpgradeApplicationsUserId {
  _id: string;
  name: string;
  profile_pic?: string | null;
  email: string;
  status: string;
  professionalBio?: string;
  id: string;
}

export interface CurrentTierIdOrRequestedTierId {
  _id: string;
  code: string;
  mentor_share_percent?: number;
  platform_share_percent?: number;
  status?: string;
  rank: number;
  max_mentors?: number | null;
  min_rating?: number | null;
  min_words_per_blueprint?: number | null;
  min_confirmed_sales?: number | null;
  min_days_since_published?: number | null;
  equity_track?: boolean;
  equity_eligible_percent?: number | null;
}

export interface IMentorTierUpgradeReviewer {
  _id?: string;
  name?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetMyMentorTierUpgradeApplicationAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IGetMyMentorTierUpgradeApplicationAPIResponseData | null;
  message: string;
  timestamp: string;
}

export interface IGetMyMentorTierUpgradeApplicationAPIResponseData {
  _id: string;
  user_id: IAllMentorTierUpgradeApplicationsUserId | string;
  status: string;
  current_tier_id: CurrentTierIdOrRequestedTierId | string;
  requested_tier_id: CurrentTierIdOrRequestedTierId | string;
  application_statement?: string | null;
  portfolio_url?: string | null;
  admin_notes?: string | null;
  decision_reason?: string | null;
  reviewed_by?: IMentorTierUpgradeReviewer | string | null;
  reviewed_at?: string | null;
  submitted_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  can_withdraw?: boolean;
  eligibility?: IMentorTierUpgradeEligibility | null;
}

export interface IReviewMentorTierUpgradeApplicationPayload {
  action: string;
  decision_reason?: string;
  admin_notes?: string;
}

export interface IReviewMentorTierUpgradeApplicationAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: IAllMentorTierUpgradeApplicationsEntity | null;
  message: string;
  timestamp: string;
}
