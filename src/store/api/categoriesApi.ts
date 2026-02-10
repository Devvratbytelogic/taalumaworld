import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { categories } from '../../data/mockData';
import type { Category } from '../../data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      queryFn: async () => {
        await delay(500);
        return { data: [...categories] };
      },
      providesTags: ['Categories'],
    }),
    
    getCategoryById: builder.query<Category | undefined, string>({
      queryFn: async (id) => {
        await delay(300);
        const category = categories.find(c => c.id === id);
        return { data: category };
      },
      providesTags: (result, error, id) => [{ type: 'Categories', id }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
} = categoriesApi;
