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
  message: string;
  actor_id: IAllAuditLogsAPIResponseDataEntityActorId;
  actor_email: string;
  actor_name: string;
  actor_role: string;
  entity_type: string;
  entity_id: string;
  entity_label: string;
  old_value?: null;
  new_value: IAllAuditLogsAPIResponseDataEntityNewValue;
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
  params: IAllAuditLogsAPIResponseDataEntityNewValueParams;
  body: IAllAuditLogsAPIResponseDataEntityNewValueBody;
}
export interface IAllAuditLogsAPIResponseDataEntityNewValueParams {
  id: string;
}
export interface IAllAuditLogsAPIResponseDataEntityNewValueBody {
  book: string;
  number: string;
  title: string;
  description: string;
  content: string;
  isFree: string;
  price: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  json_ld: string;
  accepted_agreement_ids?: (string)[] | null;
  slug: string;
  shareable_link: string;
  user_ip: string;
}
export interface IAllAuditLogsAPIResponseDataEntityMetadata {
  status_code: number;
  original_url: string;
  http_method: string;
  message: string;
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
  message: string;
  actor_id: ISingleAuditLogAPIResponseDataActorId;
  actor_email: string;
  actor_name: string;
  actor_role: string;
  entity_type: string;
  entity_id: string;
  entity_label: string;
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
  params: ISingleAuditLogAPIResponseDataNewValueParams;
  body: ISingleAuditLogAPIResponseDataNewValueBody;
}
export interface ISingleAuditLogAPIResponseDataNewValueParams {
  id: string;
}
export interface ISingleAuditLogAPIResponseDataNewValueBody {
  book: string;
  number: string;
  title: string;
  description: string;
  content: string;
  isFree: string;
  price: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  json_ld: string;
  accepted_agreement_ids?: (string)[] | null;
  slug: string;
  shareable_link: string;
  user_ip: string;
}
export interface ISingleAuditLogAPIResponseDataMetadata {
  status_code: number;
  original_url: string;
  http_method: string;
  message: string;
}
