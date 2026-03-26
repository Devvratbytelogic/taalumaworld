export interface IActiveReadersAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IActiveReadersAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IActiveReadersAPIResponseData {
    totalReaders: number;
    remainingReaders: number;
    users?: (IActiveReadersAPIResponseUsersEntity)[] | null;
  }
  export interface IActiveReadersAPIResponseUsersEntity {
    id: string;
    name: string;
    profilePic?: string | null;
    lastReadAt: string;
  }
  