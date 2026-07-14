export interface IAllAgreementTypesAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllAgreementTypesData;
  message: string;
  timestamp: string;
}
export interface IAllAgreementTypesData {
  data?: (IAllAgreementTypesDataEntity)[] | null;
  total: number;
  page: number;
  limit: number;
}
export interface IAllAgreementTypesDataEntity {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  deletedAt?: null;
}





export interface IAddAgreementTypeAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAddAgreementTypeData;
  message: string;
  timestamp: string;
}
export interface IAddAgreementTypeData {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  deletedAt?: null;
}
