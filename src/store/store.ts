import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { booksApi } from './api/booksApi';
import { chaptersApi } from './api/chaptersApi';
import { authorsApi } from './api/authorsApi';
import { categoriesApi } from './api/categoriesApi';
import { userApi } from './api/userApi';
import cartReducer from './slices/cartSlice';
import contentModeReducer from './slices/contentModeSlice';
import readingReducer from './slices/readingSlice';
import allModalSlice from './slices/allModalSlice';
import authReducer from './slices/authSlice';
import chapterPurchaseReducer from './slices/chapterPurchaseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // RTK Query APIs
    [booksApi.reducerPath]: booksApi.reducer,
    [chaptersApi.reducerPath]: chaptersApi.reducer,
    [authorsApi.reducerPath]: authorsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    // Regular slices
    allModal: allModalSlice,
    chapterPurchase: chapterPurchaseReducer,
    cart: cartReducer,
    contentMode: contentModeReducer,
    reading: readingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApi.middleware,
      chaptersApi.middleware,
      authorsApi.middleware,
      categoriesApi.middleware,
      userApi.middleware
    ),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;