export interface IAllUsersAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IAllUsersDataEntity)[] | null;
    message: string;
    timestamp: string;
  }
  export interface IAllUsersDataEntity {
    _id: string;
    name: string;
    profile_pic?: string | null;
    email: string;
    phone_number?: null;
    alt_phone?: null;
    is_verified: boolean;
    device_id?: null;
    dob?: null;
    status: string;
    fcm_token?: null;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
    role: Role;
    joinDate: string;
    purchases: number;
  }
  export interface Role {
    id: number;
    name: string;
  }
  