import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '@/utils/config';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  photo?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface PurchasedItem {
  id: string;
  chapterId?: string;
  bookId?: string;
  purchaseDate: string;
  price: number;
}

export interface ReadingProgress {
  chapterId: string;
  progress: number;
  lastRead: string;
}

interface APIEnvelope<T> {
  data: T;
  success: boolean;
  message: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = Cookies.get('auth_token') || null;
      const deviceId = Cookies.get('device') || '';
      const userId = Cookies.get('userID') || '';
      headers.set('device', deviceId);
      headers.set('userID', userId);
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['User', 'Purchases', 'Progress'],
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => ({ url: '/user/profile', method: 'GET' }),
      transformResponse: (res: APIEnvelope<UserProfile>) => res.data,
      providesTags: ['User'],
    }),

    getPurchasedItems: builder.query<PurchasedItem[], void>({
      query: () => ({ url: '/user/purchases', method: 'GET' }),
      transformResponse: (res: APIEnvelope<PurchasedItem[]>) => res.data,
      providesTags: ['Purchases'],
    }),

    getReadingProgress: builder.query<ReadingProgress[], void>({
      query: () => ({ url: '/user/progress', method: 'GET' }),
      transformResponse: (res: APIEnvelope<ReadingProgress[]>) => res.data,
      providesTags: ['Progress'],
    }),

    updateReadingProgress: builder.mutation<void, { chapterId: string; progress: number }>({
      query: ({ chapterId, progress }) => ({
        url: `/user/progress/${chapterId}`,
        method: 'PATCH',
        body: { progress },
      }),
      invalidatesTags: ['Progress'],
    }),

    updateUserProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (updates) => ({
        url: '/user/profile',
        method: 'PATCH',
        body: updates,
      }),
      transformResponse: (res: APIEnvelope<UserProfile>) => res.data,
      invalidatesTags: ['User'],
    }),

    purchaseChapter: builder.mutation<boolean, string>({
      query: (chapterId) => ({
        url: `/user/purchase/chapter/${chapterId}`,
        method: 'POST',
      }),
      transformResponse: (res: APIEnvelope<boolean>) => res.data,
      invalidatesTags: ['Purchases'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetPurchasedItemsQuery,
  useGetReadingProgressQuery,
  useUpdateReadingProgressMutation,
  useUpdateUserProfileMutation,
  usePurchaseChapterMutation,
} = userApi;
