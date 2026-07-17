export interface ITestimonialsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (ITestimonialsAPIResponseDataEntity)[] | null;
    message: string;
    timestamp: string;
}
export interface ITestimonialsAPIResponseDataEntity {
    _id: string;
    name: string;
    rating: number;
    title: string;
    message: string;
    photo?: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
}



export interface IFAQAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IFAQAPIResponseData;
    message: string;
    timestamp: string;
}
export interface IFAQAPIResponseData {
    data?: (IFAQAPIResponseDataEntity)[] | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface IFAQAPIResponseDataEntity {
    _id: string;
    question: string;
    answer: string;
    type: 'payment' | 'reading' | 'account';
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
    name: string;
    message: string;
}
