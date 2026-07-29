import type { IAffiliateReferalAPIResponse } from '@/types/affiliateReferral';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const affiliateReferralApis = rtkQuerieSetup.injectEndpoints({
  endpoints: (builder) => ({
    getAffiliateReferal: builder.query<IAffiliateReferalAPIResponse, void>({
      query: () => ({
        url: `/admin/affiliate-referrale`,
        method: 'GET',
      }),
      providesTags: ['AffiliateReferal'],
    }),
    addUpdateAffiliateReferal: builder.mutation({
      query: (payload) => ({
        url: `/admin/affiliate-referrale`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['AffiliateReferal'],
    }),
  }),
});

export const {
  useGetAffiliateReferalQuery,
  useAddUpdateAffiliateReferalMutation,
} = affiliateReferralApis;
