export interface IUserAllTagsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: IUserAllTagsAPIResponseData[] | null;
    message: string;
    timestamp: string;
}

export interface IUserAllTagsAPIResponseData {
    _id: string;
    name: string;
    slug: string;
    deletedAt?: null;
    createdBy?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
}
