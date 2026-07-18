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
