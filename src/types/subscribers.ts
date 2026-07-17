export interface SubscriberEntry {
    _id: string;
    id: number;
    name: string | null;
    email: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    date_of_subscription: string;
    __v: number;
}

export interface IAllSubscribersAPIResponseData {
    data?: (SubscriberEntry)[] | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IAllSubscribersAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllSubscribersAPIResponseData;
    message: string;
    timestamp: string;
}
