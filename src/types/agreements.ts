export interface IAllAgreementsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllAgreementsData;
  message: string;
  timestamp: string;
}
export interface IAllAgreementsData {
  data?: (IAllAgreementsDataEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IAllAgreementsDataEntity {
  _id: string;
  title: string;
  slug: string;
  text: string;
  status: string;
  agreementType: AgreementType;
  version: string;
  is_required: boolean;
  can_block: boolean;
  isEditable: boolean;
}
export interface AgreementType {
  _id: string;
  name: string;
}



export interface ISingleAgreementAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: ISingleAgreementData;
  message: string;
  timestamp: string;
}
export interface ISingleAgreementData {
  _id: string;
  title: string;
  slug: string;
  text: string;
  status: string;
  agreementType: ISingleAgreementAgreementType;
  version: string;
  content: string;
  visible_to?: (string)[] | null;
  touchpoints?: (string)[] | null;
  is_required: boolean;
  can_block: boolean;
  isEditable: boolean;
  deletedAt?: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface ISingleAgreementAgreementType {
  _id: string;
  name: string;
}



export interface IAgreementSentenceLinkAgreementType {
  _id: string;
  name: string;
}
export interface IAgreementSentenceLinkAgreement {
  _id: string;
  title: string;
  slug: string;
  version: string;
  can_block: boolean;
  agreement_type?: IAgreementSentenceLinkAgreementType;
}
export interface IAgreementSentenceLink {
  phrase: string;
  slug?: string;
  _id?: string;
  agreementType?: IAgreementSentenceLinkAgreementType | string | null;
  agreement_type_id?: string;
  agreement?: IAgreementSentenceLinkAgreement | null;
}
export interface IAgreementSentenceEntity {
  _id: string;
  text: string;
  touchpoint: string;
  is_required: boolean;
  sort_order: number;
  status?: string;
  links?: IAgreementSentenceLink[] | null;
  deletedAt?: null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
export interface IAgreementsByTouchpointData {
  touchpoints?: string[] | null;
  roles?: string[] | null;
  sentences?: IAgreementSentenceEntity[] | null;
}
export interface IAgreementsByTouchpointAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAgreementsByTouchpointData;
  message: string;
  timestamp: string;
}
export interface IAllAgreementSentencesAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAgreementSentenceEntity[] | IAgreementsByTouchpointData;
  message: string;
  timestamp: string;
}

export interface IGetAgreementByTouchpointAndUserTypeAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAgreementsByTouchpointData;
  message: string;
  timestamp: string;
}

export interface IGetUserConsentStatusAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IGetUserConsentStatusData;
  message: string;
  timestamp: string;
}
export interface IGetUserConsentStatusData {
  role?: string;
  visible_to?: string;
  touchpoints?: string[] | null;
  agreements?: (IGetUserConsentStatusAgreementsEntity)[] | null;
  total: number;
  accepted_count: number;
  pending_count: number;
  all_accepted: boolean;
}
export interface IGetUserConsentStatusAgreementsEntity {
  _id: string;
  title: string;
  is_required: boolean;
  can_block?: boolean;
  slug?: string | null;
  agreement_type: IGetUserConsentStatusAgreementType;
  current_version: string;
  accepted_version: string;
  is_accepted: boolean;
  accepted_at: string;
  touchpoints?: string[] | null;
}
export interface IGetUserConsentStatusAgreementType {
  _id: string;
  name: string;
}
