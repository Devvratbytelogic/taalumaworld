import { IAddTaxAPIResponse, IAllTaxesAPIResponse } from '@/types/taxes';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const taxApis = rtkQuerieSetup.injectEndpoints({
  endpoints: (builder) => ({
    getAllTaxes: builder.query<IAllTaxesAPIResponse, { page?: number; limit?: number; search?: string; status?: string } | void>({
      query: (params) => ({
        url: `/admin/taxes`,
        method: 'GET',
        params: params ? { ...params } : {},
      }),
      providesTags: ['AdminTaxes'],
    }),
    getTaxById: builder.query<IAddTaxAPIResponse, string>({
      query: (id) => ({
        url: `/admin/taxes/${id}`,
        method: 'GET',
      }),
      providesTags: ['AdminTaxes'],
    }),
    addTax: builder.mutation({
      query: (payload) => ({
        url: `/admin/taxes`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['AdminTaxes'],
    }),
    updateTax: builder.mutation({
      query: ({ id, values }) => ({
        url: `/admin/taxes/${id}`,
        method: 'PUT',
        body: values,
      }),
      invalidatesTags: ['AdminTaxes'],
    }),
    deleteTax: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/taxes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminTaxes'],
    }),
  }),
});

export const {
  useGetAllTaxesQuery,
  useGetTaxByIdQuery,
  useAddTaxMutation,
  useUpdateTaxMutation,
  useDeleteTaxMutation,
} = taxApis;
