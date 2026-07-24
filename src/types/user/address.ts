export interface IAddress {
  _id: string;
  user?: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAddressListAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAddress[];
  message: string;
  timestamp: string;
}

export interface IAddressAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAddress;
  message: string;
  timestamp: string;
}

export interface IAddressPayload {
  full_name: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  isDefault?: boolean;
}

export interface IEditAddressPayload {
  id: string;
  body: IAddressPayload;
}
