export interface IAllTransactionsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllTransactionsData;
  message: string;
  timestamp: string;
}
export interface IAllTransactionsData {
  summary: IAllTransactionsSummary;
  data: IAllTransactionsData1;
}
export interface IAllTransactionsSummary {
  totalRevenue: number;
  totalTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  statusCounts: IAllTransactionsStatusCounts;
}
export interface IAllTransactionsStatusCounts {
  completed: number;
  failed: number;
}
export interface IAllTransactionsData1 {
  data?: (IAllTransactionsDataEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IAllTransactionsDataEntity {
  id: string;
  transactionId?: string | null;
  userName: string;
  userEmail: string;
  item: string;
  type: string;
  amount: number;
  date: string;
  status: string;
  receiptNumber?: string | null;
}
