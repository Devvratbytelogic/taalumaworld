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
  chapter_id: string;
  blueprint_id: string;
  __v: number;
  createdAt: string;
  created_by: string;
  updatedAt: string;
}





export interface IPartnerInstitutionsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: (IPartnerInstitutionEntity)[] | null;
  message: string;
  timestamp: string;
}
export interface IPartnerInstitutionEntity {
  id: string;
  name: string;
  domains?: (string)[] | null;
  promo_start: string;
  promo_end: string;
  promo_active: boolean;
  contact_email: string;
}




export interface IInstitutionKpisAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IInstitutionKpisData;
  message: string;
  timestamp: string;
}
export interface IInstitutionKpisData {
  summary: IInstitutionKpisSummary;
  institutions?: (IInstitutionKpiEntity)[] | null;
  pagination: IInstitutionKpisPagination;
}
export interface IInstitutionKpisSummary {
  totalRegistrations: number;
  activeUsers: number;
  blueprintViews: number;
  paidConversions: number;
  averageConversionRate: number;
}
export interface IInstitutionKpiEntity {
  id: string;
  name: string;
  status: string;
  registrations: number;
  activeUsers: number;
  blueprintViews: number;
  conversions: number;
  conversionRate: number;
  promoEnd: string;
  daysLeft: number;
  promoStatus: string;
}
export interface IInstitutionKpisPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
