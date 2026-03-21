export interface IUserProfileAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IUserProfileAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IUserProfileAPIResponseData {
    _id: string;
    name: string;
    profile_pic: string;
    email: string;
    phone_number?: null;
    alt_phone?: null;
    device_id?: null;
    dob?: null;
    status: boolean;
    fcm_token?: null;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
  }
  