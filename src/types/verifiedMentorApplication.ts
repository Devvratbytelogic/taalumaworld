export interface IVerifiedMentorDocument {
  url: string;
  name: string;
  mime_type?: string;
  size?: number;
}

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
  type?: string | null;
  application_statement: string;
  portfolio_url?: string | null;
  documents?: IVerifiedMentorDocument[] | null;
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
  type?: string | null;
  application_statement: string;
  portfolio_url?: string | null;
  documents?: IVerifiedMentorDocument[] | null;
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
