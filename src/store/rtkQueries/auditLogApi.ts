import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type { IAllAuditLogsAPIResponse, ISingleAuditLogAPIResponse } from '@/types/auditLog';

export interface IAuditLogsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  export?: boolean;
}

export const auditLogApi = rtkQuerieSetup.injectEndpoints({
  endpoints: (builder) => ({
    getAllAuditLogs: builder.query<IAllAuditLogsAPIResponse, IAuditLogsQueryParams | void>({
      query: (params) => ({
        url: `/admin/audit-logs`,
        method: 'GET',
        params: params ? { ...params } : {},
      }),
      providesTags: ['AdminAuditLogs'],
    }),
    getAuditLogById: builder.query<ISingleAuditLogAPIResponse, string>({
      query: (id) => ({
        url: `/admin/audit-logs/${id}`,
        method: 'GET',
      }),
      providesTags: ['AdminAuditLogs'],
    }),
  }),
});

export const { useGetAllAuditLogsQuery, useGetAuditLogByIdQuery } = auditLogApi;
