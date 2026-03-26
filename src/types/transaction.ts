export interface IAllTransactionsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllTransactionsAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IAllTransactionsAPIResponseData {
    totalRevenue: number;
    payments?: (IPaymentsEntity)[] | null;
  }
  export interface IPaymentsEntity {
    transactionId: string;
    userName: string;
    userEmail: string;
    item: string;
    type: string;
    amount: number;
    date: string;
    status: string;
  }
  