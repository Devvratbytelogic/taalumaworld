export interface IPaystackBanksAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IPaystackBanksData;
  message: string;
  timestamp: string;
}

export interface IPaystackBanksData {
  country: string;
  currency: string;
  type?: null;
  count: number;
  banks?: BanksEntity[] | null;
}

export interface BanksEntity {
  id: number;
  name: string;
  code: string;
  slug: string;
  longcode: string;
  gateway?: null;
  type: string;
  currency: string;
  country: string;
  active: boolean;
}
