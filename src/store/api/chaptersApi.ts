import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { chapters, books } from '../../data/mockData';
import type { Chapter } from '../../data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const chaptersApi = createApi({
  reducerPath: 'chaptersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Chapters'],
  endpoints: (builder) => ({
    getAllChapters: builder.query<Chapter[], void>({
      queryFn: async () => {
        await delay(500);
        return { data: [...chapters] };
      },
      providesTags: ['Chapters'],
    }),
    
    getChapters: builder.query<Chapter[], { 
      bookId?: string;
      categoryId?: string;
      authorId?: string;
      tags?: string[];
    }>({
      queryFn: async (params = {}) => {
        await delay(500);
        
        const { bookId, categoryId, authorId, tags } = params;
        let filteredChapters = [...chapters];
        
        if (bookId) {
          filteredChapters = filteredChapters.filter(chapter => chapter.bookId === bookId);
        }
        
        if (categoryId) {
          filteredChapters = filteredChapters.filter(chapter => {
            const book = books.find(b => b.id === chapter.bookId);
            return book?.categoryId === categoryId;
          });
        }
        
        if (authorId) {
          filteredChapters = filteredChapters.filter(chapter => {
            const book = books.find(b => b.id === chapter.bookId);
            return book?.authorId === authorId;
          });
        }
        
        if (tags && tags.length > 0) {
          filteredChapters = filteredChapters.filter(chapter => {
            const book = books.find(b => b.id === chapter.bookId);
            return book && tags.some(tag => book.tags.includes(tag));
          });
        }
        
        return { data: filteredChapters };
      },
      providesTags: ['Chapters'],
    }),
    
    getChapterById: builder.query<Chapter | undefined, string>({
      queryFn: async (id) => {
        await delay(300);
        const chapter = chapters.find(c => c.id === id);
        return { data: chapter };
      },
      providesTags: (result, error, id) => [{ type: 'Chapters', id }],
    }),
    
    getChaptersByBook: builder.query<Chapter[], string>({
      queryFn: async (bookId) => {
        await delay(400);
        const bookChapters = chapters.filter(chapter => chapter.bookId === bookId);
        return { data: bookChapters };
      },
      providesTags: ['Chapters'],
    }),
    
    searchChapters: builder.query<Chapter[], string>({
      queryFn: async (query) => {
        await delay(400);
        const lowerQuery = query.toLowerCase();
        const results = chapters.filter(chapter => {
          const book = books.find(b => b.id === chapter.bookId);
          return chapter.title.toLowerCase().includes(lowerQuery) ||
            chapter.description.toLowerCase().includes(lowerQuery) ||
            book?.title.toLowerCase().includes(lowerQuery) ||
            book?.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
        });
        return { data: results };
      },
    }),
  }),
});

export const {
  useGetAllChaptersQuery,
  useGetChaptersQuery,
  useGetChapterByIdQuery,
  useGetChaptersByBookQuery,
  useSearchChaptersQuery,
  useLazySearchChaptersQuery,
} = chaptersApi;