export interface IAllRolesAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllRolesAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAllRolesAPIResponseData {
  data?: (IAllRolesEntity)[] | null;
  total: number;
  limit: number;
  currentPage: number;
  pages: number;
}
export interface IAllRolesEntity {
  _id: string;
  name: string;
  description: string;
  number_of_users: number;
  permissions: string[];
}









export interface IAllStaffAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllStaffAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAllStaffAPIResponseData {
  users?: (IAllStaffEntity)[] | null;
  pagination: IPagination;
}
export interface IAllStaffEntity {
  _id: string;
  name: string;
  email: string;
  is_verified: boolean;
  status: string;
  role_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  dob: string;
  professionalBio: string;
  profile_pic: string;
  username: string;
  role: IRole;
  user_type: string;
  mentor_info?: null;
}
export interface IRole {
  _id: string;
  name: string;
  description: string;
  number_of_users: number;
}
export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

































































































// ─── Roles & Permissions Module Types ─────────────────────────────────────────

export type UserSegmentType =
  | 'career_architect'
  | 'institutional_career_architect'
  | 'mentor'
  | 'administrator';

export type StaffStatus = 'active' | 'suspended';

export interface IUserSegment {
  id: UserSegmentType;
  name: string;
  description: string;
  terms_document: string;
  dashboard: string;
  user_count: number;
}

export interface IPermission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface IRole {
  _id: string;
  id: string;
  name: string;
  description: string;
  user_count: number;
  is_system: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IRoleFormValues {
  name: string;
  description: string;
  number_of_users: number;
}

export interface IStaffFormValues {
  name: string;
  email: string;
  role: string;
}

export interface IStaffMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: StaffStatus;
  last_active: string;
  createdAt: string;
}

export interface IPermissionsMatrix {
  permissions: IPermission[];
  roles: Pick<IRole, 'id' | 'name' | 'is_system'>[];
  /** roleId → permission ids */
  matrix: Record<string, string[]>;
}

// ─── API Response Wrappers ─────────────────────────────────────────────────────


export interface ISingleRoleAPIResponse {
  http_status_code: number;
  status: boolean;
  message: string;
  data: IRole;
}

export interface IPermissionsMatrixAPIResponse {
  http_status_code: number;
  status: boolean;
  message: string;
  data: IPermissionsMatrix;
}


export interface IAllUserSegmentsAPIResponse {
  http_status_code: number;
  status: boolean;
  message: string;
  data: IUserSegment[];
}

export interface IMutationAPIResponse {
  http_status_code: number;
  status: boolean;
  message: string;
  data: null;
}
