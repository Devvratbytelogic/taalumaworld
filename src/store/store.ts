import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import cartReducer from './slices/cartSlice';
import contentModeReducer from './slices/contentModeSlice';
import readingReducer from './slices/readingSlice';
import allModalSlice from './slices/allModalSlice';
import chapterPurchaseReducer from './slices/chapterPurchaseSlice';
import { rtkQuerieSetup } from "./services/rtkQuerieSetup";

export const store = configureStore({
  reducer: {
    [rtkQuerieSetup.reducerPath]: rtkQuerieSetup.reducer,
    allModal: allModalSlice,
    chapterPurchase: chapterPurchaseReducer,
    cart: cartReducer,
    contentMode: contentModeReducer,
    reading: readingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      rtkQuerieSetup.middleware
    ),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;