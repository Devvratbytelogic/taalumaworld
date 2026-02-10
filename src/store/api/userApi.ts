import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User', 'Purchases', 'Progress'],
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      queryFn: async () => {
        await delay(500);
        
        // Get from localStorage (mock)
        const userEmail = localStorage.getItem('user_email') || '';
        const userName = localStorage.getItem('user_name') || '';
        const userPhoto = localStorage.getItem('user_photo') || '';
        
        const profile: UserProfile = {
          id: 'user-1',
          email: userEmail,
          fullName: userName,
          photo: userPhoto,
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        
        return { data: profile };
      },
      providesTags: ['User'],
    }),
    
    getPurchasedItems: builder.query<PurchasedItem[], void>({
      queryFn: async () => {
        await delay(400);
        
        // Get from localStorage
        const ownedChapters = JSON.parse(localStorage.getItem('owned_chapters') || '[]');
        
        const purchases: PurchasedItem[] = ownedChapters.map((chapterId: string, index: number) => ({
          id: `purchase-${index}`,
          chapterId,
          purchaseDate: new Date().toISOString(),
          price: 2.99,
        }));
        
        return { data: purchases };
      },
      providesTags: ['Purchases'],
    }),
    
    getReadingProgress: builder.query<ReadingProgress[], void>({
      queryFn: async () => {
        await delay(400);
        
        // Get from localStorage
        const progress = JSON.parse(localStorage.getItem('reading_progress') || '{}');
        
        const progressArray: ReadingProgress[] = Object.entries(progress).map(([chapterId, data]: [string, any]) => ({
          chapterId,
          progress: data.progress || 0,
          lastRead: data.lastRead || new Date().toISOString(),
        }));
        
        return { data: progressArray };
      },
      providesTags: ['Progress'],
    }),
    
    updateReadingProgress: builder.mutation<void, { chapterId: string; progress: number }>({
      queryFn: async ({ chapterId, progress }) => {
        await delay(300);
        
        // Update localStorage
        const currentProgress = JSON.parse(localStorage.getItem('reading_progress') || '{}');
        currentProgress[chapterId] = {
          progress,
          lastRead: new Date().toISOString(),
        };
        localStorage.setItem('reading_progress', JSON.stringify(currentProgress));
        
        return { data: undefined };
      },
      invalidatesTags: ['Progress'],
    }),
    
    updateUserProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      queryFn: async (updates) => {
        await delay(500);
        
        // Update localStorage
        if (updates.fullName) localStorage.setItem('user_name', updates.fullName);
        if (updates.photo) localStorage.setItem('user_photo', updates.photo);
        
        const profile: UserProfile = {
          id: 'user-1',
          email: localStorage.getItem('user_email') || '',
          fullName: localStorage.getItem('user_name') || '',
          photo: localStorage.getItem('user_photo') || '',
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        
        return { data: profile };
      },
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetPurchasedItemsQuery,
  useGetReadingProgressQuery,
  useUpdateReadingProgressMutation,
  useUpdateUserProfileMutation,
} = userApi;
