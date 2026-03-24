export interface IAdminProfileAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAdminProfileAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IAdminProfileAPIResponseData {
    _id: string;
    name: string;
    profile_pic?: null;
    email: string;
    phone_number?: null;
    alt_phone?: null;
    is_verified: boolean;
    device_id?: null;
    dob?: null;
    status: boolean;
    fcm_token?: null;
    role: Role;
    professionalBio?:string | null;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
  }
  export interface Role {
    _id: string;
    user_id: number;
    name: string;
    id: number;
    __v: number;
  }
  
  
  
