export interface IAllFaqsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IAllFaqsDataEntity)[] | null;
    message: string;
    timestamp: string;
}
export type FAQType = 'reading' | 'payment' | 'account';

export interface IAllFaqsDataEntity {
    _id: string;
    question: string;
    answer: string;
    type: FAQType;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
    name: string;
    message: string;
}
