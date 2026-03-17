import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { booksApi } from './api/booksApi';
import { authorsApi } from './api/authorsApi';
import { userApi } from './api/userApi';
import cartReducer from './slices/cartSlice';
import contentModeReducer from './slices/contentModeSlice';
import readingReducer from './slices/readingSlice';
import allModalSlice from './slices/allModalSlice';
import authReducer from './slices/authSlice';
import chapterPurchaseReducer from './slices/chapterPurchaseSlice';
import { rtkQuerieSetup } from "./services/rtkQuerieSetup";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // RTK Query APIs
    [rtkQuerieSetup.reducerPath]: rtkQuerieSetup.reducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [authorsApi.reducerPath]: authorsApi.reducer,
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
      authorsApi.middleware,
      userApi.middleware,
      rtkQuerieSetup.middleware
    ),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;