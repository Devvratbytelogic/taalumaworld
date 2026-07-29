export type AffiliateReferalType = 'percentage' | 'fixed';

export interface IAffiliateReferalAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAffiliateReferalEntity;
  message: string;
  timestamp: string;
}
export interface IAffiliateReferalEntity {
  _id: string;
  affiliateType: string;
  affiliateValues?: (IAffiliateValuesEntity)[] | null;
  referalType: string;
  referalValues: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IAffiliateValuesEntity {
  give: number;
  take: number;
  isDefault: boolean;
  _id: string;
}
