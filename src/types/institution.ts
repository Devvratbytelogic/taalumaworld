export interface IAllInstitutionsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllInstitutionsData;
  message: string;
  timestamp: string;
}
export interface IAllInstitutionsData {
  data?: (IInstitution)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IInstitution {
  _id: string;
  name: string;
  __v: number;
  contact_email: string;
  createdAt: string;
  created_by?: null;
  custom_registration_message: string;
  deletedAt?: null;
  domains?: string[] | null;
  promo_end: string;
  promo_start: string;
  status: string;
  updatedAt: string;
  books_pricing_type: string;
  discount_percentage: number;
}
