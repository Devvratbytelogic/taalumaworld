export interface IUserAllAuthorsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IUserAllAuthorsAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IUserAllAuthorsAPIResponseData {
    items?: (IUserAllAuthorsAPIResponseDataEntity)[] | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  export interface IUserAllAuthorsAPIResponseDataEntity {
    id: string;
    fullName: string;
    avatar?: string | null;
    professionalBio: string;
    followersCount: number;
  }
  