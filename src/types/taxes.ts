export interface IAllTaxesAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllTaxesData;
  message: string;
  timestamp: string;
}

export interface IAllTaxesData {
  data?: IAllTaxesDataEntity[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface IAllTaxesDataEntity {
  _id: string;
  country: string;
  country_code: string;
  tax_name: string;
  tax_percent: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  deletedAt?: null;
}

export interface IAddTaxAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllTaxesDataEntity;
  message: string;
  timestamp: string;
}
