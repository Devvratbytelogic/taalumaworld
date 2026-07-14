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



export interface IGetAgreementByTouchpointAndUserTypeAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: (IGetAgreementByTouchpointAndUserTypeDataEntity)[] | null;
  message: string;
  timestamp: string;
}
export interface IGetAgreementByTouchpointAndUserTypeDataEntity {
  _id: string;
  title: string;
  slug: string;
  status: string;
  agreementType: IGetAgreementByTouchpointAndUserTypeAgreementType;
  version: string;
  content: string;
  is_required: boolean;
  can_block: boolean;
}
export interface IGetAgreementByTouchpointAndUserTypeAgreementType {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  deletedAt?: null;
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
  visible_to: string;
  agreements?: (IGetUserConsentStatusAgreementsEntity)[] | null;
  total: number;
  accepted_count: number;
  pending_count: number;
  all_accepted: boolean;
}
export interface IGetUserConsentStatusAgreementsEntity {
  _id: string;
  title: string;
  agreement_type: IGetUserConsentStatusAgreementType;
  current_version: string;
  accepted_version: string;
  is_accepted: boolean;
  accepted_at: string;
}
export interface IGetUserConsentStatusAgreementType {
  _id: string;
  name: string;
}
