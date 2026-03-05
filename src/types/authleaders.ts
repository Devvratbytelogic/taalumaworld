export interface IAllAuthorLeadersAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllAuthorLeadersAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IAllAuthorLeadersAPIResponseData {
    leaders?: (LeadersEntity)[] | null;
    totalAuthors: number;
    totalFollowers: number;
  }
  export interface LeadersEntity {
    _id: string;
    fullName: string;
    email: string;
    professionalBio: string;
    avatar: string;
    status: string;
    followersCount: number;
    createdBy: string;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
  }
  