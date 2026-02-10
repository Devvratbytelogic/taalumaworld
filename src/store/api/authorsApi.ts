import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authors } from '../../data/mockData';
import type { Author } from '../../data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authorsApi = createApi({
  reducerPath: 'authorsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Authors'],
  endpoints: (builder) => ({
    getAuthors: builder.query<Author[], void>({
      queryFn: async () => {
        await delay(500);
        return { data: [...authors] };
      },
      providesTags: ['Authors'],
    }),
    
    getAuthorById: builder.query<Author | undefined, string>({
      queryFn: async (id) => {
        await delay(300);
        const author = authors.find(a => a.id === id);
        return { data: author };
      },
      providesTags: (result, error, id) => [{ type: 'Authors', id }],
    }),
    
    searchAuthors: builder.query<Author[], string>({
      queryFn: async (query) => {
        await delay(400);
        const lowerQuery = query.toLowerCase();
        const results = authors.filter(author =>
          author.name.toLowerCase().includes(lowerQuery) ||
          author.bio.toLowerCase().includes(lowerQuery)
        );
        return { data: results };
      },
    }),
  }),
});

export const {
  useGetAuthorsQuery,
  useGetAuthorByIdQuery,
  useSearchAuthorsQuery,
} = authorsApi;
