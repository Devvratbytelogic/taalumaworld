export interface IAllFaqsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllFaqsAPIResponseData;
    message: string;
    timestamp: string;
}
export interface IAllFaqsAPIResponseData {
    data?: (IAllFaqsDataEntity)[] | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export type FAQType = 'reading' | 'payment' | 'account';
export type FAQStatus = 'Active' | 'Inactive';

export interface IAllFaqsDataEntity {
    _id: string;
    question: string;
    answer: string;
    type: FAQType;
    status: FAQStatus;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
    name: string;
    message: string;
}
