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

export interface IAllSubscribersAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: SubscriberEntry[];
    message: string;
    timestamp: string;
}
