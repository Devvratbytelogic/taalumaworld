import { IUserAllAuthorsDataEntity } from "./user/allAuthors";

export interface IFollowsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IFollowsAPIResponseData;
    message: string;
    timestamp: string;
}
export interface IFollowsAPIResponseData {
    data?: (IFollowsAPIResponseDataEntity)[] | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface IFollowsAPIResponseDataEntity {
    _id: string;
    mentorId: string;
    userId: IFollowsAPIResponseDataEntityUserId;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
}
export interface IFollowsAPIResponseDataEntityUserId {
    _id: string;
    name: string;
    profile_pic: string;
    email: string;
    phone: string;
    id: string;
}




export interface IFollowedMentorsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IFollowedMentorsAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IFollowedMentorsAPIResponseData {
    data?: (IFollowedMentorsAPIResponseDataEntity)[] | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  export interface IFollowedMentorsAPIResponseDataEntity {
    _id: string;
    mentorId: IUserAllAuthorsDataEntity;
    userId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
  }
  