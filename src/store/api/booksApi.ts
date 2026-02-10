import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { books, categories } from '../../data/mockData';
import type { Book } from '../../data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Books'],
  endpoints: (builder) => ({
    getAllBooks: builder.query<Book[], void>({
      queryFn: async () => {
        await delay(500);
        return { data: [...books] };
      },
      providesTags: ['Books'],
    }),
    
    getBooks: builder.query<Book[], { 
      categoryId?: string; 
      authorId?: string;
      featured?: boolean;
      tags?: string[];
    }>({
      queryFn: async (params = {}) => {
        await delay(500);
        
        const { categoryId, authorId, featured, tags } = params;
        let filteredBooks = [...books];
        
        if (categoryId) {
          filteredBooks = filteredBooks.filter(book => book.categoryId === categoryId);
        }
        
        if (authorId) {
          filteredBooks = filteredBooks.filter(book => book.authorId === authorId);
        }
        
        if (featured) {
          filteredBooks = filteredBooks.filter(book => book.coverImage);
        }
        
        if (tags && tags.length > 0) {
          filteredBooks = filteredBooks.filter(book => 
            tags.some(tag => book.tags.includes(tag))
          );
        }
        
        return { data: filteredBooks };
      },
      providesTags: ['Books'],
    }),
    
    getBookById: builder.query<Book | undefined, string>({
      queryFn: async (id) => {
        await delay(300);
        const book = books.find(b => b.id === id);
        return { data: book };
      },
      providesTags: (result, error, id) => [{ type: 'Books', id }],
    }),
    
    searchBooks: builder.query<Book[], string>({
      queryFn: async (query) => {
        await delay(400);
        const lowerQuery = query.toLowerCase();
        const results = books.filter(book =>
          book.title.toLowerCase().includes(lowerQuery) ||
          book.description.toLowerCase().includes(lowerQuery) ||
          book.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
        return { data: results };
      },
    }),
    
    getBooksByAuthor: builder.query<Book[], string>({
      queryFn: async (authorId) => {
        await delay(400);
        const authorBooks = books.filter(book => book.authorId === authorId);
        return { data: authorBooks };
      },
      providesTags: ['Books'],
    }),
    
    getBooksByCategory: builder.query<Book[], string>({
      queryFn: async (categoryId) => {
        await delay(400);
        const categoryBooks = books.filter(book => book.categoryId === categoryId);
        return { data: categoryBooks };
      },
      providesTags: ['Books'],
    }),
  }),
});

export const {
  useGetAllBooksQuery,
  useGetBooksQuery,
  useGetBookByIdQuery,
  useSearchBooksQuery,
  useGetBooksByAuthorQuery,
  useGetBooksByCategoryQuery,
  useLazySearchBooksQuery,
} = booksApi;