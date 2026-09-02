export interface INotificationMetadata {
    application_id?: string;
    mentor_id?: string;
    mentor_name?: string;
    mentor_email?: string;
    status?: string;
    requested_tier_id?: string;
    requested_tier_code?: string;
    chapter_id?: string;
    chapter_title?: string;
    series_title?: string;
    ai_score?: number;
    flag_types?: string[];
    flag_details?: string;
    blueprint_id?: string;
    [key: string]: unknown;
}

export interface INotificationEntity {
    _id: string;
    user_id?: string;
    created_by?: string;
    type: string;
    title: string;
    msg: string;
    link?: string | null;
    entity_type?: string | null;
    entity_id?: string | null;
    metadata?: INotificationMetadata | null;
    is_read: boolean;
    read_at?: string | null;
    is_deleted?: boolean;
    deleted_at?: string | null;
    createdAt: string;
    updatedAt?: string;
}

export interface IAdminNotificationsListData {
    data: INotificationEntity[];
    unread_count: number;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IAdminNotificationsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAdminNotificationsListData;
    message: string;
    timestamp: string;
}

export interface AdminNotificationItem {
    id: string;
    title: string;
    description: string;
    type: string;
    isRead: boolean;
    href: string | null;
    createdAt: string | null;
}

export interface IAdminNotificationsQueryParams {
    page: number;
    limit: number;
}
