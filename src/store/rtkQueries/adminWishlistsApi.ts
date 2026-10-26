import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type { IAdminWishlistsAPIResponse } from '@/types/adminWishlist';

export const adminWishlistsApi = rtkQuerieSetup.injectEndpoints({
  endpoints: (builder) => ({
    getAdminWishlists: builder.query<IAdminWishlistsAPIResponse, any>({
      query: (params) => ({
        url: `/admin/wishlists`,
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: ['AdminWishlists'],
    }),
  }),
});

export const { useGetAdminWishlistsQuery } = adminWishlistsApi;
