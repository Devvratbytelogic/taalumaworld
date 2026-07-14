export interface IAllInstitutionsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllInstitutionsData;
  message: string;
  timestamp: string;
}
export interface IAllInstitutionsData {
  data?: (IAllInstitutionsDataEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  active: number;
  inactive: number;
}
export interface IAllInstitutionsDataEntity {
  _id: string;
  name: string;
  __v: number;
  contact_email: string;
  createdAt: string;
  created_by?: null;
  custom_registration_message: string;
  deletedAt?: null;
  domains?: (string)[] | null;
  promo_end: string;
  promo_start: string;
  status: string;
  updatedAt: string;
  books_pricing_type: string;
  discount_percentage: number;
  promo_reminders_sent: IInstitutionPromoRemindersSent;
}
export interface IInstitutionPromoRemindersSent {
  expired: boolean;
}








export interface ISingleInstitutionAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: ISingleInstitutionData;
  message: string;
  timestamp: string;
}
export interface ISingleInstitutionData {
  _id: string;
  name: string;
  __v: number;
  contact_email: string;
  createdAt: string;
  created_by?: null;
  custom_registration_message: string;
  deletedAt?: null;
  domains?: (string)[] | null;
  promo_end: string;
  promo_start: string;
  status: string;
  updatedAt: string;
  books_pricing_type: string;
  discount_percentage: number;
  promo_reminders_sent: ISingleInstitutionPromoRemindersSent;
  promo_active: boolean;
  blueprint_access?: (ISingleInstitutionBlueprintAccessEntity)[] | null;
}
export interface ISingleInstitutionPromoRemindersSent {
  expired: boolean;
}
export interface ISingleInstitutionBlueprintAccessEntity {
  _id: string;
  institution_id: string;
  book_id: IBookIdOrSeriesId;
  __v: number;
  createdAt: string;
  created_by: string;
  is_active: boolean;
  mentor_opt_in: boolean;
  updatedAt: string;
  series_id: IBookIdOrSeriesId;
}
export interface IBookIdOrSeriesId {
  _id: string;
  title: string;
  coverImage: string;
  pricingModel: string;
  price: number;
}








export interface IInstitutionAccessAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IInstitutionAccessData;
  message: string;
  timestamp: string;
}
export interface IInstitutionAccessData {
  data?: (IInstitutionAccessDataEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IInstitutionAccessDataEntity {
  _id: string;
  institution_id: string;
  book_id: string;
  __v: number;
  createdAt: string;
  created_by: string;
  is_active: boolean;
  mentor_opt_in: boolean;
  updatedAt: string;
  series_id: string;
}





export interface IInstituteMessageAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IInstituteMessageData;
  message: string;
  timestamp: string;
}
export interface IInstituteMessageData {
  _id: string;
  contact_email: string;
  heading: string;
  message: string;
  status: string;
}
