export interface IAllFaqsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IAllFaqsDataEntity)[] | null;
    message: string;
    timestamp: string;
}
export interface IAllFaqsDataEntity {
    _id: string;
    question: string;
    answer: string;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
    name: string;
    message: string;
}
