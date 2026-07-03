export interface IAllAuthorLeadersAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllAuthorLeadersAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IAllAuthorLeadersAPIResponseData {
    leaders?: ( IAuthorLeaderEntity)[] | null;
    totalAuthors: number;
    totalFollowers: number;
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
  export interface IAuthorLeaderEntity {
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
  