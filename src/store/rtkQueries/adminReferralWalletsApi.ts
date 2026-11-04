import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type { IAdminReferralWalletsAPIResponse } from '@/types/adminReferralWallet';

export const adminReferralWalletsApi = rtkQuerieSetup.injectEndpoints({
  endpoints: (builder) => ({
    getAdminReferralWallets: builder.query<IAdminReferralWalletsAPIResponse, Record<string, string | number>>({
      query: (params) => ({
        url: `/admin/referral-wallets`,
        method: 'GET',
        params,
      }),
      providesTags: ['AdminReferralWallets'],
    }),
  }),
});

export const { useGetAdminReferralWalletsQuery } = adminReferralWalletsApi;
