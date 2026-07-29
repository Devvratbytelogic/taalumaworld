export interface IReferralWalletLedgerAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IReferralWalletLedgerAPIResponseData;
  message: string;
  timestamp: string;
}

export interface IReferralWalletLedgerAPIResponseData {
  summary: IReferralWalletLedgerSummary;
  data: IReferralWalletLedgerList;
}

export interface IReferralWalletLedgerSummary {
  balance: number;
  lifetime_earnings: number;
  lifetime_spent: number;
  total_entries: number;
  credit_count: number;
  debit_count: number;
  total_credits: number;
  total_debits: number;
}

export interface IReferralWalletLedgerList {
  data?: IReferralWalletLedgerEntry[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IReferralWalletLedgerEntry {
  _id: string;
  transaction_id: string;
  entry_type: string;
  type: string;
  amount: number;
  absolute_amount: number;
  balance_after: number;
  commission_type: string;
  commission_value: number;
  description: string;
  referred_user: IReferralWalletReferredUser;
  order: IReferralWalletOrder;
  referral: IReferralWalletReferral;
  createdAt: string;
}

export interface IReferralWalletReferredUser {
  _id: string;
  name: string;
  email: string;
}

export interface IReferralWalletOrder {
  _id: string;
  order_number: string;
  total_amount: number;
}

export interface IReferralWalletReferral {
  _id: string;
  referral_code: string;
  isRegistered: boolean;
  isPurchased: boolean;
}
