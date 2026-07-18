export interface IMyMentorApplicationAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IMyMentorApplicationAPIResponseData;
    message: string;
    timestamp: string;
}
export interface IMyMentorApplicationAPIResponseData {
    can_apply: boolean;
    eligibility_reason: string;
    latest_application: ILatestApplicationEntity | null;
    open_application?: null;
}
export interface ILatestApplicationEntity {
    _id: string;
    user_id: string;
    previous_role: string;
    status: string;
    professional_summary: string;
    linkedin?: null;
    facebook?: null;
    bank_name: string;
    bank_number: string;
    bank_branch?: null;
    mpesa_number: string;
    tax_id?: null;
    preferred_payment_frequency: string;
    admin_notes?: string | null;
    decision_reason?: string | null;
    reviewed_by?: string | null;
    reviewed_at?: string | null;
    submitted_at: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    summary_word_count: number;
    can_withdraw: boolean;
}
