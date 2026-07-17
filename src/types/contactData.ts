export interface IAllContactusDataAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllContactusAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IAllContactusAPIResponseData {
    data?: (IAllContactusDataAPIResponseData)[] | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  export interface IAllContactusDataAPIResponseData {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
  }
  