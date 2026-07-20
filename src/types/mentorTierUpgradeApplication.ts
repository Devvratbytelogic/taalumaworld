export interface IAllMentorTierUpgradeApplicationsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllMentorTierUpgradeApplicationsAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IAllMentorTierUpgradeApplicationsAPIResponseData {
    applications?: (IAllMentorTierUpgradeApplicationsEntity)[] | null;
    pagination: Pagination;
  }
  export interface IAllMentorTierUpgradeApplicationsEntity {
    _id: string;
    user_id: IAllMentorTierUpgradeApplicationsUserId;
    status: string;
    current_tier_id: CurrentTierIdOrRequestedTierId;
    requested_tier_id: CurrentTierIdOrRequestedTierId;
    application_statement: string;
    portfolio_url?: null;
    admin_notes?: null;
    decision_reason?: null;
    reviewed_by?: null;
    reviewed_at?: null;
    submitted_at: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    statement_word_count: number;
    can_withdraw: boolean;
  }
  export interface IAllMentorTierUpgradeApplicationsUserId {
    _id: string;
    name: string;
    profile_pic?: null;
    email: string;
    status: string;
    professionalBio: string;
    id: string;
  }
  export interface CurrentTierIdOrRequestedTierId {
    _id: string;
    code: string;
    mentor_share_percent: number;
    platform_share_percent: number;
    status: string;
    rank: number;
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
    data: IGetMyMentorTierUpgradeApplicationAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IGetMyMentorTierUpgradeApplicationAPIResponseData {
    _id: string;
    user_id: string;
    status: string;
    current_tier_id: string;
    requested_tier_id: string;
    application_statement: string;
    portfolio_url?: null;
    admin_notes?: null;
    decision_reason?: null;
    reviewed_by?: null;
    reviewed_at?: null;
    submitted_at: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  