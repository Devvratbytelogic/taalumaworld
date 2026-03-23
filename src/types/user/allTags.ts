export interface IUserAllTagsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IUserAllTagsAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IUserAllTagsAPIResponseData {
    tags?: (string)[] | null;
    total: number;
  }
  