export interface IAllAuditLogsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllAuditLogsAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAllAuditLogsAPIResponseData {
  data?: (IAllAuditLogsAPIResponseDataEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IAllAuditLogsAPIResponseDataEntity {
  _id: string;
  action: string;
  action_label: string;
  actor_id: IAllAuditLogsAPIResponseDataEntityActorId;
  actor_email: string;
  actor_name: string;
  actor_role: string;
  entity_type: string;
  entity_id?: null;
  entity_label?: null;
  old_value?: null;
  new_value?: IAllAuditLogsAPIResponseDataEntityNewValue | null;
  reason?: null;
  metadata: IAllAuditLogsAPIResponseDataEntityMetadata;
  ip_address: string;
  user_agent: string;
  retention_until: string;
  createdAt: string;
}
export interface IAllAuditLogsAPIResponseDataEntityActorId {
  _id: string;
  name: string;
  email: string;
  role_id: string;
}
export interface IAllAuditLogsAPIResponseDataEntityNewValue {
  query: IAllAuditLogsAPIResponseDataEntityNewValueQuery;
}
export interface IAllAuditLogsAPIResponseDataEntityNewValueQuery {
  page: string;
  limit: string;
  search: string;
}
export interface IAllAuditLogsAPIResponseDataEntityMetadata {
  status_code: number;
  original_url: string;
}








export interface ISingleAuditLogAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: ISingleAuditLogAPIResponseData;
  message: string;
  timestamp: string;
}
export interface ISingleAuditLogAPIResponseData {
  _id: string;
  action: string;
  action_label: string;
  actor_id: ISingleAuditLogAPIResponseDataActorId;
  actor_email: string;
  actor_name: string;
  actor_role: string;
  entity_type: string;
  entity_id?: null;
  entity_label?: null;
  old_value?: null;
  new_value: ISingleAuditLogAPIResponseDataNewValue;
  reason?: null;
  metadata: ISingleAuditLogAPIResponseDataMetadata;
  ip_address: string;
  user_agent: string;
  retention_until: string;
  createdAt: string;
}
export interface ISingleAuditLogAPIResponseDataActorId {
  _id: string;
  name: string;
  email: string;
  status: string;
  role_id: string;
}
export interface ISingleAuditLogAPIResponseDataNewValue {
  query: ISingleAuditLogAPIResponseDataNewValueQuery;
}
export interface ISingleAuditLogAPIResponseDataNewValueQuery {
  page: string;
  limit: string;
  search: string;
}
export interface ISingleAuditLogAPIResponseDataMetadata {
  status_code: number;
  original_url: string;
}
