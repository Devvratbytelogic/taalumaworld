export interface IAdminInstitutionStudentsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAdminInstitutionStudentsData;
  message: string;
  timestamp: string;
}

export interface IAdminInstitutionStudentsData {
  institution: {
    id: string;
    name: string;
    status: string;
    domains?: string[] | null;
    contact_email?: string | null;
  } | null;
  data?: IAdminInstitutionStudent[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IAdminInstitutionStudent {
  id: string;
  name: string;
  email: string;
  profile_pic?: string | null;
  phone?: string | null;
  status: string;
  is_verified: boolean;
  role: string;
  joined_at: string;
}
