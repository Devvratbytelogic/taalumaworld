export interface IAllContactusDataAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IAllContactusDataAPIResponseData)[] | null;
    message: string;
    timestamp: string;
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
  