export interface IAdminReferralWalletsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAdminReferralWalletsData;
  message: string;
  timestamp: string;
}

export interface IAdminReferralWalletsData {
  data?: IAdminReferralWallet[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IAdminReferralWallet {
  id: string;
  name: string;
  email: string;
  profile_pic?: string | null;
  role: string;
  user_type: string;
  status: string;
  referral_code: string;
  wallet_balance: number;
  lifetime_earnings: number;
  lifetime_spent: number;
  total_referrals: number;
  completed_referrals: number;
  pending_referrals: number;
  conversion_rate: number;
  commission: number;
}
