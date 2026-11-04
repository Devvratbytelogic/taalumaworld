import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type { IAdminAddressesAPIResponse } from '@/types/adminAddress';

export const adminAddressesApi = rtkQuerieSetup.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAddresses: builder.query<
      IAdminAddressesAPIResponse,
      { user_id: string; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: `/admin/addresses`,
        method: 'GET',
        params,
      }),
      providesTags: ['AdminAddresses'],
    }),
  }),
});

export const { useGetAdminAddressesQuery } = adminAddressesApi;
