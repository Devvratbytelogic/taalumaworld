export interface IAllAgreementsDataAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IAllAgreementsData)[] | null;
    message: string;
    timestamp: string;
}
export interface IAllAgreementsData {
    agreement_id: string;
    agreement_type_id: string;
    agreement_type: string;
    title: string;
    version: string;
}
