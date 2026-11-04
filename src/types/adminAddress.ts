export interface IAdminAddressesAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAdminAddressesData;
  message: string;
  timestamp: string;
}

export interface IAdminAddressesData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    user_type: string;
  } | null;
  data?: IAdminAddress[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IAdminAddress {
  _id: string;
  user_id: string;
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
  createdAt: string;
  updatedAt: string;
}
