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
    domains?: string[] | null;
    promo_end: string;
    promo_start: string;
    status: string;
    updatedAt: string;
    books_pricing_type: string;
    discount_percentage: number;
    promo_active: boolean;
    blueprint_access?: IBlueprintAccess[] | null;
  }
  export interface IBlueprintAccess {
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
  