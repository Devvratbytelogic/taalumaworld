import { IAllCategoriesAPIResponse } from '@/types/categories';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const clientSideGetApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query<IAllCategoriesAPIResponse, void>({
            query: () => ({
                url: `/admin/categories`,
                method: 'GET',
            }),
            providesTags: ['AdminCategories'],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
} = clientSideGetApis;
