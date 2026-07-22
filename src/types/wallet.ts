export interface IMentorLedgerWalletAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IMentorLedgerWalletData;
  message: string;
  timestamp: string;
}

export interface IMentorLedgerWalletData {
  summary: IMentorLedgerWalletSummary;
  data?: IMentorLedgerWalletDataEntity[] | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IMentorLedgerWalletSummary {
  wallet_type: string;
  currency: string;
  balance: number;
  lifetime_earnings: number;
  pending_withdrawals: number;
  total_withdrawn: number;
  available_balance: number;
}

export interface IMentorLedgerWalletDataEntity {
  id: string;
  type: string;
  transaction_id: string;
  entry_type: string;
  amount: number;
  status: string;
  balance_after: number;
  payout_method?: string | null;
  description: string;
  order_id: string;
  date: string;
}













export interface IWithdrawalAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IWithdrawalData;
  message: string;
  timestamp: string;
}
export interface IWithdrawalData {
  summary: IWithdrawalSummary;
  data?: (IWithdrawalDataEntity)[] | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface IWithdrawalSummary {
  total: number;
  pending: number;
}
export interface IWithdrawalDataEntity {
  id: string;
  user: IUser;
  wallet_type: string;
  amount: number;
  currency: string;
  balance_at_request: number;
  payout_method: string;
  mpesa_number?: string | null;
  bank_details?: IBankDetails | null;
  status: string;
  admin_notes?: string | null;
  rejection_reason?: string | null;
  reviewed_by?: IUser | string | null;
  reviewed_at?: string | null;
  paid_at?: string | null;
  payout_reference?: string | null;
  createdAt: string;
}
export interface IUser {
  id: string;
  name: string;
  email: string;
}
export interface IBankDetails {
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_branch: string;
}
