export interface IMyVerifiedMentorApplicationAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IMyVerifiedMentorApplicationAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IMyVerifiedMentorApplicationAPIResponseData {
  _id: string;
  user_id: string;
  status: string;
  application_statement: string;
  portfolio_url: string;
  admin_notes?: string | null;
  decision_reason?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  submitted_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IAllVerifiedMentorApplicationsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllVerifiedMentorApplicationsAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAllVerifiedMentorApplicationsAPIResponseData {
  applications?: (IApplicationsEntity)[] | null;
  pagination: IPaginationEntity;
}
export interface IApplicationsEntity {
  _id: string;
  user_id: IUserIdEntity;
  status: string;
  application_statement: string;
  portfolio_url: string;
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
export interface IUserIdEntity {
  _id: string;
  name: string;
  profile_pic?: null;
  email: string;
  status: string;
  professionalBio: string;
  id: string;
}
export interface IPaginationEntity {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
