export interface IUserAllAuthorsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IUserAllAuthorsDataEntity;
  message: string;
  timestamp: string;
}
export interface IUserAllAuthorsDataEntity {
  data?: (IUserAllAuthorsDataEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IUserAllAuthorsDataEntity {
  _id: string;
  name: string;
  profile_pic: string;
  email: string;
  status: string;
  id: string;
}
