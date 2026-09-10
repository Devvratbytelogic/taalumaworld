import type { IConsentType } from '@/types/agreements';

export type InboxEntryType = 'newsletter' | 'contact_us';

export type InboxTypeFilter = 'all' | InboxEntryType;

export interface InboxEntry {
    _id: string;
    email: string;
    name: string | null;
    type: InboxEntryType;
    createdAt: string;
    consent_type?: IConsentType[] | null;
}

export interface IGetInboxParams {
    search?: string;
    type?: InboxTypeFilter;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}

export interface IInboxAPIResponseData {
    data?: InboxEntry[] | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IInboxAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IInboxAPIResponseData;
    message: string;
    timestamp: string;
}
