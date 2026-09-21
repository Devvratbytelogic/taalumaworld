export interface IAgreementAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAgreementAPIResponseData;
    message: string;
    timestamp: string;
}
export interface IAgreementAPIResponseData {
    _id: string;
    title: string;
    slug: string;
    status: string;
    agreementType: AgreementType;
    version: string;
    content: string;
    visible_to?: (string)[] | null;
    touchpoints?: (string)[] | null;
    is_required: boolean;
    can_block: boolean;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    text: string;
}
export interface AgreementType {
    _id: string;
    name: string;
}

export interface ILatestAgreement {
    _id: string;
    title: string;
    slug: string;
    version: string;
    content: string;
    can_block: boolean;
    agreement_type?: AgreementType | null;
}

export interface ILatestAgreementsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: ILatestAgreementsData;
    message: string;
    timestamp: string;
}

export interface ILatestAgreementsData {
    agreements?: ILatestAgreement[] | null;
    total: number;
}
